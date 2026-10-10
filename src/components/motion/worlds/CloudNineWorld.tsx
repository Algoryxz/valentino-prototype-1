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
 * CloudNineWorld (Phase 8 Cinematic Environment):
 * Story: A letter among the clouds.
 * Environment: Serene morning sky, layers of gentle clouds, towering green beanstalk.
 * Choreography: Scroll ascends upward through clouds along the climbing vine;
 * airmail letter unfolds to reveal live demonstration text.
 */
export function CloudNineWorld() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const letterGroupRef = useRef<HTMLDivElement | null>(null);
  const letterSheetRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.05, y: 0 });
        gsap.set(letterGroupRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(letterSheetRef.current, { rotateX: 0, rotate: 1.5 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        gsap.set(ticketRef.current, { opacity: 1 });
        return;
      }

      // Initial resting posture: Wide vista, letter resting quietly on vine
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(letterGroupRef.current, {
        opacity: 0.85,
        scale: 0.92,
        y: 20,
      });

      gsap.set(letterSheetRef.current, {
        rotateX: 18,
        rotate: -2.5,
        transformOrigin: "center center",
      });

      gsap.set(letterContentRef.current, {
        opacity: 0.35,
      });

      gsap.set(ticketRef.current, {
        opacity: 0.9,
        rotate: -6,
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

      // 1. Ascend through cloud layers & approach vine (0.0 -> 0.5)
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
      // 2. Unfold letter nestled in vine (0.35 -> 0.75)
      .to(
        letterSheetRef.current,
        {
          rotateX: 0,
          rotate: 1.5,
          ease: "power2.out",
          duration: 0.35,
        },
        0.35
      )
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
          rotate: -3.5,
          opacity: 1,
          duration: 0.3,
        },
        0.4
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#0c1a2e] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden"
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
        className="absolute inset-0 bg-gradient-to-b from-[#031525]/35 via-transparent to-[#04111E]/55 pointer-events-none -z-10"
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
          Love grows from something small
        </span>
      </div>

      {/* MAIN CINEMATIC STAGE: Beanstalk Vine & Nestled Airmail Letter */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
        {/* Left Column: Editorial Scene Narrative & Entry Action */}
        <div className="lg:col-span-6 space-y-4 text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-200/90 font-medium">
              Atmosphere 01
            </span>
            <h3 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-white drop-shadow-[0_2px_18px_rgba(2,20,40,0.85)]">
              Cloud Nine
            </h3>
          </div>
          <p className="text-lg sm:text-2xl font-serif italic text-sky-100 font-light leading-relaxed drop-shadow-[0_1px_8px_rgba(2,20,40,0.8)]">
            “For the person who makes everything lighter.”
          </p>
          <p className="text-xs sm:text-sm text-sky-100/90 max-w-md font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(2,20,40,0.8)]">
            Nestled high along the climbing vine, an airmail letter carried upward toward the quiet morning light.
          </p>
          <div className="pt-2">
            <AtmosphericButton
              href="/create?template=cloud-nine"
              worldId="cloud-nine"
              worldName="Cloud Nine"
            />
          </div>
        </div>

        {/* Right Column: Physical Airmail Letter Resting Against the Living Vine */}
        <div
          ref={letterGroupRef}
          className="lg:col-span-6 flex justify-center lg:justify-end will-change-transform [perspective:1000px]"
        >
          <div className="relative w-68 sm:w-80 select-none">
            {/* Coffee Ticket Pinned to Vine */}
            <div
              ref={ticketRef}
              className="absolute -top-3.5 -left-3 z-30 pointer-events-none transform rotate-[-6deg] drop-shadow-[0_6px_14px_rgba(3,105,161,0.35)]"
            >
              <div className="w-24 sm:w-28 py-1 px-2.5 bg-[#FAF5EE] rounded-[2px] border border-sky-300/40 text-left shadow-xs">
                <span className="font-serif italic text-[11px] sm:text-xs text-[#1A0311] leading-none block">
                  Rainy Tuesday
                </span>
                <span className="block text-[7.5px] font-mono tracking-wider text-sky-800/80 mt-0.5 uppercase">
                  First Coffee
                </span>
              </div>
            </div>

            {/* Physical Airmail Aerogramme Sheet */}
            <div
              ref={letterSheetRef}
              className="relative w-full bg-[#FFFDF9] shadow-[0_20px_50px_-8px_rgba(2,30,60,0.65),0_6px_16px_rgba(0,0,0,0.12)] border border-sky-200/50 rounded-[2px] p-5 sm:p-6 overflow-hidden will-change-transform"
            >
              {/* Airmail Par Avion Hatched Border Trim (Top & Bottom) */}
              <div
                className="absolute top-0 inset-x-0 h-1.5 opacity-80"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, #0284C7, #0284C7 8px, #FFFDF9 8px, #FFFDF9 16px, #E11D48 16px, #E11D48 24px, #FFFDF9 24px, #FFFDF9 32px)",
                }}
              />
              <div
                className="absolute bottom-0 inset-x-0 h-1.5 opacity-80"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, #0284C7, #0284C7 8px, #FFFDF9 8px, #FFFDF9 16px, #E11D48 16px, #E11D48 24px, #FFFDF9 24px, #FFFDF9 32px)",
                }}
              />

              {/* Handled Paper Edge Curl */}
              <div className="absolute top-0 right-0 w-4 h-4 pointer-events-none z-20">
                <div
                  className="w-full h-full bg-gradient-to-bl from-[#E2D8C3] via-[#FAF6EE] to-[#FFFDF9] shadow-[-1px_2px_4px_rgba(0,0,0,0.12)] border-b border-l border-sky-200/40"
                  style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
                />
              </div>

              {/* Live Authored Editorial Demonstration Text */}
              <div
                ref={letterContentRef}
                className="pt-3 pb-1 space-y-2.5 text-left will-change-transform"
              >
                <p className="font-serif italic text-base sm:text-lg text-[#0F172A] font-medium leading-relaxed">
                  “Every sunrise is lighter with you.”
                </p>
                <div className="pt-2 border-t border-sky-100 flex items-center justify-between text-[10px] font-mono text-sky-900/70 uppercase tracking-widest">
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
  );
}
