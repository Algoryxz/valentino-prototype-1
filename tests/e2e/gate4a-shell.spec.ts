import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const ARTIFACTS_DIR = process.env.OUTPUT_DIR || path.join(process.cwd(), "test-results", "gate4a_shell");

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

test.describe("Gate 4A: Design System & Core Shell Verification", () => {
  test("verifies neutral luxury FloatingNavbar on desktop and captures visual QA", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Verify brand and navigation links
    const brand = page.locator("header a[href='/']");
    await expect(brand).toBeVisible();
    await expect(brand).toContainText("Valentino");

    const createLink = page.locator("header nav a[href='/create']");
    await expect(createLink).toBeVisible();
    await expect(createLink).toHaveText("Create");

    const templatesLink = page.locator("header nav a[href='/templates']");
    await expect(templatesLink).toBeVisible();
    await expect(templatesLink).toHaveText("Templates");

    const ctaButton = page.locator("header a[href='/create'] button");
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveText("Create");

    // Capture screenshot of desktop header & hero
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "gate4a_desktop_nav.png"),
      clip: { x: 0, y: 0, width: 1280, height: 400 },
    });
  });

  test("verifies mobile responsiveness at 390px and 360px with zero horizontal overflow", async ({ page }) => {
    for (const width of [390, 360]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");

      const brand = page.locator("header a[href='/']");
      await expect(brand).toBeVisible();

      const ctaButton = page.locator("header a[href='/create'] button");
      await expect(ctaButton).toBeVisible();

      // Verify zero horizontal scroll
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

      // Capture mobile screenshot
      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, `gate4a_mobile_${width}.png`),
        clip: { x: 0, y: 0, width, height: 320 },
      });
    }
  });

  test("verifies neutral shell on /templates and /create", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/templates");

    const templatesHeading = page.locator("h1");
    await expect(templatesHeading).toContainText("Choose Your Atmosphere");

    const cta = page.locator("header a[href^='/create']");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText("Create Experience");

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "gate4a_templates_header.png"),
      clip: { x: 0, y: 0, width: 1280, height: 350 },
    });
  });
});
