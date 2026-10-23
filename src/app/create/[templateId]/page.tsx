"use client";

import React, { useEffect, useState, useMemo, useRef, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ValentinoAtmosphere } from "@/components/ui/ValentinoAtmosphere";
import { decodeDecorParam, normalizeValentineDecor } from "@/types/decor";
import { getTemplateDefinition } from "@/templates/registry";

function CreateTemplateExperienceContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const rawTemplateId = typeof params?.templateId === "string" ? params.templateId : "";

  const templateDef = useMemo(() => {
    if (!rawTemplateId) return null;
    const def = getTemplateDefinition(rawTemplateId, "v1");
    return def && def.active !== false ? def : null;
  }, [rawTemplateId]);

  const [error, setError] = useState<string | null>(null);
  const creationPromiseRef = useRef<Promise<string> | null>(null);

  useEffect(() => {
    // If template is invalid, do not attempt to POST to API; show friendly not-found UI
    if (!templateDef) {
      return;
    }
    const currentDef = templateDef;
    let isCurrentEffect = true;

    async function initExperience() {
      try {
        if (!creationPromiseRef.current) {
          let initialDecor = null;
          try {
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
            templateId: currentDef.id,
            templateVersion: currentDef.version || "v1",
          };
          if (initialDecor) {
            payload.initialDecor = initialDecor;
          }

          creationPromiseRef.current = fetch("/api/experiences", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }).then(async (res) => {
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              console.error("Create experience error details:", data);
              throw new Error("We couldn't initialize your experience. Please try again.");
            }
            const { publicId } = await res.json();
            return publicId as string;
          });
        }

        const publicId = await creationPromiseRef.current;

        if (isCurrentEffect) {
          const focus = searchParams.get("focus");
          const targetUrl = focus
            ? `/edit/${publicId}?focus=${encodeURIComponent(focus)}`
            : `/edit/${publicId}`;
          router.replace(targetUrl);
        }
      } catch (err: any) {
        if (isCurrentEffect) {
          creationPromiseRef.current = null;
          console.error("Create experience initialization failed:", err);
          setError("We couldn't initialize your experience right now. Please try again.");
        }
      }
    }

    initExperience();

    return () => {
      isCurrentEffect = false;
    };
  }, [templateDef, router, searchParams]);

  // Case 1: Template does not exist or is inactive
  if (!templateDef) {
    return (
      <main className="relative min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center bg-[#090708] text-[#FAF8F5] overflow-hidden font-ui">
        <ValentinoAtmosphere
          context="create"
          world="midnight-rose"
          intensity="subtle"
          scrollReactive={false}
          fixed={true}
        />
        <div
          data-testid="template-not-found-card"
          className="max-w-md w-full relative z-10 p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 space-y-6 shadow-2xl animate-fade-in"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-3xl text-rose-300">
            ✦
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-white">
              Atmosphere Unavailable
            </h1>
            <p className="text-sm text-rose-100/70 font-light leading-relaxed">
              The atmosphere <span className="font-mono text-rose-300">&ldquo;{rawTemplateId}&rdquo;</span> is not currently available or is resting in our atelier.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/templates"
              data-testid="browse-templates-fallback-btn"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white text-xs font-mono uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              Browse Available Atmospheres →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Case 2: Template is valid - show loading / preparing screen
  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center bg-transparent text-[#FAF8F5] overflow-hidden font-ui">
      <ValentinoAtmosphere
        context="create"
        world={templateDef.id}
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
            {/* Breathing Monogram Symbol */}
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
                Entering {templateDef.name}
              </h1>
              <p className="text-sm text-rose-100/70 font-light font-serif italic">
                Setting aside a quiet space for two...
              </p>
            </div>

            {/* World Capability Preview */}
            <div
              data-testid="world-capability-preview"
              className="pt-3 pb-2 px-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] text-center space-y-1 max-w-sm mx-auto shadow-sm"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300/90">
                {templateDef.name}
              </span>
              <p className="text-xs text-white/70 font-ui font-light">
                {templateDef.atmosphere || templateDef.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CreateTemplateExperiencePage() {
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
      <CreateTemplateExperienceContent />
    </Suspense>
  );
}
