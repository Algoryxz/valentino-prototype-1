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
 * ApricotFilmWorld (Phase 8 Cinematic Environment):
 * Story: A memory before the credits.
 * Environment: 1930s vintage cinema with rich red velvet curtains, warm projector beam,
 * dark mahogany seating, and golden halation.
 * Choreography: Projector light beam warms the auditorium; illuminated celluloid memory letter
 * settles center stage to reveal the authored quotation.
 */
export function ApricotFilmWorld() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const projectorBeamRef = useRef<HTMLDivElement | null>(null);
  const memoryLetterRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.05, y: 0 });
        gsap.set(projectorBeamRef.current, { opacity: 0.85 });
        gsap.set(memoryLetterRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        return;
      }

      // Initial resting posture: Theatre auditorium in warm low light
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(projectorBeamRef.current, {
        opacity: 0.45,
        scale: 0.95,
      });

      gsap.set(memoryLetterRef.current, {
        opacity: 0.85,
        scale: 0.92,
        y: 20,
      });

      gsap.set(letterContentRef.current, {
        opacity: 0.25,
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

      // 1. Advance toward theatre stage (0.0 -> 0.5)
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
        projectorBeamRef.current,
        {
          opacity: 0.85,
          scale: 1.15,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      .to(
        memoryLetterRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.05
      )
      // 2. Projector beam illuminates letter (0.35 -> 0.75)
      .to(
        letterContentRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.35,
        },
        0.4
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#120702] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden"
      aria-label="Apricot Film cinematic world"
    >
      {/* CINEMATIC ENVIRONMENT PLATE: 1930s Vintage Cinema Stage */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-full will-change-transform pointer-events-none select-none -z-20"
      >
        <Image
          src="/assets/environments/apricot_vintage_cinema.jpg"
          alt="Vintage cinema auditorium with velvet curtains and warm incandescent projector beam"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
          unoptimized
        />
      </div>

      {/* Auditorium Chiaroscuro Mask */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#120702]/75 via-transparent to-[#120702]/60 pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Dynamic Projector Light Beam with Floating Dust Motes */}
      <div
        ref={projectorBeamRef}
        className="absolute inset-y-0 right-1/4 w-[60vw] max-w-[700px] pointer-events-none -z-10 will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse at 75% 25%, rgba(251,191,36,0.28) 0%, rgba(245,158,11,0.12) 45%, transparent 75%)",
        }}
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-amber-200/80 blur-[0.4px] animate-pulse" />
        <div className="absolute top-1/3 left-1/2 w-1 h-1 rounded-full bg-amber-100/70 blur-[0.3px]" />
        <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 rounded-full bg-amber-300/60 blur-[0.5px]" />
      </div>

      {/* Ambient Top World Tag */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 backdrop-blur-md border border-amber-500/30 text-amber-100 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase">04 — 35mm Memory</span>
        </div>
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-200/90 drop-shadow-sm font-medium">
          Scenes worth remembering before the credits
        </span>
      </div>

      {/* MAIN CINEMATIC STAGE: Illuminated Memory Letter */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
        {/* Left Column: Editorial Scene Narrative & Entry Action */}
        <div className="lg:col-span-6 space-y-4 text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300/90 font-medium">
              Atmosphere 04
            </span>
            <h3 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-[#FFFBEB] drop-shadow-[0_2px_20px_rgba(30,12,2,0.95)]">
              Apricot Film
            </h3>
          </div>
          <p className="text-lg sm:text-2xl font-serif italic text-amber-100 font-light leading-relaxed drop-shadow-[0_1px_10px_rgba(30,12,2,0.9)]">
            “For memories that feel like a sun-drenched afternoon.”
          </p>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-md font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(30,12,2,0.9)]">
            A vintage cinema, the soft mechanical whir of the projector, and velvet curtains parting to reveal your story on the screen.
          </p>
          <div className="pt-2">
            <AtmosphericButton
              href="/create?template=apricot-film"
              worldId="apricot-film"
              worldName="Apricot Film"
            />
          </div>
        </div>

        {/* Right Column: Illuminated Celluloid Memory Frame & Cream Letter */}
        <div
          ref={memoryLetterRef}
          className="lg:col-span-6 flex justify-center lg:justify-end will-change-transform"
        >
          <div className="relative w-68 sm:w-80 select-none drop-shadow-[0_24px_50px_rgba(0,0,0,0.95)]">
            {/* Vintage Film Strip Header */}
            <div className="w-full bg-[#1A0A03] border-t border-x border-amber-600/40 py-1 px-3 flex justify-between items-center rounded-t-[2px]">
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-1.5 bg-black rounded-[1px] border border-amber-700/50"
                  />
                ))}
              </div>
              <span className="text-[8.5px] font-mono uppercase tracking-widest text-amber-400/80">
                Kodachrome · 1935
              </span>
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-1.5 bg-black rounded-[1px] border border-amber-700/50"
                  />
                ))}
              </div>
            </div>

            {/* The Illuminated Screen Frame with Warm Halation */}
            <div className="w-full bg-gradient-to-b from-[#2A1005] via-[#1D0902] to-[#120501] border-x border-amber-500/40 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
              {/* Projector Halation Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-transparent to-amber-200/15 pointer-events-none mix-blend-screen" />

              {/* The Hero Cream Memory Letter */}
              <div className="relative w-full bg-[#FAF5EE] border border-amber-200/60 p-5 sm:p-6 rounded-[2px] shadow-lg text-left">
                <div
                  ref={letterContentRef}
                  className="space-y-2.5 will-change-transform"
                >
                  <p className="font-serif italic text-base sm:text-lg text-[#1C0D05] font-medium leading-relaxed">
                    “Sunlight in your hair, golden and still.”
                  </p>
                  <div className="pt-2 border-t border-amber-200/70 flex items-center justify-between text-[10px] font-mono text-amber-900/70 uppercase tracking-widest">
                    <span>Scene 04</span>
                    <span>Golden Hour</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Film Strip Footer */}
            <div className="w-full bg-[#1A0A03] border-b border-x border-amber-600/40 py-1 px-3 flex justify-between items-center rounded-b-[2px]">
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-1.5 bg-black rounded-[1px] border border-amber-700/50"
                  />
                ))}
              </div>
              <span className="text-[8.5px] font-mono uppercase tracking-widest text-amber-400/80">
                Frame 24 FPS
              </span>
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-1.5 bg-black rounded-[1px] border border-amber-700/50"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ambient Cue */}
      <div className="text-center z-10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300/60">
          Scroll to walk through the garden
        </span>
      </div>
    </section>
  );
}
