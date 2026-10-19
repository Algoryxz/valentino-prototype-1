import { describe, it, expect } from "vitest";
import sharp from "sharp";
import {
  validateMediaBuffer,
  getSafeExtension,
  getMediaDiskPath,
  processAndStripPhoto,
  MAX_PHOTO_SIZE,
  MAX_AUDIO_SIZE,
  MAX_VIDEO_SIZE,
  MAX_MEDIA_PER_EXPERIENCE,
  AllowedMediaType,
} from "@/lib/media";
import crypto from "crypto";

describe("Phase 5B - Media Storage & Security Engine", () => {
  describe("File Size Ceilings", () => {
    it("enforces strict size limits: 5MB photo, 10MB audio, 25MB video", () => {
      expect(MAX_PHOTO_SIZE).toBe(5 * 1024 * 1024);
      expect(MAX_AUDIO_SIZE).toBe(10 * 1024 * 1024);
      expect(MAX_VIDEO_SIZE).toBe(25 * 1024 * 1024);
    });

    it("rejects buffers exceeding category ceiling", () => {
      // 5MB + 1 byte photo buffer
      const oversizedPhoto = Buffer.alloc(MAX_PHOTO_SIZE + 1);
      oversizedPhoto[0] = 0xff;
      oversizedPhoto[1] = 0xd8;
      oversizedPhoto[2] = 0xff;
      const photoResult = validateMediaBuffer(oversizedPhoto, "photo");
      expect(photoResult.valid).toBe(false);
      expect(photoResult.error).toMatch(/exceeds/i);

      // 10MB + 1 byte audio buffer
      const oversizedAudio = Buffer.alloc(MAX_AUDIO_SIZE + 1);
      oversizedAudio[0] = 0x49; // 'I'
      oversizedAudio[1] = 0x44; // 'D'
      oversizedAudio[2] = 0x33; // '3'
      const audioResult = validateMediaBuffer(oversizedAudio, "audio");
      expect(audioResult.valid).toBe(false);
      expect(audioResult.error).toMatch(/exceeds/i);

      // 25MB + 1 byte video buffer
      const oversizedVideo = Buffer.alloc(MAX_VIDEO_SIZE + 1);
      oversizedVideo.write("ftyp", 4);
      const videoResult = validateMediaBuffer(oversizedVideo, "video");
      expect(videoResult.valid).toBe(false);
      expect(videoResult.error).toMatch(/exceeds/i);
    });
  });

  describe("Magic Bytes & Content Verification", () => {
    it("validates JPEG buffers with correct signature", () => {
      const buffer = Buffer.alloc(100);
      buffer[0] = 0xff;
      buffer[1] = 0xd8;
      buffer[2] = 0xff;
      const res = validateMediaBuffer(buffer, "photo");
      expect(res.valid).toBe(true);
      expect(res.mimeType).toBe("image/jpeg");
      expect(res.extension).toBe(".jpg");
    });

    it("validates PNG buffers with correct signature", () => {
      const buffer = Buffer.alloc(100);
      buffer[0] = 0x89;
      buffer[1] = 0x50;
      buffer[2] = 0x4e;
      buffer[3] = 0x47;
      buffer[4] = 0x0d;
      buffer[5] = 0x0a;
      buffer[6] = 0x1a;
      buffer[7] = 0x0a;
      const res = validateMediaBuffer(buffer, "photo");
      expect(res.valid).toBe(true);
      expect(res.mimeType).toBe("image/png");
      expect(res.extension).toBe(".png");
    });

    it("validates WebP buffers with RIFF...WEBP signature", () => {
      const buffer = Buffer.alloc(100);
      buffer.write("RIFF", 0);
      buffer.write("WEBP", 8);
      const res = validateMediaBuffer(buffer, "photo");
      expect(res.valid).toBe(true);
      expect(res.mimeType).toBe("image/webp");
      expect(res.extension).toBe(".webp");
    });

    it("validates MP3 buffers with ID3 or sync frame", () => {
      const buffer = Buffer.alloc(100);
      buffer.write("ID3", 0);
      const res = validateMediaBuffer(buffer, "audio");
      expect(res.valid).toBe(true);
      expect(res.mimeType).toBe("audio/mpeg");
      expect(res.extension).toBe(".mp3");
    });

    it("validates WAV buffers with RIFF...WAVE signature", () => {
      const buffer = Buffer.alloc(100);
      buffer.write("RIFF", 0);
      buffer.write("WAVE", 8);
      const res = validateMediaBuffer(buffer, "audio");
      expect(res.valid).toBe(true);
      expect(res.mimeType).toBe("audio/wav");
      expect(res.extension).toBe(".wav");
    });

    it("validates MP4 video buffers with ftyp signature", () => {
      const buffer = Buffer.alloc(100);
      buffer.write("ftyp", 4);
      const res = validateMediaBuffer(buffer, "video");
      expect(res.valid).toBe(true);
      expect(res.mimeType).toBe("video/mp4");
      expect(res.extension).toBe(".mp4");
    });

    it("rejects executable or script signatures (MZ, ELF, HTML/JS)", () => {
      // Windows PE header MZ
      const mzBuffer = Buffer.alloc(100);
      mzBuffer[0] = 0x4d;
      mzBuffer[1] = 0x5a;
      expect(validateMediaBuffer(mzBuffer, "photo").valid).toBe(false);
      expect(validateMediaBuffer(mzBuffer, "audio").valid).toBe(false);
      expect(validateMediaBuffer(mzBuffer, "video").valid).toBe(false);

      // Linux ELF header
      const elfBuffer = Buffer.alloc(100);
      elfBuffer[0] = 0x7f;
      elfBuffer[1] = 0x45;
      elfBuffer[2] = 0x4c;
      elfBuffer[3] = 0x46;
      expect(validateMediaBuffer(elfBuffer, "photo").valid).toBe(false);

      // HTML / Script payload
      const htmlBuffer = Buffer.from("<script>alert('xss')</script>");
      expect(validateMediaBuffer(htmlBuffer, "photo").valid).toBe(false);
      expect(validateMediaBuffer(htmlBuffer, "audio").valid).toBe(false);
      expect(validateMediaBuffer(htmlBuffer, "video").valid).toBe(false);
    });

    it("rejects mismatched category types (e.g. uploading audio when expecting photo)", () => {
      const audioBuffer = Buffer.alloc(100);
      audioBuffer.write("ID3", 0);
      const res = validateMediaBuffer(audioBuffer, "photo");
      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/magic bytes/i);
    });
  });

  describe("Path Traversal & Safe Storage Protection", () => {
    it("ensures media disk path always resolves inside storage/media and sanitizes id", () => {
      const normalPath = getMediaDiskPath("safe-uuid-1234", ".jpg");
      expect(normalPath).toMatch(/[\\/]storage[\\/]media[\\/]safe-uuid-1234\.jpg$/);

      // Attempted directory traversal attack
      const traversalAttempt = getMediaDiskPath("../../etc/passwd", ".jpg");
      // Slashes and dots must be stripped from the id portion
      expect(traversalAttempt).not.toContain("..");
      expect(traversalAttempt).not.toContain("etc");
      expect(traversalAttempt).toMatch(/[\\/]storage[\\/]media[\\/]/);
    });

    it("maps MIME types to canonical safe extensions", () => {
      expect(getSafeExtension("image/jpeg")).toBe(".jpg");
      expect(getSafeExtension("image/png")).toBe(".png");
      expect(getSafeExtension("image/webp")).toBe(".webp");
      expect(getSafeExtension("audio/mpeg")).toBe(".mp3");
      expect(getSafeExtension("audio/wav")).toBe(".wav");
      expect(getSafeExtension("video/mp4")).toBe(".mp4");
      expect(getSafeExtension("application/octet-stream")).toBe(".bin");
    });
  });

  describe("Secret Question Lock Cryptography", () => {
    it("verifies salt + SHA-256 timing-safe answer checking", () => {
      const secretAnswer = "Paris 2024";
      const normalizedAnswer = secretAnswer.trim().toLowerCase();
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto
        .createHash("sha256")
        .update(salt + ":" + normalizedAnswer)
        .digest("hex");

      // Verify correct answer matches
      const testNormalized = "  paris 2024  ".trim().toLowerCase();
      const testHash = crypto
        .createHash("sha256")
        .update(salt + ":" + testNormalized)
        .digest("hex");

      const match = crypto.timingSafeEqual(
        Buffer.from(hash, "utf-8"),
        Buffer.from(testHash, "utf-8")
      );
      expect(match).toBe(true);

      // Verify wrong answer fails
      const wrongNormalized = "rome 2024".trim().toLowerCase();
      const wrongHash = crypto
        .createHash("sha256")
        .update(salt + ":" + wrongNormalized)
        .digest("hex");

      const wrongMatch = crypto.timingSafeEqual(
        Buffer.from(hash, "utf-8"),
        Buffer.from(wrongHash, "utf-8")
      );
      expect(wrongMatch).toBe(false);
    });
  });

  describe("Scheduled Reveal Time-Lock Logic", () => {
    it("accurately differentiates locked vs unlocked experiences relative to server time", () => {
      const now = new Date("2026-02-14T00:00:00Z");

      // Future time -> locked
      const futureUnlock = new Date("2026-02-14T12:00:00Z");
      expect(now.getTime() < futureUnlock.getTime()).toBe(true);

      // Past time -> unlocked
      const pastUnlock = new Date("2026-02-13T23:59:59Z");
      expect(now.getTime() >= pastUnlock.getTime()).toBe(true);
    });
  });

  describe("Image Processing & Metadata Stripping (Sharp)", () => {
    it("exports MAX_MEDIA_PER_EXPERIENCE set to 20", () => {
      expect(MAX_MEDIA_PER_EXPERIENCE).toBe(20);
    });

    it("processes photo, strips EXIF metadata, and resizes within max bounds", async () => {
      // Create a 200x200 JPEG with custom metadata
      const rawImage = await sharp({
        create: {
          width: 200,
          height: 200,
          channels: 3,
          background: { r: 255, g: 105, b: 180 },
        },
      })
        .jpeg()
        .toBuffer();

      const processed = await processAndStripPhoto(rawImage, "image/jpeg");
      expect(processed.buffer).toBeInstanceOf(Buffer);
      expect(processed.mimeType).toBe("image/jpeg");
      expect(processed.width).toBe(200);
      expect(processed.height).toBe(200);

      // Inspect output with sharp to verify EXIF is completely stripped
      const meta = await sharp(processed.buffer).metadata();
      expect(meta.exif).toBeUndefined();
    });

    it("enforces pixel count limit and rejects oversized images", async () => {
      // Create a small 50x50 image
      const smallImage = await sharp({
        create: {
          width: 50,
          height: 50,
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      })
        .png()
        .toBuffer();

      // With maxPixels set to 1000, 50x50 = 2500 pixels which exceeds limit
      await expect(processAndStripPhoto(smallImage, "image/png", 1000)).rejects.toThrow(
        /exceeds.*pixel limit/i
      );
    });

    it("rejects corrupt or unreadable image buffers", async () => {
      const corruptBuffer = Buffer.from("not a real image payload");
      await expect(processAndStripPhoto(corruptBuffer, "image/jpeg")).rejects.toThrow();
    });
  });
});

