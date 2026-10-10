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
 * WildflowerWorld (Phase 8.2 Environment-Integrated Table Journal):
 * Story: A letter grown in the garden.
 * Environment: English cottage garden path, foxgloves, weathered wooden table in morning light.
 * Choreography: Camera approaches the weathered wooden table on the left; the botanical journal opens
 * naturally on the table grain, revealing a deckled cotton letter and an authentic pressed dried flower.
 */
export function WildflowerWorld() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const sunbeamsRef = useRef<HTMLDivElement | null>(null);
  const journalTableRef = useRef<HTMLDivElement | null>(null);
  const journalCoverRef = useRef<HTMLDivElement | null>(null);
  const letterSheetRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);
  const specimenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.1, y: "-3%" });
        gsap.set(sunbeamsRef.current, { opacity: 0.8 });
        gsap.set(journalTableRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(journalCoverRef.current, { rotateY: -140, opacity: 0 });
        gsap.set(letterSheetRef.current, { opacity: 1, scale: 1 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        gsap.set(specimenRef.current, { opacity: 0.95 });
        return;
      }

      // Initial resting posture: Wide garden view, closed journal resting on table
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(sunbeamsRef.current, {
        opacity: 0.45,
        scale: 0.95,
      });

      gsap.set(journalTableRef.current, {
        opacity: 0.9,
        scale: 0.9,
        y: 18,
      });

      gsap.set(journalCoverRef.current, {
        rotateY: 0,
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
      });

      gsap.set(letterSheetRef.current, {
        opacity: 0.4,
        scale: 0.95,
      });

      gsap.set(letterContentRef.current, {
        opacity: 0,
      });

      gsap.set(specimenRef.current, {
        opacity: 0.6,
        scale: 0.9,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // 1. Advance toward garden table (0.0 -> 0.45)
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
        sunbeamsRef.current,
        {
          opacity: 0.85,
          scale: 1.2,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      .to(
        journalTableRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.05
      )
      // 2. Open botanical journal cover on the wooden table (0.32 -> 0.68)
      .to(
        journalCoverRef.current,
        {
          rotateY: -130,
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.32
      )
      .to(
        letterSheetRef.current,
        {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          duration: 0.35,
        },
        0.35
      )
      // 3. Specimen settles and letter text reveals with crisp dark ink (0.45 -> 0.82)
      .to(
        specimenRef.current,
        {
          opacity: 0.95,
          scale: 1,
          ease: "power1.out",
          duration: 0.3,
        },
        0.45
      )
      .to(
        letterContentRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.35,
        },
        0.48
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[180vh] sm:h-[200vh]">
      <section
        ref={sectionRef}
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#1a1f14] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden"
        aria-label="Wildflower Paper cinematic world"
      >
      {/* CINEMATIC ENVIRONMENT PLATE: English Cottage Garden */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-full will-change-transform pointer-events-none select-none -z-20"
      >
        <Image
          src="/assets/environments/wildflower_english_garden.jpg"
          alt="Lush cottage garden path with foxgloves and weathered wooden table in dappled morning light"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
          unoptimized
        />
      </div>

      {/* Ambient Morning Foliage Mask */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#151c11]/75 via-transparent to-[#151c11]/60 pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Dappled Sunlight Overlay */}
      <div
        ref={sunbeamsRef}
        className="absolute top-0 right-1/4 w-[55vw] h-[55vh] bg-gradient-to-bl from-amber-100/25 via-emerald-100/10 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
        aria-hidden="true"
      />

      {/* Ambient Top World Tag */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 backdrop-blur-md border border-amber-500/30 text-amber-100 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase">05 — Botanical Care</span>
        </div>
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-100/90 drop-shadow-sm font-medium">
          Love flourishes through small, consistent acts
        </span>
      </div>

      {/* MAIN CINEMATIC STAGE: Garden Table (Left) & Narrative (Right) */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
        {/* Left Column: Physical Botanical Journal Resting DIRECTLY on the Weathered Table */}
        <div
          ref={journalTableRef}
          className="lg:col-span-6 flex justify-center lg:justify-start will-change-transform [perspective:1000px] order-2 lg:order-1"
        >
          <div className="relative w-72 sm:w-88 select-none drop-shadow-[0_24px_50px_rgba(0,0,0,0.85)]">
            {/* The Leather/Linen Botanical Journal on the Wooden Table */}
            <div className="relative w-full rounded-[3px] overflow-hidden bg-[#2C1D13] shadow-2xl border border-amber-900/50">
              {/* Journal Front Cover (Lifts open on scroll) */}
              <div
                ref={journalCoverRef}
                className="absolute inset-0 bg-gradient-to-r from-[#24170E] via-[#3E2A1B] to-[#2B1B10] rounded-[3px] border border-amber-800/40 z-30 shadow-lg flex items-center justify-center p-5 will-change-transform"
              >
                <div className="text-center space-y-1">
                  <span className="font-serif italic text-xs text-amber-200/80 uppercase tracking-widest border border-amber-600/40 px-3 py-1 rounded-xs block">
                    Botanical Journal · Herbarium
                  </span>
                  <span className="text-[9px] font-mono text-amber-300/60 uppercase tracking-wider block">
                    № 05 · Flora
                  </span>
                </div>
              </div>

              {/* Inside Journal Page: Authentic Deckled Cotton Sheet */}
              <div
                ref={letterSheetRef}
                className="relative z-20 w-full bg-[#FAF6EE] p-6 sm:p-7 shadow-inner will-change-transform"
              >
                {/* Real Pressed Botanical Specimen Resting on the Paper */}
                <div
                  ref={specimenRef}
                  className="absolute -top-3.5 right-3 w-16 sm:w-18 h-22 sm:h-26 z-25 pointer-events-none drop-shadow-[1px_4px_8px_rgba(40,25,10,0.25)] will-change-transform"
                >
                  <Image
                    src="/assets/stationery/pressed_botanical.png"
                    alt="Authentic pressed dried flower specimen"
                    fill
                    sizes="72px"
                    className="object-contain"
                    priority={false}
                  />
                </div>

                {/* Live Authored Editorial Demonstration Text - High Contrast */}
                <div
                  ref={letterContentRef}
                  className="space-y-3 text-left will-change-transform relative z-10"
                >
                  <div className="flex items-center justify-between border-b border-stone-800/20 pb-2 text-[9px] font-mono text-stone-800/80 uppercase tracking-widest font-semibold">
                    <span>Field Notes · English Garden</span>
                    <span>Pressed Botanical</span>
                  </div>

                  <p className="font-serif italic text-base sm:text-xl text-[#1C160C] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] pr-8">
                    “Everything worth keeping grows slowly.”
                  </p>

                  <div className="pt-2 border-t border-stone-800/20 flex items-center justify-between text-[10px] font-mono text-stone-900 font-bold uppercase tracking-widest">
                    <span>Atelier Valentino</span>
                    <span>Specimen № 05</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Scene Narrative & Entry Action */}
        <div className="lg:col-span-6 space-y-4 text-left order-1 lg:order-2">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-200/90 font-medium">
              Atmosphere 05
            </span>
            <h3 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-[#FEF3C7] drop-shadow-[0_2px_20px_rgba(20,25,10,0.95)]">
              Wildflower Paper
            </h3>
          </div>
          <p className="text-lg sm:text-2xl font-serif italic text-amber-100 font-light leading-relaxed drop-shadow-[0_1px_10px_rgba(20,25,10,0.9)]">
            “For the love built by hand, petal by petal.”
          </p>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-md font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(20,25,10,0.9)]">
            A weathered table among blooming foxgloves, a botanical journal opened to morning light, and a deckled cotton letter resting beside a pressed flower.
          </p>
          <div className="pt-2">
            <AtmosphericButton
              href="/create?template=wildflower-paper"
              worldId="wildflower-paper"
              worldName="Wildflower Paper"
            />
          </div>
        </div>
      </div>

      {/* Bottom Ambient Cue */}
      <div className="text-center z-10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-200/60">
          Scroll to follow the tide home
        </span>
      </div>
    </section>
  </div>
);
}
