import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const QA_DIR = path.join(process.cwd(), "test-results", "screenshots", "visual-qa");

test.describe("Phase 5A: Comprehensive Visual QA Screenshot Generation", () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(QA_DIR)) {
      fs.mkdirSync(QA_DIR, { recursive: true });
    }
  });

  const viewports = [
    { name: "mobile-360", width: 360, height: 740 },
    { name: "mobile-390", width: 390, height: 844 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "desktop-1024", width: 1024, height: 768 },
    { name: "desktop-1280", width: 1280, height: 900 },
    { name: "desktop-1440", width: 1440, height: 960 },
  ];

  for (const vp of viewports) {
    test(`Capture Homepage - ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${APP_URL}/`);
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(QA_DIR, `homepage_initial_${vp.name}.png`),
        fullPage: true,
      });

      // Select Cloud Nine
      const cloudNineTab = page.locator('#worlds div[role="button"]:has-text("Cloud Nine")');
      if (await cloudNineTab.isVisible()) {
        await cloudNineTab.click();
        await page.waitForTimeout(400);
        await page.screenshot({
          path: path.join(QA_DIR, `homepage_cloud_nine_${vp.name}.png`),
          fullPage: false,
          clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 900) },
        });
      }

      // Select Kage
      const kageTab = page.locator('#worlds div[role="button"]:has-text("Kage")');
      if (await kageTab.isVisible()) {
        await kageTab.click();
        await page.waitForTimeout(400);
        await page.screenshot({
          path: path.join(QA_DIR, `homepage_kage_${vp.name}.png`),
          fullPage: false,
          clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 900) },
        });
      }
    });
  }

  test("Capture Showroom Worlds and Plasma Themes (Desktop 1280)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/templates`);
    await page.waitForTimeout(500);

    // Midnight Rose on Stage
    await page.screenshot({
      path: path.join(QA_DIR, "showroom_midnight_rose_stage.png"),
      fullPage: false,
    });

    // Cloud Nine on Stage
    await page.locator('button:has-text("Cloud Nine")').first().click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(QA_DIR, "showroom_cloud_nine_stage.png"),
      fullPage: false,
    });

    // Kage on Stage
    await page.locator('button:has-text("Kage")').first().click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(QA_DIR, "showroom_kage_stage.png"),
      fullPage: false,
    });

    // Launch Kage WebGL preview
    await page.locator('button:has-text("Launch 3D WebGL Preview")').click();
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(QA_DIR, "showroom_kage_webgl_active.png"),
      fullPage: false,
    });
  });

  test("Capture Studio Worlds & Recipient Views", async ({ page, request }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    // 1. Studio Midnight Rose
    await page.goto(`${APP_URL}/create?template=midnight-rose`);
    await page.waitForURL(/\/edit\/[A-Za-z0-9_-]+/);
    const midnightEditUrl = page.url();
    const publicId = midnightEditUrl.split("/edit/")[1];
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(QA_DIR, "studio_midnight_rose.png"),
      fullPage: false,
    });

    // Switch to Cloud Nine in Studio
    await page.getByTestId("change-world-trigger").click();
    await page.locator('button:has-text("Cloud Nine")').first().click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(QA_DIR, "studio_switched_to_cloud_nine.png"),
      fullPage: false,
    });

    // Switch to Kage in Studio
    await page.getByTestId("change-world-trigger").click();
    await page.locator('button:has-text("Kage")').first().click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(QA_DIR, "studio_switched_to_kage.png"),
      fullPage: false,
    });

    // Fill required letter fields to allow publishing
    await page.locator('[data-testid="input-partner-name"]').fill("Seraphina");
    await page.locator('[data-testid="input-sender-name"]').fill("Julian");
    await page.locator('[data-testid="input-message"]').fill("In this sacred space between shadow and light, my heart chooses you.");
    await page.waitForTimeout(1000);

    const publishBtn = page.getByTestId("publish-button");
    if (await publishBtn.isVisible()) {
      await publishBtn.click();
      await page.waitForSelector('[data-testid="publish-success-modal"]', { timeout: 10000 });

      // Recipient View for Kage
      await page.goto(`${APP_URL}/v/${publicId}`);
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: path.join(QA_DIR, "recipient_kage_world.png"),
        fullPage: false,
      });
    }
  });
});
