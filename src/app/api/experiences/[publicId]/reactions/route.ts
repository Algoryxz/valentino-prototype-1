import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySessionCookie } from "@/lib/session";
import { validateOrigin } from "@/lib/csrf";
import { rateLimiter, getAnonymizedKey } from "@/lib/rate-limiter";
import { serverLogger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ publicId: string }>;
}

const ALLOWED_REACTIONS = ["heart", "sparkles", "tears_of_joy", "warm_smile", "rose"];

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { publicId } = await params;

  // 1. Origin verification
  const originCheck = validateOrigin(req);
  if (!originCheck.valid) {
    return NextResponse.json({ error: "Request origin not allowed" }, { status: 403 });
  }

  // 2. Rate limit (max 10 reactions/min)
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateLimitKey = getAnonymizedKey("reactions", `${publicId}:${clientIp}`);
  const limitResult = await rateLimiter.check(rateLimitKey, 10, 60 * 1000);

  if (!limitResult.allowed) {
    return NextResponse.json(
      { error: "Too many reactions. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": limitResult.resetSeconds.toString(),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // 3. Lookup experience
  const experience = await db.experience.findUnique({
    where: { publicId },
  });
  if (!experience || experience.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Experience not available" }, { status: 404 });
  }

  // 4. Parse payload
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reaction = typeof body?.reaction === "string" ? body.reaction : (typeof body?.type === "string" ? body.type : "");
  const note = body?.note;
  if (!reaction || !ALLOWED_REACTIONS.includes(reaction)) {
    return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
  }

  const cleanNote = typeof note === "string" ? note.slice(0, 140).trim() : null;

  try {
    const saved = await db.experienceReaction.create({
      data: {
        experienceId: experience.id,
        reaction,
        note: cleanNote,
      },
    });

    serverLogger.info("Recipient reaction recorded", { publicId, reaction });
    return NextResponse.json({ success: true, id: saved.id }, { status: 201 });
  } catch (err: any) {
    serverLogger.error("Failed to save reaction", { publicId, error: err.message });
    return NextResponse.json({ error: "Failed to submit reaction" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { publicId } = await params;

  // 1. Lookup experience
  const experience = await db.experience.findUnique({
    where: { publicId },
  });
  if (!experience) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  // 2. Creator Authorization: ONLY creator can view reactions list
  const auth = await verifySessionCookie(req, publicId, experience.editCredentialHash);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reactions = await db.experienceReaction.findMany({
    where: { experienceId: experience.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const tallies: Record<string, number> = {
    heart: 0,
    sparkles: 0,
    tears_of_joy: 0,
    warm_smile: 0,
    rose: 0,
  };
  for (const r of reactions) {
    tallies[r.reaction] = (tallies[r.reaction] || 0) + 1;
  }

  return NextResponse.json({
    reactions: reactions.map((r) => ({
      id: r.id,
      reaction: r.reaction,
      note: r.note,
      createdAt: r.createdAt.toISOString(),
    })),
    tallies,
    counts: tallies,
    totalCount: reactions.length,
  });
}
