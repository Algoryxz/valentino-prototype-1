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
 * SpatialDiscoveredObjects (Phase 8.8 Hidden Trove Composition & Material Correction):
 * A restrained, believable keepsake still life resting on an intimate writing-desk surface.
 * Removes failed decorative ribbons, isolated petals, and random particles.
 * Establishes coherent directional candlelight, grounded multi-layer contact shadows,
 * balanced object coordinates, and natural atmospheric integration.
 */
export function SpatialDiscoveredObjects() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const deskLightRef = useRef<HTMLDivElement | null>(null);
  const deskSurfaceRef = useRef<HTMLDivElement | null>(null);

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
        gsap.set(deskLightRef.current, { opacity: 1 });
        gsap.set(deskSurfaceRef.current, { opacity: 1 });
        return;
      }

      // 1. Initial posture before scroll reaches section
      gsap.set(headerRef.current, { opacity: 0, y: 14 });
      gsap.set(".spatial-discovered-artifact", { opacity: 0, y: 16, scale: 0.99 });
      gsap.set(deskLightRef.current, { opacity: 0.45, scale: 0.95 });
      gsap.set(deskSurfaceRef.current, { opacity: 0.55 });

      // 2. Coordinated Scroll Scrub Timeline across entrance and settlement
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "top 25%",
          scrub: 0.6,
        },
      });

      // Directional desk candlelight pool gently illuminates
      tl.to(
        deskLightRef.current,
        {
          opacity: 1,
          scale: 1.04,
          duration: 0.5,
          ease: "power1.out",
        },
        0
      );

      // Desk surface presence clarifies smoothly
      tl.to(
        deskSurfaceRef.current,
        {
          opacity: 1,
          duration: 0.5,
          ease: "power1.out",
        },
        0.05
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
        0.08
      );

      // Intimate keepsakes settle naturally onto their resting shadows
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
        0.15
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#12040E] text-[#FAF8F5] pt-28 sm:pt-28 pb-14 sm:pb-18 px-4 sm:px-6 select-none overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 90% 75% at 50% 36%, #28081A 0%, #170410 48%, #0C0208 100%)",
      }}
    >
      {/* Peripheral Botanical Edge Atmosphere */}
      <AmbientBotanicalFrame variant="dusk" density="sparse" intensity={0.2} />

      {/* ========================================================================= */}
      {/* 1. DIRECTIONAL CANDLELIGHT POOL                                           */}
      {/* Soft directional warm light cast from the upper-left across the desk      */}
      {/* ========================================================================= */}
      <div
        ref={deskLightRef}
        className="absolute top-[36%] left-[42%] -translate-x-1/2 -translate-y-1/2 w-[680px] sm:w-[840px] h-[460px] sm:h-[520px] pointer-events-none select-none -z-10 blur-3xl will-change-transform opacity-75"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 38% 38%, rgba(251, 191, 36, 0.16) 0%, rgba(244, 114, 182, 0.09) 45%, transparent 75%)",
        }}
      />

      {/* Editorial Header */}
      <div
        ref={headerRef}
        className="text-center max-w-2xl mx-auto mb-7 sm:mb-9 space-y-2 relative z-10 will-change-transform"
      >
        <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-rose-300/85 font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
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
      <div className="max-w-4xl mx-auto relative z-10 min-h-[390px] sm:min-h-[410px] flex flex-col md:block items-center justify-center gap-7 md:gap-0">
        {/* ======================================================================= */}
        {/* SEAMLESS PHYSICAL DESK SURFACE (Organically feathered into atmosphere)   */}
        {/* No card boundaries, no rounded rectangles, no visible panel edges       */}
        {/* ======================================================================= */}
        <div
          ref={deskSurfaceRef}
          className="absolute -inset-x-12 -inset-y-8 pointer-events-none select-none z-0 will-change-transform"
          aria-hidden="true"
          style={{
            maskImage:
              "radial-gradient(ellipse 65% 55% at 50% 50%, black 15%, rgba(0,0,0,0.7) 45%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 65% 55% at 50% 50%, black 15%, rgba(0,0,0,0.7) 45%, transparent 75%)",
          }}
        >
          {/* Base Polished Dark Rosewood Desk Hue */}
          <div
            className="w-full h-full"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 46% 48%, rgba(68, 16, 42, 0.9) 0%, rgba(42, 9, 26, 0.75) 45%, transparent 80%)",
            }}
          >
            {/* Fine Longitudinal Woodgrain Texture (Organic, no repeating patterns) */}
            <div
              className="absolute inset-0 opacity-[0.11] mix-blend-overlay"
              style={{
                backgroundImage:
                  "linear-gradient(92deg, rgba(255,255,255,0.06) 0%, transparent 4%, rgba(255,255,255,0.04) 9%, transparent 16%, rgba(255,255,255,0.07) 24%, transparent 34%, rgba(255,255,255,0.05) 44%, transparent 54%, rgba(255,255,255,0.08) 64%, transparent 74%, rgba(255,255,255,0.05) 86%, transparent 100%)",
              }}
            />

            {/* Directional Candlelight Pool Sheen (Cast from Upper-Left) */}
            <div
              className="absolute top-[28%] left-[36%] w-[58%] h-[50%] -translate-x-1/2 blur-2xl opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(252, 211, 77, 0.45) 0%, rgba(244, 63, 94, 0.2) 48%, transparent 72%)",
              }}
            />

            {/* Continuous Grounding Shadow Bed Uniting All Three Keepsakes */}
            <div
              className="absolute inset-x-8 bottom-6 h-28 bg-gradient-to-t from-black/75 via-black/40 to-transparent rounded-full blur-2xl pointer-events-none opacity-85"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* OBJECT 01: REAL VELVET WAX-SEALED ENVELOPE (Primary - Left)    */}
        {/* ============================================================== */}
        <div className="spatial-discovered-artifact w-full max-w-[240px] sm:max-w-[280px] md:max-w-[300px] md:absolute md:top-4 md:left-6 lg:left-10 z-20 flex flex-col items-center md:items-start will-change-transform">
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
                  ? "rotate-0 -translate-y-2 drop-shadow-[0_24px_38px_rgba(0,0,0,0.85)]"
                  : "rotate-[-1.5deg] group-hover:rotate-0 group-hover:-translate-y-1.5 drop-shadow-[0_16px_30px_rgba(0,0,0,0.7)]"
              }`}
            >
              {/* Coherent Directional Cast Shadow (Light from upper-left) */}
              <div
                className="absolute bottom-1 left-[10%] w-[84%] h-5 bg-black/70 rounded-full blur-[8px] pointer-events-none -z-10 translate-x-3 translate-y-4"
                aria-hidden="true"
              />
              {/* Tight Ambient Occlusion Contact Line */}
              <div
                className="absolute bottom-2 left-[14%] w-[76%] h-2.5 bg-black/90 rounded-full blur-[2px] pointer-events-none -z-10 translate-x-1.5 translate-y-1.5"
                aria-hidden="true"
              />

              {/* Authentic Deep Burgundy Velvet Envelope with Wax Seal */}
              <Image
                src="/assets/stationery/velvet_envelope.png"
                alt="Burgundy velvet envelope with molten wax seal"
                fill
                sizes="(max-width: 640px) 280px, 320px"
                className="object-contain pointer-events-none select-none"
                priority
                unoptimized
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
          <div className="mt-2.5 ml-3 text-left select-none transform rotate-[-1deg]">
            <span className="font-serif italic text-xs sm:text-[13px] text-rose-200/90 font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              sealed for hard days
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OBJECT 02: REAL FOLDED VELLUM WHISPER NOTE (Secondary - Center)*/}
        {/* ============================================================== */}
        <div className="spatial-discovered-artifact w-full max-w-[220px] sm:max-w-[250px] md:max-w-[270px] md:absolute md:top-20 md:left-[35%] lg:left-[37%] z-20 flex flex-col items-center md:items-start will-change-transform">
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
                  ? "rotate-0 -translate-y-2 drop-shadow-[0_20px_34px_rgba(0,0,0,0.75)]"
                  : "rotate-[1.2deg] group-hover:rotate-0 group-hover:-translate-y-1.5 drop-shadow-[0_14px_26px_rgba(0,0,0,0.6)]"
              }`}
            >
              {/* Coherent Directional Cast Shadow */}
              <div
                className="absolute bottom-3 left-[8%] w-[82%] h-4.5 bg-black/65 rounded-full blur-[7px] pointer-events-none -z-10 translate-x-2.5 translate-y-3"
                aria-hidden="true"
              />
              {/* Tight Ambient Occlusion Contact Line */}
              <div
                className="absolute bottom-4 left-[12%] w-[72%] h-2 bg-black/85 rounded-full blur-[2px] pointer-events-none -z-10 translate-x-1 translate-y-1"
                aria-hidden="true"
              />

              {/* Authentic Folded Origami Vellum Note */}
              <Image
                src="/assets/stationery/folded_whisper.png"
                alt="Origami folded cream cotton vellum note"
                fill
                sizes="(max-width: 640px) 260px, 280px"
                className="object-contain pointer-events-none select-none"
                priority
                unoptimized
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
                <div className="absolute top-[48%] inset-x-3 text-center z-10 pointer-events-none">
                  <span className="font-serif italic text-xs sm:text-[13px] text-[#4A0825] font-semibold tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                    A secret whisper
                  </span>
                </div>
              )}
            </div>
          </button>

          {/* High-Contrast Curator Marginalia */}
          <div className="mt-2.5 ml-4 text-left select-none transform rotate-[1deg]">
            <span className="font-serif italic text-xs sm:text-[13px] text-rose-200/90 font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              guarded by a fold
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OBJECT 03: REAL AGED HAMMERED BRASS KEEPSAKE (Tertiary - Right)*/}
        {/* Positioned on the same physical desk surface as other keepsakes*/}
        {/* ============================================================== */}
        <div className="spatial-discovered-artifact w-full max-w-[180px] sm:max-w-[200px] md:max-w-[210px] md:absolute md:top-20 md:right-8 lg:right-14 z-20 flex flex-col items-center md:items-start will-change-transform">
          <button
            type="button"
            onClick={() => setOpenKeepsake(!openKeepsake)}
            className="group cursor-pointer focus:outline-none transition-transform duration-500 will-change-transform text-center flex flex-col items-center"
            aria-label="Heavy aged hammered brass talisman"
            aria-expanded={openKeepsake}
          >
            <div
              className={`relative w-24 sm:w-28 aspect-square transition-all duration-500 will-change-transform ${
                openKeepsake
                  ? "rotate-6 -translate-y-2 drop-shadow-[0_20px_36px_rgba(0,0,0,0.85)]"
                  : "rotate-[-2deg] group-hover:rotate-0 group-hover:-translate-y-1.5 drop-shadow-[0_15px_28px_rgba(0,0,0,0.7)]"
              }`}
            >
              {/* Coherent Directional Cast Shadow */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-[42%] w-24 h-4 bg-black/70 rounded-full blur-[6px] pointer-events-none -z-10 translate-y-2.5"
                aria-hidden="true"
              />
              {/* Tight Ambient Occlusion Contact Line */}
              <div
                className="absolute bottom-1 left-1/2 -translate-x-[46%] w-16 h-2 bg-black/90 rounded-full blur-[1.5px] pointer-events-none -z-10 translate-y-0.5"
                aria-hidden="true"
              />

              {/* Authentic Heavy Hammered Aged Brass Talisman */}
              <Image
                src="/assets/stationery/brass_talisman.png"
                alt="Aged hand-hammered brass talisman token"
                fill
                sizes="112px"
                className="object-contain pointer-events-none select-none"
                priority
                unoptimized
              />
            </div>

            {/* Revealed Keepsake Slip resting beside the token */}
            {openKeepsake ? (
              <div className="mt-3 py-2 px-3.5 bg-[#FAF3E8] rounded-xs border border-amber-900/30 text-center shadow-[0_8px_20px_rgba(0,0,0,0.4)] animate-fade-in max-w-[210px]">
                <p className="font-serif italic text-xs text-[#2A0802] font-semibold leading-relaxed">
                  “Every morning with you is my favorite thing on earth.”
                </p>
              </div>
            ) : null}
          </button>

          {/* High-Contrast Curator Marginalia */}
          <div className="mt-2.5 ml-2 text-left select-none transform rotate-[-0.8deg]">
            <span className="font-serif italic text-xs sm:text-[13px] text-amber-200/90 font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              turned in the palm
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTEGRATED ATMOSPHERIC NAVIGATION ENDING                               */}
      {/* Tightened deliberate spacing connected directly to the keepsake scene     */}
      {/* ========================================================================= */}
      <div className="w-full text-center pt-8 sm:pt-10 pb-4 relative z-20 flex flex-col items-center">
        <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-rose-300/75 mb-2.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          Six living worlds to hold your words
        </p>
        <Link
          href="/templates"
          className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-serif text-[#FAF5EE] bg-[#1C0512] hover:bg-[#28081B] border border-rose-400/25 hover:border-rose-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-rose-400/50"
        >
          <span>Explore all six atmospheres</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-[#F3A5BC]">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
