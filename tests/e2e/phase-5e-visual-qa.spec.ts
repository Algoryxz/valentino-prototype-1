import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import { db } from "../../src/lib/db";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const QA_DIR = path.join(process.cwd(), "test-results", "screenshots", "phase-5e-visual");

test.describe("Phase 5E: Human Visual QA & Dimensional Worlds Inspection", () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(QA_DIR)) {
      fs.mkdirSync(QA_DIR, { recursive: true });
    }
  });

  test.beforeEach(async () => {
    await db.experience.deleteMany({});
  });

  test("Capture Flagship Dimensional Worlds Visuals: Cloud Nine, Midnight Rose, Kage", async ({
    page,
    request,
  }) => {
    // -------------------------------------------------------------
    // 1. CLOUD NINE: Flagship Celestial Sky World
    // -------------------------------------------------------------
    const c9Res = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "cloud-nine", templateVersion: "v1" },
    });
    const { publicId: c9Id } = await c9Res.json();
    const c9Cookie = c9Res.headers()["set-cookie"];

    await request.put(`${APP_URL}/api/experiences/${c9Id}/draft`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: c9Cookie },
      data: {
        draftConfig: {
          partnerName: "Celeste",
          greeting: "To My Starlight",
          message: "You turned my entire world into a dreamy celestial haven where floating clouds whisper your name.",
          senderName: "Leo",
          accentTheme: "blush-sky",
          heroMediaId: "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
        },
        baseRevision: 1,
      },
    });

    await request.post(`${APP_URL}/api/experiences/${c9Id}/publish`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: c9Cookie },
      data: { expectedRevision: 2 },
    });

    // Cloud Nine Desktop Sealed State
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/v/${c9Id}`);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(QA_DIR, "01_cloud_nine_desktop_sealed.png"),
      fullPage: false,
    });

    // Cloud Nine Desktop Unsealed State
    const c9Seal = page.locator('[data-testid="wax-seal-button"]');
    if (await c9Seal.isVisible()) {
      await c9Seal.click();
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(QA_DIR, "02_cloud_nine_desktop_unsealed.png"),
        fullPage: false,
      });
    }

    // Cloud Nine Mobile State (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${APP_URL}/v/${c9Id}`);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(QA_DIR, "03_cloud_nine_mobile_390.png"),
      fullPage: false,
    });

    // -------------------------------------------------------------
    // 2. MIDNIGHT ROSE: Private Midnight Garden
    // -------------------------------------------------------------
    const mrRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "midnight-rose", templateVersion: "v1" },
    });
    const { publicId: mrId } = await mrRes.json();
    const mrCookie = mrRes.headers()["set-cookie"];

    await request.put(`${APP_URL}/api/experiences/${mrId}/draft`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: mrCookie },
      data: {
        draftConfig: {
          partnerName: "Seraphina",
          greeting: "In Moonlit Stillness",
          message: "In the quiet of the midnight garden, my heart blossoms for you alone under the silver moon.",
          senderName: "Valentin",
          accentTheme: "crimson-rose",
          heroMediaId: "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
          decor: {
            blooms: ["crimson-rose", "wild-daisy"],
            charms: ["sparkle"],
            paper: "handmade-cream",
            ribbon: "velvet-crimson",
            waxSeal: "champagne-gold",
          },
        },
        baseRevision: 1,
      },
    });

    await request.post(`${APP_URL}/api/experiences/${mrId}/publish`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: mrCookie },
      data: { expectedRevision: 2 },
    });

    // Midnight Rose Desktop Sealed State
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/v/${mrId}`);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(QA_DIR, "04_midnight_rose_desktop_sealed.png"),
      fullPage: false,
    });

    // Midnight Rose Desktop Unsealed State
    const mrSeal = page.locator('[data-testid="wax-seal-button"]');
    if (await mrSeal.isVisible()) {
      await mrSeal.click();
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(QA_DIR, "05_midnight_rose_desktop_unsealed.png"),
        fullPage: false,
      });
    }

    // Midnight Rose Mobile State (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${APP_URL}/v/${mrId}`);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(QA_DIR, "06_midnight_rose_mobile_390.png"),
      fullPage: false,
    });

    // -------------------------------------------------------------
    // 3. KAGE: Kyoto Mountain Sanctuary
    // -------------------------------------------------------------
    const kageRes = await request.post(`${APP_URL}/api/experiences`, {
      headers: { origin: APP_URL, "content-type": "application/json" },
      data: { templateId: "kage", templateVersion: "v1" },
    });
    const { publicId: kageId } = await kageRes.json();
    const kageCookie = kageRes.headers()["set-cookie"];

    await request.put(`${APP_URL}/api/experiences/${kageId}/draft`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: kageCookie },
      data: {
        draftConfig: {
          partnerName: "Aoi",
          greeting: "Where stillness reveals the unseen",
          message: "In the shadow of the mountain pines, every whisper leads back to your light.",
          senderName: "Ren",
          accentTheme: "kyoto-crimson",
        },
        baseRevision: 1,
      },
    });

    await request.post(`${APP_URL}/api/experiences/${kageId}/publish`, {
      headers: { origin: APP_URL, "content-type": "application/json", cookie: kageCookie },
      data: { expectedRevision: 2 },
    });

    // Kage Desktop State
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${APP_URL}/v/${kageId}`);
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: path.join(QA_DIR, "07_kage_desktop_sanctuary.png"),
      fullPage: false,
    });

    // Kage Mobile State (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${APP_URL}/v/${kageId}`);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(QA_DIR, "08_kage_mobile_390.png"),
      fullPage: false,
    });
  });
});
