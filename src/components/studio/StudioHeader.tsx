"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export type SaveStatus = "idle" | "saving" | "saved" | "error" | "conflict" | "offline";

interface StudioHeaderProps {
  partnerName?: string;
  templateName: string;
  templateVersion: string;
  saveStatus: SaveStatus;
  lastSavedTime: string | null;
  isPublishing: boolean;
  mobileTab: "form" | "preview";
  onChangeWorldClick: () => void;
  onPublishClick: () => void;
  onMobileTabChange: (tab: "form" | "preview") => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  previewDeviceMode?: "phone" | "tablet" | "expanded";
  onPreviewDeviceModeChange?: (mode: "phone" | "tablet" | "expanded") => void;
  onSaveDraftClick?: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  partnerName,
  templateName,
  templateVersion,
  saveStatus,
  lastSavedTime,
  isPublishing,
  mobileTab,
  onChangeWorldClick,
  onPublishClick,
  onMobileTabChange,
  isFocusMode,
  onToggleFocusMode,
  previewDeviceMode = "phone",
  onPreviewDeviceModeChange,
  onSaveDraftClick,
}) => {
  return (
    <header className="px-3 sm:px-6 py-2 sm:py-2.5 border-b border-white/[0.08] bg-[#0A090C]/95 backdrop-blur-md z-30 sticky top-0">
      <div className="flex items-center justify-between gap-2 max-w-full">
        {/* Left: Brand Monogram & Active World Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors group shrink-0"
            title="Return to Valentino Home"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-xs sm:text-sm group-hover:border-white/25 transition-colors">
              <span className="font-serif text-sm font-normal text-rose-200 select-none">V</span>
            </div>
            <span className="font-serif font-normal text-sm tracking-wide hidden md:inline text-white">
              Studio
            </span>
          </Link>

          <span className="text-white/20 hidden sm:inline">/</span>

          {/* Active World Badge with Change World action */}
          <button
            type="button"
            data-testid="change-world-trigger"
            onClick={onChangeWorldClick}
            className="relative z-10 flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 min-h-[44px] rounded-full text-[10px] sm:text-[11px] font-ui bg-white/[0.05] hover:bg-white/[0.1] text-white/85 hover:text-white border border-white/[0.1] transition-all cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
            title="Switch visual world template"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
            <span className="font-medium truncate max-w-[90px] sm:max-w-none">{templateName}</span>
            <span className="text-white/40 text-[9px] font-mono hidden sm:inline">({templateVersion})</span>
            <span className="text-white/40 ml-0.5 text-[10px]">⇄</span>
          </button>
        </div>

        {/* Center: Device Switcher & Focus Mode (Desktop/Tablet) */}
        <div className="hidden lg:flex items-center gap-3">
          {onPreviewDeviceModeChange && (
            <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-xl border border-white/[0.08] text-xs font-ui">
              <button
                type="button"
                onClick={() => onPreviewDeviceModeChange("phone")}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  previewDeviceMode === "phone"
                    ? "bg-white text-black font-medium shadow-xs"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Phone
              </button>
              <button
                type="button"
                onClick={() => onPreviewDeviceModeChange("tablet")}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  previewDeviceMode === "tablet"
                    ? "bg-white text-black font-medium shadow-xs"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Tablet
              </button>
              <button
                type="button"
                onClick={() => onPreviewDeviceModeChange("expanded")}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  previewDeviceMode === "expanded"
                    ? "bg-white text-black font-medium shadow-xs"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Expanded
              </button>
            </div>
          )}

          {onToggleFocusMode && (
            <button
              type="button"
              onClick={onToggleFocusMode}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-ui border transition-all flex items-center gap-1.5 ${
                isFocusMode
                  ? "bg-rose-500/20 border-rose-500/40 text-white"
                  : "bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white"
              }`}
              title="Toggle unencumbered recipient view"
            >
              <span>{isFocusMode ? "Exit Focus" : "Focus Mode"}</span>
              <span className="text-[10px] opacity-70">⛶</span>
            </button>
          )}
        </div>

        {/* Center / Right: Save Status & Actions */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          <div
            data-testid="save-status-pill"
            data-status={saveStatus}
            className="text-[10px] sm:text-xs px-1.5 sm:px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center gap-1 sm:gap-1.5 font-ui shrink-0 pointer-events-none select-none"
          >
            {saveStatus === "saving" && (
              <span className="text-amber-400 animate-pulse flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span className="hidden sm:inline">Saving…</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-emerald-400 flex items-center gap-1">
                <span>✓</span>
                <span className="hidden sm:inline">Saved {lastSavedTime ? `at ${lastSavedTime}` : ""}</span>
              </span>
            )}
            {saveStatus === "error" && <span className="text-rose-400">⚠️<span className="hidden sm:inline"> Error</span></span>}
            {saveStatus === "conflict" && <span className="text-rose-400">⚠️<span className="hidden sm:inline"> Conflict</span></span>}
            {saveStatus === "offline" && <span className="text-amber-400">⚡<span className="hidden sm:inline"> Offline</span></span>}
            {saveStatus === "idle" && (
              <span className="text-white/40 flex items-center gap-1">
                <span>●</span>
                <span className="hidden sm:inline">Unsaved edits</span>
              </span>
            )}
          </div>

          {/* Publish Action */}
          <Button
            type="button"
            data-testid="header-publish-button"
            variant="romantic"
            size="sm"
            disabled={saveStatus === "saving" || isPublishing}
            onClick={onPublishClick}
            className="inline-flex text-xs px-3 sm:px-4 py-1.5 min-h-[36px] rounded-full font-ui shadow-lg shadow-rose-950/40 shrink-0"
          >
            <span className="hidden sm:inline">{isPublishing ? "Publishing…" : "Publish Valentine"}</span>
            <span className="sm:hidden">{isPublishing ? "…" : "Publish"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
