// Grapheme counting and Unicode sanitation

export function countGraphemes(text: string): number {
  if (!text) return 0;
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    let count = 0;
    for (const _ of segmenter.segment(text)) {
      count++;
    }
    return count;
  }
  // Fallback for environments lacking Intl.Segmenter
  return Array.from(text).length;
}

import { z } from "zod";

export const graphemeMax = (max: number) =>
  z.string().refine((val) => countGraphemes(val) <= max, {
    message: `Must not exceed ${max} characters`,
  });

// Strip bidi overrides (U+202A to U+202E) and isolates (U+2066 to U+2069),
// and ASCII control characters except \n and \r, while keeping ZWJ (\u200D) and ZWNJ (\u200C)
export function sanitizeText(
  input: string,
  options: { allowNewlines?: boolean } = {}
): string {
  if (!input) return "";

  // Normalize to NFC
  let cleaned = input.normalize("NFC");

  // Strip directional override and isolate formatting characters
  cleaned = cleaned.replace(/[\u202A-\u202E\u2066-\u2069]/g, "");

  // Strip control characters
  if (options.allowNewlines) {
    // Keep \n (\x0A) and \r (\x0D)
    cleaned = cleaned.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");
  } else {
    cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
  }

  // Trim and collapse whitespace
  if (options.allowNewlines) {
    // Trim leading/trailing whitespace across whole string
    cleaned = cleaned.trim();
  } else {
    cleaned = cleaned.replace(/\s+/g, " ").trim();
  }

  return cleaned;
}

/**
 * Context-aware HTML entity escaping for plain-text interpolation.
 * Converts dangerous markup characters to safe HTML entities.
 */
export function escapeHtml(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Context-aware HTML attribute escaping.
 * Converts dangerous characters and quote marks so they cannot break attribute boundaries.
 */
export function escapeHtmlAttr(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;");
}

/**
 * Safely serializes data for embedding inside inline <script> tags.
 * Escapes <, >, &, and Unicode line/paragraph separators to prevent </script> breakouts.
 */
export function safeJsonForScript(data: unknown): string {
  const json = JSON.stringify(data ?? null);
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Validates and sanitizes media and soundtrack URLs.
 * Requires https: for external URLs or allowed internal relative paths (/api/media/...).
 * Explicitly rejects javascript:, data:, vbscript:, and protocol-relative (//) URLs.
 */
export function sanitizeUrl(input: string | null | undefined): string {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();
  if (!trimmed) return "";

  // Reject protocol-relative or dangerous schemes
  if (trimmed.startsWith("//")) return "";
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return "";
  }

  // Allow explicitly supported internal relative media or experience paths
  if (
    trimmed.startsWith("/api/media/") ||
    trimmed.startsWith("/api/experiences/") ||
    trimmed.startsWith("/v/") ||
    trimmed.startsWith("/landing-pages/")
  ) {
    if (/[\x00-\x1F\x7F]/.test(trimmed)) return "";
    return trimmed;
  }

  // Validate absolute URLs
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:") {
      return parsed.href;
    }
    // In local dev/test only, allow http://localhost or 127.0.0.1
    if (
      process.env.NODE_ENV !== "production" &&
      parsed.protocol === "http:" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
    ) {
      return parsed.href;
    }
  } catch {
    return "";
  }

  return "";
}
