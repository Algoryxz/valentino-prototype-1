import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  escapeHtmlAttr,
  safeJsonForScript,
  sanitizeUrl,
} from "@/lib/sanitize";
import { renderCloudNineSsrHtml } from "@/templates/cloud-nine/v1/ssr";
import { renderKageSsrHtml } from "@/templates/kage/v1/ssr";

describe("M6 Security Hardening — XSS & Output Sanitization", () => {
  describe("escapeHtml", () => {
    it("escapes executable markup and dangerous tags", () => {
      const payload = `<script>alert("XSS")</script>`;
      const escaped = escapeHtml(payload);
      expect(escaped).toBe("&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;");
      expect(escaped).not.toContain("<script>");
    });

    it("escapes event handler injection payloads", () => {
      const payload = `<img src=x onerror=alert('hacked')>`;
      const escaped = escapeHtml(payload);
      expect(escaped).toContain("&lt;img src=x onerror=alert(&#39;hacked&#39;)&gt;");
      expect(escaped).not.toContain("<img");
    });

    it("escapes SVG script vectors", () => {
      const payload = `<svg><script href="data:text/javascript,alert(1)" /></svg>`;
      const escaped = escapeHtml(payload);
      expect(escaped).toContain("&lt;svg&gt;&lt;script");
      expect(escaped).not.toContain("<svg>");
    });

    it("escapes ampersands and quotes properly", () => {
      expect(escapeHtml("Romeo & Juliet's \"Love\"")).toBe(
        "Romeo &amp; Juliet&#39;s &quot;Love&quot;"
      );
    });

    it("preserves legitimate Unicode, Hindi text, and emojis", () => {
      const unicodeText = "नमस्ते, प्रिय Ananya! 💖🌹 You make my world shine ✨";
      expect(escapeHtml(unicodeText)).toBe(unicodeText);
    });

    it("handles null, undefined, and non-string inputs safely", () => {
      expect(escapeHtml(null)).toBe("");
      expect(escapeHtml(undefined)).toBe("");
      expect(escapeHtml(12345)).toBe("12345");
    });
  });

  describe("escapeHtmlAttr", () => {
    it("escapes attribute quotes and angle brackets to prevent attribute breakout", () => {
      const breakoutPayload = `val" onfocus="alert(1)" x="`;
      const escaped = escapeHtmlAttr(breakoutPayload);
      expect(escaped).toContain("val&quot; onfocus=&quot;alert(1)&quot; x=&quot;");
      expect(escaped).not.toContain('"');
    });

    it("escapes backticks and single quotes", () => {
      const payload = "test`payload'with&symbols";
      const escaped = escapeHtmlAttr(payload);
      expect(escaped).toContain("&#96;");
      expect(escaped).toContain("&#39;");
      expect(escaped).toContain("&amp;");
    });
  });

  describe("safeJsonForScript", () => {
    it("prevents script breakout via </script> tag inside JSON payloads", () => {
      const maliciousData = {
        name: "</script><script>alert('pwned')</script>",
      };
      const serialized = safeJsonForScript(maliciousData);
      expect(serialized).not.toContain("</script>");
      expect(serialized).toContain("\\u003c/script\\u003e");
    });

    it("escapes HTML characters & and <> to prevent inline parser confusion", () => {
      const data = { message: "Tom & Jerry <3" };
      const serialized = safeJsonForScript(data);
      expect(serialized).toContain("\\u0026");
      expect(serialized).toContain("\\u003c");
    });

    it("escapes ECMAScript line separators U+2028 and U+2029", () => {
      const data = { text: "Line 1\u2028Line 2\u2029Line 3" };
      const serialized = safeJsonForScript(data);
      expect(serialized).toContain("\\u2028");
      expect(serialized).toContain("\\u2029");
      expect(serialized).not.toContain("\u2028");
    });
  });

  describe("sanitizeUrl", () => {
    it("rejects javascript: pseudo-protocol", () => {
      expect(sanitizeUrl("javascript:alert(1)")).toBe("");
      expect(sanitizeUrl("JAVASCRIPT:alert(document.cookie)")).toBe("");
      expect(sanitizeUrl(" javascript:void(0)")).toBe("");
    });

    it("rejects unsafe data: URLs", () => {
      expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("");
      expect(sanitizeUrl("data:image/svg+xml;base64,...")).toBe("");
    });

    it("rejects vbscript: and protocol-relative // URLs", () => {
      expect(sanitizeUrl("vbscript:msgbox(1)")).toBe("");
      expect(sanitizeUrl("//malicious-site.com/payload")).toBe("");
    });

    it("permits valid HTTPS URLs", () => {
      const validUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
      expect(sanitizeUrl(validUrl)).toBe(validUrl);
    });

    it("permits safe internal media and experience relative paths", () => {
      expect(sanitizeUrl("/api/media/audio-key-123.mp3")).toBe("/api/media/audio-key-123.mp3");
      expect(sanitizeUrl("/api/experiences/exp-456/status")).toBe("/api/experiences/exp-456/status");
    });

    it("rejects arbitrary relative traversal paths", () => {
      expect(sanitizeUrl("/etc/passwd")).toBe("");
      expect(sanitizeUrl("../secret.json")).toBe("");
    });
  });

  describe("Template SSR Output Hardening", () => {
    it("Cloud Nine SSR escapes partner name and prevents inline script execution", () => {
      const maliciousConfig = {
        partnerName: `<script>alert('xss')</script>`,
        message: `<img src=x onerror=alert(1)>`,
        greeting: "Hello",
        signOff: "Love",
        accentTheme: "blush-sky",
      } as any;

      const html = renderCloudNineSsrHtml(maliciousConfig, "pub-123", "test-nonce-abc");
      expect(html).not.toContain("<script>alert('xss')</script>");
      expect(html).toContain("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;");
      expect(html).toContain('nonce="test-nonce-abc"');
    });

    it("Kage SSR safely serializes partner title without script breakout", () => {
      const maliciousConfig = {
        partnerName: `Partner"; alert('hacked'); //`,
        message: "Dedication message",
        greeting: "Beloved",
        signOff: "Always",
        accentTheme: "kyoto-dusk",
      } as any;

      const html = renderKageSsrHtml(maliciousConfig, "pub-456", "nonce-xyz");
      expect(html).not.toContain('Partner"; alert(\'hacked\'); //');
      expect(html).toContain('nonce="nonce-xyz"');
    });
  });
});
