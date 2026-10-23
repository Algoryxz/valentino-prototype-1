import { test, expect } from "@playwright/test";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Phase 5A: Post-Release Stabilization & World System Repair", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}/api/health`);
  });

  test("1a. Create Midnight Rose experience without Origin mismatch", async ({ page }) => {
    await page.goto(`${APP_URL}/create?template=midnight-rose`);
    await expect(page).toHaveURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 30000 });
    await expect(page.locator("text=Midnight Rose").first()).toBeVisible();
  });

  test("1b. Create Cloud Nine experience without Origin mismatch", async ({ page }) => {
    await page.goto(`${APP_URL}/create?template=cloud-nine`);
    await expect(page).toHaveURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 30000 });
    await expect(page.locator("text=Cloud Nine").first()).toBeVisible();
  });

  test("1c. Create Kage experience without Origin mismatch", async ({ page }) => {
    await page.goto(`${APP_URL}/create?template=kage`);
    await expect(page).toHaveURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 30000 });
    await expect(page.locator("text=Kage").first()).toBeVisible();
  });

  test("2. Capability chip deep-linking to Studio destination", async ({ page }) => {
    await page.goto(`${APP_URL}/create?template=midnight-rose&focus=timeline`);
    await expect(page).toHaveURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 30000 });

    // Should activate Moments section and display Timeline module card
    await expect(page.locator('[data-testid="experience-module-manager"]')).toBeVisible();
    await expect(page.locator("text=Moments & Interactive Experiences")).toBeVisible();

    const addMomentTrigger = page.locator('[data-testid="add-moment-trigger"]').first();
    await addMomentTrigger.scrollIntoViewIfNeeded();
    await addMomentTrigger.click();

    await expect(page.locator('[data-testid="toggle-module-timeline"]')).toBeVisible();
  });

  test("3. World switching preserves content end-to-end with autosave and persistence", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/create?template=midnight-rose`);
    await expect(page).toHaveURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 30000 });

    // Enter personal content in Midnight Rose
    const partnerInput = page.locator('[data-testid="input-partner-name"]');
    await partnerInput.fill("Sophia");

    const senderInput = page.locator('[data-testid="input-sender-name"]');
    await senderInput.fill("Julian");

    const messageArea = page.locator('[data-testid="input-message"]');
    await messageArea.fill("Every quiet moment with you is an unforgettable universe.");

    // Wait for autosave indicator
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="save-status-pill"]')).toContainText("Saved");

    // Open World Switcher modal
    const worldBtn = page.getByTestId("change-world-trigger");
    await worldBtn.click();

    // Switch to Cloud Nine
    const cloudNineOption = page.locator('button:has-text("Cloud Nine")').first();
    await cloudNineOption.click();

    // Verify preview changes immediately to Cloud Nine
    await page.waitForTimeout(800);
    await expect(page.locator("text=Cloud Nine").first()).toBeVisible();

    // Verify content survived the world switch
    await expect(partnerInput).toHaveValue("Sophia");
    await expect(senderInput).toHaveValue("Julian");
    await expect(messageArea).toHaveValue("Every quiet moment with you is an unforgettable universe.");

    // Reload page to verify server persistence
    await page.reload();
    await page.waitForTimeout(1000);

    // Should still be Cloud Nine and have the exact content
    await expect(page.locator("text=Cloud Nine").first()).toBeVisible();
    await expect(page.locator('[data-testid="input-partner-name"]')).toHaveValue("Sophia");
    await expect(page.locator('[data-testid="input-sender-name"]')).toHaveValue("Julian");

    // Switch to Kage
    await page.getByTestId("change-world-trigger").click();
    const kageOption = page.locator('button:has-text("Kage")').first();
    await kageOption.click();

    await page.waitForTimeout(800);
    await expect(page.locator("text=Kage").first()).toBeVisible();
    await expect(page.locator('[data-testid="input-partner-name"]')).toHaveValue("Sophia");
  });

  test("4. Showroom world switching & dynamic Plasma button theming", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/templates`, { waitUntil: "domcontentloaded" });

    // Verify Initial Midnight Rose on Stage
    await expect(page.locator("#template-midnight-rose")).toBeVisible();

    // Switch stage to Cloud Nine
    const cloudNineTab = page.locator('button:has-text("Cloud Nine")').first();
    await cloudNineTab.click();
    await expect(page.locator("#template-cloud-nine")).toBeVisible();

    // Switch stage to Kage
    const kageTab = page.locator('button:has-text("Kage")').first();
    await kageTab.click();
    await expect(page.locator("#template-kage")).toBeVisible();

    // Verify Kage stage CTA links to create Kage experience
    const kageCreateCta = page.locator('#template-kage a[href^="/create?template=kage"]').first();
    await expect(kageCreateCta).toBeVisible();
    await expect(kageCreateCta).toHaveAttribute("href", "/create?template=kage");
  });

  test("5. Kage WebGL 3D preview initializes without crashing and can be toggled", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/templates`, { waitUntil: "domcontentloaded" });

    // Switch stage to Kage
    const kageTab = page.locator('button:has-text("Kage")').first();
    await kageTab.click();
    await expect(page.locator("#template-kage")).toBeVisible();

    // Click launch 3D WebGL preview
    const launchBtn = page.locator('button:has-text("Launch 3D WebGL Preview")');
    await expect(launchBtn).toBeVisible();
    await launchBtn.click();

    // Wait for the WebGL canvas or close button to appear
    await expect(page.locator('button:has-text("✕ Close")')).toBeVisible();

    // Wait for kage-boot.js to be loaded and attached to document
    await page.waitForSelector('script[src*="kage-boot.js"]', { state: "attached", timeout: 15000 });
    const hasScript = await page.evaluate(() => {
      return Boolean(document.querySelector('script[src*="kage-boot.js"]'));
    });
    expect(hasScript).toBe(true);

    // Toggle close WebGL
    await page.locator('button:has-text("✕ Close")').click();
    await expect(page.locator('button:has-text("Launch 3D WebGL Preview")')).toBeVisible();
  });

  test("6. Homepage platform-first presentation and World Collection navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/`);

    // Verify Platform framing
    await expect(page.locator("h1")).toContainText("Create something they'll remember");

    // Verify World Collection section
    const worldsSection = page.locator("#worlds-section");
    await expect(worldsSection).toBeVisible();
    await expect(worldsSection.getByText("Chapter 01 · The Living Worlds")).toBeVisible();
    await expect(worldsSection.getByText("Every letter has a place where it belongs.")).toBeVisible();

    // Verify presence of cinematic world sections
    await expect(page.locator('section[aria-label="Midnight Rose cinematic world"]')).toBeAttached();
    await expect(page.locator('section[aria-label="Cloud Nine cinematic world"]')).toBeAttached();
    await expect(page.locator('section[aria-label="Kage cinematic world"]')).toBeAttached();

    // Verify customize CTA routes to /create?template=kage
    const customizeKage = page.locator('section[aria-label="Kage cinematic world"] a[href="/create?template=kage"]');
    await expect(customizeKage).toBeAttached();
  });

  test("7. CSRF Origin validation rejects unrelated origins and hides internal diagnostics", async ({
    request,
  }) => {
    // Unrelated 3rd party origin POST to /api/experiences
    const maliciousRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: {
        Origin: "https://evil-attacker.com",
        "Content-Type": "application/json",
      },
      data: {
        templateId: "midnight-rose",
        templateVersion: "v1",
      },
    });

    expect(maliciousRes.status()).toBe(403);
    const body = await maliciousRes.json();
    // Verify no internal stack or sensitive origin comparison strings are exposed to client
    expect(body.error).toBe("Request origin not allowed");
    expect(body.expected).toBeUndefined();
    expect(body.received).toBeUndefined();
  });
});
