import { test, expect } from "@playwright/test";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Gate 3: Experience Module Engine & Kage Exact-Source Visual World", () => {
  test("Complete Module Journey: Studio progressive configuration -> Draft save -> Publish -> Recipient experience with Secret Privacy Boundary", async ({
    page,
    context,
    request,
  }) => {
    // 1. Initialize Midnight Rose experience via API and transfer session cookie to browser context
    const createRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose", templateVersion: "v1" },
    });
    expect(createRes.ok()).toBe(true);
    const { publicId } = await createRes.json();

    const storage = await request.storageState();
    await context.addCookies(storage.cookies);

    // 2. Open Studio Editor and wait for initial state
    await page.goto(`${APP_URL}/edit/${publicId}`);
    const saveStatusPill = page.locator('[data-testid="save-status-pill"]');
    await expect(saveStatusPill).toHaveAttribute("data-status", "saved", { timeout: 15000 });

    // Fill letter details
    const partnerInput = page.locator('[data-testid="input-partner-name"]');
    await partnerInput.fill("Sophia");
    await partnerInput.blur();

    const senderInput = page.locator('[data-testid="input-sender-name"]');
    await senderInput.fill("Alexander");
    await senderInput.blur();

    const messageInput = page.locator('[data-testid="input-message"]');
    await messageInput.fill("You are the melody that makes my heart sing in the quiet of the night.");
    await messageInput.blur();

    // 3. Progressive Studio: Experience Module Manager
    const moduleManager = page.locator('[data-testid="experience-module-manager"]');
    await expect(moduleManager).toBeVisible();

    // Verify Core Flow status badges
    await expect(moduleManager.getByText("Love Letter")).toBeVisible();
    await expect(moduleManager.getByText("Memory Photo")).toBeVisible();

    // Enable Timeline
    const addTimelineTrigger = page.locator('[data-testid="add-moment-trigger"]').first();
    await addTimelineTrigger.scrollIntoViewIfNeeded();
    await addTimelineTrigger.click();

    const timelineBtn = page.locator('[data-testid="toggle-module-timeline"]');
    await expect(timelineBtn).toBeVisible();
    await timelineBtn.click();

    // Verify progressive disclosure of timeline editor
    const timelineSection = page.locator('[data-testid="timeline-module-editor"]');
    await expect(timelineSection).toBeVisible();
    const timelineTitleInput = page.locator('[data-testid="input-timeline-title"]');
    await expect(timelineTitleInput).toBeVisible();
    await timelineTitleInput.fill("Our Chapters");
    await timelineTitleInput.blur();

    // Enable Secret Note
    const addSecretTrigger = page.locator('[data-testid="add-moment-trigger"]').first();
    await addSecretTrigger.scrollIntoViewIfNeeded();
    await addSecretTrigger.click();

    const secretBtn = page.locator('[data-testid="toggle-module-secret"]');
    await expect(secretBtn).toBeVisible();
    await secretBtn.click();

    // Verify progressive disclosure of secret note editor
    const secretSection = page.locator('[data-testid="secret-module-editor"]');
    await expect(secretSection).toBeVisible();
    const secretPromptInput = page.locator('[data-testid="input-secret-prompt"]');
    await secretPromptInput.fill("A confession for you alone");
    await secretPromptInput.blur();

    const secretContentInput = page.locator('[data-testid="input-secret-content"]');
    await secretContentInput.fill("I loved you before I even knew the word for what I felt.");
    await secretContentInput.blur();

    // Enable Love Quiz
    const addQuizTrigger = page.locator('[data-testid="add-moment-trigger"]').first();
    await addQuizTrigger.scrollIntoViewIfNeeded();
    await addQuizTrigger.click();

    const quizBtn = page.locator('[data-testid="toggle-module-quiz"]');
    await expect(quizBtn).toBeVisible();
    await quizBtn.click();

    // Verify progressive disclosure of quiz editor
    const quizSection = page.locator('[data-testid="quiz-module-editor"]');
    await expect(quizSection).toBeVisible();

    // Wait for autosave to complete
    await expect(saveStatusPill).toHaveAttribute("data-status", "saved", { timeout: 10000 });

    // 4. Publish Experience
    const publishBtn = page.locator('[data-testid="publish-button"]');
    await expect(publishBtn).toBeVisible();
    await publishBtn.click();

    const publishModal = page.locator('[data-testid="publish-success-modal"]');
    await expect(publishModal).toBeVisible({ timeout: 10000 });

    // 5. Navigate to Recipient View /v/[publicId]
    await page.goto(`${APP_URL}/v/${publicId}`);
    const experienceContainer = page.locator('[data-testid="experience-container"]');
    await expect(experienceContainer).toBeVisible();

    // =========================================================================
    // CRITICAL SECURITY & PRIVACY BOUNDARY VERIFICATION:
    // The secret note content MUST NOT be leaked in initial HTML, script tags,
    // or serialized server props.
    // =========================================================================
    const initialHtml = await page.content();
    expect(initialHtml).not.toContain("I loved you before I even knew the word for what I felt.");

    // Break wax seal to open experience letter
    const waxSealBtn = page.locator('[data-testid="wax-seal-button"]');
    await expect(waxSealBtn).toBeVisible();
    await waxSealBtn.click();

    const unsealedLetter = page.locator('[data-testid="unsealed-letter"]');
    await expect(unsealedLetter).toBeVisible();

    // 6. Verify Timeline Module Rendered
    const timelineComponent = page.locator('[data-testid="module-timeline"]');
    await expect(timelineComponent).toBeVisible();
    await expect(timelineComponent).toContainText("Our Chapters");

    // 7. Verify Love Quiz Module Flow
    const quizComponent = page.locator('[data-testid="module-quiz"]');
    await expect(quizComponent).toBeVisible();

    // Select the first option
    const firstOption = quizComponent.locator('[data-testid="quiz-option-0"]');
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    // Verify feedback is displayed
    const feedbackPill = quizComponent.locator('[data-testid="quiz-feedback-pill"]');
    await expect(feedbackPill).toBeVisible();

    // Click next / complete
    const nextQuizBtn = quizComponent.locator('[data-testid="quiz-next-button"]');
    if (await nextQuizBtn.isVisible()) {
      await nextQuizBtn.click();
    }

    // 8. Verify Secret Note Privacy Reveal Flow
    const secretComponent = page.locator('[data-testid="module-secret"]');
    await expect(secretComponent).toBeVisible();

    // Secret text is NOT visible yet
    await expect(secretComponent).toContainText("A confession for you alone");
    await expect(page.getByText("I loved you before I even knew the word for what I felt.")).not.toBeVisible();

    // Recipient interacts with reveal button
    const revealSecretBtn = secretComponent.locator('[data-testid="reveal-secret-button"]');
    await expect(revealSecretBtn).toBeVisible();
    await revealSecretBtn.click();

    // Secret note unfolds and reveals fetched content
    const revealedText = secretComponent.locator('[data-testid="revealed-secret-content"]');
    await expect(revealedText).toBeVisible({ timeout: 10000 });
    await expect(revealedText).toContainText("I loved you before I even knew the word for what I felt.");
  });

  test("Kage Exact-Source Visual World Integration (NO IFRAME)", async ({ page, request }) => {
    // 1. Check /templates showroom contains Kage card
    await page.goto(`${APP_URL}/templates`);
    const kageHeading = page.getByRole("heading", { name: /Kage/i });
    await expect(kageHeading).toBeVisible();

    // 2. Initialize a Kage experience
    const createRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "kage", templateVersion: "v1" },
    });
    expect(createRes.ok()).toBe(true);
    const { publicId } = await createRes.json();
    const cookieHeader = createRes.headers()["set-cookie"];

    // Update draft with content
    await request.put(`${APP_URL}/api/experiences/${publicId}/draft`, {
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      data: {
        baseRevision: 1,
        draftConfig: {
          partnerName: "Aoi",
          senderName: "Ren",
          greeting: "In the stillness of the mountain temple",
          message: "Even the deepest night is brightened when we walk together.",
          signOff: "Eternally Yours",
          accentTheme: "kyoto-crimson",
        },
      },
    });

    // Publish Kage experience
    const publishRes = await request.post(`${APP_URL}/api/experiences/${publicId}/publish`, {
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      data: { expectedRevision: 2 },
    });
    expect(publishRes.ok()).toBe(true);

    // 3. Visit Recipient View for Kage
    await page.goto(`${APP_URL}/v/${publicId}`);

    // Verify Kage mounts directly into DOM
    const kageContainer = page.locator('[data-testid="kage-container"]');
    await expect(kageContainer).toBeVisible();

    // CRITICAL USER MANDATE: KAGE MUST NOT BE INTEGRATED AS AN IFRAME
    const iframeCount = await page.locator("iframe").count();
    expect(iframeCount).toBe(0);

    // Verify recipient partner name & romantic message in Kage world
    await expect(page.getByText("Aoi")).toBeVisible();
    await expect(page.getByText("Even the deepest night is brightened when we walk together.")).toBeVisible();
  });

  test("Mobile Responsiveness (360px): No horizontal scroll and clean layout", async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });

    const createRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose", templateVersion: "v1" },
    });
    const { publicId } = await createRes.json();
    const cookieHeader = createRes.headers()["set-cookie"];

    await request.put(`${APP_URL}/api/experiences/${publicId}/draft`, {
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      data: {
        baseRevision: 1,
        draftConfig: {
          partnerName: "Elena",
          senderName: "Marcus",
          message: "You are the warmth in my cold winter days.",
          signOff: "With all my heart",
          modules: {
            timeline: {
              enabled: true,
              title: "Our Journey",
              items: [
                { id: "m1", title: "First Met", date: "Winter 2022", description: "At the coffee shop downtown" },
              ],
            },
          },
        },
      },
    });

    await request.post(`${APP_URL}/api/experiences/${publicId}/publish`, {
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      data: { expectedRevision: 2 },
    });

    await page.goto(`${APP_URL}/v/${publicId}`);
    await expect(page.locator('[data-testid="experience-container"]')).toBeVisible();

    // Verify zero horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
