import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const QA_DIR = path.join(process.cwd(), "test-results", "screenshots", "phase-5f-showroom");

test.describe("Phase 5F Step 4: World Showroom Visual QA & Responsive Validation", () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(QA_DIR)) {
      fs.mkdirSync(QA_DIR, { recursive: true });
    }
  });

  test("Desktop (1440x900): Cloud Nine, Midnight Rose, and Kage dominant stages", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${APP_URL}/templates`);

    // 1. Initial State: Midnight Rose Dominant
    const stage = page.locator("#showroom-stage");
    await expect(stage).toBeVisible();
    await expect(page.locator("#template-midnight-rose h2")).toContainText("Midnight Rose");
    await expect(page.getByText("Private Midnight Garden")).toBeVisible();
    await expect(page.getByText("Intimate, dramatic, deeply personal stories sealed after dark.")).toBeVisible();

    // Wax seal interaction
    const sealBtn = page.locator('button[aria-label="Break seal"]');
    await expect(sealBtn).toBeVisible();
    await sealBtn.click();
    await expect(page.getByText("In a world of noise, you are my quiet starlight")).toBeVisible();

    // Capture Midnight Rose Desktop Screenshot
    await page.screenshot({
      path: path.join(QA_DIR, "01_showroom_desktop_midnight_rose.png"),
      fullPage: false,
    });

    // 2. Switch to Cloud Nine
    const cloudTab = page.locator('button:has-text("Cloud Nine")').first();
    await cloudTab.click();
    await page.waitForTimeout(500);

    await expect(page.locator("#template-cloud-nine h2")).toContainText("Cloud Nine");
    await expect(page.getByText("Dreamy Sunset Sky World")).toBeVisible();
    await expect(page.getByText("Dreamy, playful, affectionate stories that feel light as air.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Enter Cloud Nine" })).toBeVisible();

    // Cloud envelope interaction
    const cloudBtn = page.locator('button[aria-label="Open cloud envelope"]');
    await expect(cloudBtn).toBeVisible();
    await cloudBtn.click();
    await expect(page.getByText("Every moment with you feels like floating high above the clouds")).toBeVisible();

    // Capture Cloud Nine Desktop Screenshot
    await page.screenshot({
      path: path.join(QA_DIR, "02_showroom_desktop_cloud_nine.png"),
      fullPage: false,
    });

    // 3. Switch to Kage
    const kageTab = page.locator('button:has-text("Kage")').first();
    await kageTab.click();
    await page.waitForTimeout(500);

    await expect(page.locator("#template-kage h2")).toContainText("Kage");
    await expect(page.getByText("Kyoto Digital Sanctuary")).toBeVisible();
    await expect(page.getByText("Quiet, poetic, contemplative stories steeped in sacred stillness.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Enter Kage" })).toBeVisible();

    // Capture Kage Desktop Screenshot
    await page.screenshot({
      path: path.join(QA_DIR, "03_showroom_desktop_kage.png"),
      fullPage: false,
    });

    // 4. Test "Enter World" Immersion Modal
    const enterKageBtn = page.getByRole("button", { name: "Enter Kage" });
    await enterKageBtn.click();
    const modal = page.locator(".z-modal");
    await expect(modal).toBeVisible();
    await expect(modal.getByText("Immersive Sanctuary Preview")).toBeVisible();

    const modalZ = await modal.evaluate((el) => ({
      zIndex: window.getComputedStyle(el).zIndex,
      position: window.getComputedStyle(el).position,
      parentClass: el.parentElement?.className,
    }));
    // Wait for fade-in animation to settle
    await page.waitForTimeout(600);

    // Capture Enter World Modal Screenshot
    await page.screenshot({
      path: path.join(QA_DIR, "04_showroom_desktop_enter_modal.png"),
      fullPage: false,
    });

    // Close modal via Escape
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });

  test("Mobile (390x844): Vertical composition, no overflow, clean touch UI", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${APP_URL}/templates`);

    // Verify header and title
    await expect(page.locator("h1")).toContainText("Choose Your Atmosphere");
    await expect(page.locator("#template-midnight-rose")).toBeVisible();

    // Verify zero horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);

    // Capture Mobile Midnight Rose Screenshot
    await page.screenshot({
      path: path.join(QA_DIR, "05_showroom_mobile_midnight_rose.png"),
      fullPage: false,
    });

    // Switch to Cloud Nine on Mobile
    const cloudBtn = page.locator('button:has-text("Cloud Nine")').first();
    await cloudBtn.click();
    await page.waitForTimeout(500);
    await expect(page.locator("#template-cloud-nine h2")).toContainText("Cloud Nine");

    // Capture Mobile Cloud Nine Screenshot
    await page.screenshot({
      path: path.join(QA_DIR, "06_showroom_mobile_cloud_nine.png"),
      fullPage: false,
    });

    // Switch to Kage on Mobile
    const kageBtn = page.locator('button:has-text("Kage")').first();
    await kageBtn.click();
    await page.waitForTimeout(500);
    await expect(page.locator("#template-kage h2")).toContainText("Kage");

    // Capture Mobile Kage Screenshot
    await page.screenshot({
      path: path.join(QA_DIR, "07_showroom_mobile_kage.png"),
      fullPage: false,
    });
  });

  test("Responsive Breakpoints: 360x800, 768x1024, 1024x768, 1280x800", async ({ page }) => {
    const viewports = [
      { width: 360, height: 800, name: "360x800" },
      { width: 768, height: 1024, name: "768x1024" },
      { width: 1024, height: 768, name: "1024x768" },
      { width: 1280, height: 800, name: "1280x800" },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${APP_URL}/templates`);

      // Verify no horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow).toBe(false);

      // Verify dominant world is visible
      await expect(page.locator("#showroom-stage")).toBeVisible();
    }
  });

  test("Verify elimination of technical noise and capability chips", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${APP_URL}/templates`);

    // Verify that raw developer capability chips are not rendered
    const rawLetterChip = page.locator('span:text-is("letter")');
    const rawTimelineChip = page.locator('span:text-is("timeline")');
    const rawQuizChip = page.locator('span:text-is("quiz")');
    const rawSecretChip = page.locator('span:text-is("secret")');
    const rawThreeChip = page.locator('span:text-is("threejs")');
    const rawWebglChip = page.locator('span:text-is("webgl")');

    await expect(rawLetterChip).not.toBeVisible();
    await expect(rawTimelineChip).not.toBeVisible();
    await expect(rawQuizChip).not.toBeVisible();
    await expect(rawSecretChip).not.toBeVisible();
    await expect(rawThreeChip).not.toBeVisible();
    await expect(rawWebglChip).not.toBeVisible();

    // Verify human-first language is present
    await expect(page.getByText("Relationship Journey:")).toBeVisible();
    await expect(page.getByText("Best For:")).toBeVisible();
    await expect(page.getByText("Signature:").first()).toBeVisible();
  });
});
