import fs from "fs";
import path from "path";
import { CloudinaryStorageAdapter } from "./cloudinary";

export { CloudinaryStorageAdapter } from "./cloudinary";

export interface MediaStorageAdapter {
  write(key: string, buffer: Buffer, meta: { mimeType: string }): Promise<void>;
  read(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
  getFilePath?(key: string): string | null;
  getPublicUrl?(key: string): string | null;
}

export class LocalFileSystemStorageAdapter implements MediaStorageAdapter {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir =
      baseDir ||
      process.env.MEDIA_STORAGE_DIR ||
      process.env.MEDIA_LOCAL_DIR ||
      path.join(process.cwd(), "storage", "media");
    this.ensureDir();
  }

  private ensureDir(): void {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true, mode: 0o700 });
    }
  }

  private resolveSafePath(key: string): string {
    const safeKey = path.basename(key).replace(/[^a-zA-Z0-9_.-]/g, "");
    return path.join(this.baseDir, safeKey);
  }

  async write(key: string, buffer: Buffer, _meta: { mimeType: string }): Promise<void> {
    this.ensureDir();
    const filePath = this.resolveSafePath(key);
    await fs.promises.writeFile(filePath, buffer, { mode: 0o600 });
  }

  async read(key: string): Promise<Buffer | null> {
    const filePath = this.resolveSafePath(key);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.promises.readFile(filePath);
  }

  async delete(key: string): Promise<boolean> {
    const filePath = this.resolveSafePath(key);
    if (!fs.existsSync(filePath)) {
      return false;
    }
    try {
      await fs.promises.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    const filePath = this.resolveSafePath(key);
    return fs.existsSync(filePath);
  }

  getFilePath(key: string): string | null {
    return this.resolveSafePath(key);
  }

  getPublicUrl(_key: string): string | null {
    // Local filesystem storage is served via private authenticated proxy routes
    return null;
  }
}

export class MemoryStorageAdapter implements MediaStorageAdapter {
  private store = new Map<string, { buffer: Buffer; mimeType: string }>();

  async write(key: string, buffer: Buffer, meta: { mimeType: string }): Promise<void> {
    const safeKey = path.basename(key);
    this.store.set(safeKey, { buffer: Buffer.from(buffer), mimeType: meta.mimeType });
  }

  async read(key: string): Promise<Buffer | null> {
    const safeKey = path.basename(key);
    const entry = this.store.get(safeKey);
    return entry ? entry.buffer : null;
  }

  async delete(key: string): Promise<boolean> {
    const safeKey = path.basename(key);
    return this.store.delete(safeKey);
  }

  async exists(key: string): Promise<boolean> {
    const safeKey = path.basename(key);
    return this.store.has(safeKey);
  }

  getFilePath(_key: string): string | null {
    return null;
  }

  getPublicUrl(_key: string): string | null {
    return null;
  }

  clear(): void {
    this.store.clear();
  }
}

export class ConfigurableMediaStorageService {
  private adapter: MediaStorageAdapter;

  constructor(adapter?: MediaStorageAdapter) {
    if (adapter) {
      this.adapter = adapter;
    } else {
      const provider =
        process.env.STORAGE_PROVIDER ||
        process.env.MEDIA_STORAGE_DRIVER ||
        "local";
      if (provider === "memory") {
        this.adapter = new MemoryStorageAdapter();
      } else if (provider === "cloudinary") {
        this.adapter = new CloudinaryStorageAdapter();
      } else {
        this.adapter = new LocalFileSystemStorageAdapter();
      }
    }
  }

  setAdapter(adapter: MediaStorageAdapter): void {
    this.adapter = adapter;
  }

  getAdapter(): MediaStorageAdapter {
    return this.adapter;
  }

  async write(key: string, buffer: Buffer, meta: { mimeType: string }): Promise<void> {
    return this.adapter.write(key, buffer, meta);
  }

  async read(key: string): Promise<Buffer | null> {
    return this.adapter.read(key);
  }

  async delete(key: string): Promise<boolean> {
    return this.adapter.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.adapter.exists(key);
  }

  getFilePath(key: string): string | null {
    return this.adapter.getFilePath ? this.adapter.getFilePath(key) : null;
  }

  getPublicUrl(key: string): string | null {
    return this.adapter.getPublicUrl ? this.adapter.getPublicUrl(key) : null;
  }
}

export const mediaStorage = new ConfigurableMediaStorageService();
