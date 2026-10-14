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
 * WildflowerWorld (Phase 8.5 Material Polish & Single-Stage Continuity):
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
          scale: 1.25,
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
      // 2. Botanical journal cover opens in 3D (0.35 -> 0.75)
      .to(
        journalCoverRef.current,
        {
          rotateY: -140,
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
        0.35
      )
      // 3. Crisp ink text reveals clearly on cotton paper surface (0.45 -> 0.80)
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
        specimenRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
        },
        0.4
      )
      // 4. Narrative Handover & Camera Dolly toward Shoreline (0.68 -> 0.98)
      // Journal settles into the weathered teak table
      .to(
        journalTableRef.current,
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
      // Sunbeams soften
      .to(
        sunbeamsRef.current,
        {
          opacity: 0.25,
          scale: 0.85,
          ease: "power2.out",
          duration: 0.26,
        },
        0.70
      )
      // Camera dollies forward
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
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#0a140d] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden shadow-[0_-24px_50px_rgba(0,0,0,0.7)]"
        aria-label="Wildflower Paper cinematic world"
      >
        {/* CINEMATIC ENVIRONMENT PLATE: English Cottage Garden Path with Weathered Teak Table */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 w-full h-full will-change-transform pointer-events-none select-none -z-20"
        >
          <Image
            src="/assets/environments/wildflower_cottage_garden.jpg"
            alt="English cottage garden path with blooming foxgloves, morning sunlight, and weathered wooden table"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
            unoptimized
          />
        </div>

        {/* Soft Garden Shaded Vignette */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0a140d]/75 via-transparent to-[#0a140d]/60 pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Dynamic Warm Sunbeam Flare */}
        <div
          ref={sunbeamsRef}
          className="absolute top-1/6 left-1/4 w-[550px] h-[450px] rounded-full bg-gradient-to-br from-amber-300/20 via-emerald-300/10 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
          aria-hidden="true"
        />

        {/* Ambient Top World Tag */}
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-500/30 text-emerald-100 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase">05 — Grown in the Garden</span>
          </div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-emerald-200/90 drop-shadow-sm font-medium">
            Some grow slowly, like wildflowers.
          </span>
        </div>

        {/* MAIN CINEMATIC STAGE: Garden Table & Botanical Journal Letter */}
        <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
          {/* Left Column: Physical Botanical Journal Resting on Table */}
          <div className="lg:col-span-7 flex justify-center lg:justify-start items-center">
            <div
              ref={journalTableRef}
              className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[540/724] will-change-transform drop-shadow-[0_22px_45px_rgba(5,20,10,0.7)] select-none"
            >
              {/* Authentic Pressed Lavender Specimen pinned to upper margin */}
              <div
                ref={specimenRef}
                className="absolute -top-3.5 -right-3 z-30 transform rotate-[8deg] drop-shadow-md pointer-events-none will-change-transform"
                aria-hidden="true"
              >
                <div className="py-1 px-2.5 bg-[#FAF3E8] rounded-xs border border-amber-900/30 text-right shadow-xs flex items-center gap-1.5">
                  <span className="text-xs">🪻</span>
                  <span className="font-serif italic text-[11px] text-[#2C0A04] font-semibold">
                    Lavender · July
                  </span>
                </div>
              </div>

              {/* 1. Closed Botanical Linen Journal Cover */}
              <div
                ref={journalCoverRef}
                className="absolute inset-0 z-20 pointer-events-none will-change-transform flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/stationery/botanical_journal.png"
                    alt="Botanical linen journal resting on wooden garden table"
                    fill
                    sizes="(max-width: 640px) 280px, 340px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* 2. Unfolded Deckled Cotton Letter Inside the Journal */}
              <div
                ref={letterSheetRef}
                className="relative w-full h-full bg-[#FAF5EE] border border-amber-800/30 rounded-[2px] p-6 sm:p-7 flex flex-col justify-between shadow-2xl overflow-hidden will-change-transform z-10"
              >
                {/* Botanical Dried Herbarium Header */}
                <div className="w-full pb-2 border-b border-amber-900/20 flex justify-between items-center text-[9px] font-mono tracking-widest uppercase text-amber-950 font-bold">
                  <span>Atelier Herbarium</span>
                  <span>№ 05</span>
                </div>

                {/* Live Authored Editorial Demonstration Text */}
                <div
                  ref={letterContentRef}
                  className="py-3 space-y-3 text-left will-change-transform"
                >
                  <p className="font-serif italic text-base sm:text-xl text-[#1E0D03] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                    “We grew together, like wildflowers in untamed grass.”
                  </p>
                  <div className="pt-2 border-t border-amber-900/15 flex items-center justify-between text-[10px] font-mono text-amber-950 font-bold uppercase tracking-widest">
                    <span>Morning Petals</span>
                    <span>Wild Harvest</span>
                  </div>
                </div>

                {/* Footer Tag */}
                <div className="w-full pt-2 border-t border-amber-900/20 flex justify-between items-center text-[8.5px] font-mono text-amber-900/80 uppercase tracking-widest">
                  <span>Pressed Bloom</span>
                  <span>Sunlight Kept</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Scene Narrative & Entry Action */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300/90 font-medium">
                Atmosphere 05 · Wildflower Paper
              </span>
              <h3 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#ECFDF5] drop-shadow-[0_2px_16px_rgba(3,20,10,0.9)]">
                “For the love that is honest, wild, and tender.”
              </h3>
            </div>
            <p className="text-sm sm:text-base text-emerald-100/90 max-w-sm font-normal leading-relaxed drop-shadow-sm">
              In a garden path where sunlight meets moss, a botanist&apos;s field note folded with dried blooms.
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
