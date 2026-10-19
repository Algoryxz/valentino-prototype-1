import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { MediaStorageAdapter } from "./index";
import { serverLogger } from "@/lib/logger";

export interface CloudinaryConfig {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
  url?: string;
  folder?: string;
}

export class CloudinaryStorageAdapter implements MediaStorageAdapter {
  private folder: string;
  private configured: boolean = false;

  constructor(config?: CloudinaryConfig) {
    this.folder = config?.folder || process.env.CLOUDINARY_FOLDER || "valentino/media";

    const cloudinaryUrl = config?.url || process.env.CLOUDINARY_URL;
    const cloudName = config?.cloudName || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = config?.apiKey || process.env.CLOUDINARY_API_KEY;
    const apiSecret = config?.apiSecret || process.env.CLOUDINARY_API_SECRET;

    if (cloudinaryUrl) {
      cloudinary.config({
        cloudinary_url: cloudinaryUrl,
        secure: true,
      });
      this.configured = true;
    } else if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.configured = true;
    }
  }

  public isConfigured(): boolean {
    return this.configured;
  }

  private ensureConfigured(): void {
    if (!this.configured) {
      throw new Error(
        "Cloudinary storage provider is selected, but CLOUDINARY_URL (or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) is not configured."
      );
    }
  }

  private getPublicId(key: string): string {
    // Strip file extension and sanitize key for Cloudinary public_id
    const safeKey = key.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "");
    return `${this.folder}/${safeKey}`;
  }

  private getResourceType(mimeType?: string): "image" | "video" | "raw" {
    if (!mimeType) return "image";
    if (mimeType.startsWith("video/") || mimeType.startsWith("audio/")) {
      // Cloudinary classifies audio as video resource_type
      return "video";
    }
    return "image";
  }

  async write(key: string, buffer: Buffer, meta: { mimeType: string }): Promise<void> {
    this.ensureConfigured();
    const publicId = this.getPublicId(key);
    const resourceType = this.getResourceType(meta.mimeType);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: resourceType,
          overwrite: true,
          unique_filename: false,
        },
        (error, _result?: UploadApiResponse) => {
          if (error) {
            serverLogger.error("Cloudinary upload failed", { key, error: error.message });
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else {
            resolve();
          }
        }
      );
      uploadStream.end(buffer);
    });
  }

  async read(key: string): Promise<Buffer | null> {
    const url = this.getPublicUrl(key);
    if (!url) return null;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err: any) {
      serverLogger.warn("Cloudinary read failed", { key, error: err?.message });
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    this.ensureConfigured();
    const publicId = this.getPublicId(key);
    try {
      // Attempt image deletion first
      const imageResult = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      if (imageResult?.result === "ok") return true;

      // If not an image, attempt video/audio deletion
      const videoResult = await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
      return videoResult?.result === "ok";
    } catch (err: any) {
      serverLogger.error("Cloudinary deletion failed", { key, error: err?.message });
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    this.ensureConfigured();
    const publicId = this.getPublicId(key);
    try {
      await cloudinary.api.resource(publicId);
      return true;
    } catch {
      return false;
    }
  }

  getFilePath(_key: string): string | null {
    // Cloudinary is remote object storage; no local file path
    return null;
  }

  getPublicUrl(key: string): string | null {
    if (!this.configured) return null;
    const publicId = this.getPublicId(key);
    return cloudinary.url(publicId, { secure: true });
  }
}
