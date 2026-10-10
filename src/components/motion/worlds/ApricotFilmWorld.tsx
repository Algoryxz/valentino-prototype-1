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
 * ApricotFilmWorld (Phase 8.2 Environment-Integrated Cinema Screen):
 * Story: A memory projected before the credits.
 * Environment: 1930s vintage cinema auditorium, velvet stage curtains, projector beam.
 * Choreography: Camera dollies down the aisle toward the center stage; velvet curtains part open;
 * the letter reveals directly on the illuminated cinema screen at center stage under the projector beam.
 */
export function ApricotFilmWorld() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const projectorBeamRef = useRef<HTMLDivElement | null>(null);
  const curtainLeftRef = useRef<HTMLDivElement | null>(null);
  const curtainRightRef = useRef<HTMLDivElement | null>(null);
  const screenStageRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.1, y: "-3%" });
        gsap.set(projectorBeamRef.current, { opacity: 0.9 });
        gsap.set([curtainLeftRef.current, curtainRightRef.current], { xPercent: (i) => (i === 0 ? -100 : 100) });
        gsap.set(screenStageRef.current, { opacity: 1, scale: 1 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        return;
      }

      // Initial resting posture: Curtains closed, projector warming up
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(projectorBeamRef.current, {
        opacity: 0.45,
        scale: 0.95,
      });

      gsap.set(curtainLeftRef.current, {
        xPercent: 0,
      });

      gsap.set(curtainRightRef.current, {
        xPercent: 0,
      });

      gsap.set(screenStageRef.current, {
        opacity: 0.7,
        scale: 0.94,
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

      // 1. Dolly camera down the theatre aisle toward the stage (0.0 -> 0.45)
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
        projectorBeamRef.current,
        {
          opacity: 0.85,
          scale: 1.2,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      // 2. Velvet curtains part open wide to wings (0.08 -> 0.38)
      .to(
        curtainLeftRef.current,
        {
          xPercent: -105,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.08
      )
      .to(
        curtainRightRef.current,
        {
          xPercent: 105,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.08
      )
      // 3. Illuminated cinema screen expands into view on stage (0.35 -> 0.75)
      .to(
        screenStageRef.current,
        {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          duration: 0.4,
        },
        0.35
      )
      // 4. Authored memory title reveals with high contrast (0.48 -> 0.82)
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
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#120702] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden"
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

      {/* MAIN CINEMATIC STAGE: Stage Centered Architecture */}
      <div className="w-full max-w-5xl mx-auto my-auto flex flex-col items-center gap-6 z-20">
        {/* Editorial Scene Narrative & Entry Action (Centered Header) */}
        <div className="max-w-xl text-center space-y-2">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300/90 font-medium">
              Atmosphere 04 · Apricot Film
            </span>
            <h3 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#FFFBEB] drop-shadow-[0_2px_20px_rgba(30,12,2,0.95)]">
              “For memories that feel like a sun-drenched afternoon.”
            </h3>
          </div>
          <div className="pt-1">
            <AtmosphericButton
              href="/create?template=apricot-film"
              worldId="apricot-film"
              worldName="Apricot Film"
            />
          </div>
        </div>

        {/* The Cinema Screen at Center Stage with Parting Velvet Curtains */}
        <div className="w-full flex justify-center will-change-transform [perspective:1000px]">
          <div className="relative w-[320px] sm:w-[480px] select-none rounded-[2px] overflow-hidden drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
            {/* The Illuminated Cinema Screen Frame */}
            <div
              ref={screenStageRef}
              className="relative w-full bg-[#FAF5EE] border border-amber-300/60 rounded-[2px] p-6 sm:p-7 shadow-2xl overflow-hidden will-change-transform"
            >
              {/* Restrained 35mm Perforation Header */}
              <div className="w-full pb-2 mb-2 border-b border-amber-800/20 flex justify-between items-center text-[8.5px] font-mono uppercase tracking-widest text-amber-900/80">
                <span className="font-semibold">Kodachrome · 1935</span>
                <span>Scene 04 · Frame 24</span>
              </div>

              {/* Screen Projector Glow Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/15 via-transparent to-amber-200/10 pointer-events-none mix-blend-screen" />

              {/* The Projected Letter - Crisp Contrast Typography */}
              <div
                ref={letterContentRef}
                className="py-3 space-y-3 text-left relative z-10 will-change-transform"
              >
                <p className="font-serif italic text-base sm:text-xl text-[#1C0D05] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  “Sunlight in your hair, golden and still.”
                </p>
                <div className="pt-2 border-t border-amber-800/20 flex items-center justify-between text-[10px] font-mono text-amber-950 font-bold uppercase tracking-widest">
                  <span>Golden Hour</span>
                  <span>35mm Projection</span>
                </div>
              </div>

              {/* Restrained 35mm Perforation Footer */}
              <div className="w-full pt-2 mt-2 border-t border-amber-800/20 flex justify-between items-center text-[8px] font-mono text-amber-900/70">
                <span>Atelier Valentino Cinema</span>
                <span>Print № 04</span>
              </div>
            </div>

            {/* Stage Velvet Curtains (Parting on scroll) */}
            <div
              ref={curtainLeftRef}
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#500714] via-[#7F1D1D] to-[#3B0710] border-r border-amber-400/30 shadow-2xl z-30 will-change-transform"
            />
            <div
              ref={curtainRightRef}
              className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#500714] via-[#7F1D1D] to-[#3B0710] border-l border-amber-400/30 shadow-2xl z-30 will-change-transform"
            />
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
  </div>
);
}
