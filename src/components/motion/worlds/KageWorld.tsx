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
 * KageWorld (Phase 8 Cinematic Environment):
 * Story: A letter from the quiet house.
 * Environment: Japanese courtyard, Kyoto timber architecture, bamboo tsukubai fountain,
 * stone water basin, emerald sanctuary glow, and hanging Kage banner.
 * Choreography: Scroll approaches the house; hanging rolled washi scroll unrolls to reveal
 * sumi calligraphy and quiet sentiment.
 */
export function KageWorld() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const emeraldMistRef = useRef<HTMLDivElement | null>(null);
  const scrollGroupRef = useRef<HTMLDivElement | null>(null);
  const washiBodyRef = useRef<HTMLDivElement | null>(null);
  const calligraphyRef = useRef<HTMLDivElement | null>(null);
  const hankoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.05, y: 0 });
        gsap.set(emeraldMistRef.current, { opacity: 0.7 });
        gsap.set(scrollGroupRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(washiBodyRef.current, { scaleY: 1, opacity: 1 });
        gsap.set(calligraphyRef.current, { opacity: 1 });
        gsap.set(hankoRef.current, { opacity: 1 });
        return;
      }

      // Initial resting posture: Wide courtyard vista, attendant presenting rolled scroll
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(emeraldMistRef.current, {
        opacity: 0.45,
        scale: 0.95,
      });

      gsap.set(scrollGroupRef.current, {
        opacity: 0.85,
        scale: 0.92,
        y: 20,
      });

      gsap.set(washiBodyRef.current, {
        scaleY: 0.4,
        transformOrigin: "top center",
      });

      gsap.set(calligraphyRef.current, {
        opacity: 0.2,
      });

      gsap.set(hankoRef.current, {
        opacity: 0,
        scale: 0.7,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // 1. Advance toward veranda doorway & attendant handover (0.0 -> 0.45)
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
        emeraldMistRef.current,
        {
          opacity: 0.8,
          scale: 1.2,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      .to(
        scrollGroupRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.05
      )
      // 2. Presented scroll unrolls into foreground (0.35 -> 0.75)
      .to(
        washiBodyRef.current,
        {
          scaleY: 1,
          ease: "power2.out",
          duration: 0.35,
        },
        0.35
      )
      .to(
        calligraphyRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.3,
        },
        0.45
      )
      .to(
        hankoRef.current,
        {
          opacity: 1,
          scale: 1,
          ease: "back.out(1.5)",
          duration: 0.25,
        },
        0.55
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[180vh] sm:h-[200vh]">
      <section
        ref={sectionRef}
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#050d0b] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden"
        aria-label="Kage cinematic world"
      >
        {/* CINEMATIC ENVIRONMENT PLATE: Kyoto Machiya Courtyard with Attendant Handover */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 w-full h-full will-change-transform pointer-events-none select-none -z-20"
        >
          <Image
            src="/assets/environments/kage_attendant_handover.jpg"
            alt="Kyoto machiya veranda where a kimono-clad attendant quietly presents a rolled washi scroll at night"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
            unoptimized
          />
        </div>

      {/* Atmospheric Dark Mist Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#050d0b]/75 via-transparent to-[#050d0b]/60 pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* RECOVERED EMERALD SANCTUARY GLOW */}
      <div
        ref={emeraldMistRef}
        className="absolute top-1/2 left-1/3 w-[550px] h-[500px] -translate-y-1/2 rounded-full bg-gradient-to-tr from-emerald-600/35 via-teal-900/30 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
        aria-hidden="true"
      />

      {/* Ambient Top World Tag */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-500/30 text-emerald-100 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase">03 — Quiet Gestures</span>
        </div>
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-emerald-200/90 drop-shadow-sm font-medium">
          Unspoken truths kept in cedar & stone
        </span>
      </div>

      {/* MAIN CINEMATIC STAGE: Courtyard Approach & Unrolling Washi Scroll */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
        {/* Left Column: Editorial Scene Narrative & Entry Action */}
        <div className="lg:col-span-6 space-y-4 text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-300/90 font-medium">
              Atmosphere 03
            </span>
            <h3 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-[#F0FDF4] drop-shadow-[0_2px_20px_rgba(2,15,10,0.95)]">
              Kage <span className="text-2xl sm:text-4xl opacity-80 font-light font-serif">(影)</span>
            </h3>
          </div>
          <p className="text-lg sm:text-2xl font-serif italic text-emerald-100 font-light leading-relaxed drop-shadow-[0_1px_10px_rgba(2,15,10,0.9)]">
            “For the love of quiet shadows and unspoken truths.”
          </p>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-md font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(2,15,10,0.9)]">
            At the veranda doorway, a quiet attendant presents a rolled washi scroll into the misty courtyard. Some feelings are communicated more honestly through quiet gestures and patient silence.
          </p>
          <div className="pt-2">
            <AtmosphericButton
              href="/create?template=kage"
              worldId="kage"
              worldName="Kage"
            />
          </div>
        </div>

        {/* Right Column: Physical Hanging Japanese Washi Scroll Unrolling */}
        <div
          ref={scrollGroupRef}
          className="lg:col-span-6 flex justify-center lg:justify-end will-change-transform"
        >
          <div className="relative w-56 sm:w-68 flex flex-col items-center select-none drop-shadow-[0_24px_50px_rgba(0,0,0,0.9)]">
            {/* Silk Hanging Cord & Top Cedar Dowel */}
            <div className="w-16 h-0.5 bg-amber-800/70 mb-1 rounded-full" />
            <div className="w-full h-3.5 bg-gradient-to-r from-[#20120B] via-[#3A2214] to-[#20120B] rounded-sm shadow-md border-b border-amber-950/70" />

            {/* Silk Brocade Scroll Mounting with Emerald Backglow */}
            <div
              ref={washiBodyRef}
              className="w-[94%] bg-[#121413] border-x border-stone-800/80 p-3.5 shadow-2xl flex flex-col justify-between text-center will-change-transform"
            >
              {/* Authentic Deckled Washi Sheet */}
              <div className="w-full min-h-[220px] sm:min-h-[250px] bg-[#EDE5D8] border border-stone-400/30 p-4 flex flex-col justify-between shadow-inner relative overflow-hidden">
                {/* Washi Paper Fiber Texture */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#78350F_1px,transparent_1px)] [background-size:8px_8px]" />

                {/* Sumi Ink Calligraphy */}
                <div
                  ref={calligraphyRef}
                  className="my-auto space-y-2 relative z-10 will-change-transform"
                >
                  <span className="text-4xl sm:text-5xl font-serif text-[#1C1917] font-light tracking-widest block drop-shadow-xs">
                    静寂
                  </span>
                  <p className="text-xs sm:text-sm font-serif italic text-stone-800 leading-relaxed font-medium">
                    “Some words live quietly in the shadows.”
                  </p>
                </div>

                {/* Cinnabar Vermilion Hanko Seal Stamp */}
                <div
                  ref={hankoRef}
                  className="flex justify-end pt-2 relative z-10 will-change-transform"
                >
                  <div className="w-6 h-6 rounded-[2px] bg-[#991B1B] border border-red-900/60 shadow-xs flex items-center justify-center text-[10px] font-serif text-white font-bold opacity-90">
                    印
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Weighted Cedar Dowel */}
            <div className="w-full h-3.5 bg-gradient-to-r from-[#20120B] via-[#3A2214] to-[#20120B] rounded-sm shadow-md border-t border-amber-950/70" />
          </div>
        </div>
      </div>

      {/* Bottom Ambient Cue */}
      <div className="text-center z-10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300/60">
          Scroll to step inside the cinema
        </span>
      </div>
    </section>
  </div>
);
}
