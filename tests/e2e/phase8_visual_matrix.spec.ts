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

const OUTPUT_DIR = "C:/Users/AYUSH/.gemini/antigravity-ide/brain/9fabd511-bd1c-41d3-a59d-3a047823f7e2/phase8_captures";

test.beforeAll(() => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
});

test.describe("Phase 8 Cinematic Worlds Visual Matrix", () => {
  for (const vp of VIEWPORTS) {
    test(`Visual capture across all cinematic worlds at ${vp.name}`, async ({ page }) => {
      test.setTimeout(240000);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      const vh = vp.height;

      // 0. Protected Homepage Hero Baseline
      const hero = page.locator("#hero");
      await hero.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `00_hero_${vp.name}.png`),
      });

      // 1. Stationery Unfolding Sequence (#personalize)
      await page.evaluate(() => {
        const el = document.getElementById("personalize");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollBy(0, rect.top);
        }
      });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01_stationery_initial_${vp.name}.png`),
      });

      await page.evaluate((scrollAmount) => window.scrollBy(0, scrollAmount), Math.round(vh * 0.32));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01_stationery_midpoint_${vp.name}.png`),
      });

      await page.evaluate((scrollAmount) => window.scrollBy(0, scrollAmount), Math.round(vh * 0.30));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01_stationery_settled_${vp.name}.png`),
      });

      await page.evaluate((scrollAmount) => window.scrollBy(0, scrollAmount), Math.round(vh * 0.40));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01_stationery_transition_${vp.name}.png`),
      });

      // Helper function for capturing world multi-stage sequences within calibrated pin range
      const captureWorld = async (selector: string, prefix: string) => {
        const el = page.locator(selector);
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(OUTPUT_DIR, `${prefix}_initial_${vp.name}.png`),
        });

        // 1. Midpoint (progress ~0.35)
        await page.evaluate((scrollAmount) => window.scrollBy(0, scrollAmount), Math.round(vh * 0.45));
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(OUTPUT_DIR, `${prefix}_midpoint_${vp.name}.png`),
        });

        // 2. Completed Reveal & Solid Paper Settling (progress ~0.65)
        await page.evaluate((scrollAmount) => window.scrollBy(0, scrollAmount), Math.round(vh * 0.45));
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(OUTPUT_DIR, `${prefix}_reveal_${vp.name}.png`),
        });

        // 3. Camera Dolly & Opening Handover (progress ~0.85)
        await page.evaluate((scrollAmount) => window.scrollBy(0, scrollAmount), Math.round(vh * 0.35));
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(OUTPUT_DIR, `${prefix}_transition_${vp.name}.png`),
        });

        // 4. Full Destination Atmosphere Handover (progress ~0.95)
        await page.evaluate((scrollAmount) => window.scrollBy(0, scrollAmount), Math.round(vh * 0.15));
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(OUTPUT_DIR, `${prefix}_handover_${vp.name}.png`),
        });
      };

      // 2. World 1: Cloud Nine
      await captureWorld('section[aria-label="Cloud Nine cinematic world"]', "02_world_cloud_nine");

      // 3. World 2: Midnight Rose
      await captureWorld('section[aria-label="Midnight Rose cinematic world"]', "03_world_midnight_rose");

      // 4. World 3: Kage
      await captureWorld('section[aria-label="Kage cinematic world"]', "04_world_kage");

      // 5. World 4: Apricot Film
      await captureWorld('section[aria-label="Apricot Film cinematic world"]', "05_world_apricot_film");

      // 6. World 5: Wildflower Paper
      await captureWorld('section[aria-label="Wildflower Paper cinematic world"]', "06_world_wildflower");

      // 7. World 6: Ocean Letter
      await captureWorld('section[aria-label="Ocean Letter cinematic world"]', "07_world_ocean_letter");

      // 8. Lower Page: The Hidden Trove (#moments)
      const trove = page.locator("#moments");
      await trove.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `08_trove_${vp.name}.png`),
      });

      // 9. Finale Section (#create)
      const finale = page.locator("#create");
      await finale.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `09_finale_${vp.name}.png`),
      });
    });
  }
});
