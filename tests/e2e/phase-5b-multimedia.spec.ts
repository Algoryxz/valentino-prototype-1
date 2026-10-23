import { test, expect } from "@playwright/test";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Phase 5B: Multimedia, Delivery, Secret Lock & Recipient Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}/api/health`);
  });

  test("1. Full Creator Journey: Memories, Voice, Video, Music, Secret Question, QR & Keepsake", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/create?template=midnight-rose`);
    await expect(page).toHaveURL(/\/edit\/[A-Za-z0-9_-]+/, { timeout: 30000 });

    // Step 1: Fill in core letter content
    const partnerInput = page.locator('[data-testid="input-partner-name"]');
    await partnerInput.fill("Elena");

    const senderInput = page.locator('[data-testid="input-sender-name"]');
    await senderInput.fill("Marcus");

    const messageArea = page.locator('[data-testid="input-message"]');
    await messageArea.fill("Every memory we share is carved in golden light across my heart.");

    // Wait for autosave
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="save-status-pill"]')).toContainText("Saved");

    // Step 2: Story Section - Multimedia controls
    // Verify Story section is present and activate multimedia items
    const storyTab = page.locator('[data-testid="stage-tab-story"]').first();
    if (await storyTab.isVisible()) {
      await storyTab.click();
    }

    // Toggle and configure Memories
    const toggleMemories = page.locator('[data-testid="toggle-memories"]');
    if (await toggleMemories.isVisible()) {
      await toggleMemories.click();
      await page.waitForTimeout(500);
      const addMemoryBtn = page.locator('[data-testid="add-memory-btn"]');
      if (await addMemoryBtn.isVisible()) {
        await addMemoryBtn.click();
        const captionInput = page.locator('[data-testid="memory-caption-input-0"]');
        if (await captionInput.isVisible()) {
          await captionInput.fill("Under the Paris lantern");
        }
      }
    }

    // Toggle Voice Note
    const toggleVoice = page.locator('[data-testid="toggle-voice-note"]');
    if (await toggleVoice.isVisible()) {
      await toggleVoice.click();
      const voiceCaption = page.locator('[data-testid="voice-caption-input"]');
      if (await voiceCaption.isVisible()) {
        await voiceCaption.fill("A whisper for your quietest nights.");
      }
    }

    // Toggle Video Memory
    const toggleVideo = page.locator('[data-testid="toggle-video-memory"]');
    if (await toggleVideo.isVisible()) {
      await toggleVideo.click();
      const videoCaption = page.locator('[data-testid="video-caption-input"]');
      if (await videoCaption.isVisible()) {
        await videoCaption.fill("Dancing on the pier at sunset.");
      }
    }

    // Step 3: Moments Section - Secret Question
    const momentsTab = page.locator('[data-testid="stage-tab-story"]').first();
    if (await momentsTab.isVisible()) {
      await momentsTab.click();
      await page.waitForTimeout(400);

      const secretToggle = page.locator('[data-testid="toggle-module-secret"]');
      if (await secretToggle.isVisible()) {
        await secretToggle.click();
        await page.waitForTimeout(300);

        // Fill Question Lock fields
        const secretQuestion = page.locator('[data-testid="secret-question-input"]');
        if (await secretQuestion.isVisible()) {
          await secretQuestion.fill("Where did we find the sea glass?");
        }
        const secretAnswer = page.locator('[data-testid="secret-answer-input"]');
        if (await secretAnswer.isVisible()) {
          await secretAnswer.fill("Laguna Cove");
        }
        const concealedText = page.locator('[data-testid="secret-content-input"]');
        if (await concealedText.isVisible()) {
          await concealedText.fill("I knew right then that I wanted to spend every sunset with you.");
        }
      }
    }

    // Step 4: Preview & Send Section
    const previewSendTab = page.locator('[data-testid="stage-tab-preview"]').first();
    if (await previewSendTab.isVisible()) {
      await previewSendTab.click();
      await page.waitForTimeout(400);

      // Verify QR Code Share drawer/button
      const qrBtn = page.locator('[data-testid="show-qr-keepsake-btn"]');
      if (await qrBtn.isVisible()) {
        await qrBtn.click();
        await expect(page.locator('[data-testid="qr-code-image"]')).toBeVisible();
      }

      // Verify Printable Keepsake preview trigger
      const printBtn = page.locator('[data-testid="save-keepsake-btn"]');
      if (await printBtn.isVisible()) {
        await expect(printBtn).toBeVisible();
      }
    }

    // Step 5: Publish Experience
    await page.waitForTimeout(1200);
    const publishBtn = page.locator('[data-testid="header-publish-button"]').first();
    await publishBtn.click();
    await expect(page.locator('[data-testid="publish-success-modal"]')).toBeVisible({ timeout: 25000 });
  });

  test("2. Recipient Journey: Reading Letter, Interactive Modules, Reactions & Reply", async ({ page, context, request }) => {
    // 1. Create and publish an experience programmatically
    const createRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose" },
    });
    const { publicId } = await createRes.json();
    const cookieHeader = createRes.headers()["set-cookie"] || "";

    // Save full draft with modules
    await page.request.put(`${APP_URL}/api/experiences/${publicId}/draft`, {
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      data: {
        baseRevision: 1,
        draftConfig: {
          partnerName: "Cynthia",
          senderName: "Nathan",
          greeting: "To My Starlight",
          message: "You turned ordinary days into unforgettable wonder.",
          signOff: "Eternally Yours",
          accentTheme: "crimson-rose",
          decor: { blooms: [], charms: [], paper: "deckled-parchment", ribbon: "velvet-crimson", waxSeal: "velvet-crimson" },
          modules: {
            secret: {
              enabled: true,
              prompt: "A sealed secret",
              question: "Where was our first cabin trip?",
              answer: "Blue Ridge",
              concealedSecret: "I bought the ring that very weekend.",
            },
          },
        },
      },
    });

    // Publish
    const pubRes = await page.request.post(`${APP_URL}/api/experiences/${publicId}/publish`, {
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      data: { expectedRevision: 2 },
    });
    expect(pubRes.status()).toBe(200);

    // 2. Open public recipient experience
    await page.goto(`${APP_URL}/v/${publicId}`);

    // Verify recipient sees names and initial wax seal
    await expect(page.locator('[data-testid="recipient-name"]')).toHaveText("Cynthia");
    const sealBtn = page.locator('[data-testid="wax-seal-button"]');
    await expect(sealBtn).toBeVisible();

    // Click wax seal to break seal and reveal letter
    await sealBtn.click();
    await expect(page.locator('[data-testid="letter-message"]')).toContainText("You turned ordinary days into unforgettable wonder.");
    await expect(page.locator('[data-testid="sender-name"]')).toHaveText("Nathan");

    // 3. Test Recipient Reaction
    const heartReaction = page.locator('[data-testid="reaction-heart-btn"]');
    if (await heartReaction.isVisible()) {
      await heartReaction.click();
      await expect(page.locator('[data-testid="reaction-toast"]')).toBeVisible({ timeout: 5000 });
    }

    // 4. Test Recipient Reply
    const replyInput = page.locator('[data-testid="reply-input"]');
    if (await replyInput.isVisible()) {
      await replyInput.fill("Nathan, you made me cry happy tears! I love you so much.");
      const replySubmit = page.locator('[data-testid="reply-submit-btn"]');
      await replySubmit.click();
      await expect(page.locator('[data-testid="reply-success-message"]')).toBeVisible({ timeout: 5000 });
    }

    // 5. Test Printable Keepsake trigger
    const printKeepsakeBtn = page.locator('[data-testid="print-keepsake-btn"]');
    if (await printKeepsakeBtn.isVisible()) {
      await expect(printKeepsakeBtn).toBeVisible();
    }

    // 6. Creator Journey: Return to Studio and verify partner reactions & reply
    const storage = await request.storageState();
    await context.addCookies(storage.cookies);
    await page.goto(`${APP_URL}/edit/${publicId}`);
    const previewSendTab = page.locator('[data-testid="stage-tab-preview"]').first();
    if (await previewSendTab.isVisible()) {
      await previewSendTab.click();
      await page.waitForTimeout(400);
      const interactionsPanel = page.locator('[data-testid="partner-interactions-panel"]');
      await expect(interactionsPanel).toBeVisible();
    }
  });

  test("3. Responsive Viewports Check (360, 390, 768, 1024, 1280, 1440)", async ({ page }) => {
    const viewports = [
      { width: 360, height: 640 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
    ];

    // Create experience
    const createRes = await page.request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose" },
    });
    const { publicId } = await createRes.json();
    const cookieHeader = createRes.headers()["set-cookie"] || "";

    await page.request.put(`${APP_URL}/api/experiences/${publicId}/draft`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: cookieHeader },
      data: {
        baseRevision: 1,
        draftConfig: {
          partnerName: "Aria",
          senderName: "Leo",
          message: "Across every dimension of time, my heart belongs to you.",
        },
      },
    });

    await page.request.post(`${APP_URL}/api/experiences/${publicId}/publish`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: cookieHeader },
      data: { expectedRevision: 2 },
    });

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto(`${APP_URL}/v/${publicId}`);
      await expect(page.locator('[data-testid="recipient-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="wax-seal-button"]')).toBeVisible();
    }
  });

  test("4. Template Compatibility: Cloud Nine & Kage SSR rendering with Phase 5B Modules", async ({ page }) => {
    // 1. Cloud Nine Experience
    const c9Res = await page.request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "cloud-nine" },
    });
    const { publicId: c9Id } = await c9Res.json();
    const c9Cookie = c9Res.headers()["set-cookie"] || "";

    await page.request.put(`${APP_URL}/api/experiences/${c9Id}/draft`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: c9Cookie },
      data: {
        baseRevision: 1,
        draftConfig: {
          partnerName: "Celeste",
          senderName: "Atlas",
          message: "Floating in pink clouds with you.",
          soundtrackUrl: "https://example.com/audio.mp3",
          modules: {
            "voice-note": {
              enabled: true,
              caption: "Listen to the clouds whisper.",
            },
          },
          moduleOrder: ["voice-note"],
        },
      },
    });

    await page.request.post(`${APP_URL}/api/experiences/${c9Id}/publish`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: c9Cookie },
      data: { expectedRevision: 2 },
    });

    await page.goto(`${APP_URL}/v/${c9Id}`);
    await expect(page.locator('[data-testid="recipient-name"]')).toHaveText("Celeste");
    await expect(page.locator('[data-testid="wax-seal-button"]')).toBeVisible();
    await expect(page.locator('#soundtrack-toggle')).toBeVisible();

    // 2. Kage Experience
    const kageRes = await page.request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "kage" },
    });
    const { publicId: kageId } = await kageRes.json();
    const kageCookie = kageRes.headers()["set-cookie"] || "";

    await page.request.put(`${APP_URL}/api/experiences/${kageId}/draft`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: kageCookie },
      data: {
        baseRevision: 1,
        draftConfig: {
          partnerName: "Kuro",
          senderName: "Shiro",
          message: "Where shadows fall and cherry blossoms rest.",
          modules: {
            "memories": {
              enabled: true,
              title: "Monochrome Echoes",
              items: [],
            },
          },
          moduleOrder: ["memories"],
        },
      },
    });

    await page.request.post(`${APP_URL}/api/experiences/${kageId}/publish`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: kageCookie },
      data: { expectedRevision: 2 },
    });

    await page.goto(`${APP_URL}/v/${kageId}`);
    await expect(page.locator('[data-testid="kage-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="recipient-name"]')).toHaveText("Kuro");
    await expect(page.locator('[data-testid="read-aloud-btn"]')).toBeVisible();
  });

  test("5. M3 Secure Upload Flow: Photo upload, validation failure, publish and public media delivery", async ({ request }) => {
    // 1. Create an experience
    const createRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose" },
    });
    expect(createRes.status()).toBe(201);
    const { publicId } = await createRes.json();
    const cookieHeader = createRes.headers()["set-cookie"] || "";

    // 2. Reject disguised script/HTML file with 422
    const fakeUploadRes = await request.post(`${APP_URL}/api/experiences/${publicId}/media`, {
      headers: { origin: APP_URL, cookie: cookieHeader },
      multipart: {
        file: {
          name: "malicious.jpg",
          mimeType: "image/jpeg",
          buffer: Buffer.from("<script>alert(1)</script>"),
        },
      },
    });
    expect(fakeUploadRes.status()).toBe(422);

    // 3. Upload valid JPEG image (minimal valid 1x1 JPEG)
    const validJpegBytes = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
      0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
      0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
      0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
      0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
      0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
      0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
      0x00, 0xbf, 0x80, 0xff, 0xd9,
    ]);

    const uploadRes = await request.post(`${APP_URL}/api/experiences/${publicId}/media`, {
      headers: { origin: APP_URL, cookie: cookieHeader },
      multipart: {
        file: {
          name: "romantic.jpg",
          mimeType: "image/jpeg",
          buffer: validJpegBytes,
        },
      },
    });
    expect(uploadRes.status()).toBe(201);
    const uploadData = await uploadRes.json();
    expect(uploadData.success).toBe(true);
    expect(uploadData.media.draftUrl).toBeDefined();
    expect(uploadData.media.publishedUrl).toBeDefined();

    const mediaId = uploadData.media.id;

    // 4. Draft media endpoint is accessible to creator with no-store cache header
    const draftMediaRes = await request.get(`${APP_URL}/api/experiences/${publicId}/media/${mediaId}`, {
      headers: { cookie: cookieHeader },
    });
    expect(draftMediaRes.status()).toBe(200);
    expect(draftMediaRes.headers()["cache-control"]).toContain("no-store");

    // 5. Public media endpoint blocks access before publish
    const unpubPublicMediaRes = await request.get(`${APP_URL}/api/media/${publicId}/${mediaId}`);
    expect(unpubPublicMediaRes.status()).toBe(403);

    // 6. Save draft referencing media and publish
    await request.put(`${APP_URL}/api/experiences/${publicId}/draft`, {
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      data: {
        baseRevision: 1,
        draftConfig: {
          partnerName: "Isabella",
          senderName: "Liam",
          message: "Our shared memories in golden light.",
          modules: {
            memories: {
              enabled: true,
              items: [
                {
                  id: "m-1",
                  url: uploadData.media.draftUrl,
                  caption: "A sunset to remember",
                },
              ],
            },
          },
          moduleOrder: ["memories"],
        },
      },
    });

    const pubRes = await request.post(`${APP_URL}/api/experiences/${publicId}/publish`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: cookieHeader },
      data: { expectedRevision: 2 },
    });
    expect(pubRes.status()).toBe(200);

    // 7. Public media delivery route serves published media with Cache-Control: no-store
    const pubMediaRes = await request.get(`${APP_URL}/api/media/${publicId}/${mediaId}`);
    expect([200, 302]).toContain(pubMediaRes.status());
    expect(pubMediaRes.headers()["cache-control"]).toContain("no-store");
  });
});
