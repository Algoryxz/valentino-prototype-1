import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const QA_DIR = path.join(process.cwd(), "test-results", "screenshots", "phase-5f-landing");

test.describe("Phase 5F: Public Landing Page Renaissance Visual QA", () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(QA_DIR)) {
      fs.mkdirSync(QA_DIR, { recursive: true });
    }
  });

  test("Capture Desktop 1440x900 continuous landing page journey", async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${APP_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // 1. Hero: Pink Sunset Sky (01 - Enter Valentino)
    const heroEl = page.locator("#hero").first();
    await heroEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "01_landing_desktop_hero.png"),
      fullPage: false,
    });

    // 2. Personalize / Stationery Unfold
    const personalizeEl = page.locator("#personalize, #build-your-valentine").first();
    await personalizeEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "02_landing_desktop_personalize.png"),
      fullPage: false,
    });

    // 3. Worlds: Living Worlds Showcase
    const worldsEl = page.locator("#worlds-section, [data-testid='world-showroom-scene']").first();
    await worldsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "03_landing_desktop_worlds.png"),
      fullPage: false,
    });

    // 4. Moments: Discovered Objects & Keepsakes
    const momentsEl = page.locator("#moments").first();
    await momentsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "04_landing_desktop_moments.png"),
      fullPage: false,
    });

    // 5. Finale & Resolution
    const finaleEl = page.locator("#create").first();
    await finaleEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "05_landing_desktop_finale.png"),
      fullPage: false,
    });
  });

  test("Capture Mobile 390x844 responsive landing page journey", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${APP_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Verify no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

    // 6. Mobile Hero
    const heroEl = page.locator("#hero").first();
    await heroEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "06_landing_mobile_hero.png"),
      fullPage: false,
    });

    // 7. Mobile Personalize
    const personalizeEl = page.locator("#personalize, #build-your-valentine").first();
    await personalizeEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "07_landing_mobile_personalize.png"),
      fullPage: false,
    });

    // 8. Mobile Worlds
    const worldsEl = page.locator("#worlds-section, [data-testid='world-showroom-scene']").first();
    await worldsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "08_landing_mobile_worlds.png"),
      fullPage: false,
    });

    // 9. Mobile Moments
    const momentsEl = page.locator("#moments").first();
    await momentsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "09_landing_mobile_moments.png"),
      fullPage: false,
    });

    // 10. Mobile Finale
    const finaleEl = page.locator("#create").first();
    await finaleEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "10_landing_mobile_finale.png"),
      fullPage: false,
    });
  });
});
