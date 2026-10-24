import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ExperienceStatus } from "@prisma/client";
import { verifyEditCredential } from "@/lib/security";
import { getEditCredentialFromRequest, isSessionExpired } from "@/lib/session";
import { validateOrigin, validateJsonContentType } from "@/lib/csrf";
import { rateLimiter, getAnonymizedKey } from "@/lib/rate-limiter";
import { serverLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ publicId: string }>;
}

const StatusUpdateSchema = z.object({
  status: z.enum(["DISABLED", "PUBLISHED"]),
});

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { publicId } = await params;

  // 1. CSRF Origin validation
  const originCheck = validateOrigin(req);
  if (!originCheck.valid) {
    return NextResponse.json(
      { error: originCheck.reason || "Forbidden" },
      { status: 403, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 2. Content-type check
  const jsonCheck = validateJsonContentType(req);
  if (!jsonCheck.valid) {
    return NextResponse.json(
      { error: jsonCheck.reason || "Invalid Content-Type" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 3. Rate limiting (max 15/min)
  const rateLimitKey = getAnonymizedKey("status-exp", publicId);
  const limitResult = await rateLimiter.check(rateLimitKey, 15, 60 * 1000);
  if (!limitResult.allowed) {
    return NextResponse.json(
      { error: "Too many status update requests. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": limitResult.resetSeconds.toString(),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // 4. Find experience
  const experience = await db.experience.findUnique({
    where: { publicId },
  });

  if (!experience) {
    return NextResponse.json(
      { error: "Experience not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 5. Authenticate via creator edit token cookie
  const token = getEditCredentialFromRequest(req, publicId);
  if (!token || !verifyEditCredential(token, experience.editCredentialHash)) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing edit token" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 6. Check session expiration (180-day max lifetime)
  if (isSessionExpired(experience.editCredentialIssuedAt)) {
    return NextResponse.json(
      { error: "Session expired (180-day maximum lifetime reached)" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 7. Parse and validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const parsed = StatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid status requested. Must be 'DISABLED' or 'PUBLISHED'" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const newStatus = parsed.data.status;

  // 8. Validate state transition
  if (newStatus === "PUBLISHED") {
    if (!experience.publishedConfig) {
      return NextResponse.json(
        { error: "Cannot enable public link before publishing an experience" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  if (experience.status === ExperienceStatus.DELETED) {
    return NextResponse.json(
      { error: "Cannot change status of a permanently deleted experience" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const updated = await db.experience.update({
      where: { publicId },
      data: {
        status: newStatus as ExperienceStatus,
      },
      select: {
        id: true,
        publicId: true,
        status: true,
      },
    });

    serverLogger.info("Experience status updated", {
      publicId,
      oldStatus: experience.status,
      newStatus: updated.status,
    });

    return NextResponse.json(
      { success: true, status: updated.status },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    serverLogger.error("Error updating experience status", {
      publicId,
      error: err instanceof Error ? err.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "A temporary error occurred while updating status" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
