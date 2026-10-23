import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const QA_DIR = process.env.OUTPUT_DIR || path.join(process.cwd(), "test-results", "phase5f_landing_qa");

test.describe("Phase 5F: Public Landing Page Renaissance Visual QA", () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(QA_DIR)) {
      fs.mkdirSync(QA_DIR, { recursive: true });
    }
  });

  test("Capture Desktop 1440x900 continuous landing page journey", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${APP_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // 1. Hero: Editorial Asymmetric Stagger & Floating Letter
    const heroEl = page.locator("#hero");
    await expect(heroEl).toBeVisible();
    await page.screenshot({
      path: path.join(QA_DIR, "01_landing_desktop_hero.png"),
      fullPage: false,
    });

    // 2. Stationery Unfold: Physical Paper Hand-off
    const builderEl = page.locator("#build-your-valentine");
    await expect(builderEl).toBeVisible();
    await builderEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "02_landing_desktop_stationery.png"),
      fullPage: false,
    });

    // 3. Living Worlds: Single-Stage Continuity Walkthrough
    const worldsEl = page.locator("#worlds-section");
    await expect(worldsEl).toBeVisible();
    await worldsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "03_landing_desktop_worlds.png"),
      fullPage: false,
    });

    // 4. Discovered Objects: Suspended Keepsakes in Starlight
    const momentsEl = page.locator("#moments");
    await expect(momentsEl).toBeVisible();
    await momentsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "04_landing_desktop_moments.png"),
      fullPage: false,
    });

    // 5. Finale: Botanical Frame & Invitation
    const finaleEl = page.locator("#create");
    await expect(finaleEl).toBeVisible();
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
    const heroEl = page.locator("#hero");
    await expect(heroEl).toBeVisible();
    await page.screenshot({
      path: path.join(QA_DIR, "06_landing_mobile_hero.png"),
      fullPage: false,
    });

    // 7. Mobile Stationery
    const builderEl = page.locator("#build-your-valentine");
    await expect(builderEl).toBeVisible();
    await builderEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "07_landing_mobile_stationery.png"),
      fullPage: false,
    });

    // 8. Mobile Worlds Walkthrough
    const worldsEl = page.locator("#worlds-section");
    await expect(worldsEl).toBeVisible();
    await worldsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "08_landing_mobile_worlds.png"),
      fullPage: false,
    });

    // 9. Mobile Discovered Objects
    const momentsEl = page.locator("#moments");
    await expect(momentsEl).toBeVisible();
    await momentsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "09_landing_mobile_moments.png"),
      fullPage: false,
    });

    // 10. Mobile Finale
    const finaleEl = page.locator("#create");
    await expect(finaleEl).toBeVisible();
    await finaleEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "10_landing_mobile_finale.png"),
      fullPage: false,
    });
  });
});
