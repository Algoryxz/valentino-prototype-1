"use client";

import React from "react";

export type StudioStageId =
  | "personalize"
  | "world"
  | "story"
  | "mood"
  | "preview"
  | "moments"; // Kept as alias for compatibility

export interface StudioStage {
  id: StudioStageId;
  stepNumber: string;
  label: string;
  shortLabel: string;
  description: string;
}

export const STUDIO_STAGES: StudioStage[] = [
  {
    id: "personalize",
    stepNumber: "01",
    label: "Dedication & Letter",
    shortLabel: "LETTER",
    description: "Personal words meant for their eyes only",
  },
  {
    id: "world",
    stepNumber: "02",
    label: "Visual Atmosphere",
    shortLabel: "WORLD",
    description: "The mood and realm they enter",
  },
  {
    id: "story",
    stepNumber: "03",
    label: "Story & Keepsakes",
    shortLabel: "STORY",
    description: "Chapters, milestones & discovered moments",
  },
  {
    id: "mood",
    stepNumber: "04",
    label: "Stationery & Seals",
    shortLabel: "STYLING",
    description: "Fine paper, ribbon, wax seal & flora",
  },
  {
    id: "preview",
    stepNumber: "05",
    label: "Delivery & Keepsakes",
    shortLabel: "DELIVERY",
    description: "Experience verification & private share link",
  },
];

interface StudioStageStepperProps {
  activeStage: StudioStageId;
  onSelectStage: (stage: StudioStageId) => void;
  completedStages?: Record<StudioStageId, boolean>;
  worldId?: string;
  className?: string;
}

export const StudioStageStepper: React.FC<StudioStageStepperProps> = ({
  activeStage,
  onSelectStage,
  completedStages = {} as Record<StudioStageId, boolean>,
  worldId = "midnight-rose",
  className = "",
}) => {
  const buttonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  // Ensure active stage button is visible horizontally in mobile navigation
  React.useEffect(() => {
    const activeBtn = buttonRefs.current[activeStage];
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeStage]);

  // World-derived accent lighting tokens
  const getAccentTokens = (id: string) => {
    switch (id) {
      case "cloud-nine":
        return {
          text: "text-amber-200",
          bar: "bg-amber-300",
          glow: "shadow-[0_0_8px_rgba(252,211,77,0.4)]",
        };
      case "kage":
        return {
          text: "text-purple-300",
          bar: "bg-purple-400",
          glow: "shadow-[0_0_8px_rgba(167,139,250,0.4)]",
        };
      case "apricot-film":
        return {
          text: "text-amber-300",
          bar: "bg-amber-500",
          glow: "shadow-[0_0_8px_rgba(245,158,11,0.4)]",
        };
      case "wildflower-paper":
        return {
          text: "text-emerald-300",
          bar: "bg-emerald-400",
          glow: "shadow-[0_0_8px_rgba(52,211,153,0.4)]",
        };
      case "ocean-letter":
        return {
          text: "text-sky-300",
          bar: "bg-sky-400",
          glow: "shadow-[0_0_8px_rgba(56,189,248,0.4)]",
        };
      case "midnight-rose":
      default:
        return {
          text: "text-rose-300",
          bar: "bg-rose-500",
          glow: "shadow-[0_0_8px_rgba(244,63,94,0.4)]",
        };
    }
  };

  const accents = getAccentTokens(worldId);

  return (
    <nav
      data-testid="studio-stage-stepper"
      aria-label="Studio creation stages"
      className={`border-b border-white/[0.04] bg-[#0E0C12]/95 backdrop-blur-md select-none px-3 sm:px-6 py-1.5 sm:py-2 overflow-x-auto scrollbar-none shrink-0 ${className}`}
    >
      <div className="flex items-center justify-between gap-2.5 sm:gap-5 min-w-max mx-auto max-w-xl">
        {STUDIO_STAGES.map((stage) => {
          const isActive = activeStage === stage.id;
          const isComplete = completedStages[stage.id];

          return (
            <button
              key={stage.id}
              ref={(el) => {
                buttonRefs.current[stage.id] = el;
              }}
              type="button"
              data-testid={`stage-tab-${stage.id}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectStage(stage.id)}
              className={`group relative py-2 sm:py-1.5 px-2.5 sm:px-2 min-h-[44px] flex items-center gap-1.5 transition-all cursor-pointer select-none shrink-0 ${
                isActive ? "text-white" : "text-white/35 hover:text-white/70"
              }`}
              title={`${stage.stepNumber} · ${stage.label}: ${stage.description}`}
            >
              <span
                className={`text-[10px] font-mono tracking-wider transition-colors ${
                  isActive ? accents.text : "text-white/25 group-hover:text-white/45"
                }`}
              >
                {stage.stepNumber}
              </span>
              <span
                className={`text-[11px] font-serif tracking-widest uppercase transition-colors ${
                  isActive
                    ? "text-white font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
                    : "font-normal"
                }`}
              >
                {stage.shortLabel}
                {stage.id === "story" && (
                  <span
                    data-testid="stage-tab-moments"
                    className="text-[9px] font-mono opacity-60 ml-1 select-none"
                    title="Interactive Moments & Keepsakes included"
                  >
                    ✦
                  </span>
                )}
              </span>
              {isComplete && !isActive && (
                <span className="w-1 h-1 rounded-full bg-emerald-400/60 shrink-0" title="Completed" />
              )}
              {/* Active stage micro accent line */}
              {isActive && (
                <span
                  className={`absolute bottom-0 left-1.5 right-1.5 h-[1.5px] rounded-full ${accents.bar} ${accents.glow} transition-all duration-300`}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
