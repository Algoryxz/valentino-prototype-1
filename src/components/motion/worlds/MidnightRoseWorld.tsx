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
 * MidnightRoseWorld (Phase 8 Cinematic Environment):
 * Story: A letter reserved for two.
 * Environment: An elegant intimate restaurant at night, candlelight, ruby wine glass, deep burgundy shadows.
 * Choreography: Scroll dollies toward the candlelit table; wax-sealed velvet envelope opens to reveal the letter.
 */
export function MidnightRoseWorld() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const candleGlowRef = useRef<HTMLDivElement | null>(null);
  const envelopeGroupRef = useRef<HTMLDivElement | null>(null);
  const envelopeFlapRef = useRef<HTMLDivElement | null>(null);
  const waxSealRef = useRef<HTMLDivElement | null>(null);
  const letterSheetRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.05, y: 0 });
        gsap.set(candleGlowRef.current, { opacity: 0.8 });
        gsap.set(envelopeGroupRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(envelopeFlapRef.current, { rotateX: -160, opacity: 0.1 });
        gsap.set(waxSealRef.current, { opacity: 0 });
        gsap.set(letterSheetRef.current, { y: -30, opacity: 1, scale: 1 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        return;
      }

      // Initial resting posture: Wide dining room view, envelope resting closed
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(candleGlowRef.current, {
        opacity: 0.45,
        scale: 0.9,
      });

      gsap.set(envelopeGroupRef.current, {
        opacity: 0.85,
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
        y: 0,
        opacity: 0.2,
        scale: 0.96,
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
          scale: 1.08,
          y: "-3%",
          ease: "none",
          duration: 0.5,
        },
        0
      )
      .to(
        candleGlowRef.current,
        {
          opacity: 0.85,
          scale: 1.2,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      .to(
        envelopeGroupRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.05
      )
      // 2. Unseal wax & open velvet flap (0.35 -> 0.65)
      .to(
        waxSealRef.current,
        {
          scale: 0.8,
          opacity: 0.2,
          ease: "power2.in",
          duration: 0.25,
        },
        0.35
      )
      .to(
        envelopeFlapRef.current,
        {
          rotateX: -150,
          opacity: 0.15,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.38
      )
      // 3. Cream letter emerges into candlelight (0.45 -> 0.80)
      .to(
        letterSheetRef.current,
        {
          y: -28,
          opacity: 1,
          scale: 1.02,
          ease: "power2.out",
          duration: 0.4,
        },
        0.45
      )
      .to(
        letterContentRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.3,
        },
        0.52
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

      {/* Dynamic Candle Light Halo */}
      <div
        ref={candleGlowRef}
        className="absolute top-1/2 right-1/4 w-[450px] h-[450px] -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/25 via-rose-600/15 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
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

      {/* MAIN CINEMATIC STAGE: Candlelit Table & Velvet Envelope Reveal */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
        {/* Left Column: Editorial Scene Narrative & Entry Action */}
        <div className="lg:col-span-6 space-y-4 text-left">
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

        {/* Right Column: Physical Wax-Sealed Velvet Envelope Opening into Cream Letter */}
        <div
          ref={envelopeGroupRef}
          className="lg:col-span-6 flex justify-center lg:justify-end will-change-transform [perspective:1000px]"
        >
          <div className="relative w-68 sm:w-80 select-none">
            {/* Fallen Rose Petal */}
            <div className="absolute -bottom-4 -left-4 z-30 pointer-events-none transform -rotate-12 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#9F1239]">
                <path
                  d="M5 16 C 3 9, 10 3, 17 4 C 20 11, 13 19, 5 16 Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
              </svg>
            </div>

            {/* The Velvet Envelope Pocket Body */}
            <div className="relative w-full min-h-[180px] bg-gradient-to-br from-[#30051B] via-[#1A020E] to-[#0A0105] shadow-[0_24px_60px_-10px_rgba(0,0,0,0.95),0_6px_20px_rgba(159,18,57,0.3)] border-t border-l border-amber-300/30 rounded-[2px] p-4 flex flex-col justify-end">
              {/* Velvet Pointed Flap */}
              <div
                ref={envelopeFlapRef}
                className="absolute top-0 inset-x-0 h-22 bg-gradient-to-b from-[#3E0723] to-[#16020D] [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-md z-30 border-t border-amber-300/20 will-change-transform"
              />

              {/* Hand-Poured Molten Wax Seal */}
              <div
                ref={waxSealRef}
                className="absolute top-18 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 will-change-transform"
              >
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#E11D48] via-[#9F1239] to-[#4C0519] border border-amber-300/50 shadow-[0_6px_20px_rgba(159,18,57,0.8),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center">
                  <div className="w-4.5 h-4.5 rounded-full border border-amber-200/40 bg-[#9F1239]/70" />
                </div>
              </div>

              {/* The Unfolding Cream Stationery Sheet Emerging from Pocket */}
              <div
                ref={letterSheetRef}
                className="relative z-20 w-full bg-[#FFFDF9] shadow-[0_16px_40px_rgba(0,0,0,0.6)] border border-amber-200/50 rounded-[2px] p-5 sm:p-6 will-change-transform"
              >
                <div
                  ref={letterContentRef}
                  className="space-y-2.5 text-left will-change-transform"
                >
                  <p className="font-serif italic text-base sm:text-lg text-[#1A0311] font-medium leading-relaxed">
                    “Written in quiet starlight, meant only for you.”
                  </p>
                  <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-[10px] font-mono text-rose-950/70 uppercase tracking-widest">
                    <span>Table No. 02</span>
                    <span>Midnight</span>
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
