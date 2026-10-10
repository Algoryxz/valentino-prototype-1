"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AtmosphericButton } from "@/components/ui/AtmosphericButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * MidnightRoseWorld (Phase 8.2 Environment-Integrated Letter):
 * Story: A letter reserved for two.
 * Environment: An elegant intimate restaurant at night, candlelight, linen-covered table, deep shadows.
 * Choreography: Camera dollies toward the candlelit table; a wax-sealed envelope resting on the linen
 * opens, revealing the cream stationery letter directly under warm candlelight.
 */
export function MidnightRoseWorld() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const candleGlowRef = useRef<HTMLDivElement | null>(null);
  const tableLetterRef = useRef<HTMLDivElement | null>(null);
  const envelopeFlapRef = useRef<HTMLDivElement | null>(null);
  const waxSealRef = useRef<HTMLDivElement | null>(null);
  const letterSheetRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.1, y: "-3%" });
        gsap.set(candleGlowRef.current, { opacity: 0.9 });
        gsap.set(tableLetterRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(envelopeFlapRef.current, { rotateX: -160, opacity: 0.1 });
        gsap.set(waxSealRef.current, { opacity: 0 });
        gsap.set(letterSheetRef.current, { opacity: 1, y: 0 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        return;
      }

      // Initial resting posture: Wide dining room view, envelope resting closed on the linen
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(candleGlowRef.current, {
        opacity: 0.45,
        scale: 0.9,
      });

      gsap.set(tableLetterRef.current, {
        opacity: 0.9,
        scale: 0.92,
        y: 20,
      });

      gsap.set(envelopeFlapRef.current, {
        rotateX: 0,
        transformOrigin: "top center",
        transformStyle: "preserve-3d",
      });

      gsap.set(waxSealRef.current, {
        opacity: 1,
        scale: 1,
      });

      gsap.set(letterSheetRef.current, {
        opacity: 0,
        y: 15,
        scale: 0.95,
      });

      gsap.set(letterContentRef.current, {
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // 1. Dolly camera toward candlelit table (0.0 -> 0.45)
      tl.to(
        bgImageRef.current,
        {
          scale: 1.12,
          y: "-3.5%",
          ease: "none",
          duration: 0.5,
        },
        0
      )
      .to(
        candleGlowRef.current,
        {
          opacity: 0.85,
          scale: 1.25,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      .to(
        tableLetterRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.05
      )
      // 2. Unseal wax & open envelope flap on table (0.30 -> 0.65)
      .to(
        waxSealRef.current,
        {
          scale: 0.7,
          opacity: 0,
          ease: "power2.in",
          duration: 0.25,
        },
        0.3
      )
      .to(
        envelopeFlapRef.current,
        {
          rotateX: -150,
          opacity: 0.15,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.32
      )
      // 3. Cream stationery letter unfolds under candlelight (0.42 -> 0.80)
      .to(
        letterSheetRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power2.out",
          duration: 0.4,
        },
        0.42
      )
      .to(
        letterContentRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.35,
        },
        0.5
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[180vh] sm:h-[200vh]">
      <section
        ref={sectionRef}
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#0c0207] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden"
        aria-label="Midnight Rose cinematic world"
      >
      {/* CINEMATIC ENVIRONMENT PLATE: Intimate Candlelit Restaurant at Night */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-full will-change-transform pointer-events-none select-none -z-20"
      >
        <Image
          src="/assets/environments/midnight_rose_restaurant.jpg"
          alt="Intimate candlelit fine dining table at midnight with burgundy velvet and mahogany shadows"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
          unoptimized
        />
      </div>

      {/* Chiaroscuro Atmospheric Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0c0207]/75 via-transparent to-[#0c0207]/60 pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Dynamic Candle Light Halo around the table */}
      <div
        ref={candleGlowRef}
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[450px] rounded-full bg-gradient-to-tr from-amber-500/30 via-rose-600/20 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
        aria-hidden="true"
      />

      {/* Ambient Top World Tag */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 backdrop-blur-md border border-rose-500/30 text-rose-100 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase">02 — Reserved for Two</span>
        </div>
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-rose-200/90 drop-shadow-sm font-medium">
          Words meant for an unhurried hour
        </span>
      </div>

      {/* MAIN CINEMATIC STAGE: Candlelit Linen Table & Cream Letter Reveal */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
        {/* Left Column: Editorial Scene Narrative & Entry Action */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-rose-300/90 font-medium">
              Atmosphere 02
            </span>
            <h3 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-[#FFF5F7] drop-shadow-[0_2px_20px_rgba(20,0,8,0.95)]">
              Midnight Rose
            </h3>
          </div>
          <p className="text-lg sm:text-2xl font-serif italic text-rose-100 font-light leading-relaxed drop-shadow-[0_1px_10px_rgba(20,0,8,0.9)]">
            “For the love that feels like midnight.”
          </p>
          <p className="text-xs sm:text-sm text-rose-100/90 max-w-md font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(20,0,8,0.9)]">
            A private table, warm candlelight, and a wax-sealed envelope resting on the linen. The most meaningful words deserve an unhurried moment.
          </p>
          <div className="pt-2">
            <AtmosphericButton
              href="/create?template=midnight-rose"
              worldId="midnight-rose"
              worldName="Midnight Rose"
            />
          </div>
        </div>

        {/* Right Column: Physical Cream Letter Resting Directly on the Candlelit Linen Table */}
        <div
          ref={tableLetterRef}
          className="lg:col-span-7 flex justify-center lg:justify-center will-change-transform [perspective:1000px]"
        >
          <div className="relative w-72 sm:w-88 select-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)]">
            {/* Fallen Rose Petal beside the letter */}
            <div className="absolute -bottom-4 -left-4 z-40 pointer-events-none transform -rotate-12 drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-[#9F1239]">
                <path
                  d="M5 16 C 3 9, 10 3, 17 4 C 20 11, 13 19, 5 16 Z"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
              </svg>
            </div>

            {/* 1. Initial State: Deep Velvet Envelope with Wax Seal */}
            <div className="relative w-full rounded-[2px] overflow-hidden">
              {/* Velvet Envelope Flap & Wax Seal (Opens to reveal letter) */}
              <div
                ref={envelopeFlapRef}
                className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#3E0723] via-[#240315] to-[#14010B] [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-md z-30 border-t border-amber-300/30 will-change-transform"
              />

              {/* Hand-Poured Molten Wax Seal */}
              <div
                ref={waxSealRef}
                className="absolute top-22 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 will-change-transform"
              >
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#E11D48] via-[#9F1239] to-[#4C0519] border border-amber-300/60 shadow-[0_6px_22px_rgba(159,18,57,0.85),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border border-amber-200/50 bg-[#9F1239]/80 flex items-center justify-center">
                    <span className="text-[10px] text-amber-200 font-serif italic">V</span>
                  </div>
                </div>
              </div>

              {/* 2. Revealed Hero Cream Stationery Sheet on the Linen Table */}
              <div
                ref={letterSheetRef}
                className="relative z-20 w-full bg-[#FAF6EE] shadow-[0_18px_45px_rgba(0,0,0,0.65)] border border-amber-200/70 rounded-[2px] p-6 sm:p-7 will-change-transform"
              >
                {/* Subtle candlelight warmth sheen across the paper */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/10 via-transparent to-amber-200/15 pointer-events-none" />

                <div
                  ref={letterContentRef}
                  className="space-y-3 text-left will-change-transform relative z-10"
                >
                  <div className="flex items-center justify-between border-b border-rose-950/20 pb-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#7A1D45] font-bold">
                      Table No. 02 · Reserved
                    </span>
                    <span className="text-[9px] font-mono text-[#58152E]/80 uppercase tracking-widest font-semibold">
                      Midnight
                    </span>
                  </div>

                  <p className="font-serif italic text-base sm:text-xl text-[#240314] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                    “Written in quiet starlight, meant only for you.”
                  </p>

                  <div className="pt-2 border-t border-rose-950/20 flex items-center justify-between text-[10px] font-mono text-[#7A1D45] uppercase tracking-widest font-semibold">
                    <span>Atelier Valentino</span>
                    <span>For Two</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ambient Cue */}
      <div className="text-center z-10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300/60">
          Scroll to enter the quiet courtyard
        </span>
      </div>
    </section>
  </div>
);
}
