import { describe, it, expect, beforeEach } from "vitest";
import { z } from "zod";
import { hashReporterId, getPepper } from "@/lib/security";
import { InMemoryRateLimiter, getAnonymizedKey } from "@/lib/rate-limiter";
import { MemoryStorageAdapter } from "@/lib/storage";

const ReportSchema = z.object({
  reason: z.enum(["inappropriate_content", "harassment", "copyright", "other"]),
  details: z.string().max(1000).optional().nullable(),
});

describe("M6 Abuse Reporting & Creator Management Unit Tests", () => {
  describe("Abuse Report Validation Schema", () => {
    it("accepts valid reasons and optional details", () => {
      const validPayload = {
        reason: "inappropriate_content",
        details: "Contains non-consensual personal information.",
      };
      const result = ReportSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects unauthorized reason enums", () => {
      const invalidPayload = {
        reason: "spam_bot_click",
      };
      const result = ReportSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("rejects details exceeding 1000 characters", () => {
      const tooLongPayload = {
        reason: "harassment",
        details: "a".repeat(1001),
      };
      const result = ReportSchema.safeParse(tooLongPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("Privacy-Preserving Reporter Hashing", () => {
    it("generates deterministic HMAC using the server pepper", () => {
      const ip = "192.168.1.100";
      const hash1 = hashReporterId(ip);
      const hash2 = hashReporterId(ip);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // 256-bit hex
      expect(hash1).not.toBe(ip);
    });

    it("produces distinct hashes for different client IPs", () => {
      const hashA = hashReporterId("10.0.0.1");
      const hashB = hashReporterId("10.0.0.2");
      expect(hashA).not.toBe(hashB);
    });
  });

  describe("Central Rate Limiter", () => {
    let limiter: InMemoryRateLimiter;

    beforeEach(() => {
      limiter = new InMemoryRateLimiter();
    });

    it("enforces threshold limit and provides accurate reset countdown", async () => {
      const key = getAnonymizedKey("report-test", "1.2.3.4");
      const limit = 5;
      const windowMs = 60000;

      for (let i = 0; i < limit; i++) {
        const res = await limiter.check(key, limit, windowMs);
        expect(res.allowed).toBe(true);
      }

      // 6th attempt must be rejected
      const blocked = await limiter.check(key, limit, windowMs);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.resetSeconds).toBeGreaterThan(0);
    });

    it("resets after explicit cache purge", async () => {
      const key = "test-reset-key";
      await limiter.check(key, 1, 60000);
      const blocked = await limiter.check(key, 1, 60000);
      expect(blocked.allowed).toBe(false);

      await limiter.reset(key);
      const allowedAgain = await limiter.check(key, 1, 60000);
      expect(allowedAgain.allowed).toBe(true);
    });
  });

  describe("Reliable Media Cleanup Storage Semantics", () => {
    let memoryStorage: MemoryStorageAdapter;

    beforeEach(() => {
      memoryStorage = new MemoryStorageAdapter();
    });

    it("stores and reliably deletes media files", async () => {
      const key = "partner-photo-1.jpg";
      const buffer = Buffer.from("fake-image-bytes");
      await memoryStorage.write(key, buffer, { mimeType: "image/jpeg" });

      expect(await memoryStorage.exists(key)).toBe(true);

      const deleted = await memoryStorage.delete(key);
      expect(deleted).toBe(true);
      expect(await memoryStorage.exists(key)).toBe(false);
    });

    it("deleting a non-existent asset is safe and idempotent", async () => {
      const deleted = await memoryStorage.delete("non-existent-file.png");
      expect(deleted).toBe(false);
      expect(await memoryStorage.exists("non-existent-file.png")).toBe(false);
    });

    it("handles multiple media asset cleanup without leaving orphaned entries", async () => {
      const keys = ["asset1.jpg", "asset2.mp3", "asset3.png"];
      for (const k of keys) {
        await memoryStorage.write(k, Buffer.from("data"), { mimeType: "application/octet-stream" });
      }

      for (const k of keys) {
        expect(await memoryStorage.exists(k)).toBe(true);
        await memoryStorage.delete(k);
        expect(await memoryStorage.exists(k)).toBe(false);
      }
    });
  });
});
