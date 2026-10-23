import { describe, it, expect, beforeEach, afterAll } from "vitest";
import path from "path";
import fs from "fs";
import {
  ConfigurableMediaStorageService,
  MemoryStorageAdapter,
  LocalFileSystemStorageAdapter,
  CloudinaryStorageAdapter,
} from "@/lib/storage";

describe("Media Storage Service & Adapters", () => {
  describe("MemoryStorageAdapter", () => {
    let adapter: MemoryStorageAdapter;

    beforeEach(() => {
      adapter = new MemoryStorageAdapter();
    });

    it("writes and reads media buffers correctly", async () => {
      const buffer = Buffer.from("test media content");
      await adapter.write("test_media.jpg", buffer, { mimeType: "image/jpeg" });

      const exists = await adapter.exists("test_media.jpg");
      expect(exists).toBe(true);

      const readBuffer = await adapter.read("test_media.jpg");
      expect(readBuffer).not.toBeNull();
      expect(readBuffer?.toString()).toBe("test media content");
    });

    it("deletes media buffers cleanly", async () => {
      const buffer = Buffer.from("to be deleted");
      await adapter.write("delete_me.mp3", buffer, { mimeType: "audio/mpeg" });

      const deleted = await adapter.delete("delete_me.mp3");
      expect(deleted).toBe(true);

      const exists = await adapter.exists("delete_me.mp3");
      expect(exists).toBe(false);

      const readBuffer = await adapter.read("delete_me.mp3");
      expect(readBuffer).toBeNull();
    });

    it("handles non-existent files gracefully", async () => {
      const exists = await adapter.exists("nonexistent.jpg");
      expect(exists).toBe(false);

      const deleted = await adapter.delete("nonexistent.jpg");
      expect(deleted).toBe(false);

      const read = await adapter.read("nonexistent.jpg");
      expect(read).toBeNull();
    });
  });

  describe("LocalFileSystemStorageAdapter", () => {
    const testDir = path.join(process.cwd(), "storage", "test-media");
    let localAdapter: LocalFileSystemStorageAdapter;

    beforeEach(async () => {
      localAdapter = new LocalFileSystemStorageAdapter(testDir);
    });

    afterAll(async () => {
      if (fs.existsSync(testDir)) {
        await fs.promises.rm(testDir, { recursive: true, force: true });
      }
    });

    it("writes, reads, and deletes files correctly on disk", async () => {
      const buffer = Buffer.from("local filesystem test");
      await localAdapter.write("local_test.jpg", buffer, { mimeType: "image/jpeg" });

      expect(await localAdapter.exists("local_test.jpg")).toBe(true);
      const readBuffer = await localAdapter.read("local_test.jpg");
      expect(readBuffer?.toString()).toBe("local filesystem test");

      const deleted = await localAdapter.delete("local_test.jpg");
      expect(deleted).toBe(true);
      expect(await localAdapter.exists("local_test.jpg")).toBe(false);
    });

    it("sanitizes filenames to prevent directory traversal", () => {
      const filePath = localAdapter.getFilePath("../../../etc/passwd");
      expect(filePath).not.toBeNull();
      expect(filePath).not.toContain("..");
      expect(path.basename(filePath!)).toBe("passwd");
    });
  });

  describe("CloudinaryStorageAdapter", () => {
    it("reports unconfigured state when credentials are not supplied", () => {
      const adapter = new CloudinaryStorageAdapter({});
      expect(adapter.isConfigured()).toBe(false);
      expect(adapter.getPublicUrl("photo_123.jpg")).toBeNull();
    });

    it("formats delivery url and public ID when configured", () => {
      const adapter = new CloudinaryStorageAdapter({
        cloudName: "demo-cloud",
        apiKey: "demo-key",
        apiSecret: "demo-secret",
        folder: "valentino/test",
      });

      expect(adapter.isConfigured()).toBe(true);
      const publicUrl = adapter.getPublicUrl("photo_sample.jpg");
      expect(publicUrl).not.toBeNull();
      expect(publicUrl).toContain("demo-cloud");
      expect(publicUrl).toContain("valentino/test/photo_sample");
    });

    it("throws clear error when attempting write on unconfigured adapter", async () => {
      const adapter = new CloudinaryStorageAdapter({});
      await expect(
        adapter.write("unconfigured.jpg", Buffer.from("data"), { mimeType: "image/jpeg" })
      ).rejects.toThrow(/not configured/i);
    });
  });

  describe("ConfigurableMediaStorageService", () => {
    it("allows switching adapters dynamically without data loss", async () => {
      const memoryAdapter = new MemoryStorageAdapter();
      const service = new ConfigurableMediaStorageService(memoryAdapter);

      const buffer = Buffer.from("persisted through service");
      await service.write("photo_1.png", buffer, { mimeType: "image/png" });

      expect(await service.exists("photo_1.png")).toBe(true);
      const readBack = await service.read("photo_1.png");
      expect(readBack?.toString()).toBe("persisted through service");

      await service.delete("photo_1.png");
      expect(await service.exists("photo_1.png")).toBe(false);
    });

    it("selects memory adapter when STORAGE_PROVIDER=memory", () => {
      const original = process.env.STORAGE_PROVIDER;
      try {
        process.env.STORAGE_PROVIDER = "memory";
        const service = new ConfigurableMediaStorageService();
        expect(service.getAdapter()).toBeInstanceOf(MemoryStorageAdapter);
      } finally {
        process.env.STORAGE_PROVIDER = original;
      }
    });
  });
});
