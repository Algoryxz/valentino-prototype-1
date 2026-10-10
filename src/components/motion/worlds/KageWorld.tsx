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
 * KageWorld (Phase 8.2 Coherent Handover Sequence):
 * Story: A letter from the quiet house.
 * Environment: Japanese Kyoto machiya courtyard, timber veranda, shoji lighting, emerald moss mist.
 * Choreography: Camera advances toward the veranda; the attendant quietly presents the rolled washi scroll;
 * the scroll travels smoothly into the foreground and unrolls to reveal deep Sumi calligraphy.
 */
export function KageWorld() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const emeraldMistRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const rolledScrollRef = useRef<HTMLDivElement | null>(null);
  const unrolledWashiRef = useRef<HTMLDivElement | null>(null);
  const calligraphyRef = useRef<HTMLDivElement | null>(null);
  const hankoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.08, y: "-2%" });
        gsap.set(emeraldMistRef.current, { opacity: 0.8 });
        gsap.set(scrollContainerRef.current, { opacity: 1, scale: 1, x: 0, y: 0 });
        gsap.set(rolledScrollRef.current, { opacity: 0 });
        gsap.set(unrolledWashiRef.current, { opacity: 1, scale: 1 });
        gsap.set(calligraphyRef.current, { opacity: 1 });
        gsap.set(hankoRef.current, { opacity: 1 });
        return;
      }

      // Initial resting posture: Wide courtyard vista, attendant presenting the rolled scroll
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(emeraldMistRef.current, {
        opacity: 0.5,
        scale: 0.95,
      });

      // Scroll container originates at the attendant's hands (left-center veranda)
      gsap.set(scrollContainerRef.current, {
        opacity: 0.9,
        scale: 0.75,
        x: -40,
        y: 25,
      });

      gsap.set(rolledScrollRef.current, {
        opacity: 1,
        scale: 1,
      });

      gsap.set(unrolledWashiRef.current, {
        opacity: 0,
        scale: 0.88,
      });

      gsap.set(calligraphyRef.current, {
        opacity: 0,
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
          scale: 1.12,
          y: "-3.5%",
          ease: "none",
          duration: 0.5,
        },
        0
      )
      .to(
        emeraldMistRef.current,
        {
          opacity: 0.85,
          scale: 1.25,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      // 2. Handover travel: Scroll glides from attendant's hands into courtyard foreground (0.10 -> 0.55)
      .to(
        scrollContainerRef.current,
        {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.1
      )
      // 3. Rolled scroll unties & unfurls into washi keepsake (0.38 -> 0.75)
      .to(
        rolledScrollRef.current,
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.25,
        },
        0.38
      )
      .to(
        unrolledWashiRef.current,
        {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          duration: 0.35,
        },
        0.4
      )
      // 4. Sumi calligraphy & cinnabar seal stamp appear crisply (0.50 -> 0.85)
      .to(
        calligraphyRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.35,
        },
        0.5
      )
      .to(
        hankoRef.current,
        {
          opacity: 1,
          scale: 1,
          ease: "back.out(1.5)",
          duration: 0.25,
        },
        0.58
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

      {/* MAIN CINEMATIC STAGE: Courtyard Handover & Unfurled Washi Scroll */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
        {/* Left Column: Editorial Scene Narrative & Entry Action */}
        <div className="lg:col-span-5 space-y-4 text-left">
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

        {/* Right Column: Physical Washi Scroll Handed from Attendant into Foreground */}
        <div
          ref={scrollContainerRef}
          className="lg:col-span-7 flex justify-center lg:justify-center will-change-transform [perspective:1000px]"
        >
          <div className="relative w-72 sm:w-88 select-none drop-shadow-[0_24px_55px_rgba(0,0,0,0.95)]">
            {/* 1. Initial State: The Rolled Washi Scroll Tied with Red Silk Cord */}
            <div
              ref={rolledScrollRef}
              className="absolute inset-x-4 top-10 z-30 p-4 bg-gradient-to-r from-[#D7CCA8] via-[#F4EED8] to-[#D7CCA8] rounded-full border border-amber-950/40 shadow-xl flex items-center justify-between will-change-transform"
            >
              <div className="w-5 h-5 rounded-full bg-[#3B2212] border border-amber-900/60" />
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-12 bg-[#991B1B] rounded-full shadow-sm" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#24170E] font-bold">
                  Washi Scroll · 手紙
                </span>
                <div className="w-2.5 h-12 bg-[#991B1B] rounded-full shadow-sm" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#3B2212] border border-amber-900/60" />
            </div>

            {/* 2. Revealed State: The Unfurled Deckled Washi Sheet in the Foreground */}
            <div
              ref={unrolledWashiRef}
              className="relative w-full bg-[#F3ECDF] border border-amber-900/30 rounded-[2px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between overflow-hidden will-change-transform"
            >
              {/* Natural Japanese cedar dowel trim at top and bottom */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#20120B] via-[#4A2E1B] to-[#20120B] shadow-xs" />
              <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r from-[#20120B] via-[#4A2E1B] to-[#20120B] shadow-xs" />

              {/* Sumi Ink Calligraphy & Authored Words - Crisp Contrast */}
              <div
                ref={calligraphyRef}
                className="py-4 space-y-3 text-center will-change-transform"
              >
                <div className="flex items-center justify-between border-b border-stone-800/20 pb-2 text-[9px] font-mono text-stone-800/80 uppercase tracking-widest font-semibold">
                  <span>Kyoto Machiya · 閑寂</span>
                  <span>Shikishi · 色紙</span>
                </div>

                <span className="text-4xl sm:text-5xl font-serif text-[#09090B] font-light tracking-widest block pt-2 drop-shadow-xs">
                  静寂
                </span>

                <p className="font-serif italic text-base sm:text-lg text-[#1C1917] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  “Some words live quietly in the shadows.”
                </p>

                {/* Cinnabar Vermilion Hanko Seal Stamp */}
                <div
                  ref={hankoRef}
                  className="flex justify-end pt-3 will-change-transform"
                >
                  <div className="w-7 h-7 rounded-[2px] bg-[#991B1B] border border-red-950/70 shadow-xs flex items-center justify-center text-xs font-serif text-white font-bold opacity-95">
                    印
                  </div>
                </div>
              </div>
            </div>
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
