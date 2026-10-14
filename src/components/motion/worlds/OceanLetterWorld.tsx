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
 * OceanLetterWorld (Phase 8.5 Material Polish & Single-Stage Continuity):
 * Story: The bottle that found its way home.
 * Environment: Dawn shoreline, turquoise tidal wave rolling onto glistening wet sand, sea mist.
 * Choreography: Camera dollies toward the washed-up glass bottle; the cork releases, and
 * the weathered sea-salt parchment unrolls directly on the wet sand beside a frosted sea-glass pebble.
 */
export function OceanLetterWorld() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const coastalMistRef = useRef<HTMLDivElement | null>(null);
  const sandStageRef = useRef<HTMLDivElement | null>(null);
  const corkReleaseRef = useRef<HTMLDivElement | null>(null);
  const parchmentSheetRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);
  const seaGlassRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.1, y: "-3%" });
        gsap.set(coastalMistRef.current, { opacity: 0.8 });
        gsap.set(sandStageRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(corkReleaseRef.current, { opacity: 0, x: 20 });
        gsap.set(parchmentSheetRef.current, { opacity: 1, scale: 1, rotate: -1.5 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        gsap.set(seaGlassRef.current, { opacity: 0.95 });
        return;
      }

      // Initial resting posture: Wide shoreline vista, bottle on sand
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(coastalMistRef.current, {
        opacity: 0.45,
        scale: 0.95,
      });

      gsap.set(sandStageRef.current, {
        opacity: 0.9,
        scale: 0.9,
        y: 20,
      });

      gsap.set(corkReleaseRef.current, {
        opacity: 1,
        x: 0,
      });

      gsap.set(parchmentSheetRef.current, {
        opacity: 0,
        scale: 0.88,
        rotate: 4,
      });

      gsap.set(letterContentRef.current, {
        opacity: 0,
      });

      gsap.set(seaGlassRef.current, {
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

      // 1. Advance toward shoreline and wet sand (0.0 -> 0.45)
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
        coastalMistRef.current,
        {
          opacity: 0.85,
          scale: 1.25,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      .to(
        sandStageRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.05
      )
      // 2. Cork releases from bottle mouth in 3D (0.35 -> 0.75)
      .to(
        corkReleaseRef.current,
        {
          opacity: 0,
          x: 24,
          ease: "power2.inOut",
          duration: 0.28,
        },
        0.35
      )
      .to(
        parchmentSheetRef.current,
        {
          opacity: 1,
          scale: 1,
          rotate: -1.5,
          ease: "power2.out",
          duration: 0.35,
        },
        0.35
      )
      // 3. Crisp ink text reveals clearly on weathered sea-salt parchment (0.45 -> 0.80)
      .to(
        letterContentRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.3,
        },
        0.45
      )
      .to(
        seaGlassRef.current,
        {
          opacity: 0.95,
          scale: 1,
          duration: 0.3,
        },
        0.4
      )
      // 4. Narrative Handover & Settle (0.68 -> 0.98)
      // Parchment settles into wet sand
      .to(
        sandStageRef.current,
        {
          scale: 0.97,
          y: 4,
          opacity: 0.96,
          ease: "power1.inOut",
          duration: 0.28,
        },
        0.68
      )
      // Narrative text gracefully yields
      .to(
        sectionRef.current?.querySelector(".lg\\:col-span-5") || {},
        {
          opacity: 0,
          y: -15,
          ease: "power1.in",
          duration: 0.22,
        },
        0.70
      )
      // Coastal morning wave recedes
      .to(
        coastalMistRef.current,
        {
          opacity: 0.25,
          scale: 0.85,
          ease: "power2.out",
          duration: 0.26,
        },
        0.70
      )
      // Camera dollies forward gently
      .to(
        bgImageRef.current,
        {
          scale: 1.25,
          y: "-5%",
          ease: "power1.inOut",
          duration: 0.26,
        },
        0.74
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[220vh] sm:h-[240vh]">
      <section
        ref={sectionRef}
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#05111c] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden shadow-[0_-24px_50px_rgba(0,0,0,0.7)]"
        aria-label="Ocean Letter cinematic world"
      >
        {/* CINEMATIC ENVIRONMENT PLATE: Dawn Shoreline with Rolling Turquoise Waves */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 w-full h-full will-change-transform pointer-events-none select-none -z-20"
        >
          <Image
            src="/assets/environments/ocean_letter_shoreline.jpg"
            alt="Dawn ocean shoreline with turquoise tidal wave cresting onto glistening wet sand and sea foam"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
            unoptimized
          />
        </div>

        {/* Coastal Morning Atmospheric Vignette */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#05111c]/75 via-transparent to-[#05111c]/60 pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Dynamic Ocean Spray Light Flare */}
        <div
          ref={coastalMistRef}
          className="absolute bottom-1/4 right-1/4 w-[550px] h-[450px] rounded-full bg-gradient-to-tl from-cyan-400/20 via-sky-300/10 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
          aria-hidden="true"
        />

        {/* Ambient Top World Tag */}
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 backdrop-blur-md border border-sky-500/30 text-sky-100 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase">06 — The Shoreline</span>
          </div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-sky-200/90 drop-shadow-sm font-medium">
            Some travel across an ocean to reach you.
          </span>
        </div>

        {/* MAIN CINEMATIC STAGE: Wet Sand Shoreline & Washed-Up Bottle Parchment */}
        <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
          {/* Left Column: Editorial Scene Narrative & Entry Action */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-sky-300/90 font-medium">
                Atmosphere 06 · Ocean Letter
              </span>
              <h3 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#F0F9FF] drop-shadow-[0_2px_16px_rgba(2,12,20,0.9)]">
                “For the love that crossed oceans to reach you.”
              </h3>
            </div>
            <p className="text-sm sm:text-base text-sky-100/90 max-w-sm font-normal leading-relaxed drop-shadow-sm">
              Carried by tides and morning currents, an amber glass bottle resting on glistening tide-wet sand.
            </p>
            <div className="pt-2">
              <AtmosphericButton
                href="/create?template=ocean-letter"
                worldId="ocean-letter"
                worldName="Ocean Letter"
              />
            </div>
          </div>

          {/* Right Column: Physical Bottle & Sea-Salt Parchment on Wet Sand */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end items-center">
            <div
              ref={sandStageRef}
              className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[540/724] will-change-transform drop-shadow-[0_22px_45px_rgba(2,16,28,0.75)] select-none"
            >
              {/* Frosted Sea-Glass Pebble Resting beside the letter */}
              <div
                ref={seaGlassRef}
                className="absolute -bottom-3 -left-4 z-30 transform rotate-[-8deg] drop-shadow-md pointer-events-none will-change-transform"
                aria-hidden="true"
              >
                <div className="py-1 px-2.5 bg-cyan-950/80 rounded-full border border-cyan-400/40 text-left shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-300/90" />
                  <span className="font-serif italic text-[11px] text-cyan-100 font-semibold">
                    Sea Glass
                  </span>
                </div>
              </div>

              {/* 1. Washed-Up Corked Glass Bottle */}
              <div
                ref={corkReleaseRef}
                className="absolute inset-0 z-20 pointer-events-none will-change-transform flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/stationery/ocean_bottle.png"
                    alt="Glass bottle resting on glistening wet sand"
                    fill
                    sizes="(max-width: 640px) 280px, 340px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* 2. Unrolled Sea-Salt Weathered Parchment */}
              <div
                ref={parchmentSheetRef}
                className="relative w-full h-full bg-[#FAF5EE] border border-cyan-900/30 rounded-[2px] p-6 sm:p-7 flex flex-col justify-between shadow-2xl overflow-hidden will-change-transform z-10"
              >
                {/* Weathered Marine Coordinates Header */}
                <div className="w-full pb-2 border-b border-cyan-950/20 flex justify-between items-center text-[9px] font-mono tracking-widest uppercase text-cyan-950 font-bold">
                  <span>34°02′N 118°29′W</span>
                  <span>Shoreline № 06</span>
                </div>

                {/* Live Authored Editorial Demonstration Text */}
                <div
                  ref={letterContentRef}
                  className="py-3 space-y-3 text-left will-change-transform"
                >
                  <p className="font-serif italic text-base sm:text-xl text-[#081B26] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                    “The ocean carried my words, but my heart always pointed to you.”
                  </p>
                  <div className="pt-2 border-t border-cyan-950/15 flex items-center justify-between text-[10px] font-mono text-cyan-950 font-bold uppercase tracking-widest">
                    <span>Dawn Tide</span>
                    <span>Found at Last</span>
                  </div>
                </div>

                {/* Footer Tag */}
                <div className="w-full pt-2 border-t border-cyan-950/20 flex justify-between items-center text-[8.5px] font-mono text-cyan-900/80 uppercase tracking-widest">
                  <span>Atelier Valentino</span>
                  <span>Message in a Bottle</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ambient Cue */}
        <div className="text-center z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-sky-200/60">
            Scroll to explore discovered keepsakes
          </span>
        </div>
      </section>
    </div>
  );
}
