import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySessionCookie } from "@/lib/session";
import { validateOrigin } from "@/lib/csrf";
import {
  validateMediaBuffer,
  processAndStripPhoto,
  savePrivateMedia,
  deletePrivateMedia,
  MAX_MEDIA_PER_EXPERIENCE,
} from "@/lib/media";
import { rateLimiter, getAnonymizedKey } from "@/lib/rate-limiter";
import { serverLogger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ publicId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { publicId } = await params;

  // 1. Origin verification
  const originCheck = validateOrigin(req);
  if (!originCheck.valid) {
    return NextResponse.json({ error: "Request origin not allowed" }, { status: 403 });
  }

  // 2. Lookup experience
  const experience = await db.experience.findUnique({
    where: { publicId },
  });
  if (!experience) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  // 3. Creator Authorization via Session Cookie
  const auth = await verifySessionCookie(req, publicId, experience.editCredentialHash);
  if (!auth.authenticated) {
    serverLogger.warn("Media upload rejected: Unauthorized", { publicId });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 4. Rate Limiting: 10 uploads per minute per experience
  const rateKey = getAnonymizedKey("upload", experience.id);
  const rateCheck = await rateLimiter.check(rateKey, 10, 60_000);
  if (!rateCheck.allowed) {
    serverLogger.warn("Media upload rate limit exceeded", { publicId });
    return NextResponse.json(
      { error: "Too many upload requests. Please wait a moment before trying again." },
      {
        status: 429,
        headers: {
          "Retry-After": rateCheck.resetSeconds.toString(),
        },
      }
    );
  }

  // 5. Enforce Max Media per Experience ceiling (20 media items)
  const activeMediaCount = await db.experienceMedia.count({
    where: {
      experienceId: experience.id,
      status: { not: "DELETED" },
    },
  });
  if (activeMediaCount >= MAX_MEDIA_PER_EXPERIENCE) {
    return NextResponse.json(
      { error: `Maximum limit of ${MAX_MEDIA_PER_EXPERIENCE} media items reached for this experience` },
      { status: 400 }
    );
  }

  // 6. Parse FormData
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing or invalid file" }, { status: 400 });
  }

  const caption = (formData.get("caption") as string) || undefined;
  const altText = (formData.get("altText") as string) || undefined;
  const displayOrderStr = formData.get("displayOrder") as string;
  const displayOrder = displayOrderStr ? parseInt(displayOrderStr, 10) : 0;

  // 7. Read buffer and validate magic bytes and byte size ceilings
  const arrayBuffer = await file.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);

  const validation = validateMediaBuffer(buffer, file.type, file.name);
  if (!validation.valid || !validation.mediaType || !validation.detectedMime) {
    serverLogger.warn("Media file validation failed", {
      publicId,
      filename: file.name,
      reason: validation.error,
    });
    return NextResponse.json({ error: validation.error || "Invalid file" }, { status: 422 });
  }

  let finalMime = validation.detectedMime;

  // 8. Image processing pipeline with sharp: validate dimensions, resize, strip metadata (EXIF/GPS)
  if (validation.mediaType === "PHOTO") {
    try {
      const processed = await processAndStripPhoto(buffer, validation.detectedMime);
      buffer = Buffer.from(processed.buffer);
      finalMime = processed.mimeType;
    } catch (err: any) {
      serverLogger.warn("Photo processing / pixel limit validation failed", {
        publicId,
        filename: file.name,
        error: err.message,
      });
      return NextResponse.json(
        { error: err.message || "Failed to process photo or image exceeds maximum pixel limits" },
        { status: 422 }
      );
    }
  }

  // 9. Save to private storage with compensating rollback on DB failure
  try {
    const saved = await savePrivateMedia(experience.id, buffer, {
      mediaType: validation.mediaType,
      filename: file.name,
      mimeType: finalMime,
      caption,
      altText,
      displayOrder: isNaN(displayOrder) ? 0 : displayOrder,
    });

    serverLogger.info("Media uploaded successfully", {
      publicId,
      mediaId: saved.id,
      mediaType: saved.mediaType,
    });

    return NextResponse.json(
      {
        success: true,
        media: {
          id: saved.id,
          mediaType: saved.mediaType,
          filename: saved.filename,
          originalFilename: file.name,
          mimeType: saved.mimeType,
          sizeBytes: saved.sizeBytes,
          caption: saved.caption,
          altText: saved.altText,
          displayOrder: saved.displayOrder,
          // Creator draft URL
          url: `/api/experiences/${publicId}/media/${saved.id}`,
          draftUrl: `/api/experiences/${publicId}/media/${saved.id}`,
          // Published recipient URL (active only after publishing)
          publishedUrl: `/api/media/${publicId}/${saved.id}`,
        },
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err: any) {
    serverLogger.error("Failed to save media", { publicId, error: err.message });
    return NextResponse.json(
      { error: "Failed to process media file" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { publicId } = await params;

  // 1. Origin verification
  const originCheck = validateOrigin(req);
  if (!originCheck.valid) {
    return NextResponse.json({ error: "Request origin not allowed" }, { status: 403 });
  }

  // 2. Lookup experience
  const experience = await db.experience.findUnique({
    where: { publicId },
  });
  if (!experience) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  // 3. Creator Authorization
  const auth = await verifySessionCookie(req, publicId, experience.editCredentialHash);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 4. Rate Limiting: 20 deletes per minute per experience
  const rateKey = getAnonymizedKey("delete-media", experience.id);
  const rateCheck = await rateLimiter.check(rateKey, 20, 60_000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many delete requests. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": rateCheck.resetSeconds.toString(),
        },
      }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { mediaId } = body || {};
  if (!mediaId || typeof mediaId !== "string") {
    return NextResponse.json({ error: "mediaId is required" }, { status: 400 });
  }

  const deleted = await deletePrivateMedia(mediaId, experience.id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Media not found or not owned by this experience" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
}
