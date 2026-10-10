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

const OUTPUT_DIR = "C:/Users/AYUSH/.gemini/antigravity-ide/brain/9d610088-6efa-4241-82b7-70b0cc3a4a13/phase8_captures";

test.beforeAll(() => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
});

test.describe("Phase 8 Cinematic Worlds Visual Matrix", () => {
  for (const vp of VIEWPORTS) {
    test(`Visual capture across all cinematic worlds at ${vp.name}`, async ({ page }) => {
      test.setTimeout(180000);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      // 0. Protected Homepage Hero Baseline
      const hero = page.locator("#hero");
      await hero.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `00_hero_${vp.name}.png`),
      });

      // 1. Stationery Unfolding Sequence (#personalize)
      const stationery = page.locator("#personalize");
      await stationery.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01_stationery_initial_${vp.name}.png`),
      });

      await page.evaluate(() => window.scrollBy(0, 350));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01_stationery_midpoint_${vp.name}.png`),
      });

      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01_stationery_settled_${vp.name}.png`),
      });

      // 2. World 1: Cloud Nine
      const cloudNine = page.locator('section[aria-label="Cloud Nine cinematic world"]');
      await cloudNine.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02_world_cloud_nine_initial_${vp.name}.png`),
      });

      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02_world_cloud_nine_reveal_${vp.name}.png`),
      });

      // 3. World 2: Midnight Rose
      const midnightRose = page.locator('section[aria-label="Midnight Rose cinematic world"]');
      await midnightRose.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `03_world_midnight_rose_initial_${vp.name}.png`),
      });

      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `03_world_midnight_rose_reveal_${vp.name}.png`),
      });

      // 4. World 3: Kage
      const kage = page.locator('section[aria-label="Kage cinematic world"]');
      await kage.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `04_world_kage_initial_${vp.name}.png`),
      });

      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `04_world_kage_reveal_${vp.name}.png`),
      });

      // 5. World 4: Apricot Film
      const apricotFilm = page.locator('section[aria-label="Apricot Film cinematic world"]');
      await apricotFilm.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `05_world_apricot_film_initial_${vp.name}.png`),
      });

      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `05_world_apricot_film_reveal_${vp.name}.png`),
      });

      // 6. World 5: Wildflower Paper
      const wildflower = page.locator('section[aria-label="Wildflower Paper cinematic world"]');
      await wildflower.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `06_world_wildflower_initial_${vp.name}.png`),
      });

      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `06_world_wildflower_reveal_${vp.name}.png`),
      });

      // 7. World 6: Ocean Letter
      const oceanLetter = page.locator('section[aria-label="Ocean Letter cinematic world"]');
      await oceanLetter.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `07_world_ocean_letter_initial_${vp.name}.png`),
      });

      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `07_world_ocean_letter_reveal_${vp.name}.png`),
      });

      // 8. The Hidden Trove
      const moments = page.locator("#moments");
      await moments.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `08_trove_${vp.name}.png`),
      });

      // 9. Finale Section & CTA
      const finale = page.locator("#create");
      await finale.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `09_finale_${vp.name}.png`),
      });
    });
  }
});
