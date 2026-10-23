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

const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(process.cwd(), "test-results", "phase8_visual_matrix");

test.beforeAll(() => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
});

test.describe("Phase 8.5 Cinematic Worlds & Physical Stationery Visual Matrix", () => {
  for (const vp of VIEWPORTS) {
    test(`Visual verification at ${vp.name}`, async ({ page }) => {
      test.setTimeout(300000);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      // Helper function to scroll to exact progress inside any scroll-driven section
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
        // Wait for GSAP scrub to settle
        await page.waitForTimeout(650);
      };

      // 0. Protected Homepage Hero Baseline
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `00_hero_${vp.name}.png`),
      });

      // 1. Stationery Unfolding Sequence (#personalize)
      // 1a. Folded compact trifold bundle
      await scrollToProgress("#personalize", 0.04);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01a_stationery_folded_${vp.name}.png`),
      });

      // 1b. Flaps opening in 3D space
      await scrollToProgress("#personalize", 0.28);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01b_stationery_unfolding_${vp.name}.png`),
      });

      // 1c. Sheet settled flat with ink typography resolving
      await scrollToProgress("#personalize", 0.58);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01c_stationery_settled_${vp.name}.png`),
      });

      // 1d. Botanical vines bloomed around perimeter
      await scrollToProgress("#personalize", 0.78);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01d_stationery_vines_${vp.name}.png`),
      });

      // 1e. Stationery transition into morning sky
      await scrollToProgress("#personalize", 0.96);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `01e_stationery_to_sky_${vp.name}.png`),
      });

      // 2. Worlds Walkthrough (#worlds-section)
      // 2a. Chapter 01 Headline over Cloud Nine Sky
      await scrollToProgress("#worlds-section", 0.02);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02a_chapter01_sky_${vp.name}.png`),
      });

      // 2b. Cloud Nine Active (Skyward aerogramme)
      await scrollToProgress("#worlds-section", 0.10);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02b_cloud_nine_active_${vp.name}.png`),
      });

      // 2c. Boundary: Cloud Nine -> Midnight Rose Handoff
      await scrollToProgress("#worlds-section", 0.165);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02c_handoff_cloud_to_rose_${vp.name}.png`),
      });

      // 2d. Midnight Rose Active (Burgundy velvet envelope & wax seal)
      await scrollToProgress("#worlds-section", 0.25);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02d_midnight_rose_active_${vp.name}.png`),
      });

      // 2e. Boundary: Midnight Rose -> Kage Handoff
      await scrollToProgress("#worlds-section", 0.33);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02e_handoff_rose_to_kage_${vp.name}.png`),
      });

      // 2f. Kage Active (Kyoto veranda & washi calligraphy)
      await scrollToProgress("#worlds-section", 0.41);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02f_kage_active_${vp.name}.png`),
      });

      // 2g. Boundary: Kage -> Apricot Film Handoff
      await scrollToProgress("#worlds-section", 0.495);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02g_handoff_kage_to_apricot_${vp.name}.png`),
      });

      // 2h. Apricot Film Active (35mm projection screen on stage)
      await scrollToProgress("#worlds-section", 0.58);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02h_apricot_film_active_${vp.name}.png`),
      });

      // 2i. Boundary: Apricot Film -> Wildflower Paper Handoff
      await scrollToProgress("#worlds-section", 0.66);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02i_handoff_apricot_to_wildflower_${vp.name}.png`),
      });

      // 2j. Wildflower Paper Active (English cottage garden pressed botanicals)
      await scrollToProgress("#worlds-section", 0.74);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02j_wildflower_active_${vp.name}.png`),
      });

      // 2k. Boundary: Wildflower Paper -> Ocean Letter Handoff
      await scrollToProgress("#worlds-section", 0.825);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02k_handoff_wildflower_to_ocean_${vp.name}.png`),
      });

      // 2l. Ocean Letter Active (Dawn shoreline & message in a bottle)
      await scrollToProgress("#worlds-section", 0.90);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02l_ocean_letter_active_${vp.name}.png`),
      });

      // 2m. Boundary: Ocean Letter -> The Hidden Trove Transition
      await scrollToProgress("#worlds-section", 0.98);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `02m_handoff_ocean_to_trove_${vp.name}.png`),
      });

      // 3. The Hidden Trove Still Life (#moments)
      await page.evaluate(() => {
        const el = document.getElementById("moments");
        if (el) {
          el.scrollIntoView({ behavior: "instant" });
        }
      });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `03a_trove_settled_${vp.name}.png`),
      });

      // 4. Finale Section (#create)
      await page.evaluate(() => {
        const el = document.getElementById("create");
        if (el) {
          el.scrollIntoView({ behavior: "instant" });
        }
      });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `04a_finale_${vp.name}.png`),
      });
    });
  }

  test("Test interactive states on Discovered Objects (Desktop)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
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
