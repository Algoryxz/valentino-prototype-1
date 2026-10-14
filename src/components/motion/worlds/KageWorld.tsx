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
 * KageWorld (Phase 8.5 Material Polish & Single-Stage Continuity):
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
        0.05
      )
      // 2. Rolled scroll travels smoothly forward & unrolls in 3D (0.35 -> 0.75)
      .to(
        rolledScrollRef.current,
        {
          opacity: 0,
          scale: 0.9,
          ease: "power2.inOut",
          duration: 0.28,
        },
        0.35
      )
      .to(
        unrolledWashiRef.current,
        {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          duration: 0.35,
        },
        0.35
      )
      // 3. Deep black Sumi calligraphy reveals stroke by stroke (0.45 -> 0.80)
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
          ease: "back.out(1.7)",
          duration: 0.24,
        },
        0.55
      )
      // 4. Narrative Handover & Camera Dolly toward Evening (0.68 -> 0.98)
      // Washi scroll settles calmly into foreground space
      .to(
        scrollContainerRef.current,
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
      // Mist settles
      .to(
        emeraldMistRef.current,
        {
          opacity: 0.25,
          scale: 0.85,
          ease: "power2.out",
          duration: 0.26,
        },
        0.70
      )
      // Camera dollies forward along veranda
      .to(
        bgImageRef.current,
        {
          scale: 1.25,
          y: "-5%",
          x: "2%",
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
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#050d0b] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden shadow-[0_-24px_50px_rgba(0,0,0,0.7)]"
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

        {/* Dynamic Shoji Glow on Veranda */}
        <div
          ref={emeraldMistRef}
          className="absolute bottom-1/4 left-1/3 w-[500px] h-[400px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
          aria-hidden="true"
        />

        {/* Ambient Top World Tag */}
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-500/30 text-emerald-100 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase">03 — The Quiet House</span>
          </div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-emerald-200/90 drop-shadow-sm font-medium">
            Some are handed over in silence.
          </span>
        </div>

        {/* MAIN CINEMATIC STAGE: Veranda Doorway & Handed-Over Washi Scroll */}
        <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
          {/* Left Column: Editorial Scene Narrative & Entry Action */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300/90 font-medium">
                Atmosphere 03 · Kage
              </span>
              <h3 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#ECFDF5] drop-shadow-[0_2px_16px_rgba(2,15,10,0.9)]">
                “For the love that needs no explanation.”
              </h3>
            </div>
            <p className="text-sm sm:text-base text-emerald-100/90 max-w-sm font-normal leading-relaxed drop-shadow-sm">
              Across polished cedar and tatami shadows, a letter presented with two hands in absolute stillness.
            </p>
            <div className="pt-2">
              <AtmosphericButton
                href="/create?template=kage"
                worldId="kage"
                worldName="Kage"
              />
            </div>
          </div>

          {/* Right Column: Physical Washi Scroll Traveling from Attendant into Foreground */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end items-center">
            <div
              ref={scrollContainerRef}
              className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[540/724] will-change-transform drop-shadow-[0_22px_48px_rgba(1,10,8,0.75)] select-none"
            >
              {/* 1. Rolled Silk-Tied Washi Scroll (Presented by the attendant) */}
              <div
                ref={rolledScrollRef}
                className="absolute inset-0 z-20 pointer-events-none will-change-transform flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="relative w-3/4 aspect-[3/4]">
                  <Image
                    src="/assets/stationery/washi_scroll.png"
                    alt="Rolled washi scroll presented by attendant"
                    fill
                    sizes="(max-width: 640px) 260px, 320px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* 2. Unrolled Handmade Washi Paper Sheet with Sumi Calligraphy */}
              <div
                ref={unrolledWashiRef}
                className="relative w-full h-full bg-[#FAF5EE] border border-emerald-900/30 rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden will-change-transform z-10"
                style={{
                  backgroundImage:
                    "radial-gradient(#d1fae5 0.5px, transparent 0.5px), radial-gradient(#d1fae5 0.5px, #FAF5EE 0.5px)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 10px 10px",
                }}
              >
                {/* Washi Raw Deckled Header Bar */}
                <div className="w-full pb-2 border-b border-emerald-950/20 flex justify-between items-center text-[9px] font-mono tracking-widest uppercase text-emerald-950 font-bold">
                  <span>Kyoto Machiya · 影</span>
                  <span>№ 03</span>
                </div>

                {/* Live Authored Sumi Calligraphy Demonstration Text */}
                <div
                  ref={calligraphyRef}
                  className="py-4 space-y-3 text-left will-change-transform"
                >
                  <p className="font-serif italic text-base sm:text-xl text-[#031A12] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                    “In the quiet house, I heard your voice first.”
                  </p>
                  <div className="pt-2 border-t border-emerald-950/15 flex items-center justify-between text-[10px] font-mono text-emerald-950 font-bold uppercase tracking-widest">
                    <span>Shoji Light</span>
                    <span>Tatami Stillness</span>
                  </div>
                </div>

                {/* Hanko Vermilion Seal Stamp at bottom right */}
                <div
                  ref={hankoRef}
                  className="w-full pt-2 border-t border-emerald-950/20 flex justify-between items-center will-change-transform"
                >
                  <span className="text-[8.5px] font-mono text-emerald-900/80 uppercase tracking-widest">
                    Washi Fiber Paper
                  </span>
                  <div className="w-7 h-7 rounded-[2px] bg-[#991B1B] border border-red-950/70 shadow-xs flex items-center justify-center text-xs font-serif text-white font-bold opacity-95">
                    印
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
