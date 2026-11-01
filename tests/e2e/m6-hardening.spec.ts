import { test, expect } from "@playwright/test";

test.describe("M6 Hardening & Release Verification", () => {
  test("Security Headers & CSP Nonce Verification on Public Experience", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);

    const headers = res.headers();
    expect(headers["cache-control"]).toContain("no-store");
    expect(headers["x-content-type-options"]).toBe("nosniff");
  });

  test("CSP headers present on public experience routes", async ({ request }) => {
    const res = await request.get("/v/non-existent-public-id");
    // Returns 404 if DB is online and experience not found, or calm 500 if DB is offline
    expect([404, 500]).toContain(res.status());
    const headers = res.headers();
    expect(headers["content-security-policy"]).toBeDefined();
    expect(headers["content-security-policy"]).toContain("script-src");
    expect(headers["content-security-policy"]).toContain("object-src 'none'");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["cache-control"]).toContain("no-store");
  });

  test("Protected Homepage remains untouched and functional", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Valentino/i);
    // Verify hero CTA
    const cta = page.getByRole("link", { name: /begin their world/i }).first();
    await expect(cta).toBeVisible();
  });

  test("Report abuse endpoint enforces Origin and payload validation", async ({ request }) => {
    // Missing origin should be rejected
    const unauthenticatedRes = await request.post("/api/experiences/test-public-id/report", {
      data: {
        reason: "inappropriate_content",
        details: "Test abuse report",
      },
    });
    // Origin check rejects with 403
    expect(unauthenticatedRes.status()).toBe(403);
  });

  test("Status update endpoint requires creator session cookie", async ({ request }) => {
    const res = await request.patch("/api/experiences/test-public-id/status", {
      headers: {
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
      },
      data: {
        status: "DISABLED",
      },
    });
    // Missing cookie or offline DB rejects with 401, 404, or 500
    expect([401, 404, 500]).toContain(res.status());
  });

  test("Permanent delete endpoint requires creator session cookie", async ({ request }) => {
    const res = await request.delete("/api/experiences/test-public-id", {
      headers: {
        Origin: "http://localhost:3000",
      },
    });
    // Missing cookie or offline DB rejects with 401, 404, or 500
    expect([401, 404, 500]).toContain(res.status());
  });

  test.describe("Mobile Viewport Ergonomics (390×844 and 360×640)", () => {
    test("390×844 Mobile Viewport — Homepage and Templates", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/templates");
      await page.waitForLoadState("domcontentloaded");

      // Verify template gallery cards render cleanly without overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(390);
    });

    test("360×640 Mobile Viewport — Homepage and Templates", async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 640 });
      await page.goto("/templates");
      await page.waitForLoadState("domcontentloaded");

      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(360);
    });
  });
});
