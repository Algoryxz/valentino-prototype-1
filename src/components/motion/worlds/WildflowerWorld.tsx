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
 * WildflowerWorld (Phase 8 Cinematic Environment):
 * Story: A letter grown in the garden.
 * Environment: Living English cottage garden, winding gravel path, foxgloves,
 * weathered teak table in dappled morning light.
 * Choreography: Scroll advances to the garden table; botanical journal opens to reveal
 * a deckled letter beside an authentic pressed dried flower specimen.
 */
export function WildflowerWorld() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const sunbeamsRef = useRef<HTMLDivElement | null>(null);
  const journalGroupRef = useRef<HTMLDivElement | null>(null);
  const journalCoverRef = useRef<HTMLDivElement | null>(null);
  const letterSheetRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);
  const specimenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.05, y: 0 });
        gsap.set(sunbeamsRef.current, { opacity: 0.6 });
        gsap.set(journalGroupRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(journalCoverRef.current, { rotateY: -140, opacity: 0.1 });
        gsap.set(letterSheetRef.current, { opacity: 1, y: 0 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        gsap.set(specimenRef.current, { opacity: 0.95 });
        return;
      }

      // Initial resting posture: Wide garden view, closed journal
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(sunbeamsRef.current, {
        opacity: 0.45,
        scale: 0.95,
      });

      gsap.set(journalGroupRef.current, {
        opacity: 0.85,
        scale: 0.92,
        y: 20,
      });

      gsap.set(journalCoverRef.current, {
        rotateY: 0,
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
      });

      gsap.set(letterSheetRef.current, {
        opacity: 0.4,
        scale: 0.96,
      });

      gsap.set(letterContentRef.current, {
        opacity: 0.2,
      });

      gsap.set(specimenRef.current, {
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

      // 1. Advance along path toward garden table (0.0 -> 0.5)
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
        sunbeamsRef.current,
        {
          opacity: 0.8,
          scale: 1.15,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      .to(
        journalGroupRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.05
      )
      // 2. Open botanical journal cover (0.35 -> 0.70)
      .to(
        journalCoverRef.current,
        {
          rotateY: -135,
          opacity: 0.15,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.35
      )
      .to(
        letterSheetRef.current,
        {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          duration: 0.35,
        },
        0.42
      )
      .to(
        specimenRef.current,
        {
          opacity: 0.95,
          scale: 1,
          ease: "power1.out",
          duration: 0.3,
        },
        0.48
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#1a1f14] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden"
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

      {/* MAIN CINEMATIC STAGE: Garden Table & Botanical Journal Reveal */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
        {/* Left Column: Editorial Scene Narrative & Entry Action */}
        <div className="lg:col-span-6 space-y-4 text-left">
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

        {/* Right Column: Physical Botanical Journal with Pressed Specimen & Cotton Letter */}
        <div
          ref={journalGroupRef}
          className="lg:col-span-6 flex justify-center lg:justify-end will-change-transform [perspective:1000px]"
        >
          <div className="relative w-68 sm:w-80 select-none drop-shadow-[0_24px_50px_rgba(0,0,0,0.9)]">
            {/* Journal Book Binding Frame */}
            <div className="relative w-full bg-[#3D2C1E] border border-amber-900/60 rounded-[3px] p-2.5 shadow-2xl flex flex-col">
              {/* Journal Linen Spine */}
              <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-[#24170E] rounded-l-[3px] border-r border-amber-950/80" />

              {/* Journal Flap / Front Cover (Lifts open on scroll) */}
              <div
                ref={journalCoverRef}
                className="absolute inset-0 bg-gradient-to-r from-[#2F2015] via-[#4A3728] to-[#362518] rounded-[3px] border border-amber-800/40 z-30 shadow-md flex items-center justify-center p-5 will-change-transform"
              >
                <span className="font-serif italic text-[11px] text-amber-200/60 uppercase tracking-widest border border-amber-600/30 px-2.5 py-1 rounded-xs">
                  Botanical Journal · Herbarium
                </span>
              </div>

              {/* Inside Journal Page: Deckled Cotton Sheet */}
              <div
                ref={letterSheetRef}
                className="relative z-20 ml-1.5 bg-[#FAF7F0] border border-stone-300/80 rounded-[2px] p-5 sm:p-6 shadow-md will-change-transform"
              >
                {/* Real Pressed Botanical Specimen Pinned Naturally */}
                <div
                  ref={specimenRef}
                  className="absolute -top-3.5 right-3 w-14 sm:w-16 h-20 sm:h-24 z-20 pointer-events-none drop-shadow-[1px_4px_6px_rgba(60,40,15,0.25)] will-change-transform"
                >
                  <Image
                    src="/assets/stationery/pressed_botanical.png"
                    alt="Authentic pressed dried flower specimen"
                    fill
                    sizes="64px"
                    className="object-contain"
                    unoptimized
                  />
                </div>

                {/* Linen Thread Stitching */}
                <div className="absolute -top-1 left-3.5 w-1 h-3.5 bg-[#8C7D6B] rounded-full" />
                <div className="absolute top-1 left-2 w-3.5 h-1 bg-[#8C7D6B] rounded-full" />

                {/* Authored Demonstration Letter Text */}
                <div
                  ref={letterContentRef}
                  className="pt-5 space-y-2.5 text-left will-change-transform"
                >
                  <p className="font-serif italic text-base sm:text-lg text-[#1C1814] font-medium leading-relaxed">
                    “Pressed by hand, kept forever.”
                  </p>
                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] font-mono text-stone-700/70 uppercase tracking-widest">
                    <span>Meadow Flora · № 05</span>
                    <span>Garden Herbarium</span>
                  </div>
                </div>
              </div>
            </div>
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
  );
}
