import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getPublicBaseUrl,
  getPublicSharingMetaHtml,
  GENERIC_SHARE_TITLE,
  GENERIC_SHARE_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
} from "@/lib/metadata";

describe("Social Sharing & Metadata Helper (Decision D4)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("resolves base URL honoring APP_URL or VERCEL_URL", () => {
    delete process.env.APP_URL;
    delete process.env.VERCEL_URL;
    expect(getPublicBaseUrl()).toBe("http://localhost:3000");

    process.env.VERCEL_URL = "valentino-prototype-1.vercel.app";
    expect(getPublicBaseUrl()).toBe("https://valentino-prototype-1.vercel.app");

    process.env.APP_URL = "https://valentino.love";
    expect(getPublicBaseUrl()).toBe("https://valentino.love");
  });

  it("generates generic Open Graph and Twitter Card tags without leaking partner names", () => {
    process.env.APP_URL = "https://valentino.love";
    const publicId = "abc123secret456";

    const metaHtml = getPublicSharingMetaHtml(publicId);

    // Verifies Decision D4 strict invariant: og:title and twitter:title must never contain user input
    expect(metaHtml).toContain(`<meta property="og:title" content="${GENERIC_SHARE_TITLE}" />`);
    expect(metaHtml).toContain(`<meta name="twitter:title" content="${GENERIC_SHARE_TITLE}" />`);
    expect(metaHtml).toContain(`<meta property="og:description" content="${GENERIC_SHARE_DESCRIPTION}" />`);
    expect(metaHtml).toContain(`<meta property="og:type" content="website" />`);
    expect(metaHtml).toContain(`<meta name="twitter:card" content="summary_large_image" />`);

    // Verifies canonical link and og:url point to the exact public experience
    expect(metaHtml).toContain(`<link rel="canonical" href="https://valentino.love/v/${publicId}" />`);
    expect(metaHtml).toContain(`<meta property="og:url" content="https://valentino.love/v/${publicId}" />`);

    // Verifies og:image points to the absolute URL of the high-res card
    expect(metaHtml).toContain(
      `<meta property="og:image" content="https://valentino.love${DEFAULT_OG_IMAGE_PATH}" />`
    );
    expect(metaHtml).toContain(
      `<meta name="twitter:image" content="https://valentino.love${DEFAULT_OG_IMAGE_PATH}" />`
    );

    // Robots meta should remain noindex, nofollow for privacy
    expect(metaHtml).toContain(`<meta name="robots" content="noindex, nofollow" />`);
  });

  it("escapes custom atmospheric descriptions to prevent injection", () => {
    const maliciousDesc = 'Romantic "sanctuary" & <script>alert(1)</script>';
    const metaHtml = getPublicSharingMetaHtml("test-id", maliciousDesc);

    expect(metaHtml).not.toContain("<script>");
    expect(metaHtml).toContain("&quot;sanctuary&quot;");
    expect(metaHtml).toContain("&lt;script&gt;");
  });
});
