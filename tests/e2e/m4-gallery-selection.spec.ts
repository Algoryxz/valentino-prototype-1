import { test, expect } from "@playwright/test";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Milestone 4: Template Gallery, Live Preview, and Direct Selection Flow", () => {
  test("1. Category filtering accurately filters atmospheres", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/templates`);

    // Verify initial header and category filter pills
    await expect(page.locator("h1")).toContainText("Choose Your Atmosphere");
    await expect(page.getByTestId("filter-all")).toBeVisible();
    await expect(page.getByTestId("filter-cinematic")).toBeVisible();
    await expect(page.getByTestId("filter-analog")).toBeVisible();
    await expect(page.getByTestId("filter-botanical")).toBeVisible();
    await expect(page.getByTestId("filter-oceanic")).toBeVisible();

    // Filter by Analog
    await page.getByTestId("filter-analog").click();
    await expect(page.locator("#template-apricot-film h2")).toContainText("Apricot Film");

    // Filter by Botanical
    await page.getByTestId("filter-botanical").click();
    await expect(page.locator("#template-wildflower-paper h2")).toContainText("Wildflower Paper");

    // Filter by Oceanic
    await page.getByTestId("filter-oceanic").click();
    await expect(page.locator("#template-ocean-letter h2")).toContainText("Ocean Letter");

    // Return to All
    await page.getByTestId("filter-all").click();
    await expect(page.getByRole("radio", { name: /Select Midnight Rose atmosphere/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: /Select Cloud Nine atmosphere/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: /Select Ocean Letter atmosphere/i })).toBeVisible();
  });

  test("2. Shared ExperienceRenderer live preview renders authentic sample data", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/templates`);

    // Open live preview modal for Midnight Rose
    const previewBtn = page.getByRole("button", { name: /Enter Midnight Rose/i });
    await previewBtn.click();

    // Verify modal container & test IDs
    const modal = page.locator(".z-modal");
    await expect(modal).toBeVisible();

    // Verify prominent sample preview banner
    await expect(modal.getByText("✦ Sample Preview — Fictional Data ✦")).toBeVisible();
    await expect(modal.getByText("Immersive Sanctuary Preview")).toBeVisible();

    // Verify sample recipient and sender names are present inside the live renderer preview
    await expect(modal.getByText("Maya").first()).toBeVisible();

    // Verify CTA button to use the atmosphere is available inside modal
    const useAtmosphereBtn = modal.getByTestId("select-template-btn");
    await expect(useAtmosphereBtn).toBeVisible();
    await expect(useAtmosphereBtn).toHaveAttribute("href", "/create/midnight-rose");

    // Test dismissal via ESC key
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });

  test("3. Direct selection journey /create/[templateId] initializes experience and enters editor", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    // Navigate directly to /create/apricot-film
    await page.goto(`${APP_URL}/create/apricot-film`);

    // Verify transition screen with capability preview
    await expect(page.getByTestId("world-capability-preview")).toBeVisible();

    // Automatically redirects to /edit/[publicId]
    await page.waitForURL(/\/edit\/[a-zA-Z0-9_-]+/, { timeout: 15000 });
    expect(page.url()).toMatch(/\/edit\/[a-zA-Z0-9_-]+/);

    // Verify that the editor has loaded and reflects Apricot Film
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText(/Apricot Film|Atmosphere|Studio/i).first()).toBeVisible();
  });

  test("4. Invalid template route /create/[templateId] renders friendly error fallback", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    // Navigate to non-existent template
    await page.goto(`${APP_URL}/create/non-existent-template-world`);

    // Must show friendly branded fallback card rather than an error crash
    const notFoundCard = page.getByTestId("template-not-found-card");
    await expect(notFoundCard).toBeVisible();
    await expect(notFoundCard.getByText("Atmosphere Unavailable")).toBeVisible();
    await expect(
      notFoundCard.getByText("The atmosphere “non-existent-template-world” is not currently available")
    ).toBeVisible();

    // Fallback CTA must link back to /templates
    const backBtn = notFoundCard.getByTestId("browse-templates-fallback-btn");
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    await page.waitForURL(/\/templates/, { timeout: 10000 });
    await expect(page.locator("h1")).toContainText("Choose Your Atmosphere");
  });
});
