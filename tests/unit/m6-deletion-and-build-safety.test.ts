import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { DELETE as deleteExperience } from "@/app/api/experiences/[publicId]/route";
import { db } from "@/lib/db";
import { ExperienceStatus } from "@prisma/client";
import { generateEditCredential, hashEditCredential } from "@/lib/security";
import { getCookieName } from "@/lib/session";
import { mediaStorage, MemoryStorageAdapter } from "@/lib/storage";
import { executeVercelBuild } from "../../scripts/vercel-build.mjs";

describe("M6 Deletion Safety & Vercel Build Isolation", () => {
  const APP_URL = "http://localhost:3000";
  const publicId = "del-safety-test-id";
  const cookieName = getCookieName(publicId);

  let memoryStorage: MemoryStorageAdapter;

  beforeEach(() => {
    vi.restoreAllMocks();
    memoryStorage = new MemoryStorageAdapter();
    mediaStorage.setAdapter(memoryStorage);
  });

  describe("F-01: Vercel Build Environment Gating", () => {
    it("runs prisma migrate deploy ONLY when VERCEL_ENV is 'production'", () => {
      const commands: string[] = [];
      const logs: string[] = [];

      executeVercelBuild({
        env: { VERCEL_ENV: "production" } as any,
        runCmd: (cmd) => commands.push(cmd),
        log: (msg) => logs.push(msg),
      });

      expect(commands).toEqual([
        "npx prisma generate",
        "npx prisma migrate deploy",
        "npx next build",
      ]);
      expect(logs.some((l) => l.includes("Production deployment detected"))).toBe(true);
    });

    it("skips prisma migrate deploy when VERCEL_ENV is 'preview'", () => {
      const commands: string[] = [];
      const logs: string[] = [];

      executeVercelBuild({
        env: { VERCEL_ENV: "preview" } as any,
        runCmd: (cmd) => commands.push(cmd),
        log: (msg) => logs.push(msg),
      });

      expect(commands).toEqual([
        "npx prisma generate",
        "npx next build",
      ]);
      expect(commands).not.toContain("npx prisma migrate deploy");
      expect(logs.some((l) => l.includes("Skipping automatic Prisma migrations for non-production environment"))).toBe(true);
    });

    it("skips prisma migrate deploy when VERCEL_ENV is undefined or development", () => {
      const commands: string[] = [];
      const logs: string[] = [];

      executeVercelBuild({
        env: {} as any,
        runCmd: (cmd) => commands.push(cmd),
        log: (msg) => logs.push(msg),
      });

      expect(commands).toEqual([
        "npx prisma generate",
        "npx next build",
      ]);
      expect(commands).not.toContain("npx prisma migrate deploy");
      expect(logs.some((l) => l.includes("VERCEL_ENV=none/preview"))).toBe(true);
    });

    it("bubbles errors if prisma generate fails", () => {
      expect(() => {
        executeVercelBuild({
          env: { VERCEL_ENV: "production" } as any,
          runCmd: (cmd) => {
            if (cmd === "npx prisma generate") throw new Error("Generator crashed");
          },
          log: () => {},
        });
      }).toThrow("Generator crashed");
    });
  });

  describe("F-02: Safe Permanent Deletion Lifecycle", () => {
    function setupExperienceMock(status: ExperienceStatus = ExperienceStatus.PUBLISHED, mediaKeys: string[] = []) {
      const token = generateEditCredential();
      const hash = hashEditCredential(token);

      const experienceRecord = {
        id: "exp-db-id-123",
        publicId,
        status,
        editCredentialHash: hash,
        editCredentialIssuedAt: new Date(),
        media: mediaKeys.map((key, i) => ({
          id: `media-${i}`,
          storageKey: key,
          experienceId: "exp-db-id-123",
        })),
      };

      vi.spyOn(db.experience, "findUnique").mockResolvedValue(experienceRecord as any);
      const updateSpy = vi.spyOn(db.experience, "update").mockImplementation(((async ({ data }: any) => {
        experienceRecord.status = data.status;
        return experienceRecord as any;
      }) as any));
      const deleteSpy = vi.spyOn(db.experience, "delete").mockResolvedValue(experienceRecord as any);

      return { token, experienceRecord, updateSpy, deleteSpy };
    }

    it("transitions experience to DISABLED before physical storage cleanup begins", async () => {
      const mediaKey = "photo-1.jpg";
      await memoryStorage.write(mediaKey, Buffer.from("image-bytes"), { mimeType: "image/jpeg" });
      const { token, updateSpy, deleteSpy } = setupExperienceMock(ExperienceStatus.PUBLISHED, [mediaKey]);

      const req = new NextRequest(`${APP_URL}/api/experiences/${publicId}`, {
        method: "DELETE",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=${token}`,
        },
      });

      const res = await deleteExperience(req, { params: Promise.resolve({ publicId }) });
      expect(res.status).toBe(200);

      // Verify that update to DISABLED was called
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: "exp-db-id-123" },
        data: { status: ExperienceStatus.DISABLED },
      });

      // Verify physical media was cleaned up
      expect(await memoryStorage.exists(mediaKey)).toBe(false);

      // Verify final DB deletion
      expect(deleteSpy).toHaveBeenCalledWith({
        where: { id: "exp-db-id-123" },
      });
    });

    it("aborts physical media deletion if the initial DB transition to DISABLED fails", async () => {
      const mediaKey = "protected-photo.jpg";
      await memoryStorage.write(mediaKey, Buffer.from("valuable-bytes"), { mimeType: "image/jpeg" });
      const { token } = setupExperienceMock(ExperienceStatus.PUBLISHED, [mediaKey]);

      // Simulate DB update failure (e.g. database connection lost)
      vi.spyOn(db.experience, "update").mockRejectedValue(new Error("Database write locked"));
      const deleteStorageSpy = vi.spyOn(memoryStorage, "delete");

      const req = new NextRequest(`${APP_URL}/api/experiences/${publicId}`, {
        method: "DELETE",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=${token}`,
        },
      });

      const res = await deleteExperience(req, { params: Promise.resolve({ publicId }) });
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toContain("initiating deletion");

      // Verify physical media was NOT touched
      expect(deleteStorageSpy).not.toHaveBeenCalled();
      expect(await memoryStorage.exists(mediaKey)).toBe(true);
    });

    it("leaves experience in DISABLED state if partial storage cleanup fails", async () => {
      const key1 = "asset-1.jpg";
      const key2 = "asset-2.jpg";
      await memoryStorage.write(key1, Buffer.from("bytes-1"), { mimeType: "image/jpeg" });
      await memoryStorage.write(key2, Buffer.from("bytes-2"), { mimeType: "image/jpeg" });

      const { token, experienceRecord, deleteSpy } = setupExperienceMock(ExperienceStatus.PUBLISHED, [key1, key2]);

      // Make asset-2 fail to delete
      vi.spyOn(memoryStorage, "delete").mockImplementation(async (k) => {
        if (k === key2) throw new Error("Cloudinary rate limited");
        return true;
      });

      const req = new NextRequest(`${APP_URL}/api/experiences/${publicId}`, {
        method: "DELETE",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=${token}`,
        },
      });

      const res = await deleteExperience(req, { params: Promise.resolve({ publicId }) });
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toContain("disabled and public access removed");

      // Experience must be DISABLED so public route returns 410 instead of broken assets
      expect(experienceRecord.status).toBe(ExperienceStatus.DISABLED);

      // Final db.experience.delete must NOT have been called
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it("successfully retries deletion when an earlier attempt left experience DISABLED and assets partially deleted", async () => {
      const key1 = "asset-1.jpg";
      const key2 = "asset-2.jpg";
      // key1 was already deleted in a prior attempt
      await memoryStorage.write(key2, Buffer.from("bytes-2"), { mimeType: "image/jpeg" });

      // Experience is already DISABLED from previous attempt
      const { token, updateSpy, deleteSpy } = setupExperienceMock(ExperienceStatus.DISABLED, [key1, key2]);

      const req = new NextRequest(`${APP_URL}/api/experiences/${publicId}`, {
        method: "DELETE",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=${token}`,
        },
      });

      const res = await deleteExperience(req, { params: Promise.resolve({ publicId }) });
      expect(res.status).toBe(200);

      // update to DISABLED is skipped because it is already DISABLED
      expect(updateSpy).not.toHaveBeenCalled();

      // key2 was cleaned up
      expect(await memoryStorage.exists(key2)).toBe(false);

      // Final DB delete was executed
      expect(deleteSpy).toHaveBeenCalledWith({ where: { id: "exp-db-id-123" } });
    });

    it("leaves experience in DISABLED state if final db.experience.delete fails", async () => {
      const key1 = "asset-1.jpg";
      await memoryStorage.write(key1, Buffer.from("bytes-1"), { mimeType: "image/jpeg" });

      const { token, experienceRecord } = setupExperienceMock(ExperienceStatus.PUBLISHED, [key1]);
      vi.spyOn(db.experience, "delete").mockRejectedValue(new Error("Foreign key lock failure"));

      const req = new NextRequest(`${APP_URL}/api/experiences/${publicId}`, {
        method: "DELETE",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=${token}`,
        },
      });

      const res = await deleteExperience(req, { params: Promise.resolve({ publicId }) });
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toContain("experience remains disabled");

      // Experience record remains in DISABLED status
      expect(experienceRecord.status).toBe(ExperienceStatus.DISABLED);
    });

    it("handles concurrent deletion where record was already removed (P2025)", async () => {
      const { token } = setupExperienceMock(ExperienceStatus.DISABLED, []);
      const p2025Error = new Error("Record to delete does not exist.");
      (p2025Error as any).code = "P2025";
      vi.spyOn(db.experience, "delete").mockRejectedValue(p2025Error);

      const req = new NextRequest(`${APP_URL}/api/experiences/${publicId}`, {
        method: "DELETE",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=${token}`,
        },
      });

      const res = await deleteExperience(req, { params: Promise.resolve({ publicId }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });

    it("rejects unauthorized deletion requests without touching DB or storage", async () => {
      const { token, updateSpy, deleteSpy } = setupExperienceMock(ExperienceStatus.PUBLISHED, ["asset.jpg"]);
      const deleteStorageSpy = vi.spyOn(memoryStorage, "delete");

      const req = new NextRequest(`${APP_URL}/api/experiences/${publicId}`, {
        method: "DELETE",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=wrong-token`,
        },
      });

      const res = await deleteExperience(req, { params: Promise.resolve({ publicId }) });
      expect(res.status).toBe(401);

      expect(updateSpy).not.toHaveBeenCalled();
      expect(deleteSpy).not.toHaveBeenCalled();
      expect(deleteStorageSpy).not.toHaveBeenCalled();
    });

    it("rejects requests when 180-day session maximum lifetime has expired", async () => {
      const { token, experienceRecord, updateSpy, deleteSpy } = setupExperienceMock(ExperienceStatus.PUBLISHED, ["asset.jpg"]);
      // Set issued at to 181 days ago
      experienceRecord.editCredentialIssuedAt = new Date(Date.now() - 181 * 24 * 60 * 60 * 1000);

      const req = new NextRequest(`${APP_URL}/api/experiences/${publicId}`, {
        method: "DELETE",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=${token}`,
        },
      });

      const res = await deleteExperience(req, { params: Promise.resolve({ publicId }) });
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toContain("Session expired");

      expect(updateSpy).not.toHaveBeenCalled();
      expect(deleteSpy).not.toHaveBeenCalled();
    });
  });
});
