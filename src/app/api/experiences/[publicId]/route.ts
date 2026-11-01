import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ExperienceStatus } from "@prisma/client";
import { verifyEditCredential } from "@/lib/security";
import {
  getEditCredentialFromRequest,
  isSessionExpired,
  getCookieName,
  isProduction,
} from "@/lib/session";
import { validateOrigin } from "@/lib/csrf";
import { rateLimiter, getAnonymizedKey } from "@/lib/rate-limiter";
import { mediaStorage } from "@/lib/storage";
import { serverLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ publicId: string }>;
}

async function cleanupStorageAsset(
  storageKey: string,
  maxAttempts = 3
): Promise<{ success: boolean; error?: string }> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const exists = await mediaStorage.exists(storageKey);
      if (!exists) {
        return { success: true };
      }

      const deleted = await mediaStorage.delete(storageKey);
      if (deleted) {
        return { success: true };
      }

      // Check if it's already removed
      const stillExists = await mediaStorage.exists(storageKey);
      if (!stillExists) {
        return { success: true };
      }
    } catch (err: unknown) {
      if (attempt === maxAttempts) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Storage error",
        };
      }
      await new Promise((r) => setTimeout(r, 100 * attempt));
    }
  }

  return { success: false, error: "Deletion failed after max attempts" };
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { publicId } = await params;

  // 1. CSRF Origin validation
  const originCheck = validateOrigin(req);
  if (!originCheck.valid) {
    return NextResponse.json(
      { error: originCheck.reason || "Forbidden" },
      { status: 403, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 2. Rate limiting (max 10/min per experience)
  const rateLimitKey = getAnonymizedKey("delete-exp", publicId);
  const limitResult = await rateLimiter.check(rateLimitKey, 10, 60 * 1000);
  if (!limitResult.allowed) {
    return NextResponse.json(
      { error: "Too many delete requests. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": limitResult.resetSeconds.toString(),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // 3. Find experience including associated media
  const experience = await db.experience.findUnique({
    where: { publicId },
    include: {
      media: true,
    },
  });

  if (!experience) {
    return NextResponse.json(
      { error: "Experience not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 4. Authenticate via creator edit token cookie
  const token = getEditCredentialFromRequest(req, publicId);
  if (!token || !verifyEditCredential(token, experience.editCredentialHash)) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing edit token" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 5. Check session expiration (180-day max lifetime)
  if (isSessionExpired(experience.editCredentialIssuedAt)) {
    return NextResponse.json(
      { error: "Session expired (180-day maximum lifetime reached)" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 6. Persist transition to DISABLED before physical media cleanup begins.
  // This guarantees that /v/[publicId] immediately ceases serving the experience
  // (returning HTTP 410 Gone). If physical media cleanup or subsequent database
  // deletion fails, the public link will never be left serving broken media.
  if (experience.status !== ExperienceStatus.DISABLED) {
    try {
      await db.experience.update({
        where: { id: experience.id },
        data: { status: ExperienceStatus.DISABLED },
      });
      experience.status = ExperienceStatus.DISABLED;
    } catch (err: unknown) {
      serverLogger.error("Failed to disable experience prior to media deletion", {
        publicId,
        error: err instanceof Error ? err.message : "Unknown error",
      });

      return NextResponse.json(
        { error: "A database error occurred while initiating deletion. Please retry." },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  // 7. Reliable physical media cleanup
  // Attempt physical storage cleanup through existing storage adapter.
  // Retries are safe and idempotent because cleanupStorageAsset checks for existing absence.
  const failedCleanups: Array<{ key: string; error?: string }> = [];

  for (const media of experience.media) {
    const result = await cleanupStorageAsset(media.storageKey);
    if (!result.success) {
      failedCleanups.push({ key: media.storageKey, error: result.error });
    }
  }

  if (failedCleanups.length > 0) {
    serverLogger.error("Failed to delete physical media during experience deletion", {
      publicId,
      failedCount: failedCleanups.length,
    });

    return NextResponse.json(
      {
        error:
          "Failed to cleanly remove one or more associated media files. The experience has been disabled and public access removed; please retry deletion.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 8. Delete database record (cascading deletes media, replies, reactions, reports)
  // Only reached when all storage cleanup has succeeded.
  try {
    await db.experience.delete({
      where: { id: experience.id },
    });

    serverLogger.info("Experience and physical media permanently deleted", {
      publicId,
      cleanedMediaCount: experience.media.length,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Experience and all associated media have been permanently deleted.",
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );

    // Clear creator session cookie
    const cookieName = getCookieName(publicId);
    response.cookies.set(cookieName, "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction(),
    });

    return response;
  } catch (err: unknown) {
    // Handle concurrent deletion where record was already removed
    if ((err as { code?: string })?.code === "P2025") {
      const response = NextResponse.json(
        {
          success: true,
          message: "Experience and all associated media have been permanently deleted.",
        },
        { status: 200, headers: { "Cache-Control": "no-store" } }
      );
      const cookieName = getCookieName(publicId);
      response.cookies.set(cookieName, "", {
        maxAge: 0,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction(),
      });
      return response;
    }

    serverLogger.error("Error deleting experience record from database", {
      publicId,
      error: err instanceof Error ? err.message : "Unknown error",
    });

    return NextResponse.json(
      {
        error:
          "All media files were cleaned up, but a database error occurred while removing the experience record. The experience remains disabled; please retry.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
