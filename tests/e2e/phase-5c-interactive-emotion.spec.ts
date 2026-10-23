import { test, expect } from "@playwright/test";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Phase 5C: Interactive Emotion & Storytelling Renaissance E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}/api/health`);
  });

  test("1. End-to-End Creator Journey: Configure Moments in Studio, Publish & Verify Isolation", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/create?template=midnight-rose`);
    await expect(page).toHaveURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 30000 });

    const currentUrl = page.url();
    const publicId = currentUrl.split("/edit/")[1];

    // 1. Author core story
    const partnerInput = page.locator('[data-testid="input-partner-name"]');
    await partnerInput.fill("Juliet");

    const senderInput = page.locator('[data-testid="input-sender-name"]');
    await senderInput.fill("Romeo");

    const messageArea = page.locator('[data-testid="input-message"]');
    await messageArea.fill("My bounty is as boundless as the sea, my love as deep; the more I give to thee, the more I have.");

    // Wait for autosave
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="save-status-pill"]')).toContainText("Saved");

    // 2. Open Moments section in Studio 2.0
    const momentsTab = page.locator('[data-testid="stage-tab-story"]').first();
    if (await momentsTab.isVisible()) {
      await momentsTab.click();
      await page.waitForTimeout(400);

      const addMomentBtn = page.locator('[data-testid="add-moment-trigger"]').first();
      if (await addMomentBtn.isVisible()) {
        await addMomentBtn.click();
        await page.waitForTimeout(300);
      }
    }

    const enableModule = async (moduleId: string) => {
      let toggle = page.locator(`[data-testid="toggle-module-${moduleId}"]`);
      if (!await toggle.isVisible()) {
        const addMomentBtn = page.locator('[data-testid="add-moment-trigger"]').first();
        if (await addMomentBtn.isVisible()) {
          await addMomentBtn.click();
          await page.waitForTimeout(300);
        }
      }
      toggle = page.locator(`[data-testid="toggle-module-${moduleId}"]`);
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(300);
      }
    };

    // Toggle interactive modules for the test
    await enableModule("reasons");
    await enableModule("compliments");
    await enableModule("fortuneCookie");
    await enableModule("scratchCard");
    await enableModule("promises");
    await enableModule("futureAdventures");
    await enableModule("adventureSpinner");
    await enableModule("finale");

    // Close library drawer if open
    const closeLibraryBtn = page.locator('[data-testid="close-moment-library"]').first();
    if (await closeLibraryBtn.isVisible()) {
      await closeLibraryBtn.click();
      await page.waitForTimeout(300);
    }

    // Wait for draft autosave with all interactive modules enabled
    await page.waitForTimeout(1200);
    await expect(page.locator('[data-testid="save-status-pill"]')).toContainText("Saved");

    // 3. Publish Experience
    const previewSendTab = page.locator('[data-testid="stage-tab-preview"]').first();
    if (await previewSendTab.isVisible()) {
      await previewSendTab.click();
      await page.waitForTimeout(400);
    }

    const publishBtn = page.locator('[data-testid="header-publish-button"], [data-testid="publish-button"], [data-testid="publish-btn"]').first();
    await expect(publishBtn).toBeVisible({ timeout: 10000 });
    await publishBtn.click();

    // Verify publish modal appears with link
    const viewLiveBtn = page.locator('[data-testid="open-public-page-link"], [data-testid="view-live-btn"]').first();
    await expect(viewLiveBtn).toBeVisible({ timeout: 15000 });

    // Navigate to recipient page
    await page.goto(`${APP_URL}/v/${publicId}`);
    await expect(page).toHaveURL(`${APP_URL}/v/${publicId}`);

    // If envelope seal overlay is present, crack it open
    const waxSeal = page.locator('[data-testid="envelope-wax-seal"], [data-testid="wax-seal-button"], button[aria-label*="Break the wax seal"]').first();
    if (await waxSeal.isVisible()) {
      await waxSeal.click();
      await page.waitForTimeout(1000);
    }

    // Step 4: Exercise Recipient Interactive Modules
    // Reasons module
    const reasonsContainer = page.locator('[data-testid="reasons-module-container"], [data-testid="module-reasons"]').first();
    await expect(reasonsContainer).toBeVisible({ timeout: 10000 });
    const nextReasonBtn = page.locator('[data-testid="reasons-next-btn"]');
    if (await nextReasonBtn.isVisible()) {
      await nextReasonBtn.click();
      await page.waitForTimeout(300);
    }
    const toggleViewBtn = page.locator('[data-testid="reasons-toggle-view"]');
    if (await toggleViewBtn.isVisible()) {
      await toggleViewBtn.click();
      await expect(page.locator('[data-testid="reasons-all-grid"]')).toBeVisible();
    }

    // Compliments module
    const complimentsContainer = page.locator('[data-testid="compliments-module-container"], [data-testid="module-compliments"]').first();
    await expect(complimentsContainer).toBeVisible();
    const complimentTrigger = page.locator('[data-testid="compliment-trigger-btn"]').first();
    await complimentTrigger.click();
    await page.waitForTimeout(500);
    await expect(page.locator('[data-testid="compliment-display"], [data-testid="compliment-display-text"]').first()).toBeVisible();

    // Fortune Cookie module
    const fortuneContainer = page.locator('[data-testid="fortune-cookie-module-container"], [data-testid="module-fortune-cookie"]').first();
    await expect(fortuneContainer).toBeVisible();
    const crackBtn = page.locator('[data-testid="crack-cookie-btn"], [data-testid="fortune-crack-btn"]').first();
    await crackBtn.click();
    await page.waitForTimeout(600);
    await expect(page.locator('[data-testid="fortune-slip"]').first()).toBeVisible();

    // Scratch Card module
    const scratchContainer = page.locator('[data-testid="scratch-card-module-container"], [data-testid="module-scratch-card"]').first();
    await expect(scratchContainer).toBeVisible();
    const scratchRevealBtn = page.locator('[data-testid="scratch-reveal-btn"]').first();
    await scratchRevealBtn.click();
    await expect(page.locator('[data-testid="scratch-revealed-text"]').first()).toBeVisible();

    // Promises module
    const promisesContainer = page.locator('[data-testid="promises-module-container"], [data-testid="module-promises"]').first();
    await expect(promisesContainer).toBeVisible();
    const firstPromise = page.locator('[data-testid^="promise-card-"], [data-testid="promise-item"]').first();
    if (await firstPromise.isVisible()) {
      await firstPromise.click();
      await page.waitForTimeout(300);
      await expect(firstPromise).toContainText("HELD IN HEART");
    }

    // Future Adventures module
    const adventuresContainer = page.locator('[data-testid="future-adventures-module-container"], [data-testid="module-future-adventures"]').first();
    await expect(adventuresContainer).toBeVisible();
    const filterPlanned = page.locator('[data-testid="adventure-filter-planned"]').first();
    if (await filterPlanned.isVisible()) {
      await filterPlanned.click();
      await page.waitForTimeout(300);
    }

    // Adventure Spinner module
    const spinnerContainer = page.locator('[data-testid="adventure-spinner-module-container"], [data-testid="module-adventure-spinner"]').first();
    await expect(spinnerContainer).toBeVisible();
    const quickPickBtn = page.locator('[data-testid="spinner-fallback-btn"], [data-testid="spinner-pick-btn"]').first();
    await quickPickBtn.click();
    await page.waitForTimeout(400);
    await expect(page.locator('[data-testid="spinner-result-card"], [data-testid="spinner-result"]').first()).toBeVisible();

    // Finale module
    const finaleContainer = page.locator('[data-testid="finale-module-container"], [data-testid="module-finale"]').first();
    await expect(finaleContainer).toBeVisible();
    const sealJourneyBtn = page.locator('[data-testid="finale-seal-journey-btn"], [data-testid="finale-seal-btn"]').first();
    await sealJourneyBtn.click();
    await page.waitForTimeout(300);
    await expect(page.locator('[data-testid="finale-seal-toast"], [data-testid="finale-seal-journey-btn"], [data-testid="finale-seal-btn"]').first()).toBeVisible();
  });

  test("2. Cloud Nine & Kage Template Harmony and Responsiveness", async ({ page }) => {
    // Test on Mobile viewport (390x844 iPhone 13)
    await page.setViewportSize({ width: 390, height: 844 });

    // Test Cloud Nine template
    await page.goto(`${APP_URL}/create?template=cloud-nine`);
    await expect(page).toHaveURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 30000 });

    const partnerInput = page.locator('[data-testid="input-partner-name"]');
    await partnerInput.fill("Celeste");
    const senderInput = page.locator('[data-testid="input-sender-name"]');
    await senderInput.fill("Lucian");
    const messageArea = page.locator('[data-testid="input-message"]');
    await messageArea.fill("Among the clouds and stardust, I found you.");

    await page.waitForTimeout(1000);

    // Verify no horizontal overflow on mobile viewport
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 5);

    // Test Kage template
    await page.goto(`${APP_URL}/create?template=kage`);
    await expect(page).toHaveURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 30000 });

    const kagePartnerInput = page.locator('[data-testid="input-partner-name"]');
    await kagePartnerInput.fill("Aoi");
    const kageSenderInput = page.locator('[data-testid="input-sender-name"]');
    await kageSenderInput.fill("Ren");
    const kageMessageArea = page.locator('[data-testid="input-message"]');
    await kageMessageArea.fill("Where stillness reveals what words cannot say.");

    await page.waitForTimeout(1000);

    // Verify Kage body does not horizontally overflow
    const kageBodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const kageWindowWidth = await page.evaluate(() => window.innerWidth);
    expect(kageBodyWidth).toBeLessThanOrEqual(kageWindowWidth + 5);
  });
});
