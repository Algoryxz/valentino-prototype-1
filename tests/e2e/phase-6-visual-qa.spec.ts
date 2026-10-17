import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const QA_DIR =
  process.env.QA_DIR ||
  path.join(process.cwd(), "test-results", "screenshots", "phase-6-visual");

test.describe("Phase 6 UI/UX Renaissance Comprehensive Visual QA", () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(QA_DIR)) {
      fs.mkdirSync(QA_DIR, { recursive: true });
    }
  });

  const viewports = [
    { name: "desktop-1440x900", width: 1440, height: 900 },
    { name: "desktop-1280x800", width: 1280, height: 800 },
    { name: "tablet-landscape-1024x768", width: 1024, height: 768 },
    { name: "tablet-portrait-768x1024", width: 768, height: 1024 },
    { name: "mobile-390x844", width: 390, height: 844 },
    { name: "mobile-360x800", width: 360, height: 800 },
  ];

  // 1. Homepage & Showroom across all required viewports
  for (const vp of viewports) {
    test(`Capture Homepage & Showroom at ${vp.name}`, async ({ page }) => {
      test.setTimeout(120000);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${APP_URL}/`, { waitUntil: "load" });
      await page.waitForSelector("header, nav, #personalize", { state: "attached" });
      await page.waitForTimeout(1500);

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

      // Homepage Hero
      await page.screenshot({
        path: path.join(QA_DIR, `01_homepage_hero_${vp.name}.png`),
        fullPage: false,
      });

      // Homepage Stationery (SpatialStationeryUnfold - Made from little things)
      const stationeryEl = page.locator("#personalize");
      if (await stationeryEl.isVisible()) {
        await stationeryEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        await page.screenshot({
          path: path.join(QA_DIR, `02_homepage_stationery_${vp.name}.png`),
          fullPage: false,
        });
      }

      // Homepage Living Worlds Section (SpatialWorldsWalkthrough)
      const worldsEl = page.locator("#worlds-section");
      if (await worldsEl.isVisible()) {
        await worldsEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(QA_DIR, `02b_homepage_worlds_${vp.name}.png`),
          fullPage: false,
        });

        // Capture individual world scenes for precise visual audit
        const scenes = page.locator(".world-vista-scene");
        const sceneCount = await scenes.count();
        const worldNames = ["cloud_nine", "midnight_rose", "kage", "apricot_film", "wildflower_paper", "ocean_letter"];
        for (let i = 0; i < sceneCount; i++) {
          const scene = scenes.nth(i);
          await scene.scrollIntoViewIfNeeded();
          await page.waitForTimeout(400);
          const name = worldNames[i] || `world_${i}`;
          await page.screenshot({
            path: path.join(QA_DIR, `02b_world_${name}_${vp.name}.png`),
            fullPage: false,
          });
        }
      }

      // Homepage Discovered Moments Section (SpatialDiscoveredObjects)
      const momentsEl = page.locator("#moments");
      if (await momentsEl.isVisible()) {
        await momentsEl.scrollIntoViewIfNeeded();
        await page.evaluate(() => window.scrollBy(0, -70));
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(QA_DIR, `02b2_homepage_moments_${vp.name}.png`),
          fullPage: false,
        });
      }

      // Homepage Finale Section
      const finaleEl = page.locator("#create");
      if (await finaleEl.isVisible()) {
        await finaleEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(QA_DIR, `02c_homepage_finale_${vp.name}.png`),
          fullPage: false,
        });
      }

      // World Showroom on Templates page (Cloud Nine / Midnight Rose)
      await page.goto(`${APP_URL}/templates`, { waitUntil: "load" });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(QA_DIR, `03_world_showroom_${vp.name}.png`),
        fullPage: false,
      });

      // Switch to Kage world for contrasting material inspection
      const kageRadio = page.locator('button[aria-label="Select Kage atmosphere"]');
      if (await kageRadio.isVisible()) {
        await kageRadio.click();
        await page.waitForTimeout(800);
        await page.screenshot({
          path: path.join(QA_DIR, `03b_world_showroom_kage_${vp.name}.png`),
          fullPage: false,
        });
      }
    });
  }

  // 2. Comprehensive Creator Flow & Studio Stages (Desktop 1440x900)
  test("Capture Creator Studio, Story, Moments, Mood, Preview & Mobile Modes", async ({ page }) => {
    // A. Create Flow
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${APP_URL}/create?template=midnight-rose`);
    await page.screenshot({
      path: path.join(QA_DIR, "04_create_flow_immediate.png"),
      fullPage: false,
    });

    // Wait for redirect to /edit/[publicId]
    await page.waitForURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 15000 });
    await page.waitForTimeout(1000);

    // B. Editor Shell
    await page.screenshot({
      path: path.join(QA_DIR, "05_editor_shell_desktop.png"),
      fullPage: false,
    });

    // C. Story Editor Section
    const storyTab = page.locator('button:has-text("Story")').first();
    if (await storyTab.isVisible()) {
      await storyTab.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(QA_DIR, "06_story_editor.png"),
        fullPage: false,
      });
    }

    // D. Moments Editor Section
    const momentsTab = page.locator('button:has-text("Moments")').first();
    if (await momentsTab.isVisible()) {
      await momentsTab.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(QA_DIR, "07_moments_editor.png"),
        fullPage: false,
      });
    }

    // E. Mood / Decor Editor Section
    const moodTab = page.locator('button:has-text("Mood & Decor")').first();
    if (await moodTab.isVisible()) {
      await moodTab.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(QA_DIR, "08_mood_decor_editor.png"),
        fullPage: false,
      });
    }

    // F. Preview Mode (Focus mode)
    const focusBtn = page.locator('button[title*="Focus mode"], button:has-text("Focus Mode")').first();
    if (await focusBtn.isVisible()) {
      await focusBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(QA_DIR, "09_preview_mode_focus.png"),
        fullPage: false,
      });
      // Exit focus mode
      const exitFocus = page.locator('button:has-text("Exit Focus Mode")').first();
      if (await exitFocus.isVisible()) {
        await exitFocus.click();
        await page.waitForTimeout(300);
      }
    }

    // G. Mobile Editor Viewport (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(QA_DIR, "10_mobile_editor_form.png"),
      fullPage: false,
    });

    // Switch to Mobile Live Preview Tab
    const previewTabMobile = page.locator('button:has-text("Live Preview")').first();
    if (await previewTabMobile.isVisible()) {
      await previewTabMobile.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(QA_DIR, "11_mobile_editor_live_preview.png"),
        fullPage: false,
      });
    }
  });
});
