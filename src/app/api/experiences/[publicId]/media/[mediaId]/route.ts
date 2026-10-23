import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { db } from "@/lib/db";
import { verifySessionCookie } from "@/lib/session";
import { getPrivateMediaFilePath } from "@/lib/media";
import { mediaStorage } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ publicId: string; mediaId: string }>;
}

export const dynamic = "force-dynamic";

/**
 * Creator Draft Media Stream Endpoint.
 * Strictly verifies creator session cookie before serving private unpublished media.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { publicId, mediaId } = await params;

  // 1. Lookup experience
  const experience = await db.experience.findUnique({
    where: { publicId },
  });
  if (!experience) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 2. Creator Session Verification
  const auth = await verifySessionCookie(req, publicId, experience.editCredentialHash);
  if (!auth.authenticated) {
    // If experience is published and media is published, redirect/allow public access
    if (experience.status === "PUBLISHED") {
      const pubMedia = await db.experienceMedia.findFirst({
        where: { id: mediaId, experienceId: experience.id, status: "PUBLISHED" },
      });
      if (pubMedia) {
        return NextResponse.redirect(new URL(`/api/media/${publicId}/${mediaId}`, req.url));
      }
    }
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 3. Lookup media belonging to this experience
  const media = await db.experienceMedia.findFirst({
    where: {
      id: mediaId,
      experienceId: experience.id,
      status: { not: "DELETED" },
    },
  });
  if (!media) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 4. Read from storage service adapter
  const localPath = mediaStorage.getFilePath(media.storageKey);
  if (localPath && fs.existsSync(localPath)) {
    const fileStream = fs.createReadStream(localPath);
    const stream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => controller.enqueue(chunk));
        fileStream.on("end", () => controller.close());
        fileStream.on("error", (err) => controller.error(err));
      },
    });

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        "Content-Type": media.mimeType,
        "Content-Length": media.sizeBytes.toString(),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  }

  // Fallback to adapter read (e.g. Memory, S3, or non-filesystem storage)
  const buffer = await mediaStorage.read(media.storageKey);
  if (!buffer) {
    return new NextResponse("File missing", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": media.mimeType,
      "Content-Length": buffer.length.toString(),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
