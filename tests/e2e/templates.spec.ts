import { test, expect } from "@playwright/test";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("M2 Template Discovery & Landing Page", () => {
  test("Landing page loads with cinematic hero and navigates to templates", async ({
    page,
  }) => {
    await page.goto(`${APP_URL}/`);
    await expect(page.locator("h1")).toContainText("Create something they'll remember");

    // Click Explore Showroom / Templates
    await page.locator('a[href="/templates"]').first().click();
    await page.waitForURL("**/templates");
    expect(page.url()).toContain("/templates");

    // Verify Template Card is visible
    await expect(page.locator("h1")).toContainText("Choose Your Atmosphere");
    // Switch to Midnight Rose living atmosphere
    await page.locator('button[aria-label="Select Midnight Rose atmosphere"]').click();
    await expect(page.locator("h2:has-text('Midnight Rose')")).toBeVisible();

    // Verify interactive color palette switcher on template card
    const goldSwatch = page.locator('button:has-text("Gold")');
    await expect(goldSwatch).toBeVisible();
    await goldSwatch.click();

    // Verify Customize Midnight Rose button points to /create?template=midnight-rose
    const customizeBtn = page.locator('a:has-text("Customize Midnight Rose")');
    await expect(customizeBtn).toBeVisible();
    await expect(customizeBtn).toHaveAttribute("href", "/create?template=midnight-rose");
  });

  test("Responsive verification across 360px, 390px, 768px, and 1440px with zero overflow", async ({
    page,
  }) => {
    const viewports = [
      { name: "Mobile Small", width: 360, height: 640 },
      { name: "Mobile Standard", width: 390, height: 844 },
      { name: "Tablet Portrait", width: 768, height: 1024 },
      { name: "Desktop Large", width: 1440, height: 900 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${APP_URL}/`);

      // Verify headline line wrapping & visibility
      const headline = page.locator("h1");
      await expect(headline).toBeVisible();
      await expect(headline).toContainText("Create something");
      await expect(headline).toContainText("they'll remember");

      // Verify FloatingNavbar is visible across responsive breakpoints
      const nav = page.locator("header");
      await expect(nav).toBeVisible();

      // Assert zero horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow).toBe(false);
    }

    // Verify reduced motion behavior
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${APP_URL}/`);

    // Verify hero and navigation are visible under reduced motion
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
  });
});
