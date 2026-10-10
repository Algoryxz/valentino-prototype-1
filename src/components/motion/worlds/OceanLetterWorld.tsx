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
 * OceanLetterWorld (Phase 8 Cinematic Environment):
 * Story: The bottle that found its way home.
 * Environment: Dawn shoreline, turquoise tidal wave rolling onto glistening wet sand,
 * sea mist, distant horizon.
 * Choreography: Wave deposits the vintage corked bottle onto wet sand; parchment letter
 * unrolls beside a frosted sea glass pebble to reveal the message.
 */
export function OceanLetterWorld() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const coastalMistRef = useRef<HTMLDivElement | null>(null);
  const bottleGroupRef = useRef<HTMLDivElement | null>(null);
  const parchmentSheetRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);
  const seaGlassRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.05, y: 0 });
        gsap.set(coastalMistRef.current, { opacity: 0.6 });
        gsap.set(bottleGroupRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(parchmentSheetRef.current, { opacity: 1, y: 0, rotate: -2 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        gsap.set(seaGlassRef.current, { opacity: 0.95 });
        return;
      }

      // Initial resting posture: Wide shoreline vista
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(coastalMistRef.current, {
        opacity: 0.45,
        scale: 0.95,
      });

      gsap.set(bottleGroupRef.current, {
        opacity: 0.85,
        scale: 0.92,
        y: 20,
      });

      gsap.set(parchmentSheetRef.current, {
        opacity: 0.4,
        scale: 0.94,
        y: 15,
        rotate: 3,
      });

      gsap.set(letterContentRef.current, {
        opacity: 0.2,
      });

      gsap.set(seaGlassRef.current, {
        opacity: 0.6,
        scale: 0.9,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.7,
        },
      });

      // 1. Advance toward shoreline and wet sand (0.0 -> 0.5)
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
        coastalMistRef.current,
        {
          opacity: 0.8,
          scale: 1.15,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      .to(
        bottleGroupRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.05
      )
      // 2. Parchment unrolls on wet sand (0.35 -> 0.75)
      .to(
        parchmentSheetRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotate: -2,
          ease: "power2.out",
          duration: 0.4,
        },
        0.35
      )
      .to(
        seaGlassRef.current,
        {
          opacity: 0.95,
          scale: 1,
          ease: "back.out(1.2)",
          duration: 0.3,
        },
        0.42
      )
      .to(
        letterContentRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.3,
        },
        0.48
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#05111c] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden"
      aria-label="Ocean Letter cinematic world"
    >
      {/* CINEMATIC ENVIRONMENT PLATE: Dawn Shoreline with Wave and Wet Sand */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-full will-change-transform pointer-events-none select-none -z-20"
      >
        <Image
          src="/assets/environments/ocean_letter_shoreline.jpg"
          alt="Dawn shoreline with turquoise wave, glistened wet sand, and vintage bottle in morning light"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
          unoptimized
        />
      </div>

      {/* Maritime Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#04101a]/75 via-transparent to-[#04101a]/60 pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Coastal Dawn Sea Mist Overlay */}
      <div
        ref={coastalMistRef}
        className="absolute top-1/3 left-1/4 w-[60vw] h-[50vh] bg-gradient-to-tr from-cyan-400/20 via-sky-300/10 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
        aria-hidden="true"
      />

      {/* Ambient Top World Tag */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 backdrop-blur-md border border-sky-400/30 text-sky-100 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase">06 — Tidal Journey</span>
        </div>
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-sky-200/90 drop-shadow-sm font-medium">
          Sent across distance, finding its way home
        </span>
      </div>

      {/* MAIN CINEMATIC STAGE: Shoreline Wet Sand & Unrolled Parchment */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
        {/* Left Column: Editorial Scene Narrative & Entry Action */}
        <div className="lg:col-span-6 space-y-4 text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-300/90 font-medium">
              Atmosphere 06
            </span>
            <h3 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-[#F0F9FF] drop-shadow-[0_2px_20px_rgba(2,15,30,0.95)]">
              Ocean Letter
            </h3>
          </div>
          <p className="text-lg sm:text-2xl font-serif italic text-sky-100 font-light leading-relaxed drop-shadow-[0_1px_10px_rgba(2,15,30,0.9)]">
            “For words meant to cross any distance.”
          </p>
          <p className="text-xs sm:text-sm text-sky-100/90 max-w-md font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(2,15,30,0.9)]">
            A wave deposits a corked bottle onto wet dawn sand. The seal softens, and the weathered parchment unfolds into readable morning light.
          </p>
          <div className="pt-2">
            <AtmosphericButton
              href="/create?template=ocean-letter"
              worldId="ocean-letter"
              worldName="Ocean Letter"
            />
          </div>
        </div>

        {/* Right Column: Physical Wet Sand Plate + Parchment Sheet + Frosted Sea Glass */}
        <div
          ref={bottleGroupRef}
          className="lg:col-span-6 flex justify-center lg:justify-end will-change-transform"
        >
          <div className="relative w-68 sm:w-80 select-none drop-shadow-[0_24px_50px_rgba(0,0,0,0.95)]">
            {/* Tactile Frosted Sea-Glass Pebble */}
            <div
              ref={seaGlassRef}
              className="absolute -top-3.5 -right-2 z-30 pointer-events-none will-change-transform"
            >
              <div className="w-14 h-9 sm:w-18 sm:h-11 rounded-[50%_50%_60%_40%/45%_55%_50%_50%] bg-gradient-to-br from-cyan-200/50 via-cyan-400/30 to-teal-500/25 backdrop-blur-md border border-cyan-100/60 shadow-[0_8px_25px_rgba(34,211,238,0.5),0_2px_8px_rgba(0,0,0,0.6)] transform rotate-12 flex items-center justify-center">
                <div className="w-5 h-2 rounded-full bg-white/60 blur-[0.6px] transform -rotate-6" />
              </div>
            </div>

            {/* Wet Sand Basal Slate Plate */}
            <div className="relative w-full bg-gradient-to-br from-[#0B1A28] via-[#05111B] to-[#02080F] rounded-[2px] p-2.5 shadow-2xl border border-sky-500/20">
              {/* Wet Tidal Sheen Reflection */}
              <div className="absolute inset-0 opacity-25 pointer-events-none bg-gradient-to-tr from-cyan-400/15 via-transparent to-sky-200/15" />

              {/* Weathered Parchment Sheet Unrolled on the Sand */}
              <div
                ref={parchmentSheetRef}
                className="relative z-20 bg-[#E6ECEF] border border-sky-300/40 rounded-[2px] p-5 sm:p-6 shadow-md will-change-transform"
              >
                <div
                  ref={letterContentRef}
                  className="space-y-2.5 text-left will-change-transform"
                >
                  <p className="font-serif italic text-base sm:text-lg text-[#081B26] font-medium leading-relaxed">
                    “Our devotion is as vast and enduring as the evening tides.”
                  </p>
                  <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between text-[10px] font-mono text-sky-900/70 uppercase tracking-widest">
                    <span>Shoreline · Drift № 06</span>
                    <span>Pacific Tide</span>
                  </div>
                </div>
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
  );
}
