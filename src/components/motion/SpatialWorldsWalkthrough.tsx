"use client";

import React from "react";
import { CloudNineWorld } from "@/components/motion/worlds/CloudNineWorld";
import { MidnightRoseWorld } from "@/components/motion/worlds/MidnightRoseWorld";
import { KageWorld } from "@/components/motion/worlds/KageWorld";
import { ApricotFilmWorld } from "@/components/motion/worlds/ApricotFilmWorld";
import { WildflowerWorld } from "@/components/motion/worlds/WildflowerWorld";
import { OceanLetterWorld } from "@/components/motion/worlds/OceanLetterWorld";

/**
 * SpatialWorldsWalkthrough (Phase 8 Cinematic Worlds):
 * Six distinct, cinematic environments with carefully choreographed
 * scroll-driven storytelling and physical letter reveals.
 *
 * Rule: Build the environment first. Let the letter emerge naturally.
 * 01 Cloud Nine: Towering beanstalk & morning clouds; vine-nestled airmail letter.
 * 02 Midnight Rose: Intimate candlelit restaurant at night; wax-sealed velvet envelope.
 * 03 Kage: Kyoto machiya courtyard, emerald sanctuary glow, unrolling washi scroll.
 * 04 Apricot Film: 1930s vintage cinema, parting velvet curtains, warm projector beam.
 * 05 Wildflower Paper: English cottage garden, weathered teak table, botanical journal.
 * 06 Ocean Letter: Dawn shoreline, turquoise tidal wave, corked bottle & weathered parchment.
 */
export function SpatialWorldsWalkthrough() {
  return (
    <div className="relative w-full bg-transparent text-[#FAF8F5] pt-16 sm:pt-24 pb-0">
      {/* Editorial Section Anchor Header */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-12 sm:mb-20 space-y-3 relative z-10">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#1A0311] tracking-tight leading-tight drop-shadow-[0_1px_12px_rgba(255,245,248,0.5)]">
          Every letter has a place where it belongs.
        </h2>
        <p className="text-sm sm:text-base text-[#36091E] max-w-lg mx-auto font-normal leading-relaxed drop-shadow-[0_1px_6px_rgba(255,245,248,0.6)]">
          Six atmospheres, each with its own light, silence, and memory.
        </p>
      </div>

      {/* Sequential Cinematic Living Environments */}
      <div className="w-full relative z-10">
        <CloudNineWorld />
        <MidnightRoseWorld />
        <KageWorld />
        <ApricotFilmWorld />
        <WildflowerWorld />
        <OceanLetterWorld />
      </div>
    </div>
  );
}
