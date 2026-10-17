import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const VIEWPORTS = [
  { name: "desktop_1440x900", width: 1440, height: 900 },
  { name: "desktop_1280x800", width: 1280, height: 800 },
  { name: "tablet_1024x768", width: 1024, height: 768 },
  { name: "tablet_768x1024", width: 768, height: 1024 },
  { name: "mobile_390x844", width: 390, height: 844 },
  { name: "mobile_360x800", width: 360, height: 800 },
];

const OUTPUT_DIR = path.join(process.cwd(), "test-results", "screenshots", "phase7_captures");

test.describe("Phase 7 Spatial Composition Reset Visual Gate", () => {
  test.beforeAll(() => {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
  });
  for (const vp of VIEWPORTS) {
    test(`Visual capture at ${vp.name}`, async ({ page }) => {
      test.setTimeout(120000);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "load" });
      await page.waitForTimeout(1000);

      const scrollToProgress = async (selector: string, progress: number) => {
        await page.evaluate(
          ({ sel, prog }) => {
            const el = document.querySelector(sel);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const elementTop = rect.top + scrollTop;
            const elementHeight = rect.height;
            const maxScroll = Math.max(0, elementHeight - window.innerHeight);
            const targetY = elementTop + prog * maxScroll;
            window.scrollTo({ top: targetY, behavior: "instant" });
          },
          { sel: selector, prog: progress }
        );
        await page.waitForTimeout(650);
      };

      // 1. Protected Homepage Hero
      const hero = page.locator("#hero");
      await hero.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await hero.screenshot({
        path: path.join(OUTPUT_DIR, `hero_${vp.name}.png`),
      });

      // 2. Area A: SpatialStationeryUnfold (#personalize)
      const stationery = page.locator("#personalize");
      await stationery.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await stationery.screenshot({
        path: path.join(OUTPUT_DIR, `stationery_${vp.name}.png`),
      });

      // 3. Area B: SpatialDiscoveredObjects (#moments)
      const moments = page.locator("#moments");
      await moments.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await moments.screenshot({
        path: path.join(OUTPUT_DIR, `moments_${vp.name}.png`),
      });

      // 4. World Vista: Cloud Nine
      await scrollToProgress("#worlds-section", 0.15);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `world_cloud_nine_${vp.name}.png`),
      });

      // 5. World Vista: Kage
      await scrollToProgress("#worlds-section", 0.45);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `world_kage_${vp.name}.png`),
      });

      // 6. World Vista: Wildflower Paper
      await scrollToProgress("#worlds-section", 0.75);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `world_wildflower_${vp.name}.png`),
      });

      // 7. Area C: Final Resolution and CTA (#create)
      const finale = page.locator("#create");
      await finale.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await finale.screenshot({
        path: path.join(OUTPUT_DIR, `finale_${vp.name}.png`),
      });
    });
  }

  test("Test interactive states on Discovered Objects (Desktop)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(1000);

    const moments = page.locator("#moments");
    await moments.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // Open envelope
    const envBtn = moments.locator('button[aria-label="Folded velvet envelope with wax seal"]');
    await envBtn.click();
    await page.waitForTimeout(600);

    // Open whisper note
    const whisperBtn = moments.locator('button[aria-label="Origami folded secret whisper note"]');
    await whisperBtn.click();
    await page.waitForTimeout(600);

    // Open brass keepsake
    const brassBtn = moments.locator('button[aria-label="Heavy aged hammered brass talisman"]');
    await brassBtn.click();
    await page.waitForTimeout(600);

    await moments.screenshot({
      path: path.join(OUTPUT_DIR, "moments_interactive_revealed_desktop.png"),
    });

    // Verify all revealed contents are visible in the DOM
    await expect(page.locator("text=Close your eyes. Take a breath. I am right here with you.")).toBeVisible();
    await expect(page.locator("text=Where did we share our very first secret?")).toBeVisible();
    await expect(page.locator("text=Every morning with you is my favorite thing on earth.")).toBeVisible();
  });
});
