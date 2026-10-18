"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ValentinoMonogram } from "@/components/motion/ValentinoMonogram";
import { ValentinePlasmaButton, type ValentinePlasmaTheme } from "@/components/ui/ValentinePlasmaButton";
import { AtmosphericButton } from "@/components/ui/AtmosphericButton";
import { ROADMAP_WORLDS, type RoadmapWorld } from "@/templates/registry";
import { AtmosphericCanvas } from "@/worlds/AtmosphericCanvas";
import { ValentinoAtmosphere } from "@/components/ui/ValentinoAtmosphere";
import { useDeviceTier } from "@/worlds/useDeviceTier";
import { WorldTheme } from "@/worlds/types";
import { AmbientBotanicalFrame, type BotanicalTone } from "@/components/motion/AmbientBotanicalFrame";

const SHOWROOM_BOTANICAL_TONE: Record<WorldTheme, BotanicalTone> = {
  "cloud-nine": "light",
  "midnight-rose": "dusk",
  "kage": "dark",
  "apricot-film": "warm",
  "wildflower-paper": "meadow",
  "ocean-letter": "ocean",
};

// Lazy-load Kage WebGL component to isolate Three.js runtime until explicitly requested
const KageComponentLazy = dynamic(
  () => import("@/templates/kage/v1/Component").then((mod) => mod.KageComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center bg-[#06100E] text-emerald-300 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
        <span className="text-xs font-mono tracking-wider">Awakening Kyoto Sanctuary WebGL...</span>
      </div>
    ),
  }
);

function WorldArtifactMark({
  worldId,
  className = "w-6 h-6",
}: {
  worldId: WorldTheme;
  className?: string;
}) {
  switch (worldId) {
    case "cloud-nine":
      return (
        <svg viewBox="0 0 24 16" fill="none" className={className} aria-hidden="true">
          <path
            d="M4 14 C 2 14, 0 12, 0 9.5 C 0 7.2, 1.8 5.5, 4 5.5 C 4.5 3, 6.8 1, 9.5 1 C 12.5 1, 14.8 3.2, 15 6 C 16.5 6, 18 7.2, 18 9 C 18 10.5, 17 12, 15.5 12.5 C 15 13.5, 14 14, 13 14 Z"
            fill="currentColor"
            fillOpacity="0.35"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "midnight-rose":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeDasharray="1.5 2"
          />
          <path
            d="M12 6 C 14 6, 16 8, 15 10 C 14 12, 12 13, 12 15"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
          <path
            d="M12 8 C 10 9, 9 11, 11 12 C 12 13, 13 13, 14 14"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
          <circle cx="12" cy="10.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case "kage":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4 6 H20 M6 6 V19 M18 6 V19 M3 9 H21"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M10 6 V13 H14 V6"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
        </svg>
      );
    case "apricot-film":
      return (
        <svg viewBox="0 0 24 18" fill="none" className={className} aria-hidden="true">
          <rect x="2" y="1" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <line
            x1="6"
            y1="1"
            x2="6"
            y2="17"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <line
            x1="18"
            y1="1"
            x2="18"
            y2="17"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <rect
            x="8.5"
            y="4"
            width="7"
            height="10"
            rx="1"
            fill="currentColor"
            fillOpacity="0.25"
            stroke="currentColor"
            strokeWidth="0.8"
          />
        </svg>
      );
    case "wildflower-paper":
      return (
        <svg viewBox="0 0 16 22" fill="none" className={className} aria-hidden="true">
          <path d="M8 21 C 8 15, 9 9, 8 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path
            d="M8 15 C 4 13, 3 9, 7 8 C 8 10, 8 13, 8 15 Z"
            fill="currentColor"
            fillOpacity="0.38"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          <path
            d="M8 10 C 12 8, 13 4, 9 3 C 8 5, 8 8, 8 10 Z"
            fill="currentColor"
            fillOpacity="0.38"
            stroke="currentColor"
            strokeWidth="0.8"
          />
        </svg>
      );
    case "ocean-letter":
      return (
        <svg viewBox="0 0 24 14" fill="none" className={className} aria-hidden="true">
          <path
            d="M1 7 C 4 4, 8 4, 11 7 C 14 10, 18 10, 23 7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M2 11 C 5 9, 8 9, 11 11 C 14 13, 18 13, 22 11"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

interface WorldProfile {
  id: WorldTheme;
  name: string;
  jpName?: string;
  portalAction: string;
  tagline: string;
  category: string;
  identity: string;
  feeling: string;
  bestFor: string;
  signature: string;
  atmosphereTone: string;
  experienceFlow: string;
  accentColor: string;
  glowColor: string;
  previewQuote: string;
  sampleSender: string;
  sampleRecipient: string;
  artifactLabel: string;
  swatches?: { id: string; name: string; color: string; buttonLabel: string }[];
}

const WORLD_PROFILES: Record<WorldTheme, WorldProfile> = {
  "cloud-nine": {
    id: "cloud-nine",
    name: "Cloud Nine",
    portalAction: "Begin in Cloud Nine →",
    tagline: "For the person who makes everything lighter",
    category: "Luminous World",
    identity: "Dreamy Sunset Sky World",
    feeling: "Weightless, warm, soft, playful, intimate.",
    bestFor: "Dreamy, playful, affectionate stories that feel light as air.",
    signature: "Sunset clouds · floating petals · warm cream paper · luminous pearl",
    atmosphereTone: "Sunset Blush · Peach Horizon · Floating Motes · Cotton Haze",
    experienceFlow: "Welcome Cloud Envelope → Narrative Chapters → Floating Memories → Luminous Finale",
    accentColor: "#f472b6",
    glowColor: "rgba(244, 114, 182, 0.28)",
    previewQuote: "“Every moment with you feels like floating high above the clouds, gentle and weightless.”",
    sampleSender: "Forever in the Clouds",
    sampleRecipient: "Dearest Angel",
    artifactLabel: "Cloud Postcard",
    swatches: [
      { id: "blush-sky", name: "Blush Sky", color: "#f472b6", buttonLabel: "Blush" },
      { id: "sunset-coral", name: "Sunset Coral", color: "#fb7185", buttonLabel: "Coral" },
      { id: "lavender-dream", name: "Lavender Dream", color: "#c084fc", buttonLabel: "Lavender" },
    ],
  },
  "midnight-rose": {
    id: "midnight-rose",
    name: "Midnight Rose",
    portalAction: "Step into Midnight Rose →",
    tagline: "For the love that feels like midnight",
    category: "Flagship World",
    identity: "Private Midnight Garden",
    feeling: "Intimate, mysterious, elegant, candlelit.",
    bestFor: "Intimate, dramatic, deeply personal stories sealed after dark.",
    signature: "Physical envelope + interactive wax seal reveal · moonlit mist · candlelight",
    atmosphereTone: "Midnight Velvet · Crimson Rose · Gold Dust · Starlight Mist",
    experienceFlow: "Tactile Sealed Envelope → Relationship Milestones → Secret Keepsakes → Candlelit Vow",
    accentColor: "#e11d48",
    glowColor: "rgba(225, 29, 72, 0.32)",
    previewQuote: "“In a world of noise, you are my quiet starlight. Every single day with you feels like midnight poetry.”",
    sampleSender: "Yours Always",
    sampleRecipient: "Dearest Maya",
    artifactLabel: "Wax Sealed Parcel",
    swatches: [
      { id: "crimson-rose", name: "Crimson Velvet", color: "#e11d48", buttonLabel: "Crimson" },
      { id: "midnight-violet", name: "Midnight Violet", color: "#9333ea", buttonLabel: "Violet" },
      { id: "champagne-gold", name: "Champagne Gold", color: "#d97706", buttonLabel: "Gold" },
    ],
  },
  "kage": {
    id: "kage",
    name: "Kage",
    jpName: "(影)",
    portalAction: "Enter Kage →",
    tagline: "For the love of quiet shadows and unspoken truths",
    category: "Spatial Sanctuary",
    identity: "Kyoto Digital Sanctuary",
    feeling: "Quiet, contemplative, spatial, mysterious.",
    bestFor: "Quiet, poetic, contemplative stories steeped in sacred stillness.",
    signature: "Kyoto mountain atmosphere · cedar & lantern glow · spatial sanctuary",
    atmosphereTone: "Sacred Emerald · Kyoto Teal · Stone Lanterns · Mountain Mist",
    experienceFlow: "Sacred Torii Gate → Reflective Verses → Sacred Memories → Twilight Constellation",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.28)",
    previewQuote: "“In the quiet shade of the sacred cedar, my thoughts find their home with you.”",
    sampleSender: "With all my heart",
    sampleRecipient: "Aoi",
    artifactLabel: "Washi Ink Scroll",
    swatches: [
      { id: "kyoto-crimson", name: "Kyoto Crimson", color: "#e0231c", buttonLabel: "Crimson" },
      { id: "sanctuary-emerald", name: "Sanctuary Emerald", color: "#10b981", buttonLabel: "Emerald" },
      { id: "moonlit-stone", name: "Moonlit Stone", color: "#94a3b8", buttonLabel: "Stone" },
    ],
  },
  "apricot-film": {
    id: "apricot-film",
    name: "Apricot Film",
    portalAction: "Enter Apricot Film →",
    tagline: "For the memories that feel like warm analog cinema",
    category: "Analog Cinema",
    identity: "Warm 16mm Memory Reel",
    feeling: "Nostalgic, golden, cinematic, heartwarming.",
    bestFor: "Cherished photographic memories, golden hour reflections, and nostalgic romance.",
    signature: "Analog film slide + golden hour light leak · tobacco amber · 16mm grain",
    atmosphereTone: "Sunlit Apricot · Tobacco Amber · Golden Motes · Analog Grain",
    experienceFlow: "Analog Reel Arrival → Cinematic Memories → Sunlit Letter → Golden Hour Vow",
    accentColor: "#e76f51",
    glowColor: "rgba(231, 111, 81, 0.32)",
    previewQuote: "“Every frame with you is steeped in golden afternoon warmth that never fades.”",
    sampleSender: "Forever in Golden Hour",
    sampleRecipient: "Dearest Memory",
    artifactLabel: "16mm Film Frame",
    swatches: [
      { id: "apricot-amber", name: "Apricot Amber", color: "#e76f51", buttonLabel: "Amber" },
      { id: "terracotta-sun", name: "Terracotta Sun", color: "#f4a261", buttonLabel: "Terracotta" },
      { id: "tobacco-espresso", name: "Tobacco Espresso", color: "#3d1f0e", buttonLabel: "Espresso" },
    ],
  },
  "wildflower-paper": {
    id: "wildflower-paper",
    name: "Wildflower Paper",
    portalAction: "Open Wildflower Paper →",
    tagline: "For a love cultivated slowly with honesty and grace",
    category: "Botanical Craft",
    identity: "Artisan Meadow Press",
    feeling: "Organic, gentle, handwritten, pastoral.",
    bestFor: "Handwritten letters, meadow memories, and honest botanical devotion.",
    signature: "Botanical twine unbind + pressed floral reveal · deckled cotton fibers · sage mist",
    atmosphereTone: "Pressed Sage · Dried Lilac · Cotton Fibers · Meadow Dew",
    experienceFlow: "Deckled Parcel Unfold → Botanical Chapters → Pressed Petal Keepsakes → Pastoral Promise",
    accentColor: "#c084fc",
    glowColor: "rgba(192, 132, 252, 0.28)",
    previewQuote: "“Our love is like pressed wildflowers inside an artisan journal — quiet, enduring, and honest.”",
    sampleSender: "Grown in Love",
    sampleRecipient: "Gentlest Blossom",
    artifactLabel: "Botanical Tag",
    swatches: [
      { id: "sage-botanical", name: "Pressed Sage", color: "#a3b899", buttonLabel: "Sage" },
      { id: "pressed-lilac", name: "Pressed Lilac", color: "#c084fc", buttonLabel: "Lilac" },
      { id: "meadow-coral", name: "Meadow Coral", color: "#fb7185", buttonLabel: "Coral" },
    ],
  },
  "ocean-letter": {
    id: "ocean-letter",
    name: "Ocean Letter",
    portalAction: "Enter Ocean Letter →",
    tagline: "For devotion as vast and steady as the tides",
    category: "Oceanic Tranquility",
    identity: "Sea Glass Coastal Sanctuary",
    feeling: "Vast, tranquil, profound, eternal.",
    bestFor: "Long-distance devotion, enduring promises, and tranquil oceanic depth.",
    signature: "Sea glass message in a bottle + tidal ripple · fog blue mist · tidal foam",
    atmosphereTone: "Oceanic Teal · Fog Blue · Sea Glass Foam · Tidal Mist",
    experienceFlow: "Sea Glass Uncork → Tidal Reflections → Ocean Milestones → Twilight Horizon Vow",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.32)",
    previewQuote: "“Our devotion is as vast, calm, and enduring as the twilight sea.”",
    sampleSender: "With Every Tide",
    sampleRecipient: "Steady Anchor",
    artifactLabel: "Sea Glass Parchment",
    swatches: [
      { id: "fog-blue", name: "Fog Blue", color: "#7dd3fc", buttonLabel: "Blue" },
      { id: "deep-teal", name: "Deep Teal", color: "#0e7490", buttonLabel: "Teal" },
      { id: "soft-coral", name: "Soft Coral", color: "#fb7185", buttonLabel: "Coral" },
    ],
  },
};

const ORDERED_WORLD_KEYS: WorldTheme[] = [
  "cloud-nine",
  "midnight-rose",
  "kage",
  "apricot-film",
  "wildflower-paper",
  "ocean-letter",
];

export default function TemplatesPage() {
  const { tier, isReducedMotion } = useDeviceTier();
  const shouldReduceMotion = useReducedMotion();

  const [activeWorldId, setActiveWorldId] = useState<WorldTheme>("midnight-rose");
  const [selectedMidnightTheme, setSelectedMidnightTheme] = useState<string>("crimson-rose");
  const [selectedCloudTheme, setSelectedCloudTheme] = useState<string>("blush-sky");
  const [selectedKageTheme, setSelectedKageTheme] = useState<string>("sanctuary-emerald");
  const [selectedApricotTheme, setSelectedApricotTheme] = useState<string>("apricot-amber");
  const [selectedWildflowerTheme, setSelectedWildflowerTheme] = useState<string>("sage-botanical");
  const [selectedOceanTheme, setSelectedOceanTheme] = useState<string>("fog-blue");

  // Interaction states for floating keepsake previews
  const [surpriseMatch, setSurpriseMatch] = useState<string | null>(null);
  const [activeMidnightSealed, setActiveMidnightSealed] = useState(true);
  const [activeCloudNineSealed, setActiveCloudNineSealed] = useState(true);
  const [activeApricotRevealed, setActiveApricotRevealed] = useState(false);
  const [activeWildflowerRevealed, setActiveWildflowerRevealed] = useState(false);
  const [activeOceanRevealed, setActiveOceanRevealed] = useState(false);
  const [activeKagePreview, setActiveKagePreview] = useState(false);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);

  const currentProfile = WORLD_PROFILES[activeWorldId];

  // Midnight theme visual metadata
  const midnightThemeMeta = useMemo(() => {
    switch (selectedMidnightTheme) {
      case "midnight-violet":
        return {
          name: "Midnight Violet",
          sealBg: "bg-purple-700",
          sealBorder: "border-purple-400",
          accentText: "text-purple-300",
        };
      case "champagne-gold":
        return {
          name: "Champagne Gold",
          sealBg: "bg-amber-700",
          sealBorder: "border-amber-400",
          accentText: "text-amber-300",
        };
      case "crimson-rose":
      default:
        return {
          name: "Crimson Velvet",
          sealBg: "bg-rose-700",
          sealBorder: "border-rose-400",
          accentText: "text-rose-300",
        };
    }
  }, [selectedMidnightTheme]);

  const currentPlasmaTheme: ValentinePlasmaTheme =
    activeWorldId === "midnight-rose"
      ? "midnightRose"
      : activeWorldId === "cloud-nine"
      ? "cloudNine"
      : activeWorldId === "apricot-film"
      ? "apricotFilm"
      : activeWorldId === "wildflower-paper"
      ? "wildflowerPaper"
      : activeWorldId === "ocean-letter"
      ? "oceanLetter"
      : "kage";

  const handleSurpriseMe = () => {
    const filtered = ORDERED_WORLD_KEYS.filter((id) => id !== activeWorldId);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setSurpriseMatch(random);
    setActiveWorldId(random);
    const targetElement = document.getElementById("showroom-stage");
    targetElement?.scrollIntoView({ behavior: "smooth" });
  };

  // Keyboard navigation for modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsFullPreviewOpen(false);
      setActiveKagePreview(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <main
      id="templates-page"
      className="relative min-h-[100dvh] flex flex-col items-center justify-start bg-transparent text-[#FAF8F5] overflow-x-hidden selection:bg-rose-500/25 font-ui"
    >
      {/* ========================================================================= */}
      {/* 0. DYNAMIC ENVIRONMENTAL ATMOSPHERE (Full-Bleed Responsive Universe)       */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-world-bg overflow-hidden">
        <ValentinoAtmosphere
          key={activeWorldId}
          context="world"
          world={activeWorldId}
          intensity="cinema"
          scrollReactive={true}
        />
      </div>

      {/* Midground atmospheric particles */}
      <div className="fixed inset-0 pointer-events-none z-atmosphere">
        <AtmosphericCanvas
          key={activeWorldId}
          theme={activeWorldId}
          tier={tier}
          isReducedMotion={Boolean(isReducedMotion || shouldReduceMotion)}
          className="opacity-60"
        />
      </div>

      {/* Sparse Atelier Botanical Edge Atmosphere (Restrained, subtle periphery) */}
      <div className="fixed inset-0 pointer-events-none z-atmosphere overflow-hidden" aria-hidden="true">
        <AmbientBotanicalFrame
          variant={SHOWROOM_BOTANICAL_TONE[activeWorldId] || "dusk"}
          density="sparse"
          intensity={0.5}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. MINIMAL EDITORIAL NAV (No Artificial Curtain Navigation)               */}
      {/* ========================================================================= */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between relative z-floating-ui">
        <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
          <ValentinoMonogram
            size={32}
            className="transition-transform group-hover:scale-105 duration-300 text-rose-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          />
          <span className="text-lg sm:text-xl font-serif font-medium tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Valentino
          </span>
        </Link>

        <Link
          href={`/create?template=${activeWorldId}`}
          className="px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-[#9F1239] via-[#881337] to-[#9F1239] border border-rose-300/40 shadow-[0_4px_16px_rgba(159,18,57,0.4)] hover:brightness-110 active:scale-95 transition-all"
        >
          Create Experience
        </Link>
      </header>

      {/* ========================================================================= */}
      {/* 2. SPATIAL SANCTUARY ARRIVAL & EDITORIAL OPENING                          */}
      {/* ========================================================================= */}
      <section
        id="showroom-stage"
        className="w-full max-w-6xl mx-auto px-4 sm:px-8 pt-4 pb-20 relative z-content flex flex-col items-center"
      >
        {/* Subtle Exhibition Eyebrow */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-rose-100 font-mono font-medium drop-shadow-sm">
              The Collection · Six Living Worlds
            </span>
            <span className="sr-only">The Collection · Visual Worlds</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-white tracking-tight leading-[1.15] drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]">
            Choose Your Atmosphere
          </h1>
          <p className="text-sm sm:text-base text-rose-100/90 font-light max-w-xl mx-auto leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
            Every love story lives in its own climate. Step inside living worlds of mood, atmosphere, and intimate depth before you compose a single word.
          </p>

          {/* Centered Magical Artifact: Surprise Me */}
          <div className="pt-3 flex flex-col items-center justify-center">
            <ValentinePlasmaButton
              theme={currentPlasmaTheme}
              label="SURPRISE ME"
              sublabel="Spark a Match"
              size="md"
              onClick={handleSurpriseMe}
            />
            {surpriseMatch && (
              <p className="mt-2 text-xs font-mono text-rose-200 animate-fade-in bg-rose-950/60 border border-rose-400/30 px-3.5 py-1 rounded-full shadow-md">
                Matched with {WORLD_PROFILES[surpriseMatch as WorldTheme]?.name} ✦
              </p>
            )}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 3. TACTILE KEEPSAKE CONSTELLATION NAVIGATION (Zero Enclosing Box)        */}
        {/* ======================================================================= */}
        <div className="w-full max-w-5xl mx-auto mb-12">
          <div className="text-center mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-rose-200/80 font-medium">
              World Showroom · Six Living Atmospheres
            </span>
          </div>

          {/* Freely Breathing Keepsake Tokens (Spatial Constellation - World Selection) */}
          <div
            role="radiogroup"
            aria-label="Living atmosphere selection"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 py-2"
          >
            {ORDERED_WORLD_KEYS.map((worldKey) => {
              const isActive = activeWorldId === worldKey;
              const profile = WORLD_PROFILES[worldKey];

              return (
                <button
                  key={worldKey}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`Select ${profile.name} atmosphere`}
                  onClick={() => {
                    setActiveWorldId(worldKey);
                    setActiveKagePreview(false);
                  }}
                  className={`group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-rose-400/50 ${
                    isActive
                      ? "bg-white/[0.14] backdrop-blur-md border border-white/40 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6)] -translate-y-1.5 scale-[1.03]"
                      : "bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.09] hover:border-white/25 hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  {/* Subtle active glow halo */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-2xl blur-lg pointer-events-none opacity-40 transition-colors duration-500"
                      style={{ background: profile.accentColor }}
                    />
                  )}

                  <span className="w-7 h-7 flex items-center justify-center select-none mb-1.5 transition-transform group-hover:scale-110 duration-300 text-rose-200">
                    <WorldArtifactMark worldId={worldKey} className="w-5 h-5 text-current" />
                  </span>
                  <span
                    className={`text-xs font-serif font-medium tracking-wide transition-colors ${
                      isActive ? "text-white font-semibold" : "text-rose-100/80 group-hover:text-white"
                    }`}
                  >
                    {profile.name}
                  </span>
                  <span className="text-[9px] font-mono tracking-wider text-rose-200/60 uppercase mt-0.5">
                    {profile.artifactLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 4. THE LIVING WORLD SANCTUARY (No Boxed SaaS Card)                       */}
        {/* ======================================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWorldId}
            id={`template-${activeWorldId}`}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full relative"
          >
            {/* Ambient Bloom beneath the world object */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 opacity-60"
              style={{ background: currentProfile.glowColor }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* ----------------------------------------------------------------- */}
              {/* COLUMN A: World Voice & Editorial Identity                        */}
              {/* ----------------------------------------------------------------- */}
              <div className="w-full lg:col-span-6 space-y-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] px-3 py-0.5 rounded-full bg-rose-950/60 border border-rose-400/30 text-rose-200">
                      {currentProfile.identity}
                    </span>
                    <span className="text-xs text-rose-200/70 font-sans tracking-wide">
                      {currentProfile.category}
                    </span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-white tracking-tight flex items-baseline gap-3 drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">
                    <span>{currentProfile.name}</span>
                    {currentProfile.jpName && (
                      <span className="text-2xl text-emerald-300/70 font-light font-serif">
                        {currentProfile.jpName}
                      </span>
                    )}
                  </h2>

                  <p className="text-base sm:text-lg font-serif italic text-rose-200/95 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
                    &ldquo;{currentProfile.tagline}&rdquo;
                  </p>

                  <p className="text-sm text-rose-100/90 font-light leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                    {currentProfile.feeling}
                  </p>
                </div>

                {/* Poetic Essence Details */}
                <div className="space-y-3.5 pt-4 border-t border-white/10 text-xs text-rose-100/90">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 block mb-0.5 font-semibold">
                      Best For:
                    </span>
                    <p className="text-sm font-normal text-white drop-shadow-sm leading-relaxed">
                      {currentProfile.bestFor}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 block mb-0.5 font-semibold">
                      Signature:
                    </span>
                    <p className="text-xs font-normal text-rose-200 drop-shadow-sm leading-relaxed">
                      {currentProfile.signature}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300/80 block mb-0.5 font-semibold">
                      Relationship Journey:
                    </span>
                    <p className="text-xs font-light text-rose-100/80 leading-relaxed">
                      {currentProfile.experienceFlow}
                    </p>
                  </div>
                </div>

                {/* Atmosphere Tone Swatches */}
                {currentProfile.swatches && (
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="block text-xs uppercase tracking-wider text-rose-200 font-medium font-mono">
                      Atmosphere Tone:{" "}
                      <strong className="text-white normal-case font-serif tracking-normal">
                        {activeWorldId === "midnight-rose"
                          ? midnightThemeMeta.name
                          : activeWorldId === "cloud-nine"
                          ? selectedCloudTheme
                          : activeWorldId === "kage"
                          ? selectedKageTheme
                          : activeWorldId === "apricot-film"
                          ? selectedApricotTheme
                          : activeWorldId === "wildflower-paper"
                          ? selectedWildflowerTheme
                          : selectedOceanTheme}
                      </strong>
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {currentProfile.swatches.map((swatch) => {
                        const isSelected =
                          activeWorldId === "midnight-rose"
                            ? selectedMidnightTheme === swatch.id
                            : activeWorldId === "cloud-nine"
                            ? selectedCloudTheme === swatch.id
                            : activeWorldId === "kage"
                            ? selectedKageTheme === swatch.id
                            : activeWorldId === "apricot-film"
                            ? selectedApricotTheme === swatch.id
                            : activeWorldId === "wildflower-paper"
                            ? selectedWildflowerTheme === swatch.id
                            : selectedOceanTheme === swatch.id;

                        return (
                          <button
                            key={swatch.id}
                            type="button"
                            onClick={() => {
                              if (activeWorldId === "midnight-rose") setSelectedMidnightTheme(swatch.id);
                              if (activeWorldId === "cloud-nine") setSelectedCloudTheme(swatch.id);
                              if (activeWorldId === "kage") setSelectedKageTheme(swatch.id);
                              if (activeWorldId === "apricot-film") setSelectedApricotTheme(swatch.id);
                              if (activeWorldId === "wildflower-paper") setSelectedWildflowerTheme(swatch.id);
                              if (activeWorldId === "ocean-letter") setSelectedOceanTheme(swatch.id);
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                              isSelected
                                ? "border-white/50 bg-white/20 text-white shadow-sm"
                                : "border-white/10 bg-white/5 text-rose-200/80 hover:bg-white/10"
                            }`}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: swatch.color }}
                            />
                            <span>{swatch.buttonLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Primary & Secondary Action CTAs */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  {/* Primary Portal Button: AtmosphericButton */}
                  <AtmosphericButton
                    href={`/create?template=${activeWorldId}`}
                    worldId={activeWorldId}
                    worldName={currentProfile.name}
                    label={currentProfile.portalAction}
                    className="shadow-xl"
                  />

                  {/* Secondary Immersion Button (Opens Full Preview Modal) */}
                  <button
                    type="button"
                    onClick={() => setIsFullPreviewOpen(true)}
                    className="px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider text-rose-100/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Enter {currentProfile.name}
                  </button>

                  {/* Deep-link Customization Anchor (Test Compatibility) */}
                  <Link
                    href={`/create?template=${activeWorldId}`}
                    className="text-xs font-medium text-rose-200 hover:text-white underline underline-offset-4 transition-colors"
                  >
                    Customize {currentProfile.name}
                  </Link>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* COLUMN B: Floating Interactive Keepsake Artifact                  */}
              {/* ----------------------------------------------------------------- */}
              <div className="w-full lg:col-span-6 flex items-center justify-center py-6 sm:py-10">
                {/* ARTIFACT 1: CLOUD NINE DIMENSIONAL SKY AEROGRAMME (Physical Object) */}
                {activeWorldId === "cloud-nine" && (
                  <div className="relative w-full max-w-sm p-6 sm:p-8 text-center space-y-5 bg-[#FFFDF9] text-pink-950 rounded-2xl shadow-[0_28px_65px_-10px_rgba(244,114,182,0.4),0_2px_8px_rgba(0,0,0,0.08)] border-2 border-dashed border-pink-300/70 rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500">
                    {/* Airmail Chevron Trim Indicator & Cancellation Stamp */}
                    <div className="flex items-center justify-between border-b border-pink-200/80 pb-3">
                      <div className="text-left">
                        <span className="inline-block text-[9px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 rounded bg-pink-100 text-pink-900 font-semibold border border-pink-200">
                          PAR AVION · AIRMAIL
                        </span>
                        <span className="block text-[10px] font-mono text-pink-800/70 mt-0.5">
                          TO MY SWEETEST SOUL
                        </span>
                      </div>
                      {/* Vintage Cancellation Postal Stamp */}
                      <div className="w-11 h-11 rounded-full border-2 border-dashed border-pink-400/80 flex flex-col items-center justify-center text-[7px] font-mono text-pink-700 leading-none rotate-12 select-none">
                        <span>CLOUD 9</span>
                        <span className="font-bold my-0.5">14.02</span>
                        <span>POST</span>
                      </div>
                    </div>

                    <div className="space-y-0.5 pt-1">
                      <h3 className="text-3xl font-serif font-medium text-pink-950 tracking-wide">Dearest Angel</h3>
                      <p className="text-xs font-serif italic text-pink-800/80">Skyway Express · Delivery by Dusk</p>
                    </div>

                    {activeCloudNineSealed ? (
                      <div className="py-4 flex flex-col items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setActiveCloudNineSealed(false)}
                          className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 via-rose-100 to-pink-300 border-2 border-pink-300/90 flex items-center justify-center shadow-[0_8px_20px_rgba(244,114,182,0.4)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                          aria-label="Open cloud envelope"
                        >
                          <WorldArtifactMark worldId="cloud-nine" className="w-10 h-8 text-pink-700 drop-shadow-sm" />
                        </button>
                        <span className="mt-3 text-xs uppercase tracking-wider text-pink-800 font-medium font-mono">
                          Tap cloud to unfold letter
                        </span>
                      </div>
                    ) : (
                      <div className="py-4 px-5 rounded-xl bg-pink-50/80 border border-pink-200 text-left space-y-2.5 animate-fade-in shadow-inner">
                        <p className="text-xs text-pink-950 leading-relaxed font-serif italic">
                          {currentProfile.previewQuote}
                        </p>
                        <div className="text-right text-[11px] text-pink-800 font-serif">
                          — {currentProfile.sampleSender}
                        </div>
                        <div className="pt-1 text-center">
                          <button
                            type="button"
                            onClick={() => setActiveCloudNineSealed(true)}
                            className="text-[11px] text-pink-700 hover:text-pink-950 underline underline-offset-2"
                          >
                            Fold Envelope
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-dashed border-pink-200/80 flex items-center justify-between text-xs text-pink-800/80 font-mono">
                      <span>Luminous Sky Atmosphere</span>
                      <span>Soft Cream Paper</span>
                    </div>
                  </div>
                )}

                {/* ARTIFACT 2: MIDNIGHT ROSE DIMENSIONAL VELVET WAX-SEALED ENVELOPE (Physical Object) */}
                {activeWorldId === "midnight-rose" && (
                  <div className="relative w-full max-w-sm text-center space-y-5 bg-gradient-to-b from-[#220313] via-[#16020C] to-[#0A0105] rounded-2xl shadow-[0_28px_70px_-10px_rgba(225,29,72,0.5),0_4px_20px_rgba(0,0,0,0.8)] border border-rose-400/40 p-6 sm:p-8 rotate-[1deg] hover:rotate-0 transition-transform duration-500">
                    {/* Envelope Flap Accent Line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-400/50 to-transparent" />

                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-0.5 rounded-full border border-rose-400/40 bg-rose-950/80 text-rose-200">
                        To My Favorite Person
                      </span>
                      <h3 className="text-3xl font-serif font-medium text-white drop-shadow-md">Dearest Maya</h3>
                    </div>

                    {activeMidnightSealed ? (
                      <div className="py-4 flex flex-col items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setActiveMidnightSealed(false)}
                          className={`w-20 h-20 rounded-full ${midnightThemeMeta.sealBg} border-2 ${midnightThemeMeta.sealBorder} flex items-center justify-center shadow-[0_8px_25px_rgba(225,29,72,0.6)] cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-300`}
                          aria-label="Break seal"
                        >
                          <WorldArtifactMark worldId="midnight-rose" className="w-10 h-10 text-rose-100 drop-shadow-md" />
                        </button>
                        <span className="mt-3 text-xs uppercase tracking-wider text-rose-200/90 font-medium font-mono">
                          Tap wax seal to break & unfold
                        </span>
                      </div>
                    ) : (
                      <div className="py-4 px-5 rounded-xl bg-white/[0.08] border border-rose-400/30 text-left space-y-2.5 animate-fade-in shadow-inner">
                        <p className="text-xs text-rose-100 leading-relaxed font-serif italic">
                          {currentProfile.previewQuote}
                        </p>
                        <div className="text-right text-[11px] text-rose-300 font-serif">
                          — {currentProfile.sampleSender}
                        </div>
                        <div className="pt-1 text-center">
                          <button
                            type="button"
                            onClick={() => setActiveMidnightSealed(true)}
                            className="text-[11px] text-rose-300 hover:text-rose-100 underline underline-offset-2"
                          >
                            Reseal Envelope
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-rose-400/20 flex items-center justify-between text-xs text-rose-200/70 font-mono">
                      <span>Starlight Atmosphere</span>
                      <span className={midnightThemeMeta.accentText}>{midnightThemeMeta.name}</span>
                    </div>
                  </div>
                )}

                {/* ARTIFACT 3: KAGE HANGING KYOTO WASHI SCROLL (Physical Object) */}
                {activeWorldId === "kage" && (
                  <div className="w-full flex items-center justify-center">
                    {activeKagePreview ? (
                      <div className="w-full h-[360px] rounded-2xl overflow-hidden border border-emerald-400/40 shadow-2xl relative">
                        <KageComponentLazy
                          mode="preview"
                          config={{
                            partnerName: "Aoi",
                            senderName: "Ren",
                            greeting: "Where stillness reveals the unseen",
                            message: "In the quiet shade of the sacred cedar, my thoughts find their home with you.",
                            signOff: "With all my heart",
                            accentTheme: "kyoto-crimson",
                            heroMediaId: null,
                            decor: {
                              paper: "handmade-cream",
                              ribbon: "silk-ivory",
                              waxSeal: "crimson-heart",
                              blooms: ["crimson-rose"],
                              charms: ["sparkle"],
                            },
                          }}
                        />
                        <button
                          onClick={() => setActiveKagePreview(false)}
                          className="absolute top-3 right-3 z-30 px-3 py-1 rounded-full bg-black/80 border border-white/20 text-[11px] text-white hover:bg-black transition-colors"
                        >
                          ✕ Close
                        </button>
                      </div>
                    ) : (
                      <div className="relative w-full max-w-xs flex flex-col items-center">
                        {/* Top Scroll Dowel Rod */}
                        <div className="w-full h-3 rounded-full bg-[#1e130c] border border-amber-900/60 shadow-md flex items-center justify-center">
                          <div className="w-16 h-0.5 bg-amber-400/40" />
                        </div>

                        {/* Mulberry Washi Scroll Body */}
                        <div className="w-[92%] bg-gradient-to-b from-[#0b1714] via-[#06100d] to-[#030907] border-x border-emerald-500/30 p-6 text-center space-y-5 shadow-[0_24px_60px_-10px_rgba(16,185,129,0.35)] text-emerald-100">
                          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-emerald-300/80">
                              KYOTO WASHI · 影
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-serif bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold">
                              印
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <h3 className="text-2xl font-serif font-medium text-white tracking-wide">Twilight Sanctuary</h3>
                            <p className="text-xs font-serif italic text-emerald-300/70">Sacred Pathway to Stillness</p>
                          </div>

                          <div className="py-3 flex flex-col items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setActiveKagePreview(true)}
                              className="w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-emerald-900 via-teal-950 to-black border-2 border-emerald-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                              aria-label="Launch 3D WebGL preview"
                            >
                              <WorldArtifactMark worldId="kage" className="w-8 h-8 text-emerald-300 drop-shadow-sm" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveKagePreview(true)}
                              className="mt-3 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-400/40 text-[11px] uppercase tracking-wider text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors font-medium font-mono cursor-pointer"
                            >
                              Launch 3D WebGL Preview
                            </button>
                          </div>

                          <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-300/70 font-mono">
                            <span>Sacred Twilight Mist</span>
                            <span>Interactive Sanctuary</span>
                          </div>
                        </div>

                        {/* Bottom Weighted Scroll Roller */}
                        <div className="w-full h-4 rounded-full bg-[#1e130c] border border-amber-900/60 shadow-lg flex items-center justify-between px-2">
                          <div className="w-2 h-2 rounded-full bg-amber-600/60" />
                          <div className="w-2 h-2 rounded-full bg-amber-600/60" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ARTIFACT 4: APRICOT FILM 16MM CELLULOID SLIDE (Physical Object) */}
                {activeWorldId === "apricot-film" && (
                  <div className="relative w-full max-w-sm bg-[#120703] border-2 border-amber-500/40 rounded-xl p-5 sm:p-7 text-center space-y-5 shadow-[0_28px_65px_-10px_rgba(245,158,11,0.4),0_4px_16px_rgba(0,0,0,0.8)] text-[#FFF8F0] rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
                    {/* Sprocket Holes on Left and Right Sides */}
                    <div className="absolute left-2 top-6 bottom-6 flex flex-col justify-between pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-2 h-3.5 rounded-sm bg-black border border-amber-900/50 shadow-inner" />
                      ))}
                    </div>
                    <div className="absolute right-2 top-6 bottom-6 flex flex-col justify-between pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-2 h-3.5 rounded-sm bg-black border border-amber-900/50 shadow-inner" />
                      ))}
                    </div>

                    <div className="px-4 space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono text-amber-400/80 tracking-widest border-b border-amber-500/20 pb-2">
                        <span>KODAK VISION3</span>
                        <span>16MM · FRAME #14</span>
                      </div>
                      <h3 className="text-2xl font-serif font-medium text-white pt-1">Golden Hour Reel</h3>
                    </div>

                    <div className="px-4">
                      {activeApricotRevealed ? (
                        <div className="py-4 px-5 rounded-xl bg-[#28140B]/90 border border-amber-500/40 text-left space-y-2.5 animate-fade-in shadow-inner">
                          <p className="text-xs text-[#FFF8F0]/90 leading-relaxed font-serif italic">
                            {currentProfile.previewQuote}
                          </p>
                          <div className="text-right text-[11px] text-amber-300 font-serif">
                            — {currentProfile.sampleSender}
                          </div>
                          <div className="pt-1 text-center">
                            <button
                              type="button"
                              onClick={() => setActiveApricotRevealed(false)}
                              className="text-[11px] text-amber-300 hover:underline"
                            >
                              Rewind Film
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-3 flex flex-col items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setActiveApricotRevealed(true)}
                            className="w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-[#e76f51] via-[#d45d3e] to-[#28140B] border-2 border-amber-400/70 flex items-center justify-center shadow-[0_6px_20px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                            aria-label="Advance film slide"
                          >
                            <svg className="w-8 h-8 text-[#FFF8F0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <span className="mt-3 text-xs uppercase tracking-wider text-amber-200/90 font-medium font-mono">
                            Tap slide to advance film frame
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-4 pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs text-amber-300/80 font-mono">
                      <span>Tobacco Amber Grain</span>
                      <span>Golden Sunbeams</span>
                    </div>
                  </div>
                )}

                {/* ARTIFACT 5: WILDFLOWER PAPER HANDMADE DECKLED NOTE (Physical Object) */}
                {activeWorldId === "wildflower-paper" && (
                  <div className="relative w-full max-w-sm bg-[#FAF7F0] text-[#1A0311] rounded-2xl border border-amber-800/20 p-6 sm:p-8 text-center space-y-5 shadow-[0_28px_65px_-10px_rgba(180,120,50,0.35),0_2px_10px_rgba(0,0,0,0.1)] rotate-[1.5deg] hover:rotate-0 transition-transform duration-500">
                    {/* Botanical Brass Clip Indicator */}
                    <div className="flex items-center justify-between border-b border-amber-900/15 pb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-700/60" />
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-amber-900/80 font-semibold">
                          300GSM COTTON PRESS
                        </span>
                      </div>
                      <WorldArtifactMark worldId="wildflower-paper" className="w-4 h-5 text-amber-800" />
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="text-3xl font-serif font-medium text-[#1A0311]">Pressed Botanical Note</h3>
                      <p className="text-xs font-serif italic text-amber-900/70">Meadow Florals & Deckled Linen</p>
                    </div>

                    {activeWildflowerRevealed ? (
                      <div className="py-4 px-5 rounded-xl bg-white/90 border border-amber-900/20 text-left space-y-2.5 animate-fade-in shadow-inner">
                        <p className="text-xs text-[#1A0311] leading-relaxed font-serif italic">
                          {currentProfile.previewQuote}
                        </p>
                        <div className="text-right text-[11px] text-amber-900 font-serif">
                          — {currentProfile.sampleSender}
                        </div>
                        <div className="pt-1 text-center">
                          <button
                            type="button"
                            onClick={() => setActiveWildflowerRevealed(false)}
                            className="text-[11px] text-amber-800 hover:underline"
                          >
                            Retie Jute Twine
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-3 flex flex-col items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setActiveWildflowerRevealed(true)}
                          className="w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-[#3D5A46] via-[#2A3E31] to-[#17221A] border-2 border-emerald-400/60 flex items-center justify-center shadow-[0_6px_20px_rgba(42,62,49,0.4)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                          aria-label="Untie botanical twine"
                        >
                          <svg className="w-8 h-8 text-rose-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                          </svg>
                        </button>
                        <span className="mt-3 text-xs uppercase tracking-wider text-emerald-950 font-medium font-mono">
                          Tap to untie dried botanicals
                        </span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-amber-900/15 flex items-center justify-between text-xs text-amber-950/70 font-mono">
                      <span>Pressed Meadow Flora</span>
                      <span>Handmade Cotton Fiber</span>
                    </div>
                  </div>
                )}

                {/* ARTIFACT 6: OCEAN LETTER SEA GLASS BOTTLE SILHOUETTE (Physical Object) */}
                {activeWorldId === "ocean-letter" && (
                  <div className="relative w-full max-w-sm flex flex-col items-center rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
                    {/* Bottle Neck with Natural Cork */}
                    <div className="w-16 h-6 rounded-t-lg bg-[#b08968] border border-amber-800/60 shadow-md flex items-center justify-center">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-amber-950 font-bold">CORK</span>
                    </div>

                    {/* Bottle Body in Sea Glass Cyan */}
                    <div className="w-full bg-gradient-to-b from-[#062038]/95 via-[#031322]/95 to-[#010912]/98 border-2 border-sky-400/40 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-[0_28px_65px_-10px_rgba(59,130,246,0.4),0_4px_20px_rgba(0,0,0,0.8)] text-[#F0F9FF]">
                      <div className="flex items-center justify-between border-b border-sky-400/20 pb-2">
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-sky-300">
                          FROSTED SEA GLASS
                        </span>
                        <WorldArtifactMark worldId="ocean-letter" className="w-5 h-3.5 text-sky-300" />
                      </div>

                      <div className="space-y-0.5">
                        <h3 className="text-3xl font-serif font-medium text-white">Tidal Bottle Message</h3>
                        <p className="text-xs font-serif italic text-sky-200/70">Drifting Across Deep Ocean Waters</p>
                      </div>

                      {activeOceanRevealed ? (
                        <div className="py-4 px-5 rounded-xl bg-[#092238]/90 border border-sky-400/40 text-left space-y-2.5 animate-fade-in shadow-inner">
                          <p className="text-xs text-sky-100 leading-relaxed font-serif italic">
                            {currentProfile.previewQuote}
                          </p>
                          <div className="text-right text-[11px] text-sky-300 font-serif">
                            — {currentProfile.sampleSender}
                          </div>
                          <div className="pt-1 text-center">
                            <button
                              type="button"
                              onClick={() => setActiveOceanRevealed(false)}
                              className="text-[11px] text-sky-300 hover:underline"
                            >
                              Cork Bottle
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-3 flex flex-col items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setActiveOceanRevealed(true)}
                            className="w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#022c44] border-2 border-sky-400/70 flex items-center justify-center shadow-[0_6px_20px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                            aria-label="Uncork ocean bottle"
                          >
                            <svg className="w-8 h-8 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </button>
                          <span className="mt-3 text-xs uppercase tracking-wider text-sky-200/90 font-medium font-mono">
                            Tap to uncork floating bottle
                          </span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-sky-400/20 flex items-center justify-between text-xs text-sky-300/80 font-mono">
                        <span>Deep Oceanic Mist</span>
                        <span>Tidal Parchment</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ========================================================================= */}
      {/* 5. CONTINUOUS CONSTELLATION: COMPLEMENTARY ATMOSPHERES                     */}
      {/* ========================================================================= */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 pb-16 relative z-content">
        <div className="border-t border-white/10 pt-8 pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h2 className="text-xs uppercase font-mono tracking-[0.25em] text-rose-200/80 font-medium">
              The Constellation Index
            </h2>
            <p className="text-xs text-rose-100/60 font-serif italic mt-0.5">
              Six living atmospheres crafted for intimate storytelling
            </p>
          </div>
          <span className="text-[10px] font-mono text-rose-300/70 uppercase tracking-widest">
            Ready to Compose
          </span>
        </div>

        {/* Editorial Directory of Worlds (Pure Typography, Zero Badges or Clunky Buttons) */}
        <div className="divide-y divide-white/[0.08]">
          {ORDERED_WORLD_KEYS.filter((id) => id !== activeWorldId).map((worldKey) => {
            const profile = WORLD_PROFILES[worldKey];

            return (
              <div
                key={worldKey}
                className="group py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:pl-2"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-6 h-6 flex items-center justify-center select-none transition-transform group-hover:scale-110 duration-300 text-rose-300/80">
                    <WorldArtifactMark worldId={worldKey} className="w-5 h-5 text-current" />
                  </span>
                  <div>
                    <h3 className="text-xl font-serif font-normal text-white flex items-baseline gap-2">
                      <span>{profile.name}</span>
                      {profile.jpName && (
                        <span className="text-base text-emerald-300/70 font-light font-serif">
                          {profile.jpName}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs font-serif italic text-rose-200/70">
                      &ldquo;{profile.tagline}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWorldId(worldKey);
                      setActiveKagePreview(false);
                      const lenis = (window as unknown as { __valentinoLenis?: { scrollTo: (target: string | HTMLElement, opts?: { duration?: number; offset?: number }) => void } }).__valentinoLenis;
                      if (lenis && !shouldReduceMotion) {
                        lenis.scrollTo("#showroom-stage", { duration: 0.8, offset: -24 });
                      } else {
                        document.getElementById("showroom-stage")?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
                      }
                    }}
                    className="text-xs font-serif italic text-rose-200/80 hover:text-white transition-colors cursor-pointer"
                  >
                    View Atmosphere →
                  </button>

                  <Link
                    href={`/create?template=${worldKey}`}
                    className="text-xs font-serif italic text-rose-300/70 hover:text-white transition-colors underline-offset-4 hover:underline"
                  >
                    Customize {profile.name} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. IN THE STUDIO · POETIC FUTURE HORIZON                                  */}
      {/* ========================================================================= */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 pb-24 relative z-content">
        <div className="border-t border-white/10 pt-8 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xs uppercase font-mono tracking-[0.25em] text-rose-200/80 font-medium">
              In The Studio
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/40 border border-amber-400/20">
              Future Worlds · Coming Soon
            </span>
          </div>
          <span className="text-xs text-rose-200/60 font-serif italic hidden sm:inline">
            Quietly taking form in our atelier
          </span>
        </div>

        {/* Quiet Editorial Horizon Columns (Unboxed, Pure Typography) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-2">
          {ROADMAP_WORLDS.map((world: RoadmapWorld) => (
            <div key={world.id} className="space-y-2 border-l border-white/10 pl-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-serif font-medium text-white/95">{world.name}</h3>
                <span className="text-[9px] font-mono uppercase tracking-wider text-amber-300/80 bg-amber-950/40 border border-amber-400/20 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs font-serif italic text-amber-200/80">
                &ldquo;{world.tagline}&rdquo;
              </p>
              <p className="text-xs text-rose-100/70 font-light leading-relaxed">
                {world.atmosphere}
              </p>
              <div className="pt-2 text-[10px] text-rose-200/50 font-mono flex items-center justify-between">
                <span>{world.signature}</span>
                <span className="italic">In Atelier</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. IMMERSIVE LIVING SANCTUARY ENVIRONMENT (Zero Modal Box)                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isFullPreviewOpen && (
          <div className="fixed inset-0 z-modal overflow-hidden bg-black/95 backdrop-blur-3xl animate-fade-in flex flex-col justify-between">
            {/* World Atmospheric Bloom filling the entire screen */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 transition-colors duration-1000 blur-3xl scale-125"
              style={{ background: currentProfile.glowColor }}
            />
            {/* Ambient vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />

            {/* Top Bar: Floating directly on atmosphere */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-300/80 block">
                  Immersive Sanctuary Preview
                </span>
                <span className="text-xs font-serif italic text-rose-200/60">
                  Living Atmospheric Environment
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsFullPreviewOpen(false)}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-mono uppercase tracking-wider text-white transition-all cursor-pointer shadow-lg hover:scale-105"
                aria-label="Close sanctuary"
              >
                ✕ Return to Gallery
              </button>
            </header>

            {/* Center Stage: The World's Voice Living in Deep Space */}
            <main className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-12 my-auto text-center space-y-8 animate-fade-in">
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center text-rose-200/90">
                  <WorldArtifactMark worldId={currentProfile.id} className="w-10 h-10" />
                </div>
                <h3 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                  {currentProfile.name}
                </h3>
                {currentProfile.jpName && (
                  <p className="text-2xl text-emerald-300/80 font-serif font-light">
                    {currentProfile.jpName}
                  </p>
                )}
                <p className="text-base sm:text-xl font-serif italic text-rose-200/90 max-w-xl mx-auto">
                  &ldquo;{currentProfile.tagline}&rdquo;
                </p>
              </div>

              {/* The Environmental Quote (Floating free in space, no interior box) */}
              <div className="max-w-2xl mx-auto py-6 sm:py-8 border-y border-white/15">
                <p className="text-lg sm:text-2xl md:text-3xl font-serif text-rose-100 font-light leading-relaxed drop-shadow-md">
                  &ldquo;{currentProfile.previewQuote}&rdquo;
                </p>
                <p className="mt-4 text-xs sm:text-sm text-rose-300 font-mono tracking-wider uppercase">
                  — {currentProfile.sampleSender}
                </p>
              </div>

              <p className="text-xs font-mono uppercase tracking-[0.25em] text-rose-200/50">
                {currentProfile.feeling}
              </p>
            </main>

            {/* Bottom Bar: Action Floating over Atmosphere */}
            <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
              <div className="text-xs text-rose-200/60 font-mono">
                Press <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">ESC</kbd> to return
              </div>

              <AtmosphericButton
                href={`/create?template=${activeWorldId}`}
                worldId={activeWorldId}
                worldName={currentProfile.name}
                label={`Start Creating in ${currentProfile.name} →`}
              />
            </footer>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
