import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { validateOrigin, validateJsonContentType } from "@/lib/csrf";
import { rateLimiter, getAnonymizedKey } from "@/lib/rate-limiter";
import { hashReporterId } from "@/lib/security";
import { serverLogger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ publicId: string }>;
}

const ReportSchema = z.object({
  reason: z.enum(["inappropriate_content", "harassment", "copyright", "other"]),
  details: z.string().max(1000).optional().nullable(),
});

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { publicId } = await params;

  // 1. Origin verification
  const originCheck = validateOrigin(req);
  if (!originCheck.valid) {
    return NextResponse.json({ error: "Request origin not allowed" }, { status: 403 });
  }

  // 2. Content-type check
  const ctCheck = validateJsonContentType(req);
  if (!ctCheck.valid) {
    return NextResponse.json({ error: "Invalid Content-Type, expected application/json" }, { status: 400 });
  }

  // 3. Client IP and Rate Limit (max 5 per hour = 3600000 ms)
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const anonymizedKey = getAnonymizedKey("report", clientIp);
  const rateLimitResult = await rateLimiter.check(anonymizedKey, 5, 3600000);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many report submissions. Please wait before submitting another report." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.resetSeconds),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // 4. Parse & validate request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON body" }, { status: 400 });
  }

  const parsed = ReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues.map(i => i.message) },
      { status: 400 }
    );
  }

  try {
    // 5. Look up experience
    const experience = await db.experience.findUnique({
      where: { publicId },
      select: { id: true, status: true },
    });

    if (!experience || experience.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    // 6. Record report with hashed IP (privacy-preserving, pepper-keyed)
    const reporterHash = hashReporterId(clientIp);

    await db.experienceReport.create({
      data: {
        experienceId: experience.id,
        reason: parsed.data.reason,
        details: parsed.data.details ? parsed.data.details.trim() : null,
        reporterHash,
        status: "PENDING",
      },
    });

    serverLogger.info("Abuse report created for experience", {
      publicId,
      reason: parsed.data.reason,
    });

    return NextResponse.json(
      { success: true, message: "Thank you. Your report has been submitted and will be reviewed." },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err: unknown) {
    serverLogger.error("Error creating abuse report", {
      publicId,
      error: err instanceof Error ? err.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "A temporary error occurred. Please try again later." },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
