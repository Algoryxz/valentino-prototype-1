/**
 * Shared Social Sharing & Open Graph Metadata Generator
 *
 * Implements Decision D4 (Settled in ADR-0004 / Milestone 5):
 * - Public link previews are STRICTLY generic ("A Valentine Experience").
 * - Personal partner names and messages are NEVER interpolated into Open Graph
 *   or Twitter tags, preventing chat crawlers (iMessage, WhatsApp, Telegram, Signal)
 *   from scraping or caching private relationship data.
 */

export const GENERIC_SHARE_TITLE = "A Valentine Experience";
export const GENERIC_SHARE_DESCRIPTION = "A personal, romantic Valentine experience.";
export const DEFAULT_OG_IMAGE_PATH = "/og-share-card.png";

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function getPublicBaseUrl(): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NODE_ENV === "production"
    ? "https://valentino-prototype-1.vercel.app"
    : "http://localhost:3000";
}

export function getPublicSharingMetaHtml(
  publicId: string = "",
  customDescription: string = GENERIC_SHARE_DESCRIPTION
): string {
  const baseUrl = getPublicBaseUrl().replace(/\/+$/, "");
  const pageUrl = publicId ? `${baseUrl}/v/${encodeURIComponent(publicId)}` : baseUrl;
  const imageUrl = `${baseUrl}${DEFAULT_OG_IMAGE_PATH}`;
  const safeDescription = escapeHtmlAttr(customDescription);

  return [
    `<meta name="robots" content="noindex, nofollow" />`,
    `<meta property="og:site_name" content="Valentino" />`,
    `<meta property="og:title" content="${GENERIC_SHARE_TITLE}" />`,
    `<meta property="og:description" content="${safeDescription}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${pageUrl}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Valentino — ${GENERIC_SHARE_TITLE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${GENERIC_SHARE_TITLE}" />`,
    `<meta name="twitter:description" content="${safeDescription}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
    `<link rel="canonical" href="${pageUrl}" />`,
  ].join("\n  ");
}
