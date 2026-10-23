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
 * SpatialWorldsWalkthrough (Phase 8.5 Single-Stage Continuity):
 * Six distinct, cinematic environments hosted inside ONE authoritative,
 * viewport-pinned stage. Eliminates duplicate viewports, horizontal section cuts,
 * and bottom-entering stages.
 *
 * Sequence:
 * 00 Chapter 01 Opening: Headline blends naturally against the morning sky and beanstalk.
 * 01 Cloud Nine: Morning clouds & climbing beanstalk; nestled airmail letter.
 * 02 Midnight Rose: Intimate candlelit fine dining table; authentic wax-sealed velvet envelope.
 * 03 Kage: Kyoto machiya courtyard veranda; attendant presenting washi scroll.
 * 04 Apricot Film: 1930s vintage cinema auditorium; firmly mounted 35mm screen.
 * 05 Wildflower Paper: English cottage garden; botanical journal on weathered teak table.
 * 06 Ocean Letter: Dawn shoreline; washed-up corked bottle & weathered sea-salt parchment.
 * -> Handover into The Hidden Trove: Dawn warmth settles calmly onto mahogany tabletop.
 */
export function SpatialWorldsWalkthrough() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Background plate refs (all in the same authoritative viewport)
  const bg0Ref = useRef<HTMLDivElement | null>(null); // Cloud Nine
  const bg1Ref = useRef<HTMLDivElement | null>(null); // Midnight Rose
  const bg2Ref = useRef<HTMLDivElement | null>(null); // Kage
  const bg3Ref = useRef<HTMLDivElement | null>(null); // Apricot Film
  const bg4Ref = useRef<HTMLDivElement | null>(null); // Wildflower Paper
  const bg5Ref = useRef<HTMLDivElement | null>(null); // Ocean Letter
  const bgTroveRef = useRef<HTMLDivElement | null>(null); // The Hidden Trove Transition Plate
  const vignetteRef = useRef<HTMLDivElement | null>(null); // Global Atmospheric Edge Vignette

  // Chapter 01 intro headline ref
  const chapterIntroRef = useRef<HTMLDivElement | null>(null);

  // World stage foreground refs
  const world0Ref = useRef<HTMLElement | null>(null);
  const world1Ref = useRef<HTMLElement | null>(null);
  const world2Ref = useRef<HTMLElement | null>(null);
  const world3Ref = useRef<HTMLElement | null>(null);
  const world4Ref = useRef<HTMLElement | null>(null);
  const world5Ref = useRef<HTMLElement | null>(null);

  // World-specific motion refs
  // 01 Cloud Nine
  const w0LetterRef = useRef<HTMLDivElement | null>(null);
  const w0TicketRef = useRef<HTMLDivElement | null>(null);

  // 02 Midnight Rose
  const w1TableRef = useRef<HTMLDivElement | null>(null);
  const w1FlapRef = useRef<HTMLDivElement | null>(null);
  const w1SealRef = useRef<HTMLDivElement | null>(null);
  const w1LetterRef = useRef<HTMLDivElement | null>(null);
  const w1CandleGlowRef = useRef<HTMLDivElement | null>(null);

  // 03 Kage
  const w2ScrollRef = useRef<HTMLDivElement | null>(null);
  const w2CalligraphyRef = useRef<HTMLDivElement | null>(null);
  const w2MistRef = useRef<HTMLDivElement | null>(null);

  // 04 Apricot Film
  const w3ScreenRef = useRef<HTMLDivElement | null>(null);
  const w3BeamRef = useRef<HTMLDivElement | null>(null);

  // 05 Wildflower
  const w4JournalRef = useRef<HTMLDivElement | null>(null);

  // 06 Ocean
  const w5ParchmentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([bg0Ref.current, bg1Ref.current, bg2Ref.current, bg3Ref.current, bg4Ref.current, bg5Ref.current, bgTroveRef.current, vignetteRef.current], { opacity: 1 });
        gsap.set([world0Ref.current, world1Ref.current, world2Ref.current, world3Ref.current, world4Ref.current, world5Ref.current], { opacity: 1 });
        return;
      }

      // Initial resting posture: Single authoritative viewport
      // Backgrounds: Start transparent for seamless crossfade with stationery atmosphere
      gsap.set(bg0Ref.current, { opacity: 0, scale: 1.0 });
      gsap.set(vignetteRef.current, { opacity: 0 });
      gsap.set([bg1Ref.current, bg2Ref.current, bg3Ref.current, bg4Ref.current, bg5Ref.current, bgTroveRef.current], {
        opacity: 0,
        scale: 1.0,
      });

      // Chapter intro headline emerges smoothly from morning light
      gsap.set(chapterIntroRef.current, { opacity: 0, y: 16 });

      // World stages: World 0 starts gently visible behind intro; others hidden
      gsap.set(world0Ref.current, { opacity: 0, y: 15 });
      gsap.set([world1Ref.current, world2Ref.current, world3Ref.current, world4Ref.current, world5Ref.current], {
        opacity: 0,
        pointerEvents: "none",
      });

      // Internal world elements
      gsap.set(w0LetterRef.current, { scale: 0.92, y: 12, opacity: 0.9 });
      gsap.set(w0TicketRef.current, { rotate: -5, opacity: 0.85 });

      gsap.set(w1TableRef.current, { scale: 0.92, y: 15, opacity: 0.9 });
      gsap.set(w1FlapRef.current, { rotateX: 0 });
      gsap.set(w1SealRef.current, { opacity: 1, scale: 1 });
      gsap.set(w1LetterRef.current, { y: 12, opacity: 0 });
      gsap.set(w1CandleGlowRef.current, { opacity: 0.45 });

      gsap.set(w2ScrollRef.current, { scale: 0.88, y: 16, opacity: 0.9 });
      gsap.set(w2CalligraphyRef.current, { opacity: 0 });
      gsap.set(w2MistRef.current, { opacity: 0.4 });

      gsap.set(w3ScreenRef.current, { scale: 0.95, opacity: 0.7 });
      gsap.set(w3BeamRef.current, { opacity: 0.4 });

      gsap.set(w4JournalRef.current, { scale: 0.94, y: 14, opacity: 0.9 });

      gsap.set(w5ParchmentRef.current, { scale: 0.92, y: 16, opacity: 0.9 });

      // =========================================================================
      // MASTER SINGLE-STAGE TIMELINE (Continuous scrub across unified scroll track)
      // =========================================================================
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // -------------------------------------------------------------------------
      // 00. CHAPTER 01 INTRO -> CLOUD NINE ACTIVE (0.00 -> 0.16)
      // -------------------------------------------------------------------------
      // Cloud Nine sky & Beanstalk background plate crossfades in smoothly over the dawn atmosphere (0.00 -> 0.08)
      tl.to(
        [bg0Ref.current, vignetteRef.current],
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.08,
        },
        0.00
      )
      // Chapter 01 headline emerges softly (0.00 -> 0.05) then dissolves upward into the morning sky (0.05 -> 0.09)
      .to(
        chapterIntroRef.current,
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.05,
        },
        0.00
      )
      .to(
        chapterIntroRef.current,
        {
          opacity: 0,
          y: -24,
          ease: "power1.inOut",
          duration: 0.04,
        },
        0.05
      )
      // Cloud Nine narrative & stage emerges (0.05 -> 0.10)
      .to(
        world0Ref.current,
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.05,
          onStart: () => {
            if (world0Ref.current) world0Ref.current.style.pointerEvents = "auto";
          },
        },
        0.05
      )
      // Camera approaches vine branch (0.05 -> 0.15)
      .to(
        bg0Ref.current,
        {
          scale: 1.10,
          y: "-2.5%",
          ease: "none",
          duration: 0.10,
        },
        0.05
      )
      .to(
        w0LetterRef.current,
        {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.08,
        },
        0.07
      )
      // -------------------------------------------------------------------------
      // HANDOFF 01: CLOUD NINE -> MIDNIGHT ROSE (0.15 -> 0.20)
      // -------------------------------------------------------------------------
      // Cloud Nine foreground yields
      .to(
        world0Ref.current,
        {
          opacity: 0,
          y: -15,
          ease: "power1.in",
          duration: 0.04,
          onComplete: () => {
            if (world0Ref.current) world0Ref.current.style.pointerEvents = "none";
          },
        },
        0.15
      )
      // Midnight Rose background crossfades across the ENTIRE viewport simultaneously
      .to(
        bg1Ref.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.05,
        },
        0.15
      )
      // Cloud Nine background fades out cleanly underneath
      .to(
        bg0Ref.current,
        {
          opacity: 0,
          ease: "power1.inOut",
          duration: 0.04,
        },
        0.16
      )
      // -------------------------------------------------------------------------
      // 02. MIDNIGHT ROSE ACTIVE (0.18 -> 0.32)
      // -------------------------------------------------------------------------
      .to(
        world1Ref.current,
        {
          opacity: 1,
          ease: "power2.out",
          duration: 0.05,
          onStart: () => {
            if (world1Ref.current) world1Ref.current.style.pointerEvents = "auto";
          },
        },
        0.18
      )
      // Camera dollies toward candlelit table
      .to(
        bg1Ref.current,
        {
          scale: 1.12,
          y: "-2%",
          ease: "none",
          duration: 0.12,
        },
        0.18
      )
      .to(
        w1CandleGlowRef.current,
        {
          opacity: 0.85,
          scale: 1.2,
          ease: "power2.out",
          duration: 0.08,
        },
        0.19
      )
      .to(
        w1TableRef.current,
        {
          scale: 1.02,
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.08,
        },
        0.19
      )
      // Wax seal releases, flap opens, cream letter emerges
      .to(
        w1SealRef.current,
        {
          opacity: 0,
          scale: 0.7,
          ease: "power2.in",
          duration: 0.04,
        },
        0.23
      )
      .to(
        w1FlapRef.current,
        {
          rotateX: -160,
          opacity: 0.2,
          ease: "power2.inOut",
          duration: 0.06,
        },
        0.24
      )
      .to(
        w1LetterRef.current,
        {
          opacity: 1,
          y: -22,
          ease: "power2.out",
          duration: 0.07,
        },
        0.25
      )
      // -------------------------------------------------------------------------
      // HANDOFF 02: MIDNIGHT ROSE -> KAGE (0.31 -> 0.36)
      // -------------------------------------------------------------------------
      .to(
        world1Ref.current,
        {
          opacity: 0,
          y: -15,
          ease: "power1.in",
          duration: 0.04,
          onComplete: () => {
            if (world1Ref.current) world1Ref.current.style.pointerEvents = "none";
          },
        },
        0.31
      )
      // Kage background crossfades across the ENTIRE viewport simultaneously
      .to(
        bg2Ref.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.05,
        },
        0.31
      )
      .to(
        bg1Ref.current,
        {
          opacity: 0,
          ease: "power1.inOut",
          duration: 0.04,
        },
        0.32
      )
      // -------------------------------------------------------------------------
      // 03. KAGE ACTIVE (0.34 -> 0.48)
      // -------------------------------------------------------------------------
      .to(
        world2Ref.current,
        {
          opacity: 1,
          ease: "power2.out",
          duration: 0.05,
          onStart: () => {
            if (world2Ref.current) world2Ref.current.style.pointerEvents = "auto";
          },
        },
        0.34
      )
      // Camera dollies toward Kyoto courtyard veranda
      .to(
        bg2Ref.current,
        {
          scale: 1.12,
          y: "-2%",
          ease: "none",
          duration: 0.12,
        },
        0.34
      )
      .to(
        w2MistRef.current,
        {
          opacity: 0.85,
          scale: 1.2,
          ease: "power2.out",
          duration: 0.08,
        },
        0.35
      )
      .to(
        w2ScrollRef.current,
        {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.08,
        },
        0.35
      )
      // Sumi calligraphy reveals stroke by stroke
      .to(
        w2CalligraphyRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.06,
        },
        0.40
      )
      // -------------------------------------------------------------------------
      // HANDOFF 03: KAGE -> APRICOT FILM (0.47 -> 0.52)
      // -------------------------------------------------------------------------
      .to(
        world2Ref.current,
        {
          opacity: 0,
          y: -15,
          ease: "power1.in",
          duration: 0.04,
          onComplete: () => {
            if (world2Ref.current) world2Ref.current.style.pointerEvents = "none";
          },
        },
        0.47
      )
      // Apricot Film background crossfades across the ENTIRE viewport simultaneously
      .to(
        bg3Ref.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.05,
        },
        0.47
      )
      .to(
        bg2Ref.current,
        {
          opacity: 0,
          ease: "power1.inOut",
          duration: 0.04,
        },
        0.48
      )
      // -------------------------------------------------------------------------
      // 04. APRICOT FILM ACTIVE (0.50 -> 0.64)
      // -------------------------------------------------------------------------
      .to(
        world3Ref.current,
        {
          opacity: 1,
          ease: "power2.out",
          duration: 0.05,
          onStart: () => {
            if (world3Ref.current) world3Ref.current.style.pointerEvents = "auto";
          },
        },
        0.50
      )
      // Camera dollies smoothly down the aisle toward the proscenium stage
      .to(
        bg3Ref.current,
        {
          scale: 1.15,
          y: "-3%",
          ease: "none",
          duration: 0.12,
        },
        0.50
      )
      .to(
        w3BeamRef.current,
        {
          opacity: 0.9,
          ease: "power2.out",
          duration: 0.08,
        },
        0.51
      )
      // The projection screen illuminates inside the proscenium arch
      .to(
        w3ScreenRef.current,
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          duration: 0.08,
        },
        0.52
      )
      // -------------------------------------------------------------------------
      // HANDOFF 04: APRICOT FILM -> WILDFLOWER PAPER (0.63 -> 0.68)
      // -------------------------------------------------------------------------
      .to(
        world3Ref.current,
        {
          opacity: 0,
          y: -15,
          ease: "power1.in",
          duration: 0.04,
          onComplete: () => {
            if (world3Ref.current) world3Ref.current.style.pointerEvents = "none";
          },
        },
        0.63
      )
      // Wildflower Paper background crossfades across the ENTIRE viewport simultaneously
      .to(
        bg4Ref.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.05,
        },
        0.63
      )
      .to(
        bg3Ref.current,
        {
          opacity: 0,
          ease: "power1.inOut",
          duration: 0.04,
        },
        0.64
      )
      // -------------------------------------------------------------------------
      // 05. WILDFLOWER PAPER ACTIVE (0.66 -> 0.80)
      // -------------------------------------------------------------------------
      .to(
        world4Ref.current,
        {
          opacity: 1,
          ease: "power2.out",
          duration: 0.05,
          onStart: () => {
            if (world4Ref.current) world4Ref.current.style.pointerEvents = "auto";
          },
        },
        0.66
      )
      // Camera dollies toward teak garden table
      .to(
        bg4Ref.current,
        {
          scale: 1.12,
          y: "-2%",
          ease: "none",
          duration: 0.12,
        },
        0.66
      )
      .to(
        w4JournalRef.current,
        {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.08,
        },
        0.68
      )
      // -------------------------------------------------------------------------
      // HANDOFF 05: WILDFLOWER PAPER -> OCEAN LETTER (0.79 -> 0.84)
      // -------------------------------------------------------------------------
      .to(
        world4Ref.current,
        {
          opacity: 0,
          y: -15,
          ease: "power1.in",
          duration: 0.04,
          onComplete: () => {
            if (world4Ref.current) world4Ref.current.style.pointerEvents = "none";
          },
        },
        0.79
      )
      // Ocean Letter background crossfades across the ENTIRE viewport simultaneously
      .to(
        bg5Ref.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.05,
        },
        0.79
      )
      .to(
        bg4Ref.current,
        {
          opacity: 0,
          ease: "power1.inOut",
          duration: 0.04,
        },
        0.80
      )
      // -------------------------------------------------------------------------
      // 06. OCEAN LETTER ACTIVE (0.82 -> 0.96)
      // -------------------------------------------------------------------------
      .to(
        world5Ref.current,
        {
          opacity: 1,
          ease: "power2.out",
          duration: 0.05,
          onStart: () => {
            if (world5Ref.current) world5Ref.current.style.pointerEvents = "auto";
          },
        },
        0.82
      )
      // Camera approaches bottle on the glistening wet tide sand
      .to(
        bg5Ref.current,
        {
          scale: 1.14,
          y: "-2.5%",
          ease: "none",
          duration: 0.12,
        },
        0.82
      )
      .to(
        w5ParchmentRef.current,
        {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.08,
        },
        0.84
      )
      // -------------------------------------------------------------------------
      // HANDOFF 06: OCEAN LETTER -> THE HIDDEN TROVE (0.92 -> 1.00)
      // -------------------------------------------------------------------------
      // Ocean Letter foreground yields softly
      .to(
        world5Ref.current,
        {
          opacity: 0,
          y: -15,
          ease: "power1.inOut",
          duration: 0.06,
          onComplete: () => {
            if (world5Ref.current) world5Ref.current.style.pointerEvents = "none";
          },
        },
        0.92
      )
      // Deep mahogany & warm candlelight atmosphere plate crossfades across the full viewport
      .to(
        bgTroveRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.07,
        },
        0.93
      )
      // Ocean beach background plate dissolves away underneath
      .to(
        bg5Ref.current,
        {
          opacity: 0,
          ease: "power1.inOut",
          duration: 0.06,
        },
        0.94
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[650vh]">
      {/* THE SINGLE AUTHORITATIVE STICKY VIEWPORT STAGE */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] overflow-hidden select-none bg-transparent"
      >
        {/* ===================================================================== */}
        {/* SHARED FULL-VIEWPORT ENVIRONMENTAL BACKGROUND PLATES                 */}
        {/* Crossfade simultaneously across the full screen without bottom sliding */}
        {/* ===================================================================== */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none -z-20">
          {/* Plate 0: Cloud Nine (Towering beanstalk through morning sunrise clouds) */}
          <div
            ref={bg0Ref}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            <Image
              src="/assets/environments/cloud_nine_beanstalk.jpg"
              alt="Towering green beanstalk rising through serene morning clouds into pale blue sky"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
              unoptimized
            />
          </div>

          {/* Plate 1: Midnight Rose (Intimate candlelit dining room at midnight) */}
          <div
            ref={bg1Ref}
            className="absolute inset-0 w-full h-full will-change-transform opacity-0"
          >
            <Image
              src="/assets/environments/midnight_rose_restaurant.jpg"
              alt="Intimate candlelit fine dining table at midnight with burgundy velvet and mahogany shadows"
              fill
              sizes="100vw"
              className="object-cover object-center"
              unoptimized
            />
          </div>

          {/* Plate 2: Kage (Kyoto machiya courtyard veranda with attendant handover) */}
          <div
            ref={bg2Ref}
            className="absolute inset-0 w-full h-full will-change-transform opacity-0"
          >
            <Image
              src="/assets/environments/kage_attendant_handover.jpg"
              alt="Kyoto machiya veranda where a kimono-clad attendant quietly presents a rolled washi scroll at night"
              fill
              sizes="100vw"
              className="object-cover object-center"
              unoptimized
            />
          </div>

          {/* Plate 3: Apricot Film (1930s cinema auditorium with proscenium stage) */}
          <div
            ref={bg3Ref}
            className="absolute inset-0 w-full h-full will-change-transform opacity-0"
          >
            <Image
              src="/assets/environments/apricot_vintage_cinema.jpg"
              alt="1930s vintage cinema auditorium with ornate proscenium arch and velvet curtains"
              fill
              sizes="100vw"
              className="object-cover object-center"
              unoptimized
            />
          </div>

          {/* Plate 4: Wildflower Paper (English cottage garden in morning light) */}
          <div
            ref={bg4Ref}
            className="absolute inset-0 w-full h-full will-change-transform opacity-0"
          >
            <Image
              src="/assets/environments/wildflower_english_garden.jpg"
              alt="English cottage garden in gentle morning light with blooming lavender and summer flowers"
              fill
              sizes="100vw"
              className="object-cover object-center"
              unoptimized
            />
          </div>

          {/* Plate 5: Ocean Letter (Dawn shoreline with corked bottle glistening on wet sand) */}
          <div
            ref={bg5Ref}
            className="absolute inset-0 w-full h-full will-change-transform opacity-0"
          >
            <Image
              src="/assets/environments/ocean_letter_shoreline.jpg"
              alt="Dawn shoreline with amber morning light and a corked glass message bottle resting on glistening tide-wet sand"
              fill
              sizes="100vw"
              className="object-cover object-center"
              unoptimized
            />
          </div>

          {/* Plate 6: The Hidden Trove Transition (Deep rich mahogany, warm candlelight glow, and ribbon prelude) */}
          <div
            ref={bgTroveRef}
            className="absolute inset-0 w-full h-full will-change-transform opacity-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 38%, #2A091A 0%, #170410 50%, #0E020A 100%)",
            }}
          >
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] blur-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(251,191,36,0.14) 0%, rgba(225,29,72,0.14) 42%, transparent 70%)",
              }}
            />

            {/* Prelude satin ribbon trailing into the candlelight glow as ocean dissolves */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
              viewBox="0 0 1000 480"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="trove-prelude-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BE123C" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#9F1239" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#4C0519" stopOpacity="0.65" />
                </linearGradient>
              </defs>
              <path
                d="M 50,45 C 130,90 220,165 310,140 C 410,115 480,250 580,225"
                fill="none"
                stroke="url(#trove-prelude-ribbon)"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Global Atmospheric Edge Vignette */}
        <div
          ref={vignetteRef}
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55 pointer-events-none -z-10 opacity-0 will-change-transform"
          aria-hidden="true"
        />

        {/* ===================================================================== */}
        {/* CHAPTER 01 TRANSITION HEADLINE (Blends naturally on Cloud Nine sky)   */}
        {/* ===================================================================== */}
        <div
          ref={chapterIntroRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 pointer-events-none will-change-transform"
        >
          <div className="max-w-2xl mx-auto text-center space-y-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-sky-200 font-semibold">
              Chapter 01 · The Living Worlds
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#FAF5EE] tracking-tight leading-tight">
              Every letter has a place where it belongs.
            </h2>
            <p className="text-xs sm:text-base text-sky-100/90 max-w-lg mx-auto font-normal leading-relaxed">
              Six atmospheres, each with its own light, silence, and memory.
            </p>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 01: CLOUD NINE CINEMATIC WORLD                                        */}
        {/* ===================================================================== */}
        <section
          ref={world0Ref}
          aria-label="Cloud Nine cinematic world"
          className="absolute inset-0 w-full h-full flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 z-20 will-change-transform"
        >
          {/* Top World Tag */}
          <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase">01 — Skyward</span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/90 drop-shadow-sm font-medium">
              Some letters rise on hope.
            </span>
          </div>

          {/* Main Stage: Narrative & Airmail Aerogramme */}
          <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
            <div className="lg:col-span-5 space-y-3 sm:space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-sky-200 font-medium">
                  Atmosphere 01
                </span>
                <h3 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white drop-shadow-[0_2px_18px_rgba(2,20,40,0.85)]">
                  Cloud Nine
                </h3>
              </div>
              <p className="text-base sm:text-2xl font-serif italic text-sky-100 font-light leading-relaxed drop-shadow-[0_1px_8px_rgba(2,20,40,0.8)]">
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

            {/* Right: Airmail Letter nestled on beanstalk foliage */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end items-center">
              <div
                ref={w0LetterRef}
                className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[540/724] will-change-transform drop-shadow-[0_22px_45px_rgba(2,20,40,0.7)]"
              >
                {/* Pinned Airmail Ticket */}
                <div
                  ref={w0TicketRef}
                  className="absolute -top-3.5 -left-3 z-30 pointer-events-none transform rotate-[-4deg] drop-shadow-[0_6px_14px_rgba(3,105,161,0.35)]"
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

                {/* Unfolded Airmail Aerogramme Sheet */}
                <div className="relative w-full h-full bg-[#FFFDF9] shadow-2xl border border-sky-200/60 rounded-[2px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden">
                  {/* Top chevron border */}
                  <div
                    className="w-full h-2 rounded-xs opacity-90 mb-3"
                    style={{
                      background:
                        "repeating-linear-gradient(45deg, #0284C7, #0284C7 8px, #FFFDF9 8px, #FFFDF9 16px, #E11D48 16px, #E11D48 24px, #FFFDF9 24px, #FFFDF9 32px)",
                    }}
                  />

                  {/* Corner fold */}
                  <div className="absolute top-0 right-0 w-5 h-5 pointer-events-none z-20">
                    <div
                      className="w-full h-full bg-gradient-to-bl from-[#D8CDB6] via-[#FAF6EE] to-[#FFFDF9] shadow-[-1px_2px_4px_rgba(0,0,0,0.15)] border-b border-l border-sky-200/50"
                      style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
                    />
                  </div>

                  {/* Authored Live Typography */}
                  <div className="my-auto py-2 space-y-3 text-left">
                    <p className="font-serif italic text-base sm:text-xl text-[#0A192F] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                      “Every sunrise is lighter with you.”
                    </p>
                    <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-[10px] font-mono text-sky-950 font-bold uppercase tracking-widest">
                      <span>Par Avion · № 01</span>
                      <span>Skyward</span>
                    </div>
                  </div>

                  {/* Bottom chevron border */}
                  <div
                    className="w-full h-2 rounded-xs opacity-90 mt-3"
                    style={{
                      background:
                        "repeating-linear-gradient(45deg, #0284C7, #0284C7 8px, #FFFDF9 8px, #FFFDF9 16px, #E11D48 16px, #E11D48 24px, #FFFDF9 24px, #FFFDF9 32px)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
              Scroll to descend into evening
            </span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 02: MIDNIGHT ROSE CINEMATIC WORLD                                     */}
        {/* ===================================================================== */}
        <section
          ref={world1Ref}
          aria-label="Midnight Rose cinematic world"
          className="absolute inset-0 w-full h-full flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 z-20 will-change-transform"
        >
          {/* Candlelight glow */}
          <div
            ref={w1CandleGlowRef}
            className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[450px] rounded-full bg-gradient-to-tr from-amber-500/30 via-rose-600/20 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
            aria-hidden="true"
          />

          {/* Top Tag */}
          <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 backdrop-blur-md border border-rose-500/30 text-rose-100 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase">02 — Reserved for Two</span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-rose-200/90 drop-shadow-sm font-medium">
              Some wait for candlelight.
            </span>
          </div>

          {/* Main Stage: Candlelit Table & Burgundy Velvet Envelope */}
          <div className="w-full max-w-7xl mx-auto my-auto relative z-20 flex-1 flex flex-col justify-between pt-2 pb-1">
            <div className="max-w-md lg:max-w-lg space-y-2 text-left pt-2">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-rose-300 font-medium">
                  Atmosphere 02 · Midnight Rose
                </span>
                <h3 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#FFF5F7] drop-shadow-[0_2px_20px_rgba(20,0,8,0.95)]">
                  Midnight Rose
                </h3>
              </div>
              <p className="text-base sm:text-xl font-serif italic text-rose-100 font-light leading-relaxed drop-shadow-[0_1px_10px_rgba(20,0,8,0.9)]">
                “For the love that feels like midnight.”
              </p>
              <p className="text-xs sm:text-sm text-rose-100/90 max-w-sm font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(20,0,8,0.9)]">
                A private table, warm candlelight, and an unsealed note resting on the linen cloth.
              </p>
              <div className="pt-2">
                <AtmosphericButton
                  href="/create?template=midnight-rose"
                  worldId="midnight-rose"
                  worldName="Midnight Rose"
                />
              </div>
            </div>

            {/* Tabletop Envelope & Extracting Cream Letter */}
            <div
              ref={w1TableRef}
              className="self-center sm:self-end mr-0 sm:mr-16 md:mr-28 lg:mr-44 mb-2 sm:mb-6 w-[280px] sm:w-[330px] md:w-[360px] will-change-transform"
            >
              {/* Authentic Deep Burgundy Velvet Envelope */}
              <div className="relative w-full aspect-[4/3]">
                {/* Velvet Envelope Photographic Base */}
                <div className="absolute inset-0 pointer-events-none drop-shadow-[0_20px_35px_rgba(5,0,2,0.85)]">
                  <Image
                    src="/assets/stationery/velvet_envelope.png"
                    alt="Authentic deep burgundy velvet envelope with wax seal on linen cloth"
                    fill
                    sizes="360px"
                    className="object-contain"
                    priority
                  />
                </div>

                {/* The Cream Stationery Sheet (Extracts upward and forward from within pocket) */}
                <div
                  ref={w1LetterRef}
                  className="absolute inset-x-8 bottom-6 top-8 bg-[#FAF5EC] border border-amber-200/60 rounded-[2px] p-5 sm:p-6 shadow-[0_12px_28px_rgba(0,0,0,0.55)] z-20 will-change-transform pointer-events-auto"
                  style={{
                    background: "linear-gradient(115deg, #FFFDF8 0%, #FAF3E6 50%, #F5E9D5 100%)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/15 via-transparent to-rose-950/5 pointer-events-none" />
                  <div className="space-y-3 text-left relative z-10">
                    <div className="flex items-center justify-between border-b border-rose-950/20 pb-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#7A1D45] font-bold">
                        Atelier Valentino
                      </span>
                      <span className="text-[9px] font-mono text-[#58152E]/80 uppercase tracking-widest font-semibold">
                        Midnight
                      </span>
                    </div>

                    <p className="font-serif italic text-base sm:text-lg text-[#240314] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
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

                {/* Hinging Flap Overlay for deliberate physical unsealing */}
                <div
                  ref={w1FlapRef}
                  className="absolute top-0 inset-x-0 h-[52%] [transform-origin:top_center] [transform-style:preserve-3d] z-30 pointer-events-none will-change-transform"
                />

                {/* Molten Wax Seal */}
                <div
                  ref={w1SealRef}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="text-center z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300/60">
              Scroll to enter the quiet courtyard
            </span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 03: KAGE CINEMATIC WORLD                                              */}
        {/* ===================================================================== */}
        <section
          ref={world2Ref}
          aria-label="Kage cinematic world"
          className="absolute inset-0 w-full h-full flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 z-20 will-change-transform"
        >
          {/* Dynamic Shoji Glow on Veranda */}
          <div
            ref={w2MistRef}
            className="absolute bottom-1/4 left-1/3 w-[500px] h-[400px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
            aria-hidden="true"
          />

          {/* Top Tag */}
          <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-500/30 text-emerald-100 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase">03 — The Quiet House</span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-emerald-200/90 drop-shadow-sm font-medium">
              Some are handed over in silence.
            </span>
          </div>

          {/* Main Stage: Narrative & Unrolled Washi Scroll */}
          <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
            <div className="lg:col-span-5 space-y-3 sm:space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-300 font-medium">
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

            {/* Right: Unrolled Washi Paper with Sumi Calligraphy */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end items-center">
              <div
                ref={w2ScrollRef}
                className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[540/724] will-change-transform drop-shadow-[0_22px_48px_rgba(1,10,8,0.75)]"
              >
                <div
                  className="relative w-full h-full bg-[#FAF5EE] border border-emerald-900/30 rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden"
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

                  {/* Live Authored Sumi Calligraphy */}
                  <div
                    ref={w2CalligraphyRef}
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

                  {/* Hanko Vermilion Stamp */}
                  <div className="w-full pt-2 border-t border-emerald-950/20 flex justify-between items-center">
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

          <div className="text-center z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300/60">
              Scroll to step inside the cinema
            </span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 04: APRICOT FILM CINEMATIC WORLD                                      */}
        {/* ===================================================================== */}
        <section
          ref={world3Ref}
          aria-label="Apricot Film cinematic world"
          className="absolute inset-0 w-full h-full flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 z-20 will-change-transform"
        >
          {/* 35mm Projector Beam Cone */}
          <div
            ref={w3BeamRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] max-w-4xl h-[70vh] bg-gradient-to-b from-amber-200/25 via-amber-300/12 to-transparent [clip-path:polygon(48%_0,52%_0,85%_100%,15%_100%)] blur-md pointer-events-none -z-10 will-change-transform"
            aria-hidden="true"
          />

          {/* Top Tag */}
          <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 backdrop-blur-md border border-amber-500/30 text-amber-100 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase">04 — 35mm Memory</span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-200/90 drop-shadow-sm font-medium">
              Some become memories worth replaying.
            </span>
          </div>

          {/* Proscenium Stage Frame & Projection Screen */}
          <div className="w-full max-w-5xl mx-auto my-auto relative z-20 flex flex-col items-center justify-center">
            {/* Editorial Scene Narrative */}
            <div className="text-center max-w-md mx-auto space-y-1.5 mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-medium">
                Atmosphere 04 · Apricot Film
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-[#FFFDF8] drop-shadow-[0_2px_16px_rgba(20,5,0,0.9)]">
                “For memories that feel like a sun-drenched afternoon.”
              </h3>
            </div>

            {/* The 35mm Screen Firmly Mounted on the Stage within Proscenium Drapes */}
            <div
              ref={w3ScreenRef}
              className="relative w-full max-w-md sm:max-w-lg aspect-[16/10] -translate-y-4 sm:-translate-y-6 rounded-[2px] bg-[#FAF5EE] border-4 border-[#240A04] shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden will-change-transform flex flex-col justify-between p-5 sm:p-7"
              style={{
                background: "linear-gradient(135deg, #FFFDF8 0%, #FAF3E6 50%, #F5E8D0 100%)",
              }}
            >
              {/* Amber Projector Glow Wash */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-amber-300/15 pointer-events-none" />

              {/* 35mm Film Header Colophon */}
              <div className="w-full flex justify-between items-center text-[9px] font-mono tracking-widest uppercase text-amber-950 font-bold border-b border-amber-950/20 pb-2">
                <span>KODACHROME · 1935</span>
                <span>SCENE 04 · FRAME 24</span>
              </div>

              {/* The Live Authored Projection Text */}
              <div className="my-auto py-2 text-center space-y-2">
                <p className="font-serif italic text-lg sm:text-2xl md:text-3xl text-[#1A0502] font-semibold leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                  “Sunlight in your hair, golden and still.”
                </p>
                <p className="text-[10px] font-mono text-amber-900/80 uppercase tracking-widest">
                  Atelier Valentino Cinema Archive
                </p>
              </div>

              {/* Screen Footer */}
              <div className="w-full flex justify-between items-center text-[9px] font-mono tracking-widest uppercase text-amber-950 font-bold border-t border-amber-950/20 pt-2">
                <span>GOLDEN HOUR</span>
                <span>35MM PROJECTION</span>
              </div>
            </div>

            <div className="pt-4">
              <AtmosphericButton
                href="/create?template=apricot-film"
                worldId="apricot-film"
                worldName="Apricot Film"
              />
            </div>
          </div>

          <div className="text-center z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300/60">
              Scroll to walk through the cottage garden
            </span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 05: WILDFLOWER PAPER CINEMATIC WORLD                                  */}
        {/* ===================================================================== */}
        <section
          ref={world4Ref}
          aria-label="Wildflower Paper cinematic world"
          className="absolute inset-0 w-full h-full flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 z-20 will-change-transform"
        >
          {/* Top Tag */}
          <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-500/30 text-emerald-100 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase">05 — Cottage Garden</span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-emerald-100 drop-shadow-sm font-medium">
              Some take root and stay.
            </span>
          </div>

          {/* Main Stage: Narrative & Botanical Journal on Teak Table */}
          <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
            <div className="lg:col-span-5 space-y-3 sm:space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-200 font-medium">
                  Atmosphere 05 · Wildflower Paper
                </span>
                <h3 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#F7FEE7] drop-shadow-[0_2px_16px_rgba(5,20,10,0.9)]">
                  Wildflower Paper
                </h3>
              </div>
              <p className="text-base sm:text-xl font-serif italic text-emerald-100 font-light leading-relaxed drop-shadow-[0_1px_8px_rgba(5,20,10,0.85)]">
                “For words that grow wild and honest.”
              </p>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-md font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(5,20,10,0.85)]">
                Pressed lavender, handmade cotton paper, and unhurried thoughts beneath the summer leaves.
              </p>
              <div className="pt-2">
                <AtmosphericButton
                  href="/create?template=wildflower-paper"
                  worldId="wildflower-paper"
                  worldName="Wildflower Paper"
                />
              </div>
            </div>

            {/* Right: Botanical Journal with Pressed Sprig */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end items-center">
              <div
                ref={w4JournalRef}
                className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[540/724] will-change-transform drop-shadow-[0_22px_45px_rgba(10,25,12,0.7)]"
              >
                <div className="relative w-full h-full bg-[#FAF5EE] border border-amber-950/20 rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
                  {/* Journal Colophon Header */}
                  <div className="w-full pb-2 border-b border-amber-950/20 flex justify-between items-center text-[9px] font-mono tracking-widest uppercase text-emerald-950 font-bold">
                    <span>Wildflower Press</span>
                    <span>№ 05</span>
                  </div>

                  {/* Pressed Lavender Sprig Decoration */}
                  <div className="relative w-20 h-24 mx-auto my-1 pointer-events-none opacity-90">
                    <Image
                      src="/assets/stationery/pressed_botanical.png"
                      alt="Pressed botanical lavender sprig"
                      fill
                      sizes="100px"
                      className="object-contain"
                    />
                  </div>

                  {/* Authored Letter Text */}
                  <div className="py-2 space-y-2 text-center">
                    <p className="font-serif italic text-base sm:text-xl text-[#0F281E] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                      “You make ordinary days feel like poetry.”
                    </p>
                    <p className="text-[10px] font-mono text-emerald-900/80 uppercase tracking-widest">
                      Sussex Garden · Hand Pressed
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="w-full pt-2 border-t border-amber-950/20 flex justify-between items-center text-[9px] font-mono text-emerald-950 uppercase tracking-widest font-semibold">
                    <span>Botanical Rag</span>
                    <span>Rooted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-200/70">
              Scroll to follow the tide
            </span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 06: OCEAN LETTER CINEMATIC WORLD                                      */}
        {/* ===================================================================== */}
        <section
          ref={world5Ref}
          aria-label="Ocean Letter cinematic world"
          className="absolute inset-0 w-full h-full flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 z-20 will-change-transform"
        >
          {/* Top Tag */}
          <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 backdrop-blur-md border border-cyan-500/30 text-cyan-100 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase">06 — The Shoreline</span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-cyan-100 drop-shadow-sm font-medium">
              Some travel across an ocean to reach you.
            </span>
          </div>

          {/* Main Stage: Shoreline & Weathered Sea Parchment Letter */}
          <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
            <div className="lg:col-span-5 space-y-3 sm:space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-200 font-medium">
                  Atmosphere 06 · Ocean Letter
                </span>
                <h3 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#F0FDFA] drop-shadow-[0_2px_16px_rgba(2,18,24,0.9)]">
                  Ocean Letter
                </h3>
              </div>
              <p className="text-base sm:text-xl font-serif italic text-cyan-100 font-light leading-relaxed drop-shadow-[0_1px_8px_rgba(2,18,24,0.85)]">
                “For the love that crossed oceans to reach you.”
              </p>
              <p className="text-xs sm:text-sm text-cyan-100/90 max-w-md font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(2,18,24,0.85)]">
                Carried by tides and morning currents, an amber glass bottle resting on glistening tide-wet sand.
              </p>
              <div className="pt-2">
                <AtmosphericButton
                  href="/create?template=ocean-letter"
                  worldId="ocean-letter"
                  worldName="Ocean Letter"
                />
              </div>
            </div>

            {/* Right: Weathered Sea-Salt Parchment Letter */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end items-center">
              <div
                ref={w5ParchmentRef}
                className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[540/724] will-change-transform drop-shadow-[0_24px_45px_rgba(2,20,30,0.8)]"
              >
                <div className="relative w-full h-full bg-[#FAF5EE] border border-cyan-900/30 rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
                  {/* Parchment Header */}
                  <div className="w-full pb-2 border-b border-cyan-950/20 flex justify-between items-center text-[9px] font-mono tracking-widest uppercase text-cyan-950 font-bold">
                    <span>Tidal Post · Atlantic</span>
                    <span>№ 06</span>
                  </div>

                  {/* Authored Message */}
                  <div className="my-auto py-4 space-y-3 text-left">
                    <p className="font-serif italic text-base sm:text-xl text-[#031C24] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                      “I would cross every ocean again just to hear you say my name.”
                    </p>
                    <p className="text-[10px] font-mono text-cyan-900/80 uppercase tracking-widest">
                      Dawn Shoreline · Tidal Post · Keep Forever
                    </p>
                  </div>

                  {/* Sea-Glass Accent Footer */}
                  <div className="w-full pt-2 border-t border-cyan-950/20 flex justify-between items-center text-[9px] font-mono text-cyan-950 uppercase tracking-widest font-semibold">
                    <span>Weathered Parchment</span>
                    <span>Salt-Cured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-200/70">
              Scroll to explore discovered keepsakes
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
