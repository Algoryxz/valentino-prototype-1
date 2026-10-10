"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmbientBotanicalFrame } from "@/components/motion/AmbientBotanicalFrame";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SpatialStationeryUnfold (Phase 8 Cinematic Stationery Experience):
 * An authentic scroll-driven physical letter unfolding sequence.
 *
 * Sequence:
 * 1. Approach: Compact, imperfectly folded cream cotton stationery rests on a quiet surface.
 *    Meaningful details (vintage coffee ticket and pressed botanical specimen) are already present.
 * 2. First Movement: Outer top paper flap lifts upward along its fold crease.
 * 3. Unfold: Bottom flap unrolls downward; crease shadows flatten naturally into a single deckled sheet.
 * 4. Letter Reveal: Real HTML editorial quotation and milestones reveal via ink opacity.
 * 5. Resolution: Entire paper settles gently; clean, unencumbered CTA resolves below.
 */
export function SpatialStationeryUnfold() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const letterWrapperRef = useRef<HTMLDivElement | null>(null);
  const topFlapRef = useRef<HTMLDivElement | null>(null);
  const bottomFlapRef = useRef<HTMLDivElement | null>(null);
  const creaseShadowTopRef = useRef<HTMLDivElement | null>(null);
  const creaseShadowBottomRef = useRef<HTMLDivElement | null>(null);
  const letterTextRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(topFlapRef.current, { rotateX: 0, opacity: 0 });
        gsap.set(bottomFlapRef.current, { rotateX: 0, opacity: 0 });
        gsap.set([creaseShadowTopRef.current, creaseShadowBottomRef.current], { opacity: 0 });
        gsap.set(letterTextRef.current, { opacity: 1 });
        gsap.set(ctaRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Initial resting posture: compact folded trifold envelope shape
      gsap.set(topFlapRef.current, {
        rotateX: -140,
        transformOrigin: "top center",
        transformStyle: "preserve-3d",
      });

      gsap.set(bottomFlapRef.current, {
        rotateX: 140,
        transformOrigin: "bottom center",
        transformStyle: "preserve-3d",
      });

      gsap.set([creaseShadowTopRef.current, creaseShadowBottomRef.current], {
        opacity: 0.6,
      });

      gsap.set(letterTextRef.current, {
        opacity: 0,
      });

      gsap.set(ctaRef.current, {
        opacity: 0,
        y: 12,
      });

      // Master Scroll-Driven Timeline scrubbed against dedicated scroll track
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // 1. Approach & First Movement: Top flap lifts (0.10 -> 0.40)
      tl.to(
        topFlapRef.current,
        {
          rotateX: 0,
          opacity: 0.1,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.1
      )
      .to(
        creaseShadowTopRef.current,
        {
          opacity: 0,
          ease: "power1.out",
          duration: 0.25,
        },
        0.2
      )
      // 2. Unfold: Bottom flap unfolds downward (0.35 -> 0.65)
      .to(
        bottomFlapRef.current,
        {
          rotateX: 0,
          opacity: 0.1,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.35
      )
      .to(
        creaseShadowBottomRef.current,
        {
          opacity: 0,
          ease: "power1.out",
          duration: 0.25,
        },
        0.45
      )
      // 3. Creases flatten & live text reveals (0.55 -> 0.85)
      .to(
        letterTextRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.3,
        },
        0.55
      )
      // 4. CTA resolves cleanly below settled letter (0.75 -> 0.95)
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.25,
        },
        0.75
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[260vh] sm:h-[250vh]">
      <section
        ref={sectionRef}
        id="how-it-works"
        data-testid="little-things-scene"
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between items-center bg-transparent text-[#240412] pt-28 sm:pt-32 pb-8 sm:pb-10 px-4 select-none overflow-hidden"
      >
      <AmbientBotanicalFrame variant="dusk" density="sparse" intensity={0.25} />

      {/* Editorial Header with ample room beneath fixed navigation */}
      <div className="text-center max-w-xl mx-auto space-y-1 relative z-10">
        <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#7A1D45] font-semibold drop-shadow-[0_1px_4px_rgba(255,245,248,0.4)]">
          The Unsealing · Physical Keepsakes
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#1A0311] tracking-tight leading-tight drop-shadow-[0_1px_10px_rgba(255,245,248,0.5)]">
          Made from little things.
        </h2>
        <p className="text-xs sm:text-sm text-[#36091E] font-normal leading-relaxed drop-shadow-[0_1px_8px_rgba(255,245,248,0.5)] max-w-md mx-auto">
          A pressed petal, a fold of deckled cotton, a ticket kept from a rainy Tuesday.
        </p>
      </div>

      {/* PHYSICAL STATIONERY: One cohesive sheet unfolding naturally */}
      <div
        ref={letterWrapperRef}
        className="relative w-full max-w-[320px] sm:max-w-[360px] my-auto flex justify-center [perspective:1400px] will-change-transform z-20"
      >
        {/* Pressed Dried Flower pinned naturally to upper left */}
        <div
          className="absolute -top-5 -left-4 sm:-top-6 sm:-left-5 w-14 sm:w-16 h-20 sm:h-24 z-40 pointer-events-none drop-shadow-[0_4px_12px_rgba(60,15,30,0.2)] opacity-90"
          aria-hidden="true"
        >
          <Image
            src="/assets/stationery/pressed_botanical.png"
            alt="Pressed dried flower"
            fill
            sizes="64px"
            className="object-contain"
            priority
            unoptimized
          />
        </div>

        {/* Vintage Coffee Ticket tucked naturally into lower left */}
        <div
          className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 z-35 pointer-events-none transform rotate-[-5deg] drop-shadow-[0_8px_16px_rgba(40,10,20,0.25)]"
          aria-hidden="true"
        >
          <div className="w-24 sm:w-28 py-1 px-2.5 bg-[#FAF3E8] rounded-xs border border-amber-900/30 text-left">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono uppercase tracking-widest text-[#7A1D45] font-semibold block">
              FIRST COFFEE
            </span>
            <span className="font-serif italic text-[11px] sm:text-xs text-[#1C0412] font-semibold leading-none block mt-0.5">
              Rainy Tuesday
            </span>
          </div>
        </div>

        {/* THE HERO DECKLED COTTON SHEET */}
        <div className="relative w-full aspect-[340/460] bg-[#FAF6EE] shadow-[0_20px_50px_rgba(70,15,35,0.2),0_4px_16px_rgba(0,0,0,0.06)] border border-[#E8DFC8] rounded-[2px] p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
          {/* Subtle paper grain texture */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#78350F_1px,transparent_1px)] [background-size:10px_10px]" />

          {/* DYNAMIC FOLDING PANELS FOR SEQUENTIAL UNFOLD */}
          {/* Top Flap */}
          <div
            ref={topFlapRef}
            className="absolute inset-x-0 top-0 h-1/3 bg-[#F4EDE0] border-b border-amber-900/20 z-30 shadow-md will-change-transform"
          />

          {/* Bottom Flap */}
          <div
            ref={bottomFlapRef}
            className="absolute inset-x-0 bottom-0 h-1/3 bg-[#F4EDE0] border-t border-amber-900/20 z-30 shadow-md will-change-transform"
          />

          {/* Crease line shadows */}
          <div
            ref={creaseShadowTopRef}
            className="absolute inset-x-0 top-1/3 h-1.5 bg-gradient-to-b from-stone-800/20 to-transparent z-25 pointer-events-none"
          />
          <div
            ref={creaseShadowBottomRef}
            className="absolute inset-x-0 bottom-1/3 h-1.5 bg-gradient-to-t from-stone-800/20 to-transparent z-25 pointer-events-none"
          />

          {/* REAL HTML EDITORIAL CONTENT LAYER: Emerges as paper opens */}
          <div
            ref={letterTextRef}
            className="relative z-20 flex-1 flex flex-col justify-between text-left will-change-transform pt-2"
          >
            {/* Header Colophon */}
            <div className="flex items-center justify-between border-b border-rose-950/15 pb-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#7A1D45]/80 font-semibold">
                Atelier Valentino
              </span>
              <span className="text-[9px] font-mono text-[#58152E]/70 uppercase tracking-widest">
                № 01 · Cotton
              </span>
            </div>

            {/* The Main Authored Demonstration Letter */}
            <div className="my-auto py-3 space-y-2">
              <p className="font-serif italic text-sm sm:text-base text-[#1C0412] leading-relaxed font-normal">
                “You are the quiet place my thoughts return to when everything else is loud.”
              </p>
              <p className="font-serif italic text-xs text-[#58152E]/80 leading-relaxed">
                Some words don&apos;t need an audience. They only need one person to understand them.
              </p>
            </div>

            {/* Footer Colophon */}
            <div className="pt-2 border-t border-rose-950/15 flex items-center justify-between text-[9px] font-mono text-[#7A1D45]/70 uppercase tracking-wider">
              <span>Deckled Cotton</span>
              <span>Keep forever</span>
            </div>
          </div>
        </div>
      </div>

      {/* RESOLUTION CTA: Positioned cleanly below stationery */}
      <div
        ref={ctaRef}
        className="text-center z-20 pt-2 will-change-transform"
      >
        <Link
          href="/create"
          className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-serif text-[#FAF5EE] bg-[#1A0512] hover:bg-[#2A091E] border border-[#3E0A28]/40 shadow-[0_4px_16px_rgba(26,5,18,0.25)] hover:shadow-[0_6px_22px_rgba(26,5,18,0.35)] transition-all duration-300"
        >
          <span>Make yours</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-[#F3A5BC]">
            →
          </span>
        </Link>
      </div>
    </section>
  </div>
);
}
