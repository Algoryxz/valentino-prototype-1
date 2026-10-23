"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ValentinoAtmosphere } from "@/components/ui/ValentinoAtmosphere";
import { decodeDecorParam, normalizeValentineDecor } from "@/types/decor";

function CreateExperienceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState("midnight-rose");
  const hasInitiatedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate draft creation on repeated effect execution / StrictMode
    if (hasInitiatedRef.current) {
      return;
    }
    hasInitiatedRef.current = true;

    let isMounted = true;
    const controller = new AbortController();

    async function initExperience() {
      try {
        // Read decor and template from query params or sessionStorage fallback
        let initialDecor = null;
        let selectedTemplateId = "midnight-rose";
        try {
          const tParam = searchParams.get("template") || searchParams.get("templateId");
          if (tParam) {
            selectedTemplateId = tParam;
            if (isMounted) setTemplateId(tParam);
          }

          const decorParam = searchParams.get("decor");
          if (decorParam) {
            initialDecor = decodeDecorParam(decorParam);
          }
          if (!initialDecor) {
            const stored = sessionStorage.getItem("valentino_custom_decor");
            if (stored) {
              initialDecor = normalizeValentineDecor(JSON.parse(stored));
            }
          }
        } catch {
          // Gracefully fallback
        }

        const payload: Record<string, unknown> = {
          templateId: selectedTemplateId,
          templateVersion: "v1",
        };
        if (initialDecor) {
          payload.initialDecor = initialDecor;
        }

        // POST immediately - no artificial delays or fake staged loaders
        const res = await fetch("/api/experiences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          console.error("Create experience error details:", data);
          throw new Error("We couldn't complete that action right now. Please try again.");
        }

        const { publicId } = await res.json();
        if (isMounted) {
          const focus = searchParams.get("focus");
          const targetUrl = focus
            ? `/edit/${publicId}?focus=${encodeURIComponent(focus)}`
            : `/edit/${publicId}`;
          router.replace(targetUrl);
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          return;
        }
        if (isMounted) {
          console.error("Create experience initialization failed:", err);
          setError("We couldn't complete that action right now. Please try again.");
        }
      }
    }

    initExperience();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [router, searchParams]);

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center bg-transparent text-[#FAF8F5] overflow-hidden font-ui">
      {/* Canonical Global Atmosphere in serene transition mode */}
      <ValentinoAtmosphere
        context="create"
        world={templateId}
        intensity="soft"
        scrollReactive={false}
        fixed={true}
      />

      <div className="max-w-md w-full relative z-10 space-y-7">
        {error ? (
          <div className="p-8 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/10 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-2xl text-ivory-300">
              ✦
            </div>
            <h2 className="text-xl font-serif font-medium text-white">
              Something went wrong
            </h2>
            <p className="text-xs sm:text-sm text-ivory-300 font-light leading-relaxed">
              {error}
            </p>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Breathing Valentino Monogram Symbol */}
            <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-rose-400/10 blur-xl animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.25)] text-rose-200 transition-transform">
                <span className="font-serif text-2xl tracking-widest text-rose-100 select-none">
                  V
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-serif font-normal text-white tracking-tight">
                Entering Valentino
              </h1>
              <p className="text-sm text-rose-100/70 font-light font-serif italic">
                Setting aside a quiet space for two...
              </p>
            </div>

            {/* Concise World Capability Preview (Preserves E2E test contracts) */}
            <div
              data-testid="world-capability-preview"
              className="pt-3 pb-2 px-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] text-center space-y-1 max-w-sm mx-auto shadow-sm"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300/90">
                {templateId === "cloud-nine"
                  ? "Cloud Nine Sanctuary"
                  : templateId === "kage"
                  ? "Kage Kyoto World"
                  : templateId === "apricot-film"
                  ? "Apricot Film World"
                  : templateId === "wildflower-paper"
                  ? "Wildflower Paper World"
                  : templateId === "ocean-letter"
                  ? "Ocean Letter Sanctuary"
                  : "Midnight Rose"}
              </span>
              <p className="text-xs text-white/70 font-ui font-light">
                {templateId === "cloud-nine"
                  ? "A dreamy pastel world with Devotion Letter · Celestial Blessing · Story Chapters"
                  : templateId === "kage"
                  ? "A Kyoto mountain temple with Japanese Mist · Intimate Letter · Secret Note"
                  : templateId === "apricot-film"
                  ? "Analog cinematic nostalgia with Warm Letter · Memory Reel · Story Chapters"
                  : templateId === "wildflower-paper"
                  ? "Deckled botanical romance with Pressed Florals · Handcrafted Note · Interactive Moments"
                  : templateId === "ocean-letter"
                  ? "Coastal twilight tranquility with Message in a Bottle · Oceanic Reflection · Secret Tide"
                  : "A cinematic letter world with Love Letter · Story Timeline · Interactive Moments"}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CreateExperiencePage() {
  return (
    <Suspense
      fallback={
        <main className="relative min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center bg-[#0A090C] text-[#FAF8F5] overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-white/[0.08] animate-pulse flex items-center justify-center text-xl text-ivory-300">
            ✦
          </div>
        </main>
      }
    >
      <CreateExperienceContent />
    </Suspense>
  );
}
