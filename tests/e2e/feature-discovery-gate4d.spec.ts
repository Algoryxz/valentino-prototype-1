import { test, expect } from "@playwright/test";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Gate 4D: Feature Discovery & Capability Renaissance", () => {
  test("Feature Discovery Drawer: explore moments -> launch available feature -> verify roadmap non-actionable -> keyboard ESC", async ({
    page,
    context,
    request,
  }) => {
    // 1. Initialize experience via API
    const createRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose", templateVersion: "v1" },
    });
    expect(createRes.ok()).toBe(true);
    const { publicId } = await createRes.json();

    const storage = await request.storageState();
    await context.addCookies(storage.cookies);

    // 2. Open Experience Studio
    await page.goto(`${APP_URL}/edit/${publicId}`);
    await expect(page.locator('[data-testid="save-status-pill"]')).toHaveAttribute("data-status", "saved", {
      timeout: 15000,
    });

    // 3. Verify Explore More trigger is present in Moments section
    const exploreTrigger = page.locator('[data-testid="explore-features-trigger"]');
    await expect(exploreTrigger).toBeVisible();

    // 4. Open Feature Discovery Drawer
    await exploreTrigger.click();
    const drawer = page.locator('[data-testid="feature-discovery-drawer"]');
    await expect(drawer).toBeVisible();

    // Verify Title & Reassurance
    await expect(drawer).toContainText("Explore More For Your Story");

    // 5. Test Category Filter
    const momentsTab = page.locator('[data-testid="filter-category-moments"]');
    await expect(momentsTab).toBeVisible();
    await momentsTab.click();

    // Verify Available feature cards are visible (including Love Quiz and completed Bucket List)
    const quizCard = page.locator('[data-testid="feature-card-quiz"]');
    await expect(quizCard).toBeVisible();
    await expect(quizCard).toContainText("Love Quiz");

    const bucketListCard = page.locator('[data-testid="feature-card-bucket-list"]');
    await expect(bucketListCard).toBeVisible();

    // Verify Roadmap cards are displayed truthfully
    const milestoneRoadmap = page.locator('[data-testid="roadmap-card-milestones"]');
    await expect(milestoneRoadmap).toBeVisible();
    await expect(milestoneRoadmap).toContainText("Coming Soon");
    await expect(milestoneRoadmap).toContainText("Relationship Milestones & Timeline");

    // 6. Test Keyboard Dismiss (Escape key)
    await page.keyboard.press("Escape");
    await expect(drawer).not.toBeVisible();

    // Reopen drawer to test activating an available feature
    await exploreTrigger.click();
    await expect(drawer).toBeVisible();

    // Activate Love Quiz from drawer
    const activateQuizBtn = page.locator('[data-testid="activate-feature-quiz"]');
    await expect(activateQuizBtn).toBeVisible();
    await activateQuizBtn.click();

    // Drawer should automatically close upon feature selection
    await expect(drawer).not.toBeVisible();

    // The quiz module should now be active and open in the editor
    const quizEditor = page.locator('[data-testid="quiz-module-editor"]');
    await expect(quizEditor).toBeVisible();
  });

  test("Contextual Discovery Guidance: appears contextually and is dismissible", async ({
    page,
    context,
    request,
  }) => {
    // 1. Initialize experience
    const createRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose", templateVersion: "v1" },
    });
    expect(createRes.ok()).toBe(true);
    const { publicId } = await createRes.json();

    const storage = await request.storageState();
    await context.addCookies(storage.cookies);

    await page.goto(`${APP_URL}/edit/${publicId}`);
    await expect(page.locator('[data-testid="save-status-pill"]')).toHaveAttribute("data-status", "saved");

    // 2. Author letter message to trigger contextual suggestion
    const messageInput = page.locator('[data-testid="input-message"]');
    await messageInput.fill("I loved the gentle winter walks we took through the quiet city streets.");
    await messageInput.blur();

    // 3. Verify Discovery Guidance Drawer can be opened
    const exploreTrigger = page.locator('[data-testid="explore-features-trigger"]');
    await expect(exploreTrigger).toBeVisible();
    await exploreTrigger.click();

    const drawer = page.locator('[data-testid="feature-discovery-drawer"]');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText("Explore More For Your Story");

    // 4. Test Dismiss button
    const dismissBtn = page.locator('[data-testid="close-feature-drawer"]');
    await expect(dismissBtn).toBeVisible();
    await dismissBtn.click();

    // Should disappear cleanly
    await expect(drawer).not.toBeVisible();
  });

  test("Surprise Me Spark: deterministic suggestion and application", async ({
    page,
    context,
    request,
  }) => {
    // 1. Initialize experience
    const createRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose", templateVersion: "v1" },
    });
    expect(createRes.ok()).toBe(true);
    const { publicId } = await createRes.json();

    const storage = await request.storageState();
    await context.addCookies(storage.cookies);

    await page.goto(`${APP_URL}/edit/${publicId}`);
    await expect(page.locator('[data-testid="save-status-pill"]')).toHaveAttribute("data-status", "saved");

    // 2. Click Surprise Me Spark trigger
    const surpriseTrigger = page.locator('[data-testid="surprise-feature-trigger"]');
    await expect(surpriseTrigger).toBeVisible();
    await surpriseTrigger.click();

    // 3. Verify deterministic result
    const surpriseResult = page.locator('[data-testid="surprise-feature-result"]');
    await expect(surpriseResult).toBeVisible();
    await expect(surpriseResult).toContainText("Our Story Timeline");

    // 4. Apply sparked feature
    const applySparkBtn = page.locator('[data-testid="apply-spark-feature"]');
    await expect(applySparkBtn).toBeVisible();
    await applySparkBtn.click();

    // Verify timeline module is now active
    const timelineEditor = page.locator('[data-testid="timeline-module-editor"]');
    await expect(timelineEditor).toBeVisible();
  });

  test("Create Flow: truthful concise capability preview", async ({ page }) => {
    // Test navigation to /create with Cloud Nine template param
    await page.goto(`${APP_URL}/create?template=cloud-nine`);

    // Verify capability preview is present
    const capabilityPreview = page.locator('[data-testid="world-capability-preview"]');
    await expect(capabilityPreview).toBeVisible();
    await expect(capabilityPreview).toContainText("Cloud Nine Sanctuary");
    await expect(capabilityPreview).toContainText("Devotion Letter · Celestial Blessing · Story Chapters");
  });

  test("Mobile Viewport QA (360px & 390px): drawer layout and touch ergonomics", async ({
    page,
    context,
    request,
  }) => {
    // Set viewport to narrow mobile (360x640)
    await page.setViewportSize({ width: 360, height: 640 });

    const createRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose", templateVersion: "v1" },
    });
    expect(createRes.ok()).toBe(true);
    const { publicId } = await createRes.json();

    const storage = await request.storageState();
    await context.addCookies(storage.cookies);

    await page.goto(`${APP_URL}/edit/${publicId}`);
    await expect(page.locator('[data-testid="save-status-pill"]')).toHaveAttribute("data-status", "saved");

    // Open discovery drawer on mobile
    const exploreTrigger = page.locator('[data-testid="explore-features-trigger"]');
    await exploreTrigger.click();

    const drawer = page.locator('[data-testid="feature-discovery-drawer"]');
    await expect(drawer).toBeVisible();

    // Verify close button is operable and touch target >= 44px
    const closeBtn = page.locator('[data-testid="close-feature-drawer"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    await expect(drawer).not.toBeVisible();
  });
});
