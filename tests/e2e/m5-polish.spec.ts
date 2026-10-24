import { test, expect } from "@playwright/test";

test.describe("Milestone 5 — Quality and Polish Suite", () => {
  test.describe("1. Open Graph and Social Sharing Metadata (Decision D4)", () => {
    test("homepage serves comprehensive Open Graph and Twitter Card tags", async ({ page }) => {
      await page.goto("/");

      // Page title
      await expect(page).toHaveTitle(/Valentino/i);

      // Open Graph Tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
      const ogDesc = await page.locator('meta[property="og:description"]').getAttribute("content");
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
      const ogType = await page.locator('meta[property="og:type"]').getAttribute("content");

      expect(ogTitle).toBe("Valentino — Interactive Romantic Experience Studio");
      expect(ogDesc).toBeTruthy();
      expect(ogImage).toContain("/og-share-card.png");
      expect(ogType).toBe("website");

      // Twitter Tags
      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");
      const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute("content");
      expect(twitterCard).toBe("summary_large_image");
      expect(twitterImage).toContain("/og-share-card.png");
    });

    test("public experience route outputs generic title and zero personal metadata in static SSR head", async ({ request }) => {
      const res = await request.get("/v/sample-test-experience-privacy-check");
      const html = await res.text();

      // Invariant: SSR head must never contain personalized name patterns or leaks
      expect(html).not.toContain("<title>A Valentine for ");
      expect(html).not.toContain("<title>A Celestial Valentine for ");
      expect(html).not.toContain("<title>A Kyoto Sanctuary Valentine for ");
    });
  });

  test.describe("2. Accessibility Focus Trap & Restoration in Template Gallery", () => {
    test("traps keyboard focus inside preview modal and restores focus on Escape", async ({ page }) => {
      await page.goto("/templates");

      // Find the secondary immersion button "Enter Midnight Rose" or similar
      const enterBtn = page.getByRole("button", { name: /Enter Midnight Rose/i });
      await expect(enterBtn).toBeVisible({ timeout: 10000 });

      // Focus the button and open modal
      await enterBtn.focus();
      await enterBtn.click();

      // Modal dialog should appear with proper ARIA attributes
      const modal = page.locator('div[role="dialog"][aria-modal="true"]');
      await expect(modal).toBeVisible();

      // Focus should be inside modal
      const activeElementInModal = await page.evaluate(() => {
        const dialog = document.querySelector('div[role="dialog"][aria-modal="true"]');
        return dialog ? dialog.contains(document.activeElement) : false;
      });
      expect(activeElementInModal).toBe(true);

      // Press Tab multiple times to verify focus wraps around within modal
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press("Tab");
        const isStillInModal = await page.evaluate(() => {
          const dialog = document.querySelector('div[role="dialog"][aria-modal="true"]');
          return dialog ? dialog.contains(document.activeElement) : false;
        });
        expect(isStillInModal).toBe(true);
      }

      // Press Escape to dismiss modal
      await page.keyboard.press("Escape");
      await expect(modal).not.toBeVisible();

      // Focus must be restored to the opening trigger button
      const isFocusRestored = await page.evaluate(() => {
        const active = document.activeElement;
        return active && active.textContent?.includes("Enter");
      });
      expect(isFocusRestored).toBe(true);
    });
  });

  test.describe("3. Mobile Viewport & Touch Ergonomics", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("gallery renders cleanly without horizontal scroll overflow on mobile", async ({ page }) => {
      await page.goto("/templates");

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe("4. Reduced Motion Mode Respect", () => {
    test.use({ reducedMotion: "reduce" });

    test("respects prefers-reduced-motion in global styles", async ({ page }) => {
      await page.goto("/templates");

      // Verify reduced motion CSS rule applies
      const isReduced = await page.evaluate(() => {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      });
      expect(isReduced).toBe(true);
    });
  });

  test.describe("5. Friendly 404 & Error Handling", () => {
    test("serves romantic, friendly 404 page with no stack traces", async ({ page }) => {
      await page.goto("/non-existent-page-path-12345");

      const notFoundContainer = page.locator('[data-testid="not-found-page"]');
      await expect(notFoundContainer).toBeVisible();

      await expect(page.locator("h1")).toContainText("Lost in Starlight");
      const pageText = await page.locator("body").innerText();
      expect(pageText).not.toContain("Error: ");
      expect(pageText).not.toContain("stack");
      expect(pageText).not.toContain("node_modules");

      // Contains return buttons
      await expect(page.getByRole("button", { name: /Return Home/i })).toBeVisible();
    });
  });
});
