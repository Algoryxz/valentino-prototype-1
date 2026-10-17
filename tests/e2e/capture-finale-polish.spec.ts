import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const SHOT_DIR =
  process.env.QA_DIR ||
  path.join(process.cwd(), "test-results", "screenshots", "finale-polish");

test.describe("Phase 6.7.3 Keepsake Ornament & Human Signature Polish Screenshots", () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SHOT_DIR)) {
      fs.mkdirSync(SHOT_DIR, { recursive: true });
    }
  });

  const viewports = [
    { name: "desktop-1440x900", width: 1440, height: 900 },
    { name: "mobile-390x844", width: 390, height: 844 },
    { name: "mobile-360x800", width: 360, height: 800 },
  ];

  for (const vp of viewports) {
    test(`Capture Stationery and Finale at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${APP_URL}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

      // 1. Capture stationery section (#personalize / #how-it-works)
      const stationeryEl = page.locator("#how-it-works");
      if (await stationeryEl.isVisible()) {
        await stationeryEl.scrollIntoViewIfNeeded();
        await page.evaluate(() => window.scrollBy(0, 250));
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(SHOT_DIR, `01_stationery_keepsake_${vp.name}.png`),
          fullPage: false,
        });
      }

      // 2. Capture finale resolution section (#create)
      const finaleEl = page.locator("#create");
      await finaleEl.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(SHOT_DIR, `02_finale_resolution_${vp.name}.png`),
        fullPage: false,
      });

      // 3. Verify Algoryxz link
      const algoryxzLink = page.locator('a[href="https://github.com/Algoryxz"]');
      await expect(algoryxzLink).toBeVisible();
      await expect(algoryxzLink).toHaveAttribute("target", "_blank");
      await expect(algoryxzLink).toHaveAttribute("rel", "noopener noreferrer");

      // 4. Verify CTAs in finale section
      const beginWorldBtn = finaleEl.getByRole("button", { name: /Begin Their World/ });
      await expect(beginWorldBtn).toBeVisible();

      const exploreShowroomBtn = finaleEl.getByRole("button", { name: /Explore Showroom/ });
      await expect(exploreShowroomBtn).toBeVisible();
    });
  }
});
