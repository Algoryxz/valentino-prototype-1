import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const OUTPUT_DIR = "C:/Users/AYUSH/.gemini/antigravity-ide/brain/9d610088-6efa-4241-82b7-70b0cc3a4a13/handoff_frames";
const REVIEW_DIR = "phase8_review_images/handoff";

test.beforeAll(() => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(REVIEW_DIR)) {
    fs.mkdirSync(REVIEW_DIR, { recursive: true });
  }
});

const PROGRESS_POINTS = [0.28, 0.30, 0.32, 0.35, 0.38, 0.42];

test.describe("Stationery Origami Handoff Frame Inspection", () => {
  test("Capture handoff progression at 1440x900", async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Scroll to #personalize start
    const personalizeY = await page.evaluate(() => {
      const el = document.getElementById("personalize");
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + rect.top);
      return window.scrollY;
    });

    await page.waitForTimeout(500);

    // Total scroll track for 190vh container in 100vh viewport = 0.9 * 900 = 810px
    const totalTrack = 810;

    for (const p of PROGRESS_POINTS) {
      const scrollPos = personalizeY + p * totalTrack;
      await page.evaluate((pos) => window.scrollTo(0, pos), scrollPos);
      await page.waitForTimeout(300);

      const filename = `handoff_p${Math.round(p * 100)}_1440x900.png`;
      const outPath = path.join(OUTPUT_DIR, filename);
      await page.screenshot({ path: outPath });

      // Also copy to review folder
      fs.copyFileSync(outPath, path.join(REVIEW_DIR, filename));
    }
  });

  test("Capture Midnight Rose mobile reveal at 390x844", async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const mrSection = page.locator('section[aria-label="Midnight Rose cinematic world"]');
    await mrSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Scroll down to the completed reveal
    await page.evaluate(() => window.scrollBy(0, 844 * 0.85));
    await page.waitForTimeout(600);

    const filename = `03_midnight_rose_reveal_390x844_verified.png`;
    const outPath = path.join(OUTPUT_DIR, filename);
    await page.screenshot({ path: outPath });
    fs.copyFileSync(outPath, path.join(REVIEW_DIR, filename));
  });
});
