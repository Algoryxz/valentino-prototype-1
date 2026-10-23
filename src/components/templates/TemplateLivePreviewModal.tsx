"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ExperienceRenderer } from "@/templates/ExperienceRenderer";
import { getTemplateSampleData } from "@/templates/sampleData";
import { getTemplateDefinition } from "@/templates/registry";

interface TemplateLivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  templateVersion?: string;
  templateName: string;
  accentTheme?: string;
}

export function TemplateLivePreviewModal({
  isOpen,
  onClose,
  templateId,
  templateVersion = "v1",
  templateName,
  accentTheme,
}: TemplateLivePreviewModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">("desktop");

  const template = useMemo(
    () => getTemplateDefinition(templateId, templateVersion),
    [templateId, templateVersion]
  );

  const sampleConfig = useMemo(() => {
    const raw = getTemplateSampleData(templateId, templateVersion);
    if (accentTheme) {
      return {
        ...raw,
        accentTheme,
      };
    }
    return raw;
  }, [templateId, templateVersion, accentTheme]);

  // Accessible Escape key listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="template-live-preview-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Live preview of ${templateName}`}
        className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl text-white overflow-hidden"
      >
        {/* TOP NOTICE BANNER: Clearly labels sample preview */}
        <div className="w-full bg-gradient-to-r from-rose-950/80 via-amber-950/80 to-rose-950/80 border-b border-rose-500/20 px-4 py-2 flex items-center justify-between text-xs font-mono text-rose-200">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="tracking-wide">✦ Sample Preview — Fictional Data ✦</span>
            <span className="hidden sm:inline text-rose-200/60 font-sans italic text-[11px]">
              (Recipient sees clean, personalized mode)
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-rose-200/60">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
              ESC
            </kbd>
            <span>to return</span>
          </div>
        </div>

        {/* MODAL HEADER: Title, Viewport Switcher, Close Button */}
        <header className="w-full border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 bg-black/40">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="p-1.5 rounded-full hover:bg-white/10 text-rose-200/80 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-serif font-medium text-white truncate">
                {templateName}
              </h2>
              {template?.tagline && (
                <p className="text-xs font-serif italic text-rose-200/70 truncate hidden sm:block">
                  &ldquo;{template.tagline}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Center: Device Viewport Toggle (Desktop vs Mobile simulation) */}
          <div className="hidden md:flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/15">
            <button
              type="button"
              onClick={() => setViewportMode("desktop")}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                viewportMode === "desktop"
                  ? "bg-rose-500/80 text-white shadow-sm"
                  : "text-rose-200/70 hover:text-white"
              }`}
            >
              🖥 Full View
            </button>
            <button
              type="button"
              onClick={() => setViewportMode("mobile")}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                viewportMode === "mobile"
                  ? "bg-rose-500/80 text-white shadow-sm"
                  : "text-rose-200/70 hover:text-white"
              }`}
            >
              📱 Mobile
            </button>
          </div>

          {/* Right Action: Create CTA */}
          <div className="flex items-center gap-2">
            <Link
              href={`/create/${templateId}${accentTheme ? `?accentTheme=${accentTheme}` : ""}`}
              data-testid="select-template-btn"
              aria-label={`Create experience with ${templateName}`}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white text-xs sm:text-sm font-medium tracking-wide shadow-lg shadow-rose-950/50 hover:shadow-rose-900/60 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Use This Atmosphere</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        {/* MODAL BODY: ExperienceRenderer Preview Canvas */}
        <main
          className="flex-1 w-full overflow-y-auto relative bg-[#0A0708] flex flex-col items-center justify-start p-2 sm:p-6"
          id="preview-viewport-container"
        >
          {viewportMode === "mobile" ? (
            <div className="w-full max-w-[400px] my-auto bg-black border-[6px] border-neutral-800 rounded-[40px] shadow-2xl shadow-rose-950/40 overflow-hidden relative min-h-[720px] max-h-[85vh] flex flex-col">
              {/* Phone notch bar */}
              <div className="w-full h-6 bg-neutral-900 flex items-center justify-center relative select-none">
                <div className="w-20 h-3.5 bg-black rounded-full" />
              </div>
              <div className="flex-1 overflow-y-auto bg-black text-white relative">
                <ExperienceRenderer
                  templateId={templateId}
                  templateVersion={templateVersion}
                  mode="preview"
                  rawConfig={sampleConfig}
                />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-5xl my-auto bg-black/60 rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative">
              <ExperienceRenderer
                templateId={templateId}
                templateVersion={templateVersion}
                mode="preview"
                rawConfig={sampleConfig}
              />
            </div>
          )}
        </main>

        {/* MODAL FOOTER: Secondary reassurance & Back to Gallery CTA */}
        <footer className="w-full border-t border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-rose-200/70 bg-black/50">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-rose-300 hover:text-white underline-offset-4 hover:underline transition-colors cursor-pointer"
          >
            ← Return to Atmosphere Gallery
          </button>

          <span className="font-mono text-[11px] text-rose-300/60 hidden sm:inline">
            Template: {templateId} ({templateVersion})
          </span>
        </footer>
      </div>
    </AnimatePresence>
  );
}
