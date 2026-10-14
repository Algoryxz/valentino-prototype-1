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
 * CloudNineWorld (Phase 8.5 Single-Stage Continuity):
 * Story: A letter nestled in the climbing vine.
 * Environment: Serene morning sky, sunrise clouds, towering green beanstalk.
 * Choreography: Camera dollies closer to the vine branch; an airmail aerogramme letter
 * tucked naturally into the foliage unfolds to reveal crisp, authored words.
 */
export function CloudNineWorld() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const letterGroupRef = useRef<HTMLDivElement | null>(null);
  const aerogrammeCoverRef = useRef<HTMLDivElement | null>(null);
  const letterSheetRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.08, y: "-2%" });
        gsap.set(letterGroupRef.current, { opacity: 1, scale: 1, x: 0, y: 0 });
        gsap.set(aerogrammeCoverRef.current, { opacity: 0 });
        gsap.set(letterSheetRef.current, { opacity: 1, scale: 1 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        gsap.set(ticketRef.current, { opacity: 1 });
        return;
      }

      // Initial resting posture: Wide vista, letter quietly nestled in the beanstalk foliage
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(letterGroupRef.current, {
        opacity: 0.9,
        scale: 0.88,
        y: 15,
      });

      gsap.set(aerogrammeCoverRef.current, {
        opacity: 1,
        rotateX: 0,
      });

      gsap.set(letterSheetRef.current, {
        opacity: 0.4,
        scale: 0.95,
      });

      gsap.set(letterContentRef.current, {
        opacity: 0,
      });

      gsap.set(ticketRef.current, {
        opacity: 0.85,
        rotate: -5,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // 1. Camera approaches beanstalk branch (0.0 -> 0.45)
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
        letterGroupRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.05
      )
      // 2. Airmail letter unfolds on the branch (0.35 -> 0.75)
      .to(
        aerogrammeCoverRef.current,
        {
          opacity: 0,
          rotateX: -90,
          ease: "power2.inOut",
          duration: 0.3,
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
      // 3. Crisp ink text reveals clearly on the paper surface (0.45 -> 0.80)
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
        ticketRef.current,
        {
          rotate: -2.5,
          opacity: 1,
          duration: 0.3,
        },
        0.4
      )
      // 4. Narrative Handover & Camera Dolly toward Evening (0.68 -> 0.98)
      // Airmail envelope settles back into the green beanstalk vines, retaining crisp paper materiality
      .to(
        letterGroupRef.current,
        {
          scale: 0.96,
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
      // Camera dollies down through cloud canopy toward ground level
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
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#0c1a2e] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.6)]"
        aria-label="Cloud Nine cinematic world"
      >
        {/* CINEMATIC ENVIRONMENT PLATE: Beanstalk ascending through morning clouds */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 w-full h-full will-change-transform pointer-events-none select-none -z-20"
        >
          <Image
            src="/assets/environments/cloud_nine_beanstalk.jpg"
            alt="Towering green beanstalk rising through serene morning clouds into pale blue sky"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
            unoptimized
          />
        </div>

        {/* Atmospheric Vignette */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#031525]/30 via-transparent to-[#04111E]/55 pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Soft Golden Sunrise Radiance */}
        <div
          className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-gradient-to-bl from-amber-100/20 via-sky-200/10 to-transparent blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Ambient Top World Tag */}
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase">01 — Skyward</span>
          </div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/80 drop-shadow-sm font-medium">
            Some letters rise on hope.
          </span>
        </div>

        {/* MAIN CINEMATIC STAGE: Beanstalk Vine & Nestled Airmail Letter */}
        <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
          {/* Left Column: Editorial Scene Narrative & Entry Action */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-sky-200/90 font-medium">
                Atmosphere 01 · Cloud Nine
              </span>
              <h3 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white drop-shadow-[0_2px_16px_rgba(3,21,37,0.9)]">
                “For the love that lifts you off the ground.”
              </h3>
            </div>
            <p className="text-sm sm:text-base text-sky-100/90 max-w-sm font-normal leading-relaxed drop-shadow-sm">
              High above the everyday world, words find the quiet space to breathe.
            </p>
            <div className="pt-2">
              <AtmosphericButton
                href="/create?template=cloud-nine"
                worldId="cloud-nine"
                worldName="Cloud Nine"
              />
            </div>
          </div>

          {/* Right Column: Physical Airmail Envelope Nestled Directly in the Living Vine */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end items-center">
            <div
              ref={letterGroupRef}
              className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[540/724] will-change-transform drop-shadow-[0_20px_45px_rgba(2,12,24,0.65)] select-none"
            >
              {/* Vintage Airmail Ticket pinned casually to the left deckled margin */}
              <div
                ref={ticketRef}
                className="absolute -top-3 -left-4 z-30 transform rotate-[-4deg] drop-shadow-md pointer-events-none will-change-transform"
                aria-hidden="true"
              >
                <div className="w-24 sm:w-28 py-1 px-2 bg-[#FFFDF9] rounded-xs border border-sky-900/30 text-left shadow-xs">
                  <span className="text-[7.5px] sm:text-[8px] font-mono uppercase tracking-widest text-sky-950 font-bold block">
                    AIR LETTER
                  </span>
                  <span className="font-serif italic text-[11px] sm:text-xs text-sky-900 leading-none block mt-0.5 font-semibold">
                    Dawn Flight
                  </span>
                </div>
              </div>

              {/* 1. Closed Airmail Aerogramme Cover on the Branch */}
              <div
                ref={aerogrammeCoverRef}
                className="absolute inset-0 z-20 pointer-events-none will-change-transform"
                aria-hidden="true"
              >
                <Image
                  src="/assets/stationery/airmail_envelope.png"
                  alt="Airmail envelope nestled naturally on beanstalk branch"
                  fill
                  sizes="(max-width: 640px) 280px, 340px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* 2. Unfolded Airmail Stationery Sheet with Live Typography */}
              <div
                ref={letterSheetRef}
                className="relative w-full h-full bg-[#FAF5EE] border border-sky-300/60 rounded-[2px] p-6 sm:p-7 flex flex-col justify-between shadow-2xl overflow-hidden will-change-transform z-10"
              >
                {/* Airmail Border Chevron Strip along Top and Bottom */}
                <div className="w-full h-2.5 bg-[repeating-linear-gradient(45deg,#3B82F6,#3B82F6_8px,#FAF5EE_8px,#FAF5EE_12px,#EF4444_12px,#EF4444_20px,#FAF5EE_20px,#FAF5EE_24px)] opacity-90 rounded-xs mb-3" />

                {/* Live Authored Editorial Demonstration Text - High Contrast Ink */}
                <div
                  ref={letterContentRef}
                  className="pt-3 pb-2 space-y-3 text-left will-change-transform"
                >
                  <p className="font-serif italic text-base sm:text-xl text-[#0A192F] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    “Every sunrise is lighter with you.”
                  </p>
                  <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-[10px] font-mono text-sky-950 font-bold uppercase tracking-widest">
                    <span>Par Avion · № 01</span>
                    <span>Skyward</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ambient Cue */}
        <div className="text-center z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
            Scroll to descend into evening
          </span>
        </div>
      </section>
    </div>
  );
}
