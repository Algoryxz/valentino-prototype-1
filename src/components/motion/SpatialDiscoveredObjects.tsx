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
 * SpatialDiscoveredObjects (Phase 8.5 Tabletop Still Life Polish):
 * A grounded tabletop still life on dark mahogany and warm espresso linen.
 * Three intimate keepsakes arranged with coherent perspective, shared directional
 * candlelight, authentic alpha transparency, and tighter editorial grouping.
 */
export function SpatialDiscoveredObjects() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [openEnvelope, setOpenEnvelope] = useState(false);
  const [openWhisper, setOpenWhisper] = useState(false);
  const [openKeepsake, setOpenKeepsake] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Snappy, restrained settling onto tabletop surface (0.5s duration, 0.08s stagger)
      gsap.fromTo(
        ".spatial-discovered-artifact",
        {
          opacity: 0,
          y: 18,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.52,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 78%",
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
      className="relative w-full bg-[#12040E] text-[#FAF8F5] pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 select-none overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #2A091A 0%, #170410 50%, #0E020A 100%)",
      }}
    >
      {/* Peripheral Botanical Edge Atmosphere */}
      <AmbientBotanicalFrame variant="dusk" density="sparse" intensity={0.3} />

      {/* CONTINUOUS DARK MAHOGANY / WARM ESPRESSO TABLETOP TEXTURE */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-25 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 8px)",
        }}
        aria-hidden="true"
      />

      {/* Warm Ambient Tabletop Candlelight Pool */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none select-none -z-10 blur-3xl"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, rgba(225,29,72,0.14) 40%, transparent 70%)",
        }}
      />

      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2 relative z-10">
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
      {/* GROUNDED TABLETOP STILL LIFE: Intimate, cohesive arrangement of 3 keepsakes */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto relative z-10 min-h-[440px] sm:min-h-[460px] flex flex-col md:block items-center justify-center gap-6 md:gap-0 [perspective:1200px]">
        {/* Soft Tabletop Directional Contact Shadow */}
        <div className="absolute inset-x-8 top-12 bottom-8 bg-gradient-to-tr from-black/75 via-rose-950/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        {/* ============================================================== */}
        {/* OBJECT 01: REAL VELVET WAX-SEALED ENVELOPE (Upper-Left)        */}
        {/* ============================================================== */}
        <div className="spatial-discovered-artifact w-full max-w-[240px] sm:max-w-[290px] md:max-w-[310px] md:absolute md:top-4 md:left-6 lg:left-12 z-30 flex flex-col items-center md:items-start">
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
        <div className="spatial-discovered-artifact w-full max-w-[220px] sm:max-w-[260px] md:max-w-[280px] md:absolute md:top-24 md:left-[35%] lg:left-[37%] z-25 flex flex-col items-center md:items-start">
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
        <div className="spatial-discovered-artifact w-full max-w-[180px] sm:max-w-[210px] md:max-w-[220px] md:absolute md:top-6 md:right-8 lg:right-16 z-20 flex flex-col items-center md:items-start">
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
