import { test, expect } from "@playwright/test";
import { db } from "../../src/lib/db";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Phase 1 Acceptance Gate: Build Your Valentine Customization Engine", () => {
  test.beforeEach(async () => {
    // Ensure clean database before test run
    await db.experience.deleteMany({});
  });

  test("End-to-End: Builder -> Create -> Editor -> Autosave -> Reload -> Publish -> Recipient Parity", async ({
    browser,
  }) => {
    test.setTimeout(120000);
    const creatorContext = await browser.newContext({
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const recipientContext = await browser.newContext();

    const creatorPage = await creatorContext.newPage();
    const recipientPage = await recipientContext.newPage();

    const partnerName = "Juliet 🌹";
    const senderName = "Romeo 💌";
    const loveMessage = "Did my heart love till now? Forswear it, sight! For I ne'er saw true beauty till this night.";

    // ------------------------------------------------------------------------
    // Step 1: Landing Page Discovery & Enter Create
    // ------------------------------------------------------------------------
    await creatorPage.goto(`${APP_URL}/`);
    await expect(creatorPage.locator("h1")).toContainText(/Create (something they'll remember|a world made for someone you love)/);

    // Scroll to the Little Things editorial craft scene
    const littleThingsSection = creatorPage.locator("#how-it-works");
    await expect(littleThingsSection).toBeVisible();
    await littleThingsSection.scrollIntoViewIfNeeded();

    // ------------------------------------------------------------------------
    // Step 2: Create Valentine & Transition to Editor
    // ------------------------------------------------------------------------
    const makeYoursBtn = creatorPage.locator('a[href="/create"]').first();
    await expect(makeYoursBtn).toBeVisible();
    await makeYoursBtn.click();

    // Creator travels through /create and lands in /edit/[publicId]
    await creatorPage.waitForURL(/\/edit\/[a-zA-Z0-9_-]{22}/);
    const editUrl = creatorPage.url();
    const publicId = editUrl.split("/edit/")[1];
    expect(publicId).toHaveLength(22);

    // Helpers for mobile viewport toggling between form and preview
    const mobilePreviewBtn = creatorPage.locator('[data-testid="mobile-tab-preview"]');
    const mobileEditBtn = creatorPage.locator('[data-testid="mobile-tab-edit"]');

    // On mobile, ensure form tab is active to configure decor
    if (await mobileEditBtn.isVisible()) {
      await mobileEditBtn.click();
    }

    // Scroll to Stage 05 (Craft & Physical Styling)
    const moodSection = creatorPage.locator("#section-mood");
    await moodSection.scrollIntoViewIfNeeded();

    // Select blooms: Crimson Rose + Wild Daisy
    const roseOption = creatorPage.locator('[data-testid="decor-option-bloom-crimson-rose"]');
    const daisyOption = creatorPage.locator('[data-testid="decor-option-bloom-wild-daisy"]');
    const tulipOption = creatorPage.locator('[data-testid="decor-option-bloom-french-tulip"]');

    await expect(roseOption).toBeVisible();
    await tulipOption.click();
    await daisyOption.click();

    // Ensure charm 'sparkle' is selected (if not already in default)
    const sparkleCharm = creatorPage.locator('[data-testid="decor-option-charm-sparkle"]');
    await expect(sparkleCharm).toBeVisible();
    const isSelected = (await sparkleCharm.getAttribute("class"))?.includes("border-rose-400");
    if (!isSelected) {
      await sparkleCharm.click();
    }

    // Select Paper: Handmade Cream & Ribbon: Velvet Crimson
    const creamPaper = creatorPage.locator('[data-testid="decor-option-paper-handmade-cream"]');
    const velvetRibbon = creatorPage.locator('[data-testid="decor-option-ribbon-velvet-crimson"]');
    await expect(creamPaper).toBeVisible();
    await creamPaper.click();
    await velvetRibbon.click();

    // Select Seal: Champagne Gold
    const goldSeal = creatorPage.locator('[data-testid="decor-option-seal-champagne-gold"]');
    await expect(goldSeal).toBeVisible();
    await goldSeal.click();

    // On mobile, toggle to preview to verify initial state
    if (await mobilePreviewBtn.isVisible()) {
      await mobilePreviewBtn.click();
    }

    // Assert initial editor preview reflects the selected builder composition
    const editorPreview = creatorPage.locator('[data-testid="experience-container"]');
    await expect(editorPreview).toBeVisible();
    await expect(editorPreview.locator('[data-decor-bloom="crimson-rose"]')).toBeVisible();
    await expect(editorPreview.locator('[data-decor-bloom="wild-daisy"]')).toBeVisible();
    await expect(editorPreview.locator('[data-decor-charm="sparkle"]')).toBeVisible();
    await expect(editorPreview.locator('[data-decor-paper="handmade-cream"]')).toBeVisible();
    await expect(editorPreview.locator('[data-decor-ribbon="velvet-crimson"]')).toBeVisible();
    await expect(editorPreview.locator('[data-decor-seal="champagne-gold"]')).toBeVisible();

    // Switch back to form on mobile to fill inputs
    if (await mobileEditBtn.isVisible()) {
      await mobileEditBtn.click();
    }

    // ------------------------------------------------------------------------
    // Step 3: Editor Content & Live Customization Mutation
    // ------------------------------------------------------------------------
    const saveStatusPill = creatorPage.locator('[data-testid="save-status-pill"]');
    await expect(saveStatusPill).toHaveAttribute("data-status", "saved", { timeout: 10000 });

    // Fill in recipient and sender names + message
    await creatorPage.locator('[data-testid="input-partner-name"]').fill(partnerName);
    await creatorPage.locator('[data-testid="input-sender-name"]').fill(senderName);
    await creatorPage.locator('[data-testid="input-message"]').fill(loveMessage);

    // Change Ribbon and Wax Seal in Section 7 (Craft & Physical Styling)
    const satinRibbonOption = creatorPage.locator('[data-testid="decor-option-ribbon-satin-rose"]');
    const royalSealOption = creatorPage.locator('[data-testid="decor-option-seal-royal-burgundy"]');
    await satinRibbonOption.click();
    await royalSealOption.click();

    // If mobile, switch to preview to check the live mutation
    if (await mobilePreviewBtn.isVisible()) {
      await mobilePreviewBtn.click();
    }

    // Ensure envelope is in sealed view so envelope ribbon and seal are visible in preview
    const resealBtn = editorPreview.locator('button:has-text("View Wax Seal"), button:has-text("Seal & Read Again")').first();
    if (await resealBtn.isVisible()) {
      await resealBtn.click();
    }

    // Verify Live Preview immediately updates with new semantic values
    await expect(editorPreview.locator('[data-decor-ribbon="satin-rose"]')).toBeVisible();
    await expect(editorPreview.locator('[data-decor-seal="royal-burgundy"]')).toBeVisible();

    // Wait for autosave to complete
    await expect(saveStatusPill).toHaveAttribute("data-status", "saved", { timeout: 10000 });

    // ------------------------------------------------------------------------
    // Step 4: Reload Verification (Persistence Test)
    // ------------------------------------------------------------------------
    await creatorPage.reload();
    await expect(saveStatusPill).toHaveAttribute("data-status", "saved", { timeout: 10000 });

    // Switch to preview if on mobile
    if (await mobilePreviewBtn.isVisible()) {
      await mobilePreviewBtn.click();
    }

    const reloadResealBtn = editorPreview.locator('button:has-text("View Wax Seal"), button:has-text("Seal & Read Again")').first();
    if (await reloadResealBtn.isVisible()) {
      await reloadResealBtn.click();
    }

    // Assert form and preview preserved the modified selections after reload
    await expect(editorPreview.locator('[data-decor-bloom="crimson-rose"]')).toBeVisible();
    await expect(editorPreview.locator('[data-decor-bloom="wild-daisy"]')).toBeVisible();
    await expect(editorPreview.locator('[data-decor-paper="handmade-cream"]')).toBeVisible();
    await expect(editorPreview.locator('[data-decor-ribbon="satin-rose"]')).toBeVisible();
    await expect(editorPreview.locator('[data-decor-seal="royal-burgundy"]')).toBeVisible();

    // Switch back to form on mobile to access Publish button or verify inputs
    if (await mobileEditBtn.isVisible()) {
      await mobileEditBtn.click();
    }
    await expect(creatorPage.locator('[data-testid="input-partner-name"]')).toHaveValue(partnerName);


    // ------------------------------------------------------------------------
    // Step 5: Publish Valentine
    // ------------------------------------------------------------------------
    const publishButton = creatorPage.locator('[data-testid="publish-button"]');
    await publishButton.click();

    // Verify publish modal appears with public recipient link
    const publishModal = creatorPage.locator('[data-testid="publish-success-modal"]');
    await expect(publishModal).toBeVisible();

    const publicUrlInput = creatorPage.locator('[data-testid="public-url-input"]');
    await expect(publicUrlInput).toBeVisible();
    const recipientUrl = await publicUrlInput.inputValue();
    expect(recipientUrl).toContain(`/v/${publicId}`);

    // ------------------------------------------------------------------------
    // Step 6: Recipient Experience & Visual Parity Verification
    // ------------------------------------------------------------------------
    await recipientPage.goto(recipientUrl);

    // Verify recipient container renders
    const recipientContainer = recipientPage.locator('[data-testid="experience-container"]');
    await expect(recipientContainer).toBeVisible();

    // Assert the exact same semantic visual tokens are rendered on the recipient page
    await expect(recipientContainer.locator('[data-decor-bloom="crimson-rose"]')).toBeVisible();
    await expect(recipientContainer.locator('[data-decor-bloom="wild-daisy"]')).toBeVisible();
    await expect(recipientContainer.locator('[data-decor-charm="sparkle"]')).toBeVisible();
    await expect(recipientContainer.locator('[data-decor-paper="handmade-cream"]')).toBeVisible();
    await expect(recipientContainer.locator('[data-decor-ribbon="satin-rose"]')).toBeVisible();
    await expect(recipientContainer.locator('[data-decor-seal="royal-burgundy"]')).toBeVisible();

    // Recipient unseals the letter
    const waxSealBtn = recipientPage.locator('[data-testid="wax-seal-button"]');
    await expect(waxSealBtn).toBeVisible();
    await waxSealBtn.click();

    // Assert letter opens and displays personalized content on custom paper stationery
    const unsealedLetter = recipientPage.locator('[data-testid="unsealed-letter"]');
    await expect(unsealedLetter).toBeVisible();
    await expect(recipientPage.locator('[data-testid="recipient-name"]')).toHaveText(partnerName);
    await expect(recipientPage.locator('[data-testid="letter-message"]')).toContainText("Did my heart love till now?");
    await expect(recipientPage.locator('[data-testid="sender-name"]')).toHaveText(senderName);


    // Clean up
    await creatorContext.close();
    await recipientContext.close();
  });
});
