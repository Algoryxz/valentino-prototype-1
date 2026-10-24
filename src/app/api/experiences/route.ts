import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ExperienceStatus } from "@prisma/client";
import {
  generatePublicId,
  generateEditCredential,
  hashEditCredential,
} from "@/lib/security";
import { buildSetCookieHeader } from "@/lib/session";
import { validateOrigin } from "@/lib/csrf";
import { rateLimiter, getAnonymizedKey } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";
import { getTemplateDefinition, midnightRoseV1 } from "@/templates/registry";

export async function POST(request: NextRequest) {
  try {
    const originCheck = validateOrigin(request);
    if (!originCheck.valid) {
      logger.warn("Create experience rejected due to Origin check", {
        reason: originCheck.reason,
      });
      return NextResponse.json({ error: originCheck.reason }, { status: 403 });
    }

    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const isLocalhost = clientIp === "127.0.0.1" || clientIp === "::1" || clientIp === "localhost";
    const rateLimitKey = getAnonymizedKey("create-exp", clientIp);
    const maxCreatesPerHour =
      process.env.NODE_ENV === "production" && !isLocalhost && !process.env.CI
        ? 15
        : 10000;
    const limitResult = await rateLimiter.check(rateLimitKey, maxCreatesPerHour, 60 * 60 * 1000);

    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: "Too many experiences created. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": limitResult.resetSeconds.toString(),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const publicId = generatePublicId();
    const rawCredential = generateEditCredential();
    const credentialHash = hashEditCredential(rawCredential);
    const issuedAt = new Date();

    let selectedTemplate = midnightRoseV1;
    let initialConfig = { ...midnightRoseV1.defaultConfig };

    try {
      const body = await request.json().catch(() => null);
      if (body && typeof body === "object") {
        if (body.templateId !== undefined) {
          if (typeof body.templateId !== "string" || !body.templateId.trim() || body.templateId.length > 50) {
            return NextResponse.json({ error: "Invalid templateId" }, { status: 400 });
          }
          const targetVersion = typeof body.templateVersion === "string" && body.templateVersion.trim() ? body.templateVersion.trim() : "v1";
          const found = getTemplateDefinition(body.templateId.trim(), targetVersion);
          if (!found || found.active === false) {
            return NextResponse.json(
              { error: `Invalid or unsupported template: ${body.templateId} (${targetVersion})` },
              { status: 400 }
            );
          }
          selectedTemplate = found;
          initialConfig = { ...found.defaultConfig };
        }

        if (body.initialDecor) {
          const { normalizeValentineDecor } = await import("@/types/decor");
          initialConfig.decor = normalizeValentineDecor(body.initialDecor);
        }
      }
    } catch {
      // Gracefully fall back to defaults
    }

    const defaultConfigJson = JSON.stringify(initialConfig);

    await db.experience.create({
      data: {
        publicId,
        editCredentialHash: credentialHash,
        editCredentialVersion: 1,
        editCredentialIssuedAt: issuedAt,
        templateId: selectedTemplate.id,
        templateVersion: selectedTemplate.version,
        draftConfig: defaultConfigJson,
        draftRevision: 1,
        status: ExperienceStatus.DRAFT,
      },
    });

    const cookieData = buildSetCookieHeader(publicId, rawCredential, issuedAt);

    const response = NextResponse.json(
      { publicId },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );

    response.cookies.set(cookieData.name, cookieData.value, cookieData.options as any);

    logger.info("Created experience successfully", { publicId });
    return response;
  } catch (error) {
    logger.error("Failed to create experience", { error: String(error) });
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
