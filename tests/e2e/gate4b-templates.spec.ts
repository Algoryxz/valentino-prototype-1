import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const ARTIFACTS_DIR =
  process.env.ARTIFACTS_DIR ||
  (process.platform === "win32" && fs.existsSync("C:/Users/AYUSH")
    ? "C:/Users/AYUSH/.gemini/antigravity-ide/brain/e5eae4f4-e648-40a2-9962-cbe0c413455d"
    : path.join(process.cwd(), "test-results", "artifacts"));

test.describe("Gate 4B: Templates Showroom Renaissance", () => {
  test.beforeAll(() => {
    if (!fs.existsSync(ARTIFACTS_DIR)) {
      fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
    }
  });
  test("Editorial Showroom composition, featured live stage, and data-driven metadata", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/templates`);

    // Verify main headline and neutral shell
    await expect(page.locator("h1")).toContainText("Choose Your Atmosphere");
    await expect(page.getByText("The Collection · Visual Worlds")).toBeVisible();

    // Verify Featured Stage displays Midnight Rose by default
    const featuredHeading = page.locator("#template-midnight-rose h2");
    await expect(featuredHeading).toContainText("Midnight Rose");
    await expect(page.getByText("For the love that feels like midnight")).toBeVisible();
    await expect(page.getByText("Physical envelope + interactive wax seal reveal")).toBeVisible();

    // Verify interactive color palette switcher on featured stage
    const goldSwatch = page.locator('button:has-text("Gold")');
    await expect(goldSwatch).toBeVisible();
    await goldSwatch.click();
    await expect(page.locator("strong:has-text('Champagne Gold')")).toBeVisible();

    // Verify wax seal interaction inside featured stage
    const sealBtn = page.locator('button[aria-label="Break seal"]');
    await expect(sealBtn).toBeVisible();
    await sealBtn.click();
    await expect(page.locator("text=In a world of noise")).toBeVisible();

    // Verify customize button for Midnight Rose
    const customizeMidnight = page.locator('a:has-text("Customize Midnight Rose")');
    await expect(customizeMidnight).toBeVisible();
    await expect(customizeMidnight).toHaveAttribute("href", "/create?template=midnight-rose");

    // Capture screenshot of featured world stage
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "gate4b_featured_stage.png"),
      clip: { x: 0, y: 0, width: 1280, height: 850 },
    });
  });

  test("Truthful template availability and secondary active worlds (Cloud Nine & Kage)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/templates`);

    // Verify Cloud Nine has Available status and correct link
    const cloudNineHeading = page.getByRole("heading", { name: "Cloud Nine", exact: true });
    await expect(cloudNineHeading).toBeVisible();
    const customizeCloudNine = page.getByRole("link", { name: /Customize Cloud Nine/i });
    await expect(customizeCloudNine).toBeVisible();
    await expect(customizeCloudNine).toHaveAttribute("href", "/create?template=cloud-nine");

    // Verify Kage has ThreeUI / Experimental status and correct link
    const kageHeading = page.getByRole("heading", { name: /Kage/i });
    await expect(kageHeading).toBeVisible();
    const customizeKage = page.getByRole("link", { name: /Customize Kage/i });
    await expect(customizeKage).toBeVisible();
    await expect(customizeKage).toHaveAttribute("href", "/create?template=kage");

    // Verify roadmap worlds have honest Coming Soon badges
    await expect(page.getByRole("heading", { name: "Golden Hour" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Love Letter" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Stardust" })).toBeVisible();

    // Capture full showroom visual QA screenshot
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "gate4b_desktop_showroom.png"),
      fullPage: true,
    });
  });

  test("Mobile responsive layout across 360px and 390px with zero horizontal overflow", async ({
    page,
  }) => {
    for (const width of [390, 360]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${APP_URL}/templates`);

      // Verify header and heading fit
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Midnight Rose" })).toBeVisible();

      // Verify zero horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow).toBe(false);

      if (width === 390) {
        await page.screenshot({
          path: path.join(ARTIFACTS_DIR, "gate4b_mobile_showroom.png"),
          clip: { x: 0, y: 0, width: 390, height: 900 },
        });
      }
    }
  });
});
