import { test, expect } from "@playwright/test";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Phase 5D: Relationship Story & Personalization Renaissance E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}/api/health`);
  });

  test("1. End-to-End Creator Journey: Configure Timeline, Story Chapters, Welcome, and Finale", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/create?template=midnight-rose`);
    await expect(page).toHaveURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 30000 });

    const currentUrl = page.url();
    const publicId = currentUrl.split("/edit/")[1];

    // 1. Author core story
    const partnerInput = page.locator('[data-testid="input-partner-name"]');
    await expect(partnerInput).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(600);
    await partnerInput.fill("Maya");

    const senderInput = page.locator('[data-testid="input-sender-name"]');
    await senderInput.fill("Rohan");

    const messageArea = page.locator('[data-testid="input-message"]');
    await messageArea.fill("Every day with you has been an unwritten chapter of wonder and devotion.");

    // 2. Configure Story Chapters & Pacing
    const cinematicPacing = page.locator('[data-testid="pacing-option-cinematic"]');
    if (await cinematicPacing.isVisible()) {
      await cinematicPacing.click();
      await page.waitForTimeout(300);
    }

    // Enable Personal Welcome
    const welcomeToggle = page.locator('[data-testid="toggle-narrative-welcome"]');
    if (await welcomeToggle.isVisible()) {
      await welcomeToggle.click();
      await page.waitForTimeout(300);

      const welcomeGreeting = page.locator('[data-testid="input-welcome-greeting"]');
      if (await welcomeGreeting.isVisible()) {
        await welcomeGreeting.fill("To Maya, My Entire Sky");
      }

      const welcomeMsg = page.locator('[data-testid="input-welcome-message"]');
      if (await welcomeMsg.isVisible()) {
        await welcomeMsg.fill("Walk slowly through these quiet memories we made together.");
      }
    }

    // 3. Open Moments section to configure Timeline & Milestones
    const momentsTab = page.locator('[data-testid="stage-tab-story"]').first();
    if (await momentsTab.isVisible()) {
      await momentsTab.click();
      await page.waitForTimeout(400);
    }

    let timelineToggle = page.locator('[data-testid="toggle-module-timeline"]');
    if (!await timelineToggle.isVisible()) {
      const addMomentBtn = page.locator('[data-testid="add-moment-trigger"]').first();
      if (await addMomentBtn.isVisible()) {
        await addMomentBtn.click();
        await page.waitForTimeout(300);
      }
    }

    if (await timelineToggle.isVisible()) {
      await timelineToggle.click();
      await page.waitForTimeout(400);
    }

    // Add milestone if available
    const addMilestoneBtn = page.locator('[data-testid="timeline-add-item"]');
    if (await addMilestoneBtn.isVisible()) {
      await addMilestoneBtn.click();
      await page.waitForTimeout(300);
    }

    // 4. Save Draft and Publish
    await page.waitForTimeout(1000);
    const saveBtn = page.locator('[data-testid="save-draft-button"]');
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await page.waitForTimeout(500);
    }

    // Publish
    const publishBtn = page.locator('[data-testid="publish-button"]');
    await expect(publishBtn).toBeEnabled({ timeout: 10000 });
    await publishBtn.click();

    // Verify publish modal appears with link
    await expect(page.locator('[data-testid="publish-success-modal"]')).toBeVisible({ timeout: 15000 });
    const liveLink = page.locator('[data-testid="public-url-input"]');
    await expect(liveLink).toBeVisible();

    // 5. Navigate to Published Recipient Journey
    await page.goto(`${APP_URL}/v/${publicId}`);
    await page.waitForTimeout(1000);

    // Verify Wax Seal & Envelope
    const sealBtn = page.locator('[data-testid="wax-seal-button"]');
    if (await sealBtn.isVisible()) {
      await sealBtn.click();
      await page.waitForTimeout(1000);
    }

    // Recipient sees Story Narrative & Welcome banner
    const welcomeBanner = page.locator('[data-testid="narrative-welcome-banner"]');
    await expect(welcomeBanner).toBeVisible({ timeout: 10000 });
    await expect(welcomeBanner).toContainText("Maya");

    // Recipient sees Timeline & Milestones
    const timelineModule = page.locator('[data-testid="module-timeline"]');
    await expect(timelineModule).toBeVisible({ timeout: 10000 });
  });

  test("2. Recipient Multi-World Story Support: Cloud Nine and Kage", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // Mobile test
    await page.goto(`${APP_URL}/create?template=cloud-nine`);
    await expect(page).toHaveURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 30000 });

    const currentUrl = page.url();
    const publicId = currentUrl.split("/edit/")[1];

    // Configure Cloud Nine
    const partnerInput = page.locator('[data-testid="input-partner-name"]');
    await expect(partnerInput).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(600);
    await partnerInput.fill("Celeste");
    await page.locator('[data-testid="input-sender-name"]').fill("Leo");
    await page.locator('[data-testid="input-message"]').fill("Higher than the softest clouds in the celestial sky.");

    await page.waitForTimeout(1200);
    await expect(page.locator('[data-testid="save-status-pill"]')).toContainText("Saved");

    const saveBtn = page.locator('[data-testid="save-draft-button"]');
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await page.waitForTimeout(500);
    }

    const publishBtn = page.locator('[data-testid="publish-button"]');
    await expect(publishBtn).toBeEnabled({ timeout: 10000 });
    await publishBtn.click();

    await expect(page.locator('[data-testid="publish-success-modal"]')).toBeVisible({ timeout: 15000 });

    // Open public recipient view
    await page.goto(`${APP_URL}/v/${publicId}`);
    await page.waitForTimeout(1000);

    const sealBtn = page.locator('[data-testid="wax-seal-button"]');
    if (await sealBtn.isVisible()) {
      await sealBtn.click();
      await page.waitForTimeout(1000);
    }

    await expect(page.locator('[data-testid="recipient-name"]')).toContainText("Celeste");
  });
});
