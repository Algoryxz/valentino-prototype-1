"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmbientBotanicalFrame } from "@/components/motion/AmbientBotanicalFrame";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SpatialStationeryUnfold (Phase 8.2 Authentic Paper Materiality):
 * An authentic scroll-driven physical cotton stationery unfolding sequence.
 *
 * Sequence:
 * 1. Initial State: Compact, folded cotton letter with natural irregular creases and fold shadows.
 * 2. Unfold Sequence: The folded trifold sheet opens smoothly; horizontal crease shadows soften.
 * 3. Settled State: Unfolded deckled cotton sheet settles into its final form with crisp live typography.
 * 4. Resolution: Clean, unencumbered CTA resolves below.
 */
export function SpatialStationeryUnfold() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const letterWrapperRef = useRef<HTMLDivElement | null>(null);
  const foldedLetterRef = useRef<HTMLDivElement | null>(null);
  const unfoldedSheetRef = useRef<HTMLDivElement | null>(null);
  const creaseLinesRef = useRef<HTMLDivElement | null>(null);
  const letterTextRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(foldedLetterRef.current, { opacity: 0 });
        gsap.set(unfoldedSheetRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(creaseLinesRef.current, { opacity: 0.15 });
        gsap.set(letterTextRef.current, { opacity: 1 });
        gsap.set(ctaRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Initial resting posture: visibly folded, creased cotton paper letter
      gsap.set(foldedLetterRef.current, {
        opacity: 1,
        scale: 0.95,
        rotate: -1,
        y: 0,
      });

      gsap.set(unfoldedSheetRef.current, {
        opacity: 0,
        scale: 0.92,
        y: 12,
      });

      gsap.set(creaseLinesRef.current, {
        opacity: 0.85,
      });

      gsap.set(letterTextRef.current, {
        opacity: 0,
      });

      gsap.set(ctaRef.current, {
        opacity: 0,
        y: 12,
      });

      // Master Scroll-Driven Timeline scrubbed against dedicated scroll track
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // 1. Initial Movement: Folded letter unfolds (0.04 -> 0.24)
      tl.to(
        foldedLetterRef.current,
        {
          opacity: 0,
          scale: 1.05,
          ease: "power2.inOut",
          duration: 0.22,
        },
        0.04
      )
      // 2. Unfolded sheet expands & takes stage (0.10 -> 0.36)
      .to(
        unfoldedSheetRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.26,
        },
        0.1
      )
      // 3. Crease lines soften into natural fiber texture (0.22 -> 0.42)
      .to(
        creaseLinesRef.current,
        {
          opacity: 0.25,
          ease: "power1.out",
          duration: 0.2,
        },
        0.22
      )
      // 4. Live authored text reveals with full ink opacity (0.26 -> 0.48)
      .to(
        letterTextRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.22,
        },
        0.26
      )
      // 5. CTA resolves cleanly below settled letter (0.40 -> 0.55)
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.18,
        },
        0.4
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[200vh] sm:h-[190vh]">
      <section
        ref={sectionRef}
        id="how-it-works"
        data-testid="little-things-scene"
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between items-center bg-transparent text-[#240412] pt-28 sm:pt-32 pb-8 sm:pb-10 px-4 select-none overflow-hidden"
      >
      <AmbientBotanicalFrame variant="dusk" density="sparse" intensity={0.25} />

      {/* Editorial Header with ample headroom beneath fixed navigation */}
      <div className="text-center max-w-xl mx-auto space-y-1 relative z-10">
        <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#7A1D45] font-semibold drop-shadow-[0_1px_4px_rgba(255,245,248,0.4)]">
          The Unsealing · Physical Keepsakes
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#1A0311] tracking-tight leading-tight drop-shadow-[0_1px_10px_rgba(255,245,248,0.5)]">
          Made from little things.
        </h2>
        <p className="text-xs sm:text-sm text-[#36091E] font-normal leading-relaxed drop-shadow-[0_1px_8px_rgba(255,245,248,0.5)] max-w-md mx-auto">
          A pressed petal, a fold of deckled cotton, a ticket kept from a rainy Tuesday.
        </p>
      </div>

      {/* PHYSICAL STATIONERY: One cohesive sheet unfolding naturally */}
      <div
        ref={letterWrapperRef}
        className="relative w-full max-w-[320px] sm:max-w-[350px] my-auto flex justify-center [perspective:1400px] will-change-transform z-20"
      >
        {/* Vintage Coffee Ticket tucked naturally into lower left */}
        <div
          className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 z-40 pointer-events-none transform rotate-[-4deg] drop-shadow-[0_6px_14px_rgba(40,10,20,0.25)]"
          aria-hidden="true"
        >
          <div className="w-24 sm:w-28 py-1 px-2.5 bg-[#FAF3E8] rounded-xs border border-amber-900/30 text-left">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono uppercase tracking-widest text-[#7A1D45] font-semibold block">
              FIRST COFFEE
            </span>
            <span className="font-serif italic text-[11px] sm:text-xs text-[#1C0412] font-semibold leading-none block mt-0.5">
              Rainy Tuesday
            </span>
          </div>
        </div>

        {/* 1. INITIAL STATE: Real Folded Deckled Cotton Sheet (Transparent Cutout) */}
        <div
          ref={foldedLetterRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[230px] sm:w-[250px] aspect-[465/685] drop-shadow-[0_16px_32px_rgba(50,10,25,0.25)] will-change-transform z-30 pointer-events-none"
        >
          <Image
            src="/assets/stationery/cotton_paper_folded.png"
            alt="Folded deckled cotton stationery with natural creases"
            fill
            sizes="250px"
            className="object-contain object-center"
            priority
          />
        </div>

        {/* 2. UNFOLDED HERO DECKLED COTTON SHEET (Same Physical Sheet Opened) */}
        <div
          ref={unfoldedSheetRef}
          className="relative w-full aspect-[674/976] drop-shadow-[0_22px_45px_rgba(50,10,25,0.26)] px-7 py-8 sm:px-8 sm:py-9 flex flex-col justify-between will-change-transform"
        >
          {/* Authentic Deckled Paper Background (No rectangular box, organic edges) */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <Image
              src="/assets/stationery/cotton_paper_unfolded.png"
              alt="Handmade deckled edge cotton paper with soft natural creases"
              fill
              sizes="350px"
              className="object-contain object-center"
              priority
            />
          </div>

          {/* Natural Horizontal Fold Crease Accent */}
          <div
            ref={creaseLinesRef}
            className="absolute inset-x-6 top-1/3 bottom-1/3 pointer-events-none z-10 will-change-transform"
            aria-hidden="true"
          >
            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-950/15 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-950/15 to-transparent" />
          </div>

          {/* REAL LIVE HTML EDITORIAL CONTENT: Printed into deckled cotton fibers */}
          <div
            ref={letterTextRef}
            className="relative z-20 flex-1 flex flex-col justify-between text-left will-change-transform pt-1"
          >
            {/* Header Colophon */}
            <div className="flex items-center justify-between border-b border-rose-950/25 pb-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#7A1D45] font-bold">
                Atelier Valentino
              </span>
              <span className="text-[9px] font-mono text-[#58152E] uppercase tracking-widest font-semibold">
                № 01 · Cotton
              </span>
            </div>

            {/* The Main Authored Demonstration Letter */}
            <div className="my-auto py-3 space-y-2">
              <p className="font-serif italic text-sm sm:text-base text-[#1A0311] leading-relaxed font-bold">
                “You are the quiet place my thoughts return to when everything else is loud.”
              </p>
              <p className="font-serif italic text-xs text-[#3D0A1E] leading-relaxed font-medium">
                Some words don&apos;t need an audience. They only need one person to understand them.
              </p>
            </div>

            {/* Footer Colophon */}
            <div className="pt-2 border-t border-rose-950/25 flex items-center justify-between text-[9px] font-mono text-[#7A1D45] uppercase tracking-wider font-semibold">
              <span>Deckled Cotton</span>
              <span>Keep forever</span>
            </div>
          </div>
        </div>
      </div>

      {/* RESOLUTION CTA: Positioned cleanly below stationery */}
      <div
        ref={ctaRef}
        className="text-center z-20 pt-2 will-change-transform"
      >
        <Link
          href="/create"
          className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-serif text-[#FAF5EE] bg-[#1A0512] hover:bg-[#2A091E] border border-[#3E0A28]/40 shadow-[0_4px_16px_rgba(26,5,18,0.25)] hover:shadow-[0_6px_22px_rgba(26,5,18,0.35)] transition-all duration-300"
        >
          <span>Make yours</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-[#F3A5BC]">
            →
          </span>
        </Link>
      </div>
    </section>
  </div>
);
}
