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
 * OceanLetterWorld (Phase 8.2 Environment-Integrated Parchment Reveal):
 * Story: The bottle that found its way home.
 * Environment: Dawn shoreline, turquoise tidal wave rolling onto glistening wet sand, sea mist.
 * Choreography: Camera dollies toward the washed-up glass bottle; the cork releases, and
 * the weathered sea-salt parchment unrolls directly on the wet sand beside a frosted sea-glass pebble.
 */
export function OceanLetterWorld() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const coastalMistRef = useRef<HTMLDivElement | null>(null);
  const sandStageRef = useRef<HTMLDivElement | null>(null);
  const corkReleaseRef = useRef<HTMLDivElement | null>(null);
  const parchmentSheetRef = useRef<HTMLDivElement | null>(null);
  const letterContentRef = useRef<HTMLDivElement | null>(null);
  const seaGlassRef = useRef<HTMLDivElement | null>(null);
  const transitionBridgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bgImageRef.current, { scale: 1.1, y: "-3%" });
        gsap.set(coastalMistRef.current, { opacity: 0.8 });
        gsap.set(sandStageRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(corkReleaseRef.current, { opacity: 0, x: 20 });
        gsap.set(parchmentSheetRef.current, { opacity: 1, scale: 1, rotate: -1.5 });
        gsap.set(letterContentRef.current, { opacity: 1 });
        gsap.set(seaGlassRef.current, { opacity: 0.95 });
        gsap.set(transitionBridgeRef.current, { opacity: 0 });
        return;
      }

      // Initial resting posture: Wide shoreline vista, bottle on sand
      gsap.set(bgImageRef.current, {
        scale: 1.0,
        y: "0%",
      });

      gsap.set(coastalMistRef.current, {
        opacity: 0.45,
        scale: 0.95,
      });

      gsap.set(sandStageRef.current, {
        opacity: 0.9,
        scale: 0.9,
        y: 20,
      });

      gsap.set(corkReleaseRef.current, {
        opacity: 1,
        x: 0,
      });

      gsap.set(parchmentSheetRef.current, {
        opacity: 0,
        scale: 0.88,
        rotate: 4,
      });

      gsap.set(letterContentRef.current, {
        opacity: 0,
      });

      gsap.set(seaGlassRef.current, {
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

      // 1. Advance toward shoreline and wet sand (0.0 -> 0.45)
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
        coastalMistRef.current,
        {
          opacity: 0.85,
          scale: 1.25,
          ease: "power2.out",
          duration: 0.45,
        },
        0
      )
      .to(
        sandStageRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.05
      )
      // 2. Cork releases & parchment emerges onto wet sand (0.32 -> 0.70)
      .to(
        corkReleaseRef.current,
        {
          opacity: 0,
          x: 25,
          ease: "power2.in",
          duration: 0.25,
        },
        0.32
      )
      .to(
        parchmentSheetRef.current,
        {
          opacity: 1,
          scale: 1,
          rotate: -1.5,
          ease: "power2.out",
          duration: 0.38,
        },
        0.35
      )
      // 3. Frosted sea glass settles beside parchment (0.42 -> 0.75)
      .to(
        seaGlassRef.current,
        {
          opacity: 0.95,
          scale: 1,
          ease: "back.out(1.2)",
          duration: 0.3,
        },
        0.42
      )
      // 4. Weathered parchment letter text reveals with crisp contrast (0.48 -> 0.82)
      .to(
        letterContentRef.current,
        {
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.35,
        },
        0.48
      )
      // Weathered parchment and sea glass settle peacefully into dark wet sand and driftwood, retaining physical parchment opacity
      .to(
        sandStageRef.current,
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
      // Coastal morning wave recedes as daylight deepens into intimate evening starlight
      .to(
        coastalMistRef.current,
        {
          opacity: 0.2,
          scale: 0.8,
          ease: "power2.out",
          duration: 0.26,
        },
        0.70
      )
      // Camera dollies down from the wave crest to macro ground level, and shoreline dissolves into midnight
      .to(
        bgImageRef.current,
        {
          scale: 1.28,
          y: "-6%",
          opacity: 0,
          ease: "power1.inOut",
          duration: 0.26,
        },
        0.74
      )
      // Emerging dark evening tabletop and starlight keepsake constellation reveals in full spatial depth
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
        className="sticky top-0 w-full h-[100dvh] min-h-[640px] flex flex-col justify-between bg-[#05111c] pt-24 sm:pt-28 pb-6 sm:pb-8 px-6 sm:px-12 select-none overflow-hidden"
        aria-label="Ocean Letter cinematic world"
      >
      {/* CINEMATIC ENVIRONMENT PLATE: Dawn Shoreline with Wave and Wet Sand */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-full will-change-transform pointer-events-none select-none -z-20"
      >
        <Image
          src="/assets/environments/ocean_letter_shoreline.jpg"
          alt="Dawn shoreline with turquoise wave, glistened wet sand, and vintage bottle in morning light"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
          unoptimized
        />
      </div>

      {/* Maritime Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#04101a]/75 via-transparent to-[#04101a]/60 pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Coastal Dawn Sea Mist Overlay */}
      <div
        ref={coastalMistRef}
        className="absolute top-1/3 left-1/4 w-[60vw] h-[50vh] bg-gradient-to-tr from-cyan-400/20 via-sky-300/10 to-transparent blur-3xl pointer-events-none -z-10 will-change-transform"
        aria-hidden="true"
      />

      {/* Ambient Top World Tag */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 backdrop-blur-md border border-sky-400/30 text-sky-100 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase">06 — Tidal Journey</span>
        </div>
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-sky-200/90 drop-shadow-sm font-medium">
          Some travel until they find us.
        </span>
      </div>

      {/* MAIN CINEMATIC STAGE: Shoreline Wet Sand & Unrolled Parchment */}
      <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
        {/* Left Column: Editorial Scene Narrative & Entry Action */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-300/90 font-medium">
              Atmosphere 06
            </span>
            <h3 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-[#F0F9FF] drop-shadow-[0_2px_20px_rgba(2,15,30,0.95)]">
              Ocean Letter
            </h3>
          </div>
          <p className="text-lg sm:text-2xl font-serif italic text-sky-100 font-light leading-relaxed drop-shadow-[0_1px_10px_rgba(2,15,30,0.9)]">
            “For words meant to cross any distance.”
          </p>
          <p className="text-xs sm:text-sm text-sky-100/90 max-w-md font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(2,15,30,0.9)]">
            A wave deposits a corked bottle onto wet dawn sand. The seal softens, and the weathered parchment unfolds into readable morning light.
          </p>
          <div className="pt-2">
            <AtmosphericButton
              href="/create?template=ocean-letter"
              worldId="ocean-letter"
              worldName="Ocean Letter"
            />
          </div>
        </div>

        {/* Right Column: Weathered Parchment Sheet Resting Directly on the Wet Sand */}
        <div
          ref={sandStageRef}
          className="lg:col-span-7 flex justify-center lg:justify-center will-change-transform [perspective:1000px]"
        >
          <div className="relative w-72 sm:w-88 select-none drop-shadow-[0_24px_50px_rgba(0,10,20,0.85)]">
            {/* Tactile Frosted Sea-Glass Pebble */}
            <div
              ref={seaGlassRef}
              className="absolute -top-3.5 -right-2 z-35 pointer-events-none will-change-transform"
            >
              <div className="w-14 h-9 sm:w-16 sm:h-10 rounded-[50%_50%_60%_40%/45%_55%_50%_50%] bg-gradient-to-br from-cyan-200/60 via-cyan-400/40 to-teal-500/30 backdrop-blur-md border border-cyan-100/70 shadow-[0_8px_25px_rgba(34,211,238,0.5),0_2px_8px_rgba(0,0,0,0.4)] transform rotate-12 flex items-center justify-center">
                <div className="w-5 h-2 rounded-full bg-white/70 blur-[0.6px] transform -rotate-6" />
              </div>
            </div>

            {/* Cork Seal Release Cue */}
            <div
              ref={corkReleaseRef}
              className="absolute -top-2 left-6 z-30 pointer-events-none px-2.5 py-1 bg-[#D4A373] text-[#24170E] rounded-full border border-amber-900/40 text-[9px] font-mono uppercase tracking-widest shadow-md will-change-transform"
            >
              Sea Seal · Uncorked
            </div>

            {/* Weathered Parchment Sheet Unrolled on the Sand (NO dark UI container) */}
            <div
              ref={parchmentSheetRef}
              className="relative z-20 w-full bg-[#FAF5E8] border border-amber-900/30 rounded-[3px] p-6 sm:p-7 shadow-2xl overflow-hidden will-change-transform"
            >
              {/* Weathered sea-salt wash & parchment watermarks */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/5 via-transparent to-cyan-950/10 pointer-events-none" />

              {/* Deckled Edge Frayed Trim (Top & Bottom) */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-900/20 via-stone-700/10 to-amber-900/20" />
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-900/20 via-stone-700/10 to-amber-900/20" />

              <div
                ref={letterContentRef}
                className="space-y-3 text-left will-change-transform relative z-10"
              >
                <div className="flex items-center justify-between border-b border-sky-950/20 pb-2 text-[9px] font-mono text-sky-950/80 uppercase tracking-widest font-semibold">
                  <span>Shoreline · Drift № 06</span>
                  <span>Pacific Tide</span>
                </div>

                <p className="font-serif italic text-base sm:text-xl text-[#061923] font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  “Our devotion is as vast and enduring as the evening tides.”
                </p>

                <div className="pt-2 border-t border-sky-950/20 flex items-center justify-between text-[10px] font-mono text-sky-950 font-bold uppercase tracking-widest">
                  <span>Atelier Valentino</span>
                  <span>Message in a Bottle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ambient Cue */}
      <div className="text-center z-10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-sky-200/60">
          Scroll to explore discovered keepsakes
        </span>
      </div>

      {/* Narrative Transition Bridge: Receding dawn tide dissolves as camera glides down onto dark evening keepsake tabletop */}
      <div
        ref={transitionBridgeRef}
        className="absolute inset-0 z-30 pointer-events-none opacity-0 will-change-opacity overflow-hidden"
        aria-hidden="true"
      >
        {/* Seamless dark evening woodgrain plane bridging directly into The Hidden Trove */}
        <div className="absolute inset-0 bg-[#05111c]" />

        {/* Floating starlight particles in the deepening atmosphere matching The Hidden Trove */}
        <div className="absolute inset-0 select-none overflow-hidden" aria-hidden="true">
          <svg viewBox="0 0 1200 600" fill="none" className="w-full h-full opacity-40">
            <circle cx="300" cy="180" r="1.5" fill="#FAF5EE" fillOpacity="0.7" />
            <circle cx="850" cy="380" r="1.2" fill="#FAF5EE" fillOpacity="0.6" />
            <circle cx="580" cy="120" r="1.8" fill="#F472B6" fillOpacity="0.5" />
            <circle cx="210" cy="420" r="1.0" fill="#38BDF8" fillOpacity="0.5" />
            <circle cx="980" cy="220" r="1.4" fill="#FAF5EE" fillOpacity="0.6" />
          </svg>
        </div>

        {/* Soft tabletop shadow and subtle warm keepsake glow emerging in the lower depth */}
        <div className="absolute bottom-0 inset-x-0 h-2/3 bg-radial from-rose-950/30 via-slate-950/40 to-transparent blur-3xl" />
      </div>
    </section>
  </div>
);
}
