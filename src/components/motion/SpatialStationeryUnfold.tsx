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
 * SpatialStationeryUnfold (Phase 8.5 Physical Paper Materiality):
 * One coherent physical deckled cotton stationery sheet unfolding
 * progressively in 3D without dual-sheet crossfading.
 *
 * Motion Pacing:
 * 1. Early Scroll (0.00 -> 0.12): Compact folded trifold bundle established in gentle 3D perspective.
 * 2. Early-to-Middle (0.12 -> 0.46): Upper and lower flaps progressively rotate open along natural fold lines.
 * 3. Middle Scroll (0.42 -> 0.60): Sheet settles flat into square alignment; fold shadows soften naturally.
 * 4. After Sheet Opens (0.50 -> 0.72): Live HTML ink typography resolves into readable contrast.
 *    Blush-pink botanical vines delicately trace along the outer deckled perimeter.
 * 5. Later Scroll (0.68 -> 0.85): Letter rests peacefully; CTA becomes available without competing.
 * 6. Handover (0.85 -> 1.00): Warm stationery atmosphere dissolves into morning sky of Cloud Nine.
 */
export function SpatialStationeryUnfold() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const letterWrapperRef = useRef<HTMLDivElement | null>(null);
  const baseSheetRef = useRef<HTMLDivElement | null>(null);
  const topFlapRef = useRef<HTMLDivElement | null>(null);
  const bottomFlapRef = useRef<HTMLDivElement | null>(null);
  const topShadowRef = useRef<HTMLDivElement | null>(null);
  const bottomShadowRef = useRef<HTMLDivElement | null>(null);
  const creaseLinesRef = useRef<HTMLDivElement | null>(null);
  const letterTextRef = useRef<HTMLDivElement | null>(null);
  const botanicalVinesRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const fadeOutLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(baseSheetRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(topFlapRef.current, { rotateX: 0, opacity: 0 });
        gsap.set(bottomFlapRef.current, { rotateX: 0, opacity: 0 });
        gsap.set([topShadowRef.current, bottomShadowRef.current], { opacity: 0 });
        gsap.set(creaseLinesRef.current, { opacity: 0.15 });
        gsap.set(letterTextRef.current, { opacity: 1 });
        gsap.set(botanicalVinesRef.current, { opacity: 0.85 });
        gsap.set(ctaRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Initial resting posture: Compact folded trifold bundle resting in gentle 3D perspective
      gsap.set(letterWrapperRef.current, {
        scale: 0.94,
        rotateZ: -1.5,
        rotateX: 12,
        y: 10,
        transformPerspective: 1200,
        transformOrigin: "center center",
      });

      // The base sheet is initially clipped to the middle 1/3 (matching the folded packet height)
      gsap.set(baseSheetRef.current, {
        clipPath: "inset(33.33% 0% 33.33% 0%)",
      });

      // Top flap is folded down over the middle (rotateX 180 degrees around bottom fold line)
      gsap.set(topFlapRef.current, {
        rotateX: 180,
        transformOrigin: "bottom center",
        transformStyle: "preserve-3d",
      });

      // Bottom flap is folded up over the middle (rotateX -180 degrees around top fold line)
      gsap.set(bottomFlapRef.current, {
        rotateX: -180,
        transformOrigin: "top center",
        transformStyle: "preserve-3d",
      });

      gsap.set(topShadowRef.current, {
        opacity: 0.8,
      });

      gsap.set(bottomShadowRef.current, {
        opacity: 0.7,
      });

      gsap.set(creaseLinesRef.current, {
        opacity: 0.6,
      });

      // Live ink text begins hidden while folded
      gsap.set(letterTextRef.current, {
        opacity: 0,
      });

      // Botanical vines start hidden
      gsap.set(botanicalVinesRef.current, {
        opacity: 0,
        scale: 0.96,
      });

      gsap.set(ctaRef.current, {
        opacity: 0,
        y: 14,
      });

      // Master Scroll-Driven Timeline scrubbed smoothly across generous scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // 1. Compact folded bundle rests gracefully (0.00 -> 0.12)
      // 2. Bottom flap unfolds downward in 3D (0.12 -> 0.38)
      tl.to(
        bottomFlapRef.current,
        {
          rotateX: 0,
          ease: "power2.inOut",
          duration: 0.26,
        },
        0.12
      )
      .to(
        baseSheetRef.current,
        {
          clipPath: "inset(33.33% 0% 0% 0%)",
          ease: "power2.inOut",
          duration: 0.26,
        },
        0.12
      )
      // 3. Top flap unfolds upward in 3D (0.18 -> 0.44)
      .to(
        topFlapRef.current,
        {
          rotateX: 0,
          ease: "power2.inOut",
          duration: 0.26,
        },
        0.18
      )
      .to(
        baseSheetRef.current,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power2.inOut",
          duration: 0.26,
        },
        0.18
      )
      // 4. Fold cast shadows soften and vanish as panels lie flat (0.18 -> 0.46)
      .to(
        [topShadowRef.current, bottomShadowRef.current],
        {
          opacity: 0,
          ease: "power1.out",
          duration: 0.25,
        },
        0.20
      )
      // 5. Main sheet settles flat and squares to camera (0.24 -> 0.54)
      .to(
        letterWrapperRef.current,
        {
          rotateZ: 0,
          rotateX: 0,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.30,
        },
        0.24
      )
      // 6. Flap 3D overlays smoothly yield to continuous base sheet (0.44 -> 0.52)
      .to(
        [topFlapRef.current, bottomFlapRef.current],
        {
          opacity: 0,
          ease: "power1.inOut",
          duration: 0.08,
        },
        0.44
      )
      // 7. Fold memory creases soften into subtle paper fibers (0.35 -> 0.58)
      .to(
        creaseLinesRef.current,
        {
          opacity: 0.15,
          ease: "power1.out",
          duration: 0.23,
        },
        0.35
      )
      // 8. Live authored ink typography resolves with rich contrast once sheet is open (0.48 -> 0.68)
      .to(
        letterTextRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.20,
        },
        0.48
      )
      // 9. Delicate blush-pink botanical vines bloom around perimeter (0.52 -> 0.72)
      .to(
        botanicalVinesRef.current,
        {
          opacity: 0.85,
          scale: 1,
          ease: "power2.out",
          duration: 0.20,
        },
        0.52
      )
      // 10. CTA resolves cleanly below settled stationery (0.68 -> 0.84)
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.16,
        },
        0.68
      )
      // 11. Seamless Handover: Settled stationery and atmosphere softly yield (0.86 -> 0.98)
      .to(
        [
          letterWrapperRef.current,
          ctaRef.current,
          sectionRef.current?.querySelector(".stationery-editorial-header") || {},
        ],
        {
          opacity: 0,
          y: -18,
          ease: "power1.inOut",
          duration: 0.12,
        },
        0.86
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[220vh] sm:h-[240vh]">
      <section
        ref={sectionRef}
        id="how-it-works"
        data-testid="little-things-scene"
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between items-center bg-transparent text-[#240412] pt-24 sm:pt-28 pb-8 sm:pb-10 px-4 select-none overflow-hidden"
      >
        <AmbientBotanicalFrame variant="dusk" density="sparse" intensity={0.25} />

        {/* Editorial Header */}
        <div className="stationery-editorial-header text-center max-w-xl mx-auto space-y-1 relative z-10 will-change-transform">
          <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#7A1D45] font-semibold drop-shadow-[0_1px_4px_rgba(255,245,248,0.4)]">
            The Unsealing · Chapter 00
          </p>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#1A0311] tracking-tight leading-tight drop-shadow-[0_1px_10px_rgba(255,245,248,0.5)]">
            Every story begins with something small.
          </h2>
          <p className="text-xs sm:text-sm text-[#36091E] font-normal leading-relaxed drop-shadow-[0_1px_8px_rgba(255,245,248,0.5)] max-w-md mx-auto">
            A pressed petal, a fold of deckled cotton, kept close for someone special.
          </p>
        </div>

        {/* PHYSICAL STATIONERY: ONE unified physical sheet unfolding naturally in 3D */}
        <div
          ref={letterWrapperRef}
          className="relative w-full max-w-[320px] sm:max-w-[350px] aspect-[540/724] my-auto flex justify-center [perspective:1400px] will-change-transform z-20"
        >
          {/* THE CONTINUOUS DECKLED COTTON PAPER BASE (Present throughout the entire sequence) */}
          <div
            ref={baseSheetRef}
            className="absolute inset-0 z-10 drop-shadow-[0_22px_45px_rgba(50,10,25,0.28)] px-7 py-8 sm:px-8 sm:py-10 flex flex-col justify-between pointer-events-auto"
          >
            {/* Authentic Handmade Deckled Cotton Paper Texture */}
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

            {/* Faint Natural Fold Memory Lines */}
            <div
              ref={creaseLinesRef}
              className="absolute inset-x-8 top-[33.3%] bottom-[33.3%] pointer-events-none z-10 will-change-transform"
              aria-hidden="true"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-amber-950/25 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-950/25 to-transparent" />
            </div>

            {/* Delicate Blush-Pink Botanical Vines framing outer perimeter of settled sheet */}
            <div
              ref={botanicalVinesRef}
              className="absolute inset-2 sm:inset-3 pointer-events-none z-15 will-change-transform overflow-hidden"
              aria-hidden="true"
            >
              <svg viewBox="0 0 320 440" fill="none" className="w-full h-full">
                {/* Top-Left Corner Vine */}
                <path
                  d="M14 42 C 14 24, 24 16, 44 14 C 58 13, 72 15, 84 13"
                  stroke="#E892A8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="2 3"
                  opacity="0.85"
                />
                <circle cx="28" cy="20" r="2" fill="#F472B6" opacity="0.7" />
                <circle cx="60" cy="14" r="1.5" fill="#FDA4AF" opacity="0.75" />
                {/* Top-Right Corner Vine */}
                <path
                  d="M306 42 C 306 24, 296 16, 276 14 C 262 13, 248 15, 236 13"
                  stroke="#E892A8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="2 3"
                  opacity="0.85"
                />
                <circle cx="292" cy="20" r="2" fill="#F472B6" opacity="0.7" />
                <circle cx="260" cy="14" r="1.5" fill="#FDA4AF" opacity="0.75" />
                {/* Bottom-Left Corner Vine */}
                <path
                  d="M14 398 C 14 416, 24 424, 44 426 C 58 427, 72 425, 84 427"
                  stroke="#E892A8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="2 3"
                  opacity="0.85"
                />
                <circle cx="28" cy="420" r="2" fill="#F472B6" opacity="0.7" />
                <circle cx="60" cy="426" r="1.5" fill="#FDA4AF" opacity="0.75" />
                {/* Bottom-Right Corner Vine */}
                <path
                  d="M306 398 C 306 416, 296 424, 276 426 C 262 427, 248 425, 236 427"
                  stroke="#E892A8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="2 3"
                  opacity="0.85"
                />
                <circle cx="292" cy="420" r="2" fill="#F472B6" opacity="0.7" />
                <circle cx="260" cy="426" r="1.5" fill="#FDA4AF" opacity="0.75" />
              </svg>
            </div>

            {/* REAL LIVE HTML EDITORIAL CONTENT (Authored ink text) */}
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

          {/* 3D TRIFOLD FLAPS: Hinging open in physical space over the continuous base sheet */}
          <div
            className="absolute inset-0 pointer-events-none [transform-style:preserve-3d] z-30 will-change-transform"
            aria-hidden="true"
          >
            {/* Top Flap (0 to 33.3% height, hinges at bottom edge, unfolds upward) */}
            <div
              ref={topFlapRef}
              className="absolute top-0 inset-x-0 h-[33.33%] [transform-origin:bottom_center] [transform-style:preserve-3d] will-change-transform z-35"
              style={{ transformOrigin: "bottom center" }}
            >
              {/* Front Face (visible when open) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
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

              {/* Back Face (visible when folded downward over middle) */}
              <div
                className="absolute inset-0 overflow-hidden drop-shadow-[0_12px_24px_rgba(30,5,15,0.35)]"
                style={{
                  transform: "rotateX(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="relative w-full h-[300%] -top-0 pointer-events-none filter brightness-[0.97]">
                  <Image
                    src="/assets/stationery/deckled_paper.png"
                    alt=""
                    fill
                    sizes="360px"
                    className="object-contain object-top"
                    priority
                  />
                </div>
                {/* Fold crease shading */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-950/15 via-transparent to-amber-950/20 pointer-events-none" />
              </div>

              {/* Cast shadow under top flap onto the body */}
              <div
                ref={topShadowRef}
                className="absolute -bottom-5 inset-x-2 h-7 bg-gradient-to-b from-amber-950/35 via-amber-950/15 to-transparent blur-xs pointer-events-none"
              />
            </div>

            {/* Bottom Flap (66.7% to 100% height, hinges at top edge, unfolds downward) */}
            <div
              ref={bottomFlapRef}
              className="absolute bottom-0 inset-x-0 h-[33.33%] [transform-origin:top_center] [transform-style:preserve-3d] will-change-transform z-25"
              style={{ transformOrigin: "top center" }}
            >
              {/* Front Face (visible when open) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
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

              {/* Back Face (visible when folded upward over middle) */}
              <div
                className="absolute inset-0 overflow-hidden drop-shadow-[0_-8px_20px_rgba(30,5,15,0.28)]"
                style={{
                  transform: "rotateX(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="relative w-full h-[300%] -top-[200%] pointer-events-none filter brightness-[0.96]">
                  <Image
                    src="/assets/stationery/deckled_paper.png"
                    alt=""
                    fill
                    sizes="360px"
                    className="object-contain object-bottom"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/15 via-transparent to-amber-950/10 pointer-events-none" />
              </div>

              {/* Cast shadow above bottom flap */}
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
