import { describe, it, expect, vi } from "vitest";

describe("Draft Creation Effect Lifecycle", () => {
  it("REPRODUCTION: demonstrates how hasInitiatedRef + AbortController strands user in React Strict Mode", async () => {
    // Simulate what the existing code did:
    const hasInitiatedRef = { current: false };
    let postCallCount = 0;
    let replacedUrl: string | null = null;
    let stranded = false;

    // Simulated API endpoint
    const fakeFetch = vi.fn((url: string, init?: { signal?: AbortSignal }) => {
      postCallCount++;
      return new Promise<{ ok: boolean; json: () => Promise<{ publicId: string }> }>((resolve, reject) => {
        const timeout = setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({ publicId: "draft_123" }),
          });
        }, 10);

        if (init?.signal) {
          init.signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            const err = new Error("The user aborted a request.");
            err.name = "AbortError";
            reject(err);
          });
        }
      });
    });

    // --- SETUP 1 (Mount 1) ---
    let cleanup1: (() => void) | undefined;
    {
      if (!hasInitiatedRef.current) {
        hasInitiatedRef.current = true;
        let isMounted = true;
        const controller = new AbortController();

        fakeFetch("/api/experiences", { signal: controller.signal })
          .then((res) => res.json())
          .then((data) => {
            if (isMounted) {
              replacedUrl = `/edit/${data.publicId}`;
            }
          })
          .catch((err) => {
            if (err?.name === "AbortError") return;
            if (isMounted) console.error(err);
          });

        cleanup1 = () => {
          isMounted = false;
          controller.abort();
        };
      }
    }

    // --- CLEANUP 1 (React Strict Mode immediate unmount) ---
    cleanup1?.();

    // --- SETUP 2 (React Strict Mode immediate remount on same instance) ---
    {
      if (hasInitiatedRef.current) {
        // Exits immediately!
        stranded = true;
      }
    }

    // Wait for any async tasks to settle
    await new Promise((r) => setTimeout(r, 50));

    // Result of old implementation:
    // 1. Post was called once (or aborted)
    expect(postCallCount).toBe(1);
    // 2. Setup 2 exited because hasInitiatedRef was true
    expect(stranded).toBe(true);
    // 3. User was NEVER redirected to the editor because setup 1 was aborted and setup 2 did nothing!
    expect(replacedUrl).toBeNull();
  });

  it("SOLUTION: in-flight promise sharing safely handles React Strict Mode effect replay", async () => {
    // The proposed solution:
    const creationPromiseRef: { current: Promise<string> | null } = { current: null };
    let postCallCount = 0;
    let replacedUrl: string | null = null;

    const fakeFetch = vi.fn(() => {
      postCallCount++;
      return new Promise<{ ok: boolean; json: () => Promise<{ publicId: string }> }>((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({ publicId: "draft_456" }),
          });
        }, 10);
      });
    });

    // --- SETUP 1 (Mount 1) ---
    let cleanup1: (() => void) | undefined;
    {
      let isCurrentEffect = true;

      const run = async () => {
        try {
          if (!creationPromiseRef.current) {
            creationPromiseRef.current = fakeFetch().then((r) => r.json()).then((d) => d.publicId);
          }
          const publicId = await creationPromiseRef.current;
          if (isCurrentEffect) {
            replacedUrl = `/edit/${publicId}`;
          }
        } catch {}
      };
      run();

      cleanup1 = () => {
        isCurrentEffect = false;
      };
    }

    // --- CLEANUP 1 (React Strict Mode immediate unmount) ---
    cleanup1?.();

    // --- SETUP 2 (React Strict Mode immediate remount) ---
    let cleanup2: (() => void) | undefined;
    {
      let isCurrentEffect = true;

      const run = async () => {
        try {
          if (!creationPromiseRef.current) {
            creationPromiseRef.current = fakeFetch().then((r) => r.json()).then((d) => d.publicId);
          }
          const publicId = await creationPromiseRef.current;
          if (isCurrentEffect) {
            replacedUrl = `/edit/${publicId}`;
          }
        } catch {}
      };
      run();

      cleanup2 = () => {
        isCurrentEffect = false;
      };
    }

    // Wait for promise to settle
    await new Promise((r) => setTimeout(r, 50));

    // Result of solution:
    // 1. Post was called EXACTLY ONCE
    expect(postCallCount).toBe(1);
    // 2. Setup 2 received the resolved publicId and navigated to the editor!
    expect(replacedUrl).toBe("/edit/draft_456");
  });

  it("handles genuine unmount: cancels effect consumer so navigation never fires when user leaves page", async () => {
    const creationPromiseRef: { current: Promise<string> | null } = { current: null };
    let postCallCount = 0;
    let replacedUrl: string | null = null;

    const fakeFetch = vi.fn(() => {
      postCallCount++;
      return new Promise<{ ok: boolean; json: () => Promise<{ publicId: string }> }>((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({ publicId: "draft_unmounted" }),
          });
        }, 30);
      });
    });

    let isCurrentEffect = true;
    const run = async () => {
      try {
        if (!creationPromiseRef.current) {
          creationPromiseRef.current = fakeFetch().then((r) => r.json()).then((d) => d.publicId);
        }
        const publicId = await creationPromiseRef.current;
        if (isCurrentEffect) {
          replacedUrl = `/edit/${publicId}`;
        }
      } catch {}
    };
    run();

    // User navigates away before promise resolves:
    isCurrentEffect = false;

    await new Promise((r) => setTimeout(r, 60));

    // Post was called, but router.replace was NEVER called because component unmounted
    expect(postCallCount).toBe(1);
    expect(replacedUrl).toBeNull();
  });

  it("handles network failure and retry: resets creationPromiseRef so user can retry successfully", async () => {
    const creationPromiseRef: { current: Promise<string> | null } = { current: null };
    let attempts = 0;
    let errorMessage: string | null = null;
    let replacedUrl: string | null = null;

    const fakeFetch = vi.fn(() => {
      attempts++;
      if (attempts === 1) {
        return Promise.reject(new Error("Network Error"));
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ publicId: "draft_retried_success" }),
      });
    });

    let isCurrentEffect = true;
    const run = async () => {
      try {
        if (!creationPromiseRef.current) {
          creationPromiseRef.current = fakeFetch().then((r) => r.json()).then((d) => d.publicId);
        }
        const publicId = await creationPromiseRef.current;
        if (isCurrentEffect) {
          replacedUrl = `/edit/${publicId}`;
        }
      } catch (err: any) {
        if (isCurrentEffect) {
          creationPromiseRef.current = null; // reset for retry
          errorMessage = "Failed to create";
        }
      }
    };

    // Attempt 1 fails
    await run();
    expect(attempts).toBe(1);
    expect(errorMessage).toBe("Failed to create");
    expect(replacedUrl).toBeNull();
    expect(creationPromiseRef.current).toBeNull();

    // User clicks "Try Again"
    errorMessage = null;
    await run();
    expect(attempts).toBe(2);
    expect(errorMessage).toBeNull();
    expect(replacedUrl).toBe("/edit/draft_retried_success");
  });
});
