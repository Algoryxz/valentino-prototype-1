"use client";

import React, { useState } from "react";
import { QrCard } from "@/components/keepsakes/QrCard";
import { PrintKeepsakeButton } from "@/components/keepsakes/PrintKeepsake";
import { PartnerInteractionsPanel } from "./PartnerInteractionsPanel";
import { MediaUploader } from "./MediaUploader";

interface PreviewAndSendSectionProps {
  publicId: string;
  partnerName?: string;
  soundtrackUrl?: string | null;
  scheduledUnlockAt?: string | null;
  onSoundtrackChange: (url: string | null) => void;
  onScheduleChange: (isoDate: string | null) => void;
  className?: string;
}

export const PreviewAndSendSection: React.FC<PreviewAndSendSectionProps> = ({
  publicId,
  partnerName = "My Love",
  soundtrackUrl,
  scheduledUnlockAt,
  onSoundtrackChange,
  onScheduleChange,
  className = "",
}) => {
  const [scheduleActive, setScheduleActive] = useState(Boolean(scheduledUnlockAt));
  const [activeKeepsakeView, setActiveKeepsakeView] = useState<"qr" | "print" | null>(null);

  // Format local date for input
  const localDateTimeString = scheduledUnlockAt
    ? new Date(scheduledUnlockAt).toISOString().slice(0, 16)
    : "";

  return (
    <div className={`space-y-6 ${className}`} data-testid="preview-send-section">
      <div className="space-y-1">
        <h3 className="text-base font-serif font-normal text-white flex items-center gap-2.5">
          <svg className="w-4 h-4 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <span>Delivery, Keepsakes & Responses</span>
        </h3>
        <p className="text-xs text-white/60 font-ui font-light">
          Set soundtrack music, schedule a future reveal date, share QR cards, and view partner replies.
        </p>
      </div>

      {/* 1. Background Music (Creator-Uploaded Only) */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-rose-300/80 select-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a.75.75 0 00.542-.721V6.9m0 0a2.25 2.25 0 00-1.632-2.163l-7.5-2.143A2.25 2.25 0 006 4.757v11.046a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66A.75.75 0 004.91 13.5V4.757" />
            </svg>
            <div>
              <span className="text-xs font-serif font-normal text-white block">
                Background Music (Creator Soundtrack)
              </span>
              <span className="text-[11px] text-white/50 font-ui">
                Upload your own song, memory audio, or soundtrack (MP3/WAV up to 10 MB).
              </span>
            </div>
          </div>
          {soundtrackUrl && (
            <button
              type="button"
              onClick={() => onSoundtrackChange(null)}
              className="text-[11px] text-rose-400 hover:text-rose-300 underline font-ui cursor-pointer"
            >
              Remove Soundtrack
            </button>
          )}
        </div>

        <MediaUploader
          publicId={publicId}
          fileType="audio"
          label={soundtrackUrl ? "Replace Custom Track" : "Upload Custom Song (MP3/WAV)"}
          maxSizeMb={10}
          onUploaded={(media) => onSoundtrackChange(media.url)}
        />

        {soundtrackUrl ? (
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.08] flex items-center justify-between">
            <audio src={soundtrackUrl} controls className="h-8 max-w-xs" />
            <span className="text-[10px] text-emerald-400 font-ui">✓ Custom Song Attached</span>
          </div>
        ) : (
          <div className="text-[11px] text-white/50 font-ui italic">
            No soundtrack uploaded. Experience will remain ambiently silent unless a track is attached.
          </div>
        )}
      </div>

      {/* 2. Scheduled Reveal (Server-Enforced) */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-rose-300/80 select-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="text-xs font-serif font-normal text-white block">
                Scheduled Reveal (Time-Lock)
              </span>
              <span className="text-[11px] text-white/50 font-ui">
                Server-enforced time lock until your exact Valentine moment.
              </span>
            </div>
          </div>
          <button
            type="button"
            data-testid="toggle-schedule-reveal"
            onClick={() => {
              if (scheduleActive) {
                setScheduleActive(false);
                onScheduleChange(null);
              } else {
                setScheduleActive(true);
                // Default to tomorrow 09:00 AM
                const tmrw = new Date();
                tmrw.setDate(tmrw.getDate() + 1);
                tmrw.setHours(9, 0, 0, 0);
                onScheduleChange(tmrw.toISOString());
              }
            }}
            className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer font-ui ${
              scheduleActive
                ? "bg-rose-950/60 border-rose-500/40 text-rose-200"
                : "bg-white/[0.04] border-white/[0.1] text-white/70 hover:text-white"
            }`}
          >
            {scheduleActive ? "✓ Scheduled" : "+ Set Time-Lock"}
          </button>
        </div>

        {scheduleActive && (
          <div className="pt-2 pl-2 space-y-2 border-l-2 border-rose-500/30 animate-fadeIn">
            <label className="block text-[11px] text-white/70 font-ui font-medium">
              Unlock Date & Time (Recipient will see countdown before this):
            </label>
            <input
              type="datetime-local"
              data-testid="scheduled-unlock-input"
              value={localDateTimeString}
              onChange={(e) => {
                if (e.target.value) {
                  const d = new Date(e.target.value);
                  onScheduleChange(d.toISOString());
                } else {
                  onScheduleChange(null);
                }
              }}
              className="text-xs px-3 py-2 rounded-xl bg-black/40 border border-white/[0.12] text-white font-mono focus:outline-none focus:border-rose-400"
            />
            <p className="text-[10px] text-rose-300/70 font-ui font-light">
              Server-enforced: Even if client clocks or local storage are modified, our server will render the countdown until this timestamp.
            </p>
          </div>
        )}
      </div>

      {/* 3. Keepsakes & Sharing Suite */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-rose-300/80 select-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24-1.076-.672-2.14-1.28-3.048M21.75 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z" />
          </svg>
          <div>
            <span className="text-xs font-serif font-normal text-white block">
              Keepsakes & Physical Gifting
            </span>
            <span className="text-[11px] text-white/50 font-ui">
              Physical QR card printout or framed letter print.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            data-testid="show-qr-keepsake-btn"
            onClick={() => setActiveKeepsakeView(activeKeepsakeView === "qr" ? null : "qr")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif border transition-all cursor-pointer ${
              activeKeepsakeView === "qr"
                ? "bg-rose-950/60 border-rose-500/40 text-rose-200"
                : "bg-white/[0.04] border-white/[0.1] text-white/80 hover:text-white"
            }`}
          >
            QR Keepsake Card
          </button>

          <PrintKeepsakeButton />
        </div>

        {activeKeepsakeView === "qr" && (
          <div className="pt-4 border-t border-white/[0.08] animate-fadeIn">
            <QrCard publicId={publicId} partnerName={partnerName} />
          </div>
        )}
      </div>

      {/* 4. Partner Reactions & Replies */}
      <PartnerInteractionsPanel publicId={publicId} />
    </div>
  );
};
