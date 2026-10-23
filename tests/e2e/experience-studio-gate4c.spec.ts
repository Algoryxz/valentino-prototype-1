import { test, expect } from "@playwright/test";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Gate 4C: Experience Studio 2.0 (Creative Builder Renaissance)", () => {
  test("Studio Experience: Neutral Shell -> Non-Destructive World Switch -> Story & Moments -> Mood -> Live Canvas -> Publish", async ({
    page,
    context,
    request,
  }) => {
    // 1. Initialize an experience via API and transfer session cookie
    const createRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose", templateVersion: "v1" },
    });
    expect(createRes.ok()).toBe(true);
    const { publicId } = await createRes.json();

    const storage = await request.storageState();
    await context.addCookies(storage.cookies);

    // 2. Open Experience Studio 2.0
    await page.goto(`${APP_URL}/edit/${publicId}`);

    // Verify mandatory owner browser storage reminder banner
    const reminderBanner = page.locator('[data-testid="browser-storage-reminder"]');
    await expect(reminderBanner).toBeVisible();

    // Verify Save Status Pill shows saved
    const saveStatusPill = page.locator('[data-testid="save-status-pill"]');
    await expect(saveStatusPill).toHaveAttribute("data-status", "saved", { timeout: 15000 });

    // 3. Verify Active World & Non-Destructive World Switch Modal
    const worldTrigger = page.locator('[data-testid="change-world-trigger"]');
    await expect(worldTrigger).toBeVisible();
    await expect(worldTrigger).toContainText("Midnight Rose");

    // Click to open World Selector Modal
    await worldTrigger.click();
    const worldModal = page.locator('[data-testid="world-selector-modal"]');
    await expect(worldModal).toBeVisible();

    // Verify available worlds are displayed
    await expect(page.locator('[data-testid="world-option-midnight-rose"]')).toBeVisible();
    const cloudNineOption = page.locator('[data-testid="world-option-cloud-nine"]');
    await expect(cloudNineOption).toBeVisible();
    await expect(page.locator('[data-testid="world-option-kage"]')).toBeVisible();

    // Switch to Cloud Nine
    await cloudNineOption.click();
    await expect(worldModal).not.toBeVisible();

    // Verify world trigger now reflects Cloud Nine
    await expect(worldTrigger).toContainText("Cloud Nine");

    // 4. Compose Story (The Love Letter)
    const partnerInput = page.locator('[data-testid="input-partner-name"]');
    await partnerInput.fill("Seraphina");
    await partnerInput.blur();

    const senderInput = page.locator('[data-testid="input-sender-name"]');
    await senderInput.fill("Julian");
    await senderInput.blur();

    const messageInput = page.locator('[data-testid="input-message"]');
    await messageInput.fill("In a world of noise, you are my quiet starlight.");
    await messageInput.blur();

    // Verify Progressive Disclosure for Salutation and Sign-Off
    const advancedStoryToggle = page.getByRole("button", { name: /Customize Salutation & Sign-Off/i });
    await expect(advancedStoryToggle).toBeVisible();
    await advancedStoryToggle.click();

    const greetingInput = page.locator('[data-testid="input-greeting"]');
    await expect(greetingInput).toBeVisible();
    await greetingInput.fill("To my beloved Seraphina");

    const signoffInput = page.locator('[data-testid="input-sign-off"]');
    await expect(signoffInput).toBeVisible();
    await signoffInput.fill("Forever & always, Julian");

    // 5. Verify Dedication Completion & Stage Continuation
    await expect(page.locator("#section-personalize").getByText("Inscribed")).toBeVisible();
    await expect(page.getByRole("button", { name: /Continue to Atmosphere/i })).toBeVisible();

    // 6. Compose Moments (Module Engine)
    const moduleManager = page.locator('[data-testid="experience-module-manager"]');
    await expect(moduleManager).toBeVisible();

    // Enable Timeline moment via On-Demand Library
    const addMomentBtn = page.locator('[data-testid="add-moment-trigger"]');
    if (await addMomentBtn.isVisible()) {
      await addMomentBtn.click();
    }
    const timelineBtn = page.locator('[data-testid="toggle-module-timeline"]');
    await timelineBtn.click();
    const timelineEditor = page.locator('[data-testid="timeline-module-editor"]');
    await expect(timelineEditor).toBeVisible();

    const timelineTitleInput = page.locator('[data-testid="input-timeline-title"]');
    await timelineTitleInput.fill("Our Sacred Milestones");
    await timelineTitleInput.blur();

    // Enable Secret Note moment via On-Demand Library
    if (await addMomentBtn.isVisible()) {
      await addMomentBtn.click();
    }
    const secretBtn = page.locator('[data-testid="toggle-module-secret"]');
    await secretBtn.click();
    const secretEditor = page.locator('[data-testid="secret-module-editor"]');
    await expect(secretEditor).toBeVisible();

    const secretPromptInput = page.locator('[data-testid="input-secret-prompt"]');
    await secretPromptInput.fill("A whisper for your ears only");
    const secretContentInput = page.locator('[data-testid="input-secret-content"]');
    await secretContentInput.fill("I loved you before the stars even formed.");
    await secretContentInput.blur();

    // 7. Customize Mood & Decor (Presets & Untruncated Labels)
    const wildflowerPreset = page.locator('[data-testid="preset-option-wildflower"]');
    await expect(wildflowerPreset).toBeVisible();
    await wildflowerPreset.click();

    // Verify individual decor swatch triggers work
    const petalPaper = page.locator('[data-testid="decor-option-paper-petal-blush"]');
    await expect(petalPaper).toBeVisible();
    await petalPaper.click();

    const velvetRibbon = page.locator('[data-testid="decor-option-ribbon-velvet-crimson"]');
    await expect(velvetRibbon).toBeVisible();
    await velvetRibbon.click();

    // 8. Test Non-Destructive World Switching (Switching to Kage and verifying data survived)
    await worldTrigger.click();
    await expect(worldModal).toBeVisible();
    const kageOption = page.locator('[data-testid="world-option-kage"]');
    await kageOption.click();
    await expect(worldTrigger).toContainText("Kage");

    // Assert that partner, sender, message, and greeting survived the world switch
    await expect(partnerInput).toHaveValue("Seraphina");
    await expect(senderInput).toHaveValue("Julian");
    await expect(messageInput).toHaveValue("In a world of noise, you are my quiet starlight.");
    await expect(greetingInput).toHaveValue("To my beloved Seraphina");

    // Switch back to Midnight Rose for final publish
    await worldTrigger.click();
    await page.locator('[data-testid="world-option-midnight-rose"]').click();
    await expect(worldTrigger).toContainText("Midnight Rose");

    // Wait for autosave to complete
    await expect(saveStatusPill).toHaveAttribute("data-status", "saved", { timeout: 10000 });

    // 9. Manual Save Draft Button
    const saveDraftBtn = page.locator('[data-testid="save-draft-button"]');
    await expect(saveDraftBtn).toBeVisible();
    await saveDraftBtn.click();
    await expect(saveStatusPill).toHaveAttribute("data-status", "saved", { timeout: 10000 });

    // 10. Publish Flow
    const publishBtn = page.locator('[data-testid="publish-button"]');
    await expect(publishBtn).toBeVisible();
    await publishBtn.click();

    const publishModal = page.locator('[data-testid="publish-success-modal"]');
    await expect(publishModal).toBeVisible({ timeout: 15000 });

    const publicUrlInput = page.locator('[data-testid="public-url-input"]');
    await expect(publicUrlInput).toHaveValue(`${APP_URL}/v/${publicId}`);

    const copyBtn = page.locator('[data-testid="copy-link-button"]');
    await copyBtn.click();
    await expect(copyBtn).toContainText("Copied!");

    // Close publish modal and return to studio
    const closePublishBtn = page.locator('[data-testid="close-publish-modal-button"]');
    await closePublishBtn.click();
    await expect(publishModal).not.toBeVisible();
  });

  test("Mobile Studio: Responsive Layout, Zero Horizontal Overflow, and Tab Toggling (360px & 390px)", async ({
    page,
    context,
    request,
  }) => {
    // Test on 390px viewport
    await page.setViewportSize({ width: 390, height: 844 });

    const createRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose", templateVersion: "v1" },
    });
    expect(createRes.ok()).toBe(true);
    const { publicId } = await createRes.json();

    const storage = await request.storageState();
    await context.addCookies(storage.cookies);

    await page.goto(`${APP_URL}/edit/${publicId}`);

    // Verify mobile tabs are visible
    const mobileEditTab = page.locator('[data-testid="mobile-tab-edit"]');
    const mobilePreviewTab = page.locator('[data-testid="mobile-tab-preview"]');
    await expect(mobileEditTab).toBeVisible();
    await expect(mobilePreviewTab).toBeVisible();

    // Check zero horizontal overflow on mobile
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    // Switch to Preview tab
    await mobilePreviewTab.click();
    const previewCanvas = page.locator('[data-testid="experience-container"]');
    await expect(previewCanvas).toBeVisible();

    // Switch back to Edit tab
    await mobileEditTab.click();
    await expect(page.locator('[data-testid="input-partner-name"]')).toBeVisible();

    // Also verify 360px viewport
    await page.setViewportSize({ width: 360, height: 740 });
    const scrollWidth360 = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth360 = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth360).toBeLessThanOrEqual(clientWidth360 + 1);
  });
});
