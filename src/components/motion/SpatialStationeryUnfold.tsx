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
  const topFlapRef = useRef<HTMLDivElement | null>(null);
  const bottomFlapRef = useRef<HTMLDivElement | null>(null);
  const topShadowRef = useRef<HTMLDivElement | null>(null);
  const bottomShadowRef = useRef<HTMLDivElement | null>(null);
  const origamiBundleRef = useRef<HTMLDivElement | null>(null);
  const unfoldedSheetRef = useRef<HTMLDivElement | null>(null);
  const creaseLinesRef = useRef<HTMLDivElement | null>(null);
  const letterTextRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const ticketRef = useRef<HTMLDivElement | null>(null);
  const transitionBridgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(origamiBundleRef.current, { opacity: 0 });
        gsap.set(unfoldedSheetRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(creaseLinesRef.current, { opacity: 0.15 });
        gsap.set(letterTextRef.current, { opacity: 1 });
        gsap.set(ctaRef.current, { opacity: 1, y: 0 });
        gsap.set(ticketRef.current, { x: 0, y: 0, opacity: 1 });
        return;
      }

      // Initial resting posture: The same physical deckled cotton sheet folded into a compact trifold bundle
      gsap.set(topFlapRef.current, {
        rotateX: -168,
        rotateZ: -2,
        transformOrigin: "bottom center",
        transformStyle: "preserve-3d",
      });

      gsap.set(bottomFlapRef.current, {
        rotateX: 164,
        rotateZ: 1.5,
        transformOrigin: "top center",
        transformStyle: "preserve-3d",
      });

      gsap.set(topShadowRef.current, {
        opacity: 0.9,
      });

      gsap.set(bottomShadowRef.current, {
        opacity: 0.8,
      });

      // Ticket physically tucked beneath lower-left crease of folded bundle with deliberate overlap
      gsap.set(ticketRef.current, {
        x: 0,
        y: -142,
        rotate: -5,
        opacity: 1,
      });

      gsap.set(origamiBundleRef.current, {
        opacity: 1,
        scale: 0.96,
        rotate: -1,
      });

      // The base sheet is completely hidden initially so the viewer only sees the folded bundle
      gsap.set(unfoldedSheetRef.current, {
        opacity: 0,
        scale: 0.96,
        y: 6,
      });

      gsap.set(letterTextRef.current, {
        opacity: 0,
      });

      gsap.set(creaseLinesRef.current, {
        opacity: 0.85,
      });

      gsap.set(ctaRef.current, {
        opacity: 0,
        y: 12,
      });

      gsap.set(transitionBridgeRef.current, {
        opacity: 0,
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

      // 1. Top flap lifts and physically unfolds in 3D (0.04 -> 0.30)
      tl.to(
        topFlapRef.current,
        {
          rotateX: 0,
          rotateZ: 0,
          ease: "power2.inOut",
          duration: 0.26,
        },
        0.04
      )
      // 2. Bottom flap unfolds down in 3D (0.06 -> 0.30)
      .to(
        bottomFlapRef.current,
        {
          rotateX: 0,
          rotateZ: 0,
          ease: "power2.inOut",
          duration: 0.24,
        },
        0.06
      )
      // 3. Dynamic cast shadows soften as flaps flatten out (0.06 -> 0.28)
      .to(
        [topShadowRef.current, bottomShadowRef.current],
        {
          opacity: 0,
          ease: "power1.out",
          duration: 0.22,
        },
        0.06
      )
      // 4. Ticket glides smoothly with expanding lower deckled edge, maintaining physical overlap (0.06 -> 0.30)
      .to(
        ticketRef.current,
        {
          x: 0,
          y: 0,
          rotate: -4,
          ease: "power2.out",
          duration: 0.24,
        },
        0.06
      )
      // 5. Origami bundle settles casual rotation and scale (0.04 -> 0.30)
      .to(
        origamiBundleRef.current,
        {
          rotate: 0,
          scale: 1,
          ease: "power2.out",
          duration: 0.26,
        },
        0.04
      )
      // 6. Seamless handover: At 0.30 both flaps are completely flat at 0deg.
      // Handover between 0.30 and 0.36 has zero geometry shift and prevents subpixel hairline seams.
      .to(
        unfoldedSheetRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power1.inOut",
          duration: 0.06,
        },
        0.30
      )
      .to(
        origamiBundleRef.current,
        {
          opacity: 0,
          ease: "power1.inOut",
          duration: 0.06,
        },
        0.30
      )
      // 7. Live authored text reveals with full ink opacity (0.24 -> 0.40)
      .to(
        letterTextRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.16,
        },
        0.24
      )
      // 8. Crease lines soften into natural fiber texture (0.26 -> 0.46)
      .to(
        creaseLinesRef.current,
        {
          opacity: 0.15,
          ease: "power1.out",
          duration: 0.20,
        },
        0.26
      )
      // 9. CTA resolves cleanly below settled letter (0.42 -> 0.58)
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.18,
        },
        0.42
      )
      // 10. Narrative bridge: Morning sky atmosphere warms into Cloud Nine entry (0.75 -> 0.95)
      .to(
        transitionBridgeRef.current,
        {
          opacity: 1,
          ease: "power2.inOut",
          duration: 0.20,
        },
        0.75
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

      {/* Cinematic Transition Bridge to Cloud Nine: Morning atmosphere opens up toward skyward blue */}
      <div
        ref={transitionBridgeRef}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c1a2e]/60 to-[#0c1a2e] pointer-events-none opacity-0 z-35 transition-opacity"
        aria-hidden="true"
      />

      {/* Editorial Header with Chapter Continuity */}
      <div className="text-center max-w-xl mx-auto space-y-1 relative z-10">
        <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#7A1D45] font-semibold drop-shadow-[0_1px_4px_rgba(255,245,248,0.4)]">
          The Unsealing · Chapter 00
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#1A0311] tracking-tight leading-tight drop-shadow-[0_1px_10px_rgba(255,245,248,0.5)]">
          Every story begins with something small.
        </h2>
        <p className="text-xs sm:text-sm text-[#36091E] font-normal leading-relaxed drop-shadow-[0_1px_8px_rgba(255,245,248,0.5)] max-w-md mx-auto">
          A pressed petal, a fold of deckled cotton, a ticket kept from a rainy Tuesday.
        </p>
      </div>

      {/* PHYSICAL STATIONERY: One cohesive sheet unfolding naturally in 3D */}
      <div
        ref={letterWrapperRef}
        className="relative w-full max-w-[320px] sm:max-w-[350px] aspect-[540/724] my-auto flex justify-center [perspective:1400px] will-change-transform z-20"
      >
        {/* Vintage Coffee Ticket tucked naturally beneath lower-left deckled edge with deliberate overlap */}
        <div
          ref={ticketRef}
          className="absolute bottom-2.5 -left-10 sm:bottom-3.5 sm:-left-12 z-15 pointer-events-none transform rotate-[-4deg] drop-shadow-[0_4px_14px_rgba(40,10,20,0.28)] will-change-transform"
          aria-hidden="true"
        >
          <div className="w-28 sm:w-32 py-1 px-2 sm:px-2.5 bg-[#FAF3E8] rounded-xs border border-amber-900/35 text-left shadow-xs">
            <span className="text-[7px] sm:text-[8px] font-mono uppercase tracking-widest text-[#7A1D45] font-semibold block">
              FIRST COFFEE
            </span>
            <span className="font-serif italic text-[11px] sm:text-xs text-[#1C0412] font-semibold leading-none block mt-0.5 whitespace-nowrap">
              Rainy Tuesday
            </span>
          </div>
        </div>

        {/* 1. UNFOLDED HERO DECKLED COTTON SHEET (Continuous settled sheet with live typography) */}
        <div
          ref={unfoldedSheetRef}
          className="absolute inset-0 z-20 drop-shadow-[0_22px_45px_rgba(50,10,25,0.26)] px-7 py-8 sm:px-8 sm:py-10 flex flex-col justify-between will-change-transform opacity-0 pointer-events-auto"
        >
          {/* Authentic Continuous Deckled Cotton Paper Background */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <Image
              src="/assets/stationery/deckled_paper.png"
              alt="Handmade deckled edge cotton paper with continuous natural texture"
              fill
              sizes="360px"
              className="object-contain object-center"
              priority
            />
          </div>

          {/* Faint Natural Fold Memory (Subtle, relaxing as paper settles) */}
          <div
            ref={creaseLinesRef}
            className="absolute inset-x-8 top-[33.3%] bottom-[33.3%] pointer-events-none z-10 will-change-transform opacity-15"
            aria-hidden="true"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-amber-950/15 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-950/15 to-transparent" />
          </div>

          {/* REAL LIVE HTML EDITORIAL CONTENT */}
          <div
            ref={letterTextRef}
            className="relative z-20 flex-1 flex flex-col justify-between text-left will-change-transform pt-1"
          >
            {/* Header Colophon */}
            <div className="flex items-center justify-between border-b border-rose-950/20 pb-2.5">
              <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#7A1D45] font-bold">
                Atelier Valentino
              </span>
              <span className="text-[9.5px] font-mono text-[#58152E] uppercase tracking-widest font-semibold">
                № 01 · Deckled Cotton
              </span>
            </div>

            {/* The Main Authored Demonstration Letter */}
            <div className="my-auto py-4 sm:py-6 space-y-3">
              <p className="font-serif italic text-base sm:text-lg text-[#1A0311] leading-relaxed font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                “You are the quiet place my thoughts return to when everything else is loud.”
              </p>
              <p className="font-serif italic text-xs sm:text-sm text-[#3D0A1E] leading-relaxed font-medium">
                Some words don&apos;t need an audience. They only need one person to understand them.
              </p>
              <p className="text-[10px] font-mono text-[#7A1D45]/80 uppercase tracking-widest pt-1">
                Folded by hand · Kept close
              </p>
            </div>

            {/* Footer Colophon */}
            <div className="pt-2.5 border-t border-rose-950/20 flex items-center justify-between text-[9px] font-mono text-[#7A1D45] uppercase tracking-wider font-semibold">
              <span>Pure Cotton Rag</span>
              <span>Keep Forever</span>
            </div>
          </div>
        </div>

        {/* 2. 3D ORIGAMI UNFOLDING PANELS: Progressive physical trifold opening */}
        <div
          ref={origamiBundleRef}
          className="absolute inset-0 pointer-events-none [transform-style:preserve-3d] z-30 will-change-transform drop-shadow-[0_18px_36px_rgba(50,10,25,0.24)]"
          aria-hidden="true"
        >
          {/* Top Flap (0 to 33.3% height, folds down over middle panel) */}
          <div
            ref={topFlapRef}
            className="absolute top-0 inset-x-0 h-[33.33%] [transform-origin:bottom_center] [transform-style:preserve-3d] will-change-transform z-35"
          >
            {/* Front Face (unfolded) */}
            <div className="absolute inset-0 [backface-visibility:hidden] overflow-hidden">
              <div className="relative w-full h-[300%] -top-0 pointer-events-none">
                <Image
                  src="/assets/stationery/deckled_paper.png"
                  alt=""
                  fill
                  sizes="360px"
                  className="object-contain object-top"
                  priority
                />
              </div>
            </div>

            {/* Back Face (visible when folded down) */}
            <div className="absolute inset-0 [transform:rotateX(180deg)] [backface-visibility:hidden] overflow-hidden drop-shadow-[0_12px_20px_rgba(30,5,15,0.30)]">
              <div className="relative w-full h-[300%] -top-0 pointer-events-none filter brightness-[0.98] contrast-[1.02]">
                <Image
                  src="/assets/stationery/deckled_paper.png"
                  alt=""
                  fill
                  sizes="360px"
                  className="object-contain object-top"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-amber-950/8 via-transparent to-amber-950/15 pointer-events-none" />
            </div>

            {/* Cast shadow under the top flap onto the body */}
            <div
              ref={topShadowRef}
              className="absolute -bottom-5 inset-x-2 h-7 bg-gradient-to-b from-amber-950/35 via-amber-950/15 to-transparent blur-xs pointer-events-none"
            />
          </div>

          {/* Middle Body Panel (33.3% to 66.7% height) */}
          <div className="absolute top-[33.33%] inset-x-0 h-[33.34%] overflow-hidden pointer-events-none z-20">
            <div className="relative w-full h-[300%] -top-[100%] pointer-events-none">
              <Image
                src="/assets/stationery/deckled_paper.png"
                alt=""
                fill
                sizes="360px"
                className="object-contain object-center"
                priority
              />
            </div>
          </div>

          {/* Bottom Flap (66.7% to 100% height, folds up over middle panel) */}
          <div
            ref={bottomFlapRef}
            className="absolute bottom-0 inset-x-0 h-[33.33%] [transform-origin:top_center] [transform-style:preserve-3d] will-change-transform z-25"
          >
            {/* Front Face (unfolded) */}
            <div className="absolute inset-0 [backface-visibility:hidden] overflow-hidden">
              <div className="relative w-full h-[300%] -top-[200%] pointer-events-none">
                <Image
                  src="/assets/stationery/deckled_paper.png"
                  alt=""
                  fill
                  sizes="360px"
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            </div>

            {/* Back Face (visible when folded up) */}
            <div className="absolute inset-0 [transform:rotateX(180deg)] [backface-visibility:hidden] overflow-hidden drop-shadow-[0_-8px_16px_rgba(30,5,15,0.22)]">
              <div className="relative w-full h-[300%] -top-[200%] pointer-events-none filter brightness-[0.97]">
                <Image
                  src="/assets/stationery/deckled_paper.png"
                  alt=""
                  fill
                  sizes="360px"
                  className="object-contain object-bottom"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-amber-950/10 via-transparent to-amber-950/5 pointer-events-none" />
            </div>

            {/* Cast shadow above the bottom flap */}
            <div
              ref={bottomShadowRef}
              className="absolute -top-4 inset-x-2 h-6 bg-gradient-to-t from-amber-950/25 to-transparent blur-xs pointer-events-none"
            />
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
