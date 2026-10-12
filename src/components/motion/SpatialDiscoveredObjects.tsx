"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmbientBotanicalFrame } from "@/components/motion/AmbientBotanicalFrame";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SpatialDiscoveredObjects (Phase 8 Editorial Still Life):
 * Three physical keepsakes sharing an authentic, intimate evening tabletop surface:
 * 1. Deep Burgundy Velvet Envelope with molten wax seal (opens to secret letter).
 * 2. Folded Cream Vellum Whisper Note (unfolds to private memory).
 * 3. Heavy Hammered Antique Brass Keepsake (turns to revealed engraving).
 *
 * Grounded on a shared dark evening surface to eliminate background bleed and provide
 * a cohesive bridge between the worlds and the finale.
 */
export function SpatialDiscoveredObjects() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Interactive reveal states for each keepsake
  const [openEnvelope, setOpenEnvelope] = useState(false);
  const [openWhisper, setOpenWhisper] = useState(false);
  const [openKeepsake, setOpenKeepsake] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".spatial-discovered-artifact");
      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 35,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gradient-to-b from-[#05111c] via-[#15040e] to-[#1c0514] text-[#FAF8F5] py-20 sm:py-28 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* Peripheral Botanical Edge Atmosphere */}
      <AmbientBotanicalFrame variant="dusk" density="subtle" intensity={0.35} />

      {/* Floating subtle ambient starlight particles */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        <svg viewBox="0 0 1200 600" fill="none" className="w-full h-full opacity-25">
          <circle cx="300" cy="180" r="1.5" fill="#FAF5EE" fillOpacity="0.5" />
          <circle cx="850" cy="380" r="1.2" fill="#FAF5EE" fillOpacity="0.4" />
          <circle cx="580" cy="120" r="1.8" fill="#F472B6" fillOpacity="0.3" />
        </svg>
      </div>

      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2 relative z-10">
        <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-rose-300 font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          The Hidden Trove
        </p>
        <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#FFF5F8] tracking-tight leading-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
          And some become the things we never throw away.
        </h2>
        <p className="text-xs sm:text-base text-rose-100/80 font-normal leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
          Love lives in folded notes, private questions, and unhurried mornings.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SHARED TABLETOP SURFACE: Asymmetric editorial constellation of keepsakes */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto relative z-10 min-h-[440px] sm:min-h-[480px] flex flex-col md:block items-center justify-center gap-6 md:gap-0 [perspective:1200px]">
        {/* Soft Tabletop Shadow / Woodgrain Silhouette */}
        <div className="absolute inset-x-2 sm:inset-x-4 top-1/6 bottom-1/8 bg-gradient-to-tr from-black/40 via-transparent to-rose-950/20 rounded-3xl blur-2xl pointer-events-none -z-10" />

        {/* ============================================================== */}
        {/* OBJECT 01: REAL VELVET WAX-SEALED ENVELOPE (Upper-Left)        */}
        {/* ============================================================== */}
        <div className="spatial-discovered-artifact w-full max-w-[210px] sm:max-w-[270px] md:max-w-[280px] md:absolute md:top-4 md:left-4 lg:left-10 z-30 flex flex-col items-center md:items-start">
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
                  ? "rotate-0 -translate-y-2.5 drop-shadow-[0_26px_40px_rgba(0,0,0,0.8)]"
                  : "rotate-[-2.5deg] group-hover:rotate-0 group-hover:-translate-y-1.5 drop-shadow-[0_18px_32px_rgba(0,0,0,0.65)]"
              }`}
            >
              {/* Authentic Deep Burgundy Velvet Envelope with Wax Seal */}
              <Image
                src="/assets/stationery/velvet_envelope.png"
                alt="Burgundy velvet envelope with wax seal"
                fill
                sizes="(max-width: 640px) 270px, 290px"
                className="object-contain pointer-events-none select-none"
                priority
                unoptimized
              />

              {/* Revealed Secret Letter / Cue */}
              {openEnvelope ? (
                <div className="absolute inset-x-4 bottom-4 top-10 bg-[#FFFDF9] text-[#2C0718] p-4 rounded-xs shadow-[0_12px_28px_rgba(0,0,0,0.6)] border border-rose-300/40 flex flex-col justify-center items-center text-center animate-fade-in z-20">
                  <p className="font-serif italic text-xs sm:text-[13px] text-[#1A0311] leading-relaxed font-medium">
                    “Close your eyes. Take a breath. I am right here with you.”
                  </p>
                  <span className="mt-2 text-[9px] font-mono tracking-widest text-[#881337]/70 uppercase">
                    — yours, always
                  </span>
                </div>
              ) : (
                <div className="absolute bottom-4 inset-x-3 text-center z-10 pointer-events-none">
                  <span className="font-serif italic text-xs sm:text-[13px] text-rose-100 font-medium tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    Open when you miss me
                  </span>
                </div>
              )}
            </div>
          </button>

          {/* Penciled Curator Marginalia */}
          <div className="mt-2.5 ml-2 text-left select-none transform rotate-[-1.5deg]">
            <span className="font-serif italic text-xs text-rose-200/70 tracking-wide drop-shadow-xs">
              sealed for hard days
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OBJECT 02: REAL FOLDED VELLUM WHISPER NOTE (Lower-Center)      */}
        {/* ============================================================== */}
        <div className="spatial-discovered-artifact w-full max-w-[200px] sm:max-w-[250px] md:max-w-[270px] md:absolute md:top-28 md:left-[36%] lg:left-[38%] z-25 flex flex-col items-center md:items-start">
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
                  ? "rotate-0 -translate-y-2.5 drop-shadow-[0_22px_36px_rgba(0,0,0,0.7)]"
                  : "rotate-[2deg] group-hover:rotate-0 group-hover:-translate-y-1.5 drop-shadow-[0_16px_28px_rgba(0,0,0,0.55)]"
              }`}
            >
              {/* Authentic Folded Origami Vellum Note */}
              <Image
                src="/assets/stationery/folded_whisper.png"
                alt="Origami folded cream vellum note"
                fill
                sizes="(max-width: 640px) 260px, 280px"
                className="object-contain pointer-events-none select-none"
                priority
                unoptimized
              />

              {/* Content or Revealed Secret */}
              {openWhisper ? (
                <div className="absolute inset-x-4 inset-y-6 bg-[#FFFDF9]/95 text-[#2A051A] p-4 rounded-xs shadow-[0_10px_24px_rgba(0,0,0,0.5)] border border-amber-900/20 flex flex-col justify-center items-center text-center animate-fade-in z-20">
                  <p className="font-serif italic text-xs sm:text-[13px] text-[#881337] font-medium leading-relaxed">
                    “Where did we share our very first secret?”
                  </p>
                  <span className="mt-2 text-[9px] font-mono tracking-widest text-[#7A1D45]/70 uppercase">
                    tap to fold
                  </span>
                </div>
              ) : (
                <div className="absolute bottom-3 inset-x-2 text-center z-10 pointer-events-none">
                  <span className="font-serif italic text-[11px] sm:text-xs text-[#2A051A]/85 font-medium tracking-wide drop-shadow-xs">
                    A secret whisper
                  </span>
                </div>
              )}
            </div>
          </button>

          {/* Penciled Curator Marginalia */}
          <div className="mt-2.5 ml-4 sm:ml-6 text-left select-none transform rotate-[1.8deg]">
            <span className="font-serif italic text-xs text-rose-200/70 tracking-wide drop-shadow-xs">
              guarded by a fold
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OBJECT 03: REAL AGED HAMMERED BRASS KEEPSAKE (Upper-Right)     */}
        {/* ============================================================== */}
        <div className="spatial-discovered-artifact w-full max-w-[200px] sm:max-w-[240px] md:absolute md:top-2 md:right-2 lg:right-6 z-20 flex flex-col items-center md:items-start">
          <button
            type="button"
            onClick={() => setOpenKeepsake(!openKeepsake)}
            className="group cursor-pointer focus:outline-none transition-transform duration-500 will-change-transform text-center flex flex-col items-center"
            aria-label="Heavy aged hammered brass talisman"
            aria-expanded={openKeepsake}
          >
            <div
              className={`relative w-24 sm:w-28 md:w-32 aspect-square rounded-full transition-all duration-500 will-change-transform ${
                openKeepsake
                  ? "rotate-12 -translate-y-2 drop-shadow-[0_24px_42px_rgba(0,0,0,0.85)]"
                  : "rotate-[-3deg] group-hover:rotate-0 group-hover:-translate-y-1.5 drop-shadow-[0_16px_30px_rgba(0,0,0,0.7)]"
              }`}
            >
              {/* Authentic Heavy Hammered Aged Brass Talisman */}
              <Image
                src="/assets/stationery/brass_talisman.png"
                alt="Aged hand-hammered brass talisman"
                fill
                sizes="128px"
                className="object-contain pointer-events-none select-none"
                priority
                unoptimized
              />
            </div>

            {/* Revealed Keepsake Slip resting beside the token */}
            {openKeepsake ? (
              <div className="mt-3 py-2 px-3.5 bg-[#FAF3E8] rounded-xs border border-amber-900/30 text-center shadow-[0_8px_20px_rgba(0,0,0,0.4)] animate-fade-in max-w-[220px]">
                <p className="font-serif italic text-xs text-[#2A0802] font-medium leading-relaxed">
                  “Every morning with you is my favorite thing on earth.”
                </p>
              </div>
            ) : null}
          </button>

          {/* Penciled Curator Marginalia */}
          <div className="mt-2.5 ml-3 sm:ml-5 text-left select-none transform rotate-[-0.8deg]">
            <span className="font-serif italic text-xs text-rose-200/70 tracking-wide drop-shadow-xs">
              turned in the palm
            </span>
          </div>
        </div>
      </div>

      {/* Understated Showroom Full Catalog Link */}
      <div className="w-full text-center pt-16 sm:pt-20 pb-4 relative z-20">
        <Link
          href="/templates"
          className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-mono uppercase tracking-widest bg-rose-950/40 hover:bg-rose-900/60 border border-rose-400/40 text-rose-100 hover:text-white font-medium shadow-[0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
        >
          <span>Explore all six atmospheres</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
