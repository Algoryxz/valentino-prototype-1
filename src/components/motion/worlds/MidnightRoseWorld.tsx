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
 * MidnightRoseWorld (Phase 8.2 Environment-Integrated Letter):
 * Story: A letter reserved for two.
 * Environment: An elegant intimate restaurant at night, candlelight, linen-covered table, deep shadows.
 * Choreography: Camera dollies toward the candlelit table; a wax-sealed envelope resting on the linen
 * opens, revealing the cream stationery letter directly under warm candlelight.
 */
export function MidnightRoseWorld() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const candleGlowRef = useRef<HTMLDivElement | null>(null);
  const tableLetterRef = useRef<HTMLDivElement | null>(null);
  const envelopeFlapRef = useRef<HTMLDivElement | null>(null);
  const waxSealRef = useRef<HTMLDivElement | null>(null);
  const letterSheetRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);
  const narrativeRef = useRef<HTMLDivElement | null>(null);
  const transitionBridgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.1, y: "-3%" });
        gsap.set(candleGlowRef.current, { opacity: 0.9 });
        gsap.set(tableLetterRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(envelopeFlapRef.current, { rotateX: -160, opacity: 0.1 });
        gsap.set(waxSealRef.current, { opacity: 0 });
        gsap.set(letterSheetRef.current, { opacity: 1, y: 0 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        gsap.set(transitionBridgeRef.current, { opacity: 0 });
        return;
      }

      const isMobile = window.innerWidth < 640;

      // Initial resting posture: Wide dining room view, envelope resting closed on the linen
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(candleGlowRef.current, {
        opacity: 0.45,
        scale: 0.9,
      });

      gsap.set(narrativeRef.current, {
        opacity: 1,
      });

      // Ground letter physically on the candlelit linen tabletop with 3D perspective
      gsap.set(tableLetterRef.current, {
        opacity: 0.95,
        scale: isMobile ? 0.92 : 0.9,
        y: isMobile ? 6 : 12,
        rotationX: isMobile ? 18 : 24,
        rotationY: isMobile ? -1 : -5,
        rotationZ: isMobile ? -1 : -2.5,
        transformPerspective: 1000,
        transformOrigin: "center bottom",
      });

      gsap.set(envelopeFlapRef.current, {
        rotateX: 0,
        transformOrigin: "top center",
        transformStyle: "preserve-3d",
      });

      gsap.set(waxSealRef.current, {
        opacity: 1,
        scale: 1,
      });

      gsap.set(letterSheetRef.current, {
        opacity: 0,
        y: 15,
        scale: 0.95,
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

      // 1. Dolly camera toward candlelit table (0.0 -> 0.45)
      tl.to(
        bgImageRef.current,
        {
          scale: 1.18,
          transformOrigin: isMobile ? "50% 80%" : "58% 78%",
          ease: "none",
          duration: 0.5,
        },
        0
      )
      .to(
        candleGlowRef.current,
        {
          opacity: 0.85,
          scale: 1.25,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      .to(
        narrativeRef.current,
        {
          opacity: isMobile ? 0.35 : 1,
          ease: "power1.out",
          duration: 0.35,
        },
        0.05
      )
      .to(
        tableLetterRef.current,
        {
          opacity: 1,
          scale: isMobile ? 1.02 : 1.04,
          y: isMobile ? -6 : -10,
          rotationX: isMobile ? 14 : 20,
          rotationY: isMobile ? 0 : -3.5,
          rotationZ: isMobile ? -0.5 : -1.5,
          ease: "power2.out",
          duration: 0.42,
        },
        0.04
      )
      // 2. Unseal wax & open envelope flap on table (0.08 -> 0.30)
      .to(
        waxSealRef.current,
        {
          scale: 0.7,
          opacity: 0,
          ease: "power2.in",
          duration: 0.16,
        },
        0.08
      )
      .to(
        envelopeFlapRef.current,
        {
          rotateX: -160,
          opacity: 0.2,
          ease: "power2.inOut",
          duration: 0.22,
        },
        0.10
      )
      // 3. Cream stationery letter slides forward & unfolds on linen (0.16 -> 0.46)
      .to(
        letterSheetRef.current,
        {
          opacity: 1,
          y: -12,
          scale: 1.02,
          ease: "power2.out",
          duration: 0.28,
        },
        0.16
      )
      .to(
        letterContentRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.22,
        },
        0.20
      )
      // 4. Narrative Handover & Camera Dolly into Kage (0.68 -> 0.98)
      // Letter settles into the linen cloth as the unhurried hour closes, retaining physical paper opacity
      .to(
        tableLetterRef.current,
        {
          scale: isMobile ? 0.94 : 0.96,
          y: isMobile ? 6 : 10,
          rotationX: isMobile ? 18 : 22,
          opacity: 0.96,
          ease: "power1.inOut",
          duration: 0.28,
        },
        0.68
      )
      .to(
        letterSheetRef.current,
        {
          y: 0,
          opacity: 1,
          ease: "power1.out",
          duration: 0.24,
        },
        0.68
      )
      // Dining candle flickers low as midnight deepens
      .to(
        candleGlowRef.current,
        {
          opacity: 0.2,
          scale: 0.6,
          ease: "power2.out",
          duration: 0.26,
        },
        0.70
      )
      // Narrative text gracefully fades, yielding focus to the spatial depth
      .to(
        narrativeRef.current,
        {
          opacity: 0,
          y: -15,
          ease: "power1.in",
          duration: 0.22,
        },
        0.70
      )
      // Camera dollies past the candlelit table toward the left veranda opening
      .to(
        bgImageRef.current,
        {
          scale: 1.35,
          xPercent: isMobile ? -8 : -10,
          yPercent: isMobile ? -2 : -3,
          ease: "power1.inOut",
          duration: 0.26,
        },
        0.74
      )
      // Emerging Kyoto courtyard atmosphere reveals in full spatial depth through the veranda opening
      .to(
        transitionBridgeRef.current,
        {
          opacity: 1,
          ease: "power2.inOut",
          duration: 0.26,
        },
        0.74
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[240vh] sm:h-[260vh]">
      <section
        ref={sectionRef}
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#0c0207] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden"
        aria-label="Midnight Rose cinematic world"
      >
      {/* CINEMATIC ENVIRONMENT PLATE: Intimate Candlelit Restaurant at Night */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-full will-change-transform pointer-events-none select-none -z-20"
      >
        <Image
          src="/assets/environments/midnight_rose_restaurant.jpg"
          alt="Intimate candlelit fine dining table at midnight with burgundy velvet and mahogany shadows"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
          unoptimized
        />
      </div>

      {/* Chiaroscuro Atmospheric Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0c0207]/75 via-transparent to-[#0c0207]/60 pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Dynamic Candle Light Halo around the table */}
      <div
        ref={candleGlowRef}
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[450px] rounded-full bg-gradient-to-tr from-amber-500/30 via-rose-600/20 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
        aria-hidden="true"
      />

      {/* Ambient Top World Tag */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-rose-950/60 backdrop-blur-md border border-rose-500/30 text-rose-100 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase">02 — Reserved for Two</span>
        </div>
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-rose-200/90 drop-shadow-sm font-medium hidden sm:block">
          Some wait for candlelight.
        </span>
      </div>

      {/* MAIN CINEMATIC STAGE: Candlelit Linen Table & Cream Letter Reveal */}
      <div className="w-full max-w-7xl mx-auto my-auto relative z-20 flex-1 flex flex-col justify-between pt-2 pb-1">
        {/* Top/Left: Editorial Scene Narrative & Entry Action (Subtle, upper area) */}
        <div
          ref={narrativeRef}
          className="max-w-md lg:max-w-lg space-y-1.5 sm:space-y-2.5 text-left pt-1 sm:pt-2 will-change-transform"
        >
          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-rose-300/90 font-medium">
              Atmosphere 02 · Midnight Rose
            </span>
            <h3 className="text-2xl sm:text-5xl font-serif font-normal tracking-tight text-[#FFF5F7] drop-shadow-[0_2px_20px_rgba(20,0,8,0.95)]">
              Midnight Rose
            </h3>
          </div>
          <p className="text-sm sm:text-xl font-serif italic text-rose-100 font-light leading-relaxed drop-shadow-[0_1px_10px_rgba(20,0,8,0.9)]">
            “For the love that feels like midnight.”
          </p>
          <p className="text-xs sm:text-sm text-rose-100/90 max-w-sm font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(20,0,8,0.9)] hidden sm:block">
            A private table, warm candlelight, and an unsealed note resting on the linen cloth.
          </p>
          <div className="pt-0.5 sm:pt-1">
            <AtmosphericButton
              href="/create?template=midnight-rose"
              worldId="midnight-rose"
              worldName="Midnight Rose"
            />
          </div>
        </div>

        {/* PHYSICAL TABLETOP STATIONERY: Resting directly on the open linen tablecloth */}
        <div
          ref={tableLetterRef}
          className="self-center sm:self-end mr-0 sm:mr-16 md:mr-28 lg:mr-52 xl:mr-60 mb-2 sm:mb-6 md:mb-8 w-[260px] sm:w-[310px] md:w-[340px] will-change-transform"
        >
          {/* Physical Envelope & Paper on the Table Linen */}
          <div className="relative w-full select-none drop-shadow-[0_20px_38px_rgba(15,2,8,0.75)]">
            {/* 1. Deep Velvet Envelope Body */}
            <div className="relative w-full bg-gradient-to-br from-[#2D0418] via-[#1A020E] to-[#100108] border border-amber-300/25 rounded-[3px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
              {/* Envelope Flap */}
              <div
                ref={envelopeFlapRef}
                className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#3E0723] via-[#240315] to-[#14010B] [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-md z-30 border-t border-amber-300/30 will-change-transform"
              />

              {/* Wax Seal */}
              <div
                ref={waxSealRef}
                className="absolute top-18 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 will-change-transform"
              >
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#E11D48] via-[#9F1239] to-[#4C0519] border border-amber-300/60 shadow-[0_4px_16px_rgba(159,18,57,0.85)] flex items-center justify-center">
                  <span className="text-[10px] text-amber-200 font-serif italic font-bold">V</span>
                </div>
              </div>

              {/* 2. Revealed Cream Stationery Sheet Resting on Linen */}
              <div
                ref={letterSheetRef}
                className="relative z-20 w-full bg-[#FAF5EC] border border-amber-200/60 rounded-[2px] p-5 sm:p-6 shadow-[0_14px_35px_rgba(0,0,0,0.55)] will-change-transform"
                style={{
                  background: "linear-gradient(115deg, #FFFDF8 0%, #FAF3E6 50%, #F5E9D5 100%)",
                }}
              >
                {/* Candlelight directional illumination gradient from the left */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/15 via-transparent to-rose-950/5 pointer-events-none" />

                <div
                  ref={letterContentRef}
                  className="space-y-3 text-left will-change-transform relative z-10"
                >
                  <div className="flex items-center justify-between border-b border-rose-950/20 pb-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#7A1D45] font-bold">
                      Atelier Valentino
                    </span>
                    <span className="text-[9px] font-mono text-[#58152E]/80 uppercase tracking-widest font-semibold">
                      Midnight
                    </span>
                  </div>

                  <p className="font-serif italic text-base sm:text-xl text-[#240314] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                    “Written in quiet starlight, meant only for you.”
                  </p>

                  <p className="font-serif italic text-xs text-[#4A0A26] leading-relaxed font-normal">
                    Some words are meant for an unhurried hour.
                  </p>

                  <div className="pt-2 border-t border-rose-950/20 flex items-center justify-between text-[9px] font-mono text-[#7A1D45] uppercase tracking-widest font-semibold">
                    <span>Table for Two</span>
                    <span>Candlelight</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ambient Cue */}
      <div className="text-center z-10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300/60">
          Scroll to enter the quiet courtyard
        </span>
      </div>

      {/* Narrative Transition Bridge: Candlelight yields as camera moves toward Kage's Kyoto courtyard veranda */}
      <div
        ref={transitionBridgeRef}
        className="absolute inset-0 z-30 pointer-events-none opacity-0 will-change-opacity overflow-hidden"
        aria-hidden="true"
      >
        {/* Emerging Kage Kyoto Courtyard Full-Viewport Depth Plate */}
        <div className="absolute inset-0 w-full h-full scale-100 pointer-events-none select-none">
          <Image
            src="/assets/environments/kage_kyoto_courtyard.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-left"
            unoptimized
          />
        </div>
        {/* Natural architectural edge darkening matching Kyoto dusk ambiance */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050e0c]/80 via-transparent to-[#050e0c]/40 pointer-events-none" />
      </div>
    </section>
  </div>
);
}
