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
 * CloudNineWorld (Phase 8.2 Environment-Integrated Letter):
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
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[180vh] sm:h-[200vh]">
      <section
        ref={sectionRef}
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#0c1a2e] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden"
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
          Love grows from something small
        </span>
      </div>

      {/* MAIN CINEMATIC STAGE: Beanstalk Vine & Nestled Airmail Letter */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
        {/* Left Column: Editorial Scene Narrative & Entry Action */}
        <div className="lg:col-span-5 space-y-4 text-left">
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

        {/* Right Column: Physical Airmail Letter Nestled Directly Against the Living Vine */}
        <div
          ref={letterGroupRef}
          className="lg:col-span-7 flex justify-center lg:justify-center will-change-transform [perspective:1000px]"
        >
          <div className="relative w-72 sm:w-88 select-none drop-shadow-[0_22px_45px_rgba(2,25,50,0.7)]">
            {/* Coffee Ticket Pinned to Vine */}
            <div
              ref={ticketRef}
              className="absolute -top-3.5 -left-3 z-30 pointer-events-none transform rotate-[-5deg] drop-shadow-[0_6px_14px_rgba(3,105,161,0.35)]"
            >
              <div className="w-24 sm:w-28 py-1 px-2.5 bg-[#FAF5EE] rounded-[2px] border border-sky-300/40 text-left shadow-xs">
                <span className="font-serif italic text-[11px] sm:text-xs text-[#1A0311] leading-none block font-semibold">
                  Rainy Tuesday
                </span>
                <span className="block text-[7.5px] font-mono tracking-wider text-sky-800/80 mt-0.5 uppercase font-medium">
                  First Coffee
                </span>
              </div>
            </div>

            {/* 1. Folded Aerogramme Envelope State */}
            <div
              ref={aerogrammeCoverRef}
              className="absolute inset-0 z-25 bg-[#FAF6EE] rounded-[2px] border border-sky-200/60 p-5 shadow-lg flex flex-col justify-between overflow-hidden will-change-transform"
            >
              <div
                className="absolute top-0 inset-x-0 h-2 opacity-90"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, #0284C7, #0284C7 8px, #FFFDF9 8px, #FFFDF9 16px, #E11D48 16px, #E11D48 24px, #FFFDF9 24px, #FFFDF9 32px)",
                }}
              />
              <div className="my-auto text-center space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-900/80 font-bold block">
                  PAR AVION · AIR MAIL
                </span>
                <span className="font-serif italic text-xs text-sky-950/70">
                  Folded along the vine
                </span>
              </div>
              <div
                className="absolute bottom-0 inset-x-0 h-2 opacity-90"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, #0284C7, #0284C7 8px, #FFFDF9 8px, #FFFDF9 16px, #E11D48 16px, #E11D48 24px, #FFFDF9 24px, #FFFDF9 32px)",
                }}
              />
            </div>

            {/* 2. Physical Unfolded Airmail Aerogramme Sheet */}
            <div
              ref={letterSheetRef}
              className="relative w-full bg-[#FFFDF9] shadow-[0_20px_50px_-8px_rgba(2,30,60,0.65),0_6px_16px_rgba(0,0,0,0.12)] border border-sky-200/60 rounded-[2px] p-6 sm:p-7 overflow-hidden will-change-transform"
            >
              {/* Airmail Par Avion Hatched Border Trim (Top & Bottom) */}
              <div
                className="absolute top-0 inset-x-0 h-2 opacity-90"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, #0284C7, #0284C7 8px, #FFFDF9 8px, #FFFDF9 16px, #E11D48 16px, #E11D48 24px, #FFFDF9 24px, #FFFDF9 32px)",
                }}
              />
              <div
                className="absolute bottom-0 inset-x-0 h-2 opacity-90"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, #0284C7, #0284C7 8px, #FFFDF9 8px, #FFFDF9 16px, #E11D48 16px, #E11D48 24px, #FFFDF9 24px, #FFFDF9 32px)",
                }}
              />

              {/* Handled Paper Edge Corner Fold */}
              <div className="absolute top-0 right-0 w-5 h-5 pointer-events-none z-20">
                <div
                  className="w-full h-full bg-gradient-to-bl from-[#D8CDB6] via-[#FAF6EE] to-[#FFFDF9] shadow-[-1px_2px_4px_rgba(0,0,0,0.15)] border-b border-l border-sky-200/50"
                  style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
                />
              </div>

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
