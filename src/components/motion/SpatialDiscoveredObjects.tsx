"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmbientBotanicalFrame } from "@/components/motion/AmbientBotanicalFrame";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SpatialDiscoveredObjects (Phase 8.7 Hidden Trove Spatial Enhancement):
 * A grounded, cinematic 3D tabletop environment on dark aged mahogany and warm espresso linen.
 * Features coherent directional candlelight, deep multi-layered contact shadows,
 * a continuous delicate satin ribbon threading the keepsakes, and subtle candlelight embers.
 * Fully integrated with bidirectional scroll scrubbing.
 */
export function SpatialDiscoveredObjects() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const candlelightRef = useRef<HTMLDivElement | null>(null);
  const tabletopRef = useRef<HTMLDivElement | null>(null);
  const ribbonPathRef = useRef<SVGPathElement | null>(null);
  const ribbonShadowRef = useRef<SVGPathElement | null>(null);
  const ribbonHighlightRef = useRef<SVGPathElement | null>(null);
  const petalRef = useRef<HTMLDivElement | null>(null);

  const [openEnvelope, setOpenEnvelope] = useState(false);
  const [openWhisper, setOpenWhisper] = useState(false);
  const [openKeepsake, setOpenKeepsake] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(headerRef.current, { opacity: 1, y: 0 });
        gsap.set(".spatial-discovered-artifact", { opacity: 1, y: 0, scale: 1 });
        gsap.set(".spatial-particle", { opacity: 0.6 });
        gsap.set([ribbonPathRef.current, ribbonShadowRef.current, ribbonHighlightRef.current], {
          strokeDashoffset: 0,
        });
        gsap.set(candlelightRef.current, { opacity: 1, scale: 1 });
        gsap.set(petalRef.current, { opacity: 0.7, scale: 1 });
        return;
      }

      // 1. Initial posture before scroll reaches section
      gsap.set(headerRef.current, { opacity: 0, y: 16 });
      gsap.set(".spatial-discovered-artifact", { opacity: 0, y: 20, scale: 0.98 });
      gsap.set(".spatial-particle", { opacity: 0 });
      gsap.set([ribbonPathRef.current, ribbonShadowRef.current, ribbonHighlightRef.current], {
        strokeDashoffset: 1450,
      });
      gsap.set(candlelightRef.current, { opacity: 0.45, scale: 0.92 });
      gsap.set(petalRef.current, { opacity: 0, scale: 0.85 });

      // 2. Coordinated Scroll Scrub Timeline across entrance and settlement
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "top 22%",
          scrub: 0.65,
        },
      });

      // Directional Candlelight pool warms up
      tl.to(
        candlelightRef.current,
        {
          opacity: 1,
          scale: 1.06,
          duration: 0.5,
          ease: "power1.out",
        },
        0
      );

      // Editorial Header gently clarifies
      tl.to(
        headerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        0.05
      );

      // Continuous Satin Ribbon draws smoothly through the keepsakes
      tl.to(
        [ribbonShadowRef.current, ribbonPathRef.current, ribbonHighlightRef.current],
        {
          strokeDashoffset: 0,
          duration: 0.75,
          ease: "power2.inOut",
        },
        0.1
      );

      // Intimate keepsakes settle gently onto their contact shadows
      tl.to(
        ".spatial-discovered-artifact",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
        },
        0.18
      );

      // Gentle parallax on warm candlelight particles
      tl.to(
        ".spatial-particle-slow",
        {
          opacity: 0.7,
          y: -18,
          duration: 0.8,
          ease: "none",
        },
        0.12
      );

      tl.to(
        ".spatial-particle-fast",
        {
          opacity: 0.55,
          y: -32,
          duration: 0.8,
          ease: "none",
        },
        0.12
      );

      // Subordinate pressed rose petal settles on tabletop
      tl.to(
        petalRef.current,
        {
          opacity: 0.75,
          scale: 1,
          duration: 0.4,
          ease: "power1.out",
        },
        0.3
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#12040E] text-[#FAF8F5] pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 select-none overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 38%, #2A091A 0%, #170410 50%, #0E020A 100%)",
      }}
    >
      {/* Peripheral Botanical Edge Atmosphere */}
      <AmbientBotanicalFrame variant="dusk" density="sparse" intensity={0.25} />

      {/* ========================================================================= */}
      {/* 1. 3D SPATIAL TABLETOP DEPTH PLANE & DIRECTIONAL LIGHTING                 */}
      {/* ========================================================================= */}
      <div
        ref={tabletopRef}
        className="absolute inset-x-0 bottom-0 top-16 pointer-events-none select-none -z-10 [perspective:1000px] overflow-hidden"
        aria-hidden="true"
      >
        {/* Angled dark mahogany & warm espresso linen tabletop surface */}
        <div
          className="absolute inset-x-[-15%] bottom-[-25%] h-[135%] origin-bottom [transform:rotateX(50deg)]"
          style={{
            background:
              "linear-gradient(to top, rgba(16, 2, 12, 0.98) 0%, rgba(38, 8, 26, 0.76) 42%, rgba(18, 3, 14, 0.95) 100%)",
            boxShadow: "inset 0 120px 140px -40px rgba(0,0,0,0.9)",
          }}
        >
          {/* Subtle natural woodgrain & woven fiber texture overlay */}
          <div
            className="absolute inset-0 opacity-15 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
            }}
          />

          {/* Candlelight specular sheen pool reflecting softly off polished surface */}
          <div
            className="absolute top-1/4 left-1/3 w-[55%] h-[45%] -translate-x-1/2 blur-3xl opacity-25 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(254, 215, 170, 0.3) 0%, rgba(225, 29, 72, 0.15) 50%, transparent 75%)",
            }}
          />
        </div>
      </div>

      {/* Warm Ambient Tabletop Candlelight Glow Pool */}
      <div
        ref={candlelightRef}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] pointer-events-none select-none -z-10 blur-3xl will-change-transform opacity-70"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse, rgba(251, 191, 36, 0.14) 0%, rgba(225, 29, 72, 0.14) 42%, transparent 70%)",
        }}
      />

      {/* Editorial Header */}
      <div
        ref={headerRef}
        className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2 relative z-10 will-change-transform"
      >
        <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-rose-300/90 font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          The Hidden Trove
        </p>
        <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#FFF5F8] tracking-tight leading-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
          And some become the things we never throw away.
        </h2>
        <p className="text-xs sm:text-base text-rose-100/90 font-normal leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
          Love lives in folded notes, private questions, and unhurried mornings.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. GROUNDED TABLETOP STILL LIFE: Intimate arrangement of 3 keepsakes       */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto relative z-10 min-h-[440px] sm:min-h-[460px] flex flex-col md:block items-center justify-center gap-6 md:gap-0 [perspective:1200px]">
        {/* Soft Tabletop Directional Ambient Occlusion */}
        <div
          className="absolute inset-x-8 top-12 bottom-8 bg-gradient-to-tr from-black/75 via-rose-950/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* ======================================================================= */}
        {/* 3. CONTINUOUS DELICATE SATIN RIBBON (Threads strictly behind keepsakes)  */}
        {/* ======================================================================= */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-visible"
          viewBox="0 0 1000 480"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Satin ribbon rich velvet-to-silk gradient */}
            <linearGradient id="satin-ribbon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BE123C" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#9F1239" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#E11D48" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#881337" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4C0519" stopOpacity="0.85" />
            </linearGradient>

            {/* Specular crest highlight on silk edge */}
            <linearGradient id="satin-crest-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FECDD3" stopOpacity="0.75" />
              <stop offset="35%" stopColor="#FDE68A" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#FDA4AF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FECDD3" stopOpacity="0.45" />
            </linearGradient>

            {/* Drop shadow filter for ribbon onto tabletop surface */}
            <filter id="ribbon-blur-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* Ribbon Physical Contact Shadow on Tabletop Surface */}
          <path
            ref={ribbonShadowRef}
            d="M 30,40 C 120,80 210,155 310,140 C 410,120 480,165 570,150 C 660,135 750,95 840,120 C 910,140 940,200 965,270"
            fill="none"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1450"
            strokeDashoffset="1450"
            filter="url(#ribbon-blur-shadow)"
            transform="translate(3, 8)"
          />

          {/* Ribbon Silken Body */}
          <path
            ref={ribbonPathRef}
            d="M 30,40 C 120,80 210,155 310,140 C 410,120 480,165 570,150 C 660,135 750,95 840,120 C 910,140 940,200 965,270"
            fill="none"
            stroke="url(#satin-ribbon-gradient)"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1450"
            strokeDashoffset="1450"
          />

          {/* Delicate Specular Silk Highlight along Ribbon Crest */}
          <path
            ref={ribbonHighlightRef}
            d="M 30,40 C 120,80 210,155 310,140 C 410,120 480,165 570,150 C 660,135 750,95 840,120 C 910,140 940,200 965,270"
            fill="none"
            stroke="url(#satin-crest-highlight)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1450"
            strokeDashoffset="1450"
          />
        </svg>

        {/* ======================================================================= */}
        {/* 4. MINIMAL SUPPORTING DETAILS: Candlelight Embers & Pressed Petal        */}
        {/* ======================================================================= */}
        {/* Candlelight Dust Motes / Warm Embers at distinct depths */}
        <div
          className="spatial-particle spatial-particle-slow absolute top-[22%] left-[16%] w-1.5 h-1.5 rounded-full bg-amber-300/60 blur-[0.5px] pointer-events-none -z-5"
          aria-hidden="true"
        />
        <div
          className="spatial-particle spatial-particle-fast absolute top-[48%] left-[26%] w-1 h-1 rounded-full bg-rose-300/50 blur-[0.4px] pointer-events-none -z-5"
          aria-hidden="true"
        />
        <div
          className="spatial-particle spatial-particle-slow absolute top-[32%] left-[54%] w-1.5 h-1.5 rounded-full bg-amber-200/70 blur-[0.5px] pointer-events-none -z-5"
          aria-hidden="true"
        />
        <div
          className="spatial-particle spatial-particle-fast absolute top-[58%] left-[66%] w-1 h-1 rounded-full bg-rose-400/55 blur-[0.4px] pointer-events-none -z-5"
          aria-hidden="true"
        />
        <div
          className="spatial-particle spatial-particle-slow absolute top-[18%] left-[84%] w-1.5 h-1.5 rounded-full bg-amber-300/65 blur-[0.5px] pointer-events-none -z-5"
          aria-hidden="true"
        />
        <div
          className="spatial-particle spatial-particle-fast absolute top-[68%] left-[40%] w-1 h-1 rounded-full bg-rose-200/50 blur-[0.4px] pointer-events-none -z-5"
          aria-hidden="true"
        />

        {/* Subordinate Tiny Pressed Botanical Petal on Tabletop Surface */}
        <div
          ref={petalRef}
          className="absolute bottom-6 left-[18%] md:left-[22%] pointer-events-none select-none z-10 transform rotate-[-16deg] opacity-70 will-change-transform"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 28" className="w-5 h-6 text-[#881337] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
            <path
              d="M12 2 C16 6, 22 14, 18 22 C14 28, 8 26, 5 20 C2 14, 8 6, 12 2 Z"
              fill="#9F1239"
              fillOpacity="0.85"
              stroke="#BE123C"
              strokeWidth="0.8"
            />
          </svg>
        </div>

        {/* ============================================================== */}
        {/* OBJECT 01: REAL VELVET WAX-SEALED ENVELOPE (Upper-Left)        */}
        {/* ============================================================== */}
        <div className="spatial-discovered-artifact w-full max-w-[240px] sm:max-w-[290px] md:max-w-[310px] md:absolute md:top-4 md:left-6 lg:left-12 z-30 flex flex-col items-center md:items-start will-change-transform">
          <button
            type="button"
            onClick={() => setOpenEnvelope(!openEnvelope)}
            className="group cursor-pointer focus:outline-none transition-transform duration-500 will-change-transform text-left w-full"
            aria-label="Folded velvet envelope with wax seal"
            aria-expanded={openEnvelope}
          >
            <div
              className={`relative w-full aspect-[4/3] rounded-xs transition-all duration-500 will-change-transform ${
                openEnvelope
                  ? "rotate-0 -translate-y-2 drop-shadow-[0_26px_40px_rgba(0,0,0,0.9)]"
                  : "rotate-[-1.5deg] group-hover:rotate-0 group-hover:-translate-y-1.5 drop-shadow-[0_20px_35px_rgba(0,0,0,0.75)]"
              }`}
            >
              {/* Natural Physical Contact Shadows on Tabletop Surface */}
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[84%] h-4 bg-black/75 rounded-full blur-[4px] pointer-events-none -z-10 translate-y-1"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[98%] h-8 bg-black/40 rounded-full blur-[10px] pointer-events-none -z-10 translate-y-2"
                aria-hidden="true"
              />

              {/* Authentic Deep Burgundy Velvet Envelope with Wax Seal (Real Alpha Cutout) */}
              <Image
                src="/assets/stationery/velvet_envelope.png"
                alt="Burgundy velvet envelope with molten wax seal"
                fill
                sizes="(max-width: 640px) 280px, 320px"
                className="object-contain pointer-events-none select-none"
                priority
              />

              {/* Revealed Secret Letter / Cue */}
              {openEnvelope ? (
                <div className="absolute inset-x-4 bottom-4 top-10 bg-[#FFFDF9] text-[#2C0718] p-4 rounded-xs shadow-[0_12px_28px_rgba(0,0,0,0.7)] border border-rose-300/40 flex flex-col justify-center items-center text-center animate-fade-in z-20">
                  <p className="font-serif italic text-xs sm:text-[13px] text-[#1A0311] leading-relaxed font-semibold">
                    “Close your eyes. Take a breath. I am right here with you.”
                  </p>
                  <span className="mt-2 text-[9px] font-mono tracking-widest text-[#881337] uppercase font-bold">
                    — yours, always
                  </span>
                </div>
              ) : (
                <div className="absolute bottom-4 inset-x-3 text-center z-10 pointer-events-none">
                  <span className="font-serif italic text-xs sm:text-[13px] text-rose-100 font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    Open when you miss me
                  </span>
                </div>
              )}
            </div>
          </button>

          {/* High-Contrast Curator Marginalia */}
          <div className="mt-2 ml-3 text-left select-none transform rotate-[-1deg]">
            <span className="font-serif italic text-xs sm:text-[13px] text-rose-200 font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              sealed for hard days
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OBJECT 02: REAL FOLDED VELLUM WHISPER NOTE (Lower-Center)      */}
        {/* ============================================================== */}
        <div className="spatial-discovered-artifact w-full max-w-[220px] sm:max-w-[260px] md:max-w-[280px] md:absolute md:top-24 md:left-[35%] lg:left-[37%] z-20 flex flex-col items-center md:items-start will-change-transform">
          <button
            type="button"
            onClick={() => setOpenWhisper(!openWhisper)}
            className="group cursor-pointer focus:outline-none transition-transform duration-500 will-change-transform text-left w-full"
            aria-label="Origami folded secret whisper note"
            aria-expanded={openWhisper}
          >
            <div
              className={`relative w-full aspect-[4/3] rounded-xs transition-all duration-500 will-change-transform ${
                openWhisper
                  ? "rotate-0 -translate-y-2 drop-shadow-[0_22px_36px_rgba(0,0,0,0.8)]"
                  : "rotate-[1.2deg] group-hover:rotate-0 group-hover:-translate-y-1.5 drop-shadow-[0_18px_30px_rgba(0,0,0,0.65)]"
              }`}
            >
              {/* Natural Physical Contact Shadows on Tabletop Surface */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[76%] h-3.5 bg-black/75 rounded-full blur-[4px] pointer-events-none -z-10 translate-y-1"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-6 bg-black/35 rounded-full blur-[8px] pointer-events-none -z-10 translate-y-1"
                aria-hidden="true"
              />

              {/* Authentic Folded Origami Vellum Note (Real Alpha Cutout) */}
              <Image
                src="/assets/stationery/folded_whisper.png"
                alt="Origami folded cream cotton vellum note"
                fill
                sizes="(max-width: 640px) 260px, 280px"
                className="object-contain pointer-events-none select-none"
                priority
              />

              {/* Revealed Secret Whisper */}
              {openWhisper ? (
                <div className="absolute inset-x-4 inset-y-6 bg-[#FFFDF9]/95 text-[#2A051A] p-4 rounded-xs shadow-[0_10px_24px_rgba(0,0,0,0.5)] border border-amber-900/20 flex flex-col justify-center items-center text-center animate-fade-in z-20">
                  <p className="font-serif italic text-xs sm:text-[13px] text-[#881337] font-semibold leading-relaxed">
                    “Where did we share our very first secret?”
                  </p>
                  <span className="mt-2 text-[9px] font-mono tracking-widest text-[#7A1D45] uppercase font-bold">
                    tap to fold
                  </span>
                </div>
              ) : (
                <div className="absolute bottom-3 inset-x-2 text-center z-10 pointer-events-none">
                  <span className="font-serif italic text-[11px] sm:text-xs text-[#1C0412] font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
                    A secret whisper
                  </span>
                </div>
              )}
            </div>
          </button>

          {/* High-Contrast Curator Marginalia */}
          <div className="mt-2 ml-4 text-left select-none transform rotate-[1deg]">
            <span className="font-serif italic text-xs sm:text-[13px] text-rose-200 font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              guarded by a fold
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OBJECT 03: REAL AGED HAMMERED BRASS KEEPSAKE (Upper-Right)     */}
        {/* ============================================================== */}
        <div className="spatial-discovered-artifact w-full max-w-[180px] sm:max-w-[210px] md:max-w-[220px] md:absolute md:top-6 md:right-8 lg:right-16 z-20 flex flex-col items-center md:items-start will-change-transform">
          <button
            type="button"
            onClick={() => setOpenKeepsake(!openKeepsake)}
            className="group cursor-pointer focus:outline-none transition-transform duration-500 will-change-transform text-center flex flex-col items-center"
            aria-label="Heavy aged hammered brass talisman"
            aria-expanded={openKeepsake}
          >
            <div
              className={`relative w-24 sm:w-28 md:w-32 aspect-square transition-all duration-500 will-change-transform ${
                openKeepsake
                  ? "rotate-6 -translate-y-2 drop-shadow-[0_24px_42px_rgba(0,0,0,0.9)]"
                  : "rotate-[-2deg] group-hover:rotate-0 group-hover:-translate-y-1.5 drop-shadow-[0_18px_32px_rgba(0,0,0,0.75)]"
              }`}
            >
              {/* Natural Physical Contact Shadows on Tabletop Surface */}
              <div
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-black/85 rounded-full blur-[3px] pointer-events-none -z-10 translate-y-1"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-950/35 rounded-full blur-[8px] pointer-events-none -z-10 translate-y-1"
                aria-hidden="true"
              />

              {/* Authentic Heavy Hammered Aged Brass Talisman (Real Alpha Cutout) */}
              <Image
                src="/assets/stationery/brass_talisman.png"
                alt="Aged hand-hammered brass talisman token"
                fill
                sizes="128px"
                className="object-contain pointer-events-none select-none"
                priority
              />
            </div>

            {/* Revealed Keepsake Slip resting beside the token */}
            {openKeepsake ? (
              <div className="mt-3 py-2 px-3.5 bg-[#FAF3E8] rounded-xs border border-amber-900/30 text-center shadow-[0_8px_20px_rgba(0,0,0,0.4)] animate-fade-in max-w-[220px]">
                <p className="font-serif italic text-xs text-[#2A0802] font-semibold leading-relaxed">
                  “Every morning with you is my favorite thing on earth.”
                </p>
              </div>
            ) : null}
          </button>

          {/* High-Contrast Curator Marginalia */}
          <div className="mt-2 ml-2 text-left select-none transform rotate-[-0.8deg]">
            <span className="font-serif italic text-xs sm:text-[13px] text-amber-200/90 font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              turned in the palm
            </span>
          </div>
        </div>
      </div>

      {/* Integrated Atmospheric Navigation Ending */}
      <div className="w-full text-center pt-8 sm:pt-10 pb-2 relative z-20 flex flex-col items-center">
        <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-rose-300/80 mb-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          Six living worlds to hold your words
        </p>
        <Link
          href="/templates"
          className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-serif text-[#FAF5EE] bg-[#220616] hover:bg-[#2F081E] border border-rose-500/35 hover:border-rose-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5"
        >
          <span>Explore all six atmospheres</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-[#F3A5BC]">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
