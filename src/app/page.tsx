import Link from "next/link";
import { ValentinoAtmosphere } from "@/components/ui/ValentinoAtmosphere";
import { FloatingNavbar } from "@/components/ui/FloatingNavbar";
import { HeroEditorialStagger } from "@/components/motion/HeroEditorialStagger";
import { LoveLetter3D } from "@/components/motion/LoveLetter3D";
import { SpatialStationeryUnfold } from "@/components/motion/SpatialStationeryUnfold";
import { SpatialWorldsWalkthrough } from "@/components/motion/SpatialWorldsWalkthrough";
import { SpatialDiscoveredObjects } from "@/components/motion/SpatialDiscoveredObjects";
import { FinaleBotanicalFrame } from "@/components/motion/FinaleBotanicalFrame";

/**
 * HomePage — Phase 6.4: Scroll Story & Spatial Composition
 *
 * Sequence Narrative:
 * 01 HERO: Untouched sunset sky, floating 3D love letter, asymmetric typography.
 * 02 UNSEAL & DISPERSAL: The love letter unseals, vellum and petals disperse into space, transforms into a milestone timeline.
 * 03 LIVING WORLDS: Full-viewport vistas for each of the six worlds without tabs, capability chips, or palette swatches.
 * 04 DISCOVERED OBJECTS: Suspended interactive keepsakes floating directly in starlight without card boxes.
 * 05 RESOLUTION: Dispersed elements collapse into one glowing talisman and quiet invitation.
 */
export default function HomePage() {
  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-start bg-transparent text-[#1A0311] overflow-x-clip selection:bg-rose-500/20 selection:text-[#1A0311]">
      {/* ========================================================================= */}
      {/* 00 — CANONICAL GLOBAL PERSISTENT ATMOSPHERE                               */}
      {/* Pinned behind the entire public experience; morphs continuously as user    */}
      {/* scrolls: Sunset Pink Sky -> Soft Cloud Paper -> Berry Depth -> Finale     */}
      {/* ========================================================================= */}
      <ValentinoAtmosphere
        context="marketing"
        fixed={true}
        intensity="hero"
        scrollReactive={true}
      />

      {/* Floating Spatial Dock Navigation */}
      <FloatingNavbar />

      {/* ========================================================================= */}
      {/* 01 — HERO: SUNSET CLOUD ATMOSPHERE & ASYMMETRIC LETTER                    */}
      {/* HERO KEPT SACRED & UNTOUCHED: Same typography, floating 3D letter, sky    */}
      {/* ========================================================================= */}
      <section
        id="hero"
        className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-transparent"
      >
        <div className="w-full max-w-6xl mx-auto px-6 pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 relative z-20 z-content">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Asymmetric Editorial Typography */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <HeroEditorialStagger
                eyebrow="made quietly, for one person"
                headline="Create something they'll remember."
                subtitle="An intimate digital art experience crafted for the person who means everything to you — complete with starlight letters, shared memories, and living worlds."
                primaryCtaText="Begin Their World"
                primaryCtaHref="/create"
                secondaryCtaText="Explore Showroom"
                secondaryCtaHref="/templates"
              />
            </div>

            {/* Right Column: Floating 3D Dimensional Love Letter */}
            <div className="lg:col-span-5 flex items-center justify-center relative mt-6 lg:mt-0">
              {/* Soft rosy ambient back-glow */}
              <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-rose-300/40 via-pink-200/30 to-amber-200/20 blur-3xl pointer-events-none" />
              <div className="w-full max-w-xs sm:max-w-sm relative z-20 lg:-rotate-2 hover:rotate-0 transition-transform duration-500 will-change-transform">
                <LoveLetter3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 — THE UNSEAL & DISPERSAL: SPATIAL STATIONERY UNFOLD                    */}
      {/* Physical stationery handoff from hero, dispersing freely in the clouds     */}
      {/* ========================================================================= */}
      <section
        id="personalize"
        className="w-full bg-transparent text-[#240412] relative z-20 z-content scroll-mt-20 sm:scroll-mt-24"
      >
        <div id="build-your-valentine" className="w-full">
          <SpatialStationeryUnfold />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03 — LIVING WORLDS: FULL-VIEWPORT EDITORIAL VISTAS                         */}
      {/* No tabs, no capability chips, no swatches — pure atmospheric vistas        */}
      {/* ========================================================================= */}
      <section
        id="worlds-section"
        data-testid="world-showroom-scene"
        className="w-full -mt-[100dvh] bg-transparent text-[#FAF8F5] relative z-20 z-content scroll-mt-24"
      >
        <SpatialWorldsWalkthrough />
      </section>

      {/* ========================================================================= */}
      {/* 04 — DISCOVERED OBJECTS: SPATIAL KEEPSAKES IN STARLIGHT                    */}
      {/* No card boxes — tactile, dimensional keepsakes floating in the atmosphere */}
      {/* ========================================================================= */}
      <section
        id="moments"
        className="w-full bg-[#12040E] text-[#FAF8F5] relative z-20 z-content"
      >
        <SpatialDiscoveredObjects />
      </section>

      {/* ========================================================================= */}
      {/* 05 — THE RESOLUTION: QUIET WHISPER & INTIMATE ACTION                      */}
      {/* Everything collapses back into one glowing talisman in warm twilight       */}
      {/* ========================================================================= */}
      <section
        id="create"
        className="w-full bg-gradient-to-b from-[#1c0514] via-[#2d061f]/30 to-transparent text-[#240412] relative z-20 z-content py-20 sm:py-28 px-6 overflow-hidden"
      >
        {/* Asymmetric Scroll-Aware Botanical Frame at Empty Viewport Edges */}
        <FinaleBotanicalFrame />

        <div className="max-w-3xl mx-auto text-center space-y-7 relative z-20">
          {/* Restrained Hand-Drawn Botanical Gesture (Replacing floating heart app-icon) */}
          <div className="inline-flex items-center justify-center mx-auto opacity-80 hover:opacity-100 transition-opacity" aria-hidden="true">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="w-7 h-7 sm:w-8 sm:h-8 text-[#881337] filter drop-shadow-[0_1px_3px_rgba(136,19,55,0.18)]"
            >
              {/* Four-petal star flower pressed gesture with subtle asymmetry */}
              <g transform="translate(16, 16)" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="#9F1239" fillOpacity="0.82">
                {/* Top petal */}
                <path d="M0 -1 C -2.2 -4.8, -1.8 -8.2, 0 -9.5 C 1.8 -8.2, 2.2 -4.8, 0 -1 Z" />
                {/* Right petal (slightly elongated for handmade feel) */}
                <path d="M1 0 C 4.8 -2, 8.5 -1.5, 9.8 0.2 C 8.5 2, 4.8 2.2, 1 0 Z" />
                {/* Bottom petal */}
                <path d="M0 1 C 2 -4.8, 1.6 8.2, 0 9.2 C -1.6 8.2, -2 4.8, 0 1 Z" />
                {/* Left petal */}
                <path d="M-1 0 C -4.8 2.2, -8.2 1.8, -9.5 0 C -8.2 -1.8, -4.8 -2.2, -1 0 Z" />
                {/* Pistil stamen core */}
                <circle cx="0" cy="0" r="1.5" fill="#FFF5F7" stroke="#701A36" strokeWidth="0.8" />
              </g>
              {/* Miniature ink sprig leaf hint */}
              <path
                d="M19 21 C 22 23, 24 22, 25 21 C 24 23.5, 21.5 24, 19 22.5"
                fill="#881337"
                fillOpacity="0.5"
              />
            </svg>
          </div>

          <div className="space-y-3.5 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#1A0311] leading-tight tracking-tight drop-shadow-[0_1px_12px_rgba(255,245,248,0.5)]">
              Now make a story of your own.
            </h2>
            <p className="text-sm sm:text-base text-[#36091E] font-normal leading-relaxed drop-shadow-[0_1px_6px_rgba(255,245,248,0.6)]">
              Crafted for two. Never indexed by search engines, zero tracking, and no passwords.
            </p>
          </div>

          {/* Action CTAs: Intimate tactile keepsake controls */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create">
              <button
                type="button"
                className="group px-7 py-3.5 min-h-[48px] rounded-2xl font-serif text-base font-medium text-[#FAF5EE] bg-[#1A0512] hover:bg-[#2A091E] border border-[#3E0A28]/40 shadow-[0_4px_18px_rgba(26,5,18,0.28)] hover:shadow-[0_6px_24px_rgba(26,5,18,0.36)] active:scale-[0.98] transition-all duration-300 flex items-center gap-3 cursor-pointer select-none"
              >
                <span className="tracking-wide">Begin Their World</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-[#F3A5BC] font-sans font-normal text-sm">
                  →
                </span>
              </button>
            </Link>

            <Link href="/templates">
              <button
                type="button"
                className="group px-6 py-3.5 min-h-[48px] rounded-2xl font-serif text-sm font-medium text-[#220414] bg-[#FAF6F0]/90 hover:bg-[#FFFDF9] border border-rose-950/12 shadow-[0_2px_10px_rgba(70,15,35,0.05)] hover:shadow-[0_4px_16px_rgba(70,15,35,0.08)] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer select-none"
              >
                <span className="tracking-wide">Explore Showroom</span>
                <span className="text-[#881337] transition-transform duration-300 group-hover:translate-x-1 font-sans text-xs">
                  →
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 06 — BACK OF THE KEEPSAKE: THE MAKER COLOPHON                              */}
        {/* A quiet, sacred maker signature at the absolute end of the experience      */}
        {/* ========================================================================= */}
        <div className="mt-28 sm:mt-36 pt-12 flex flex-col items-center justify-center text-center space-y-2.5 relative z-20 select-none">
          {/* Subtle deckled separation rule */}
          <div className="w-10 h-px bg-rose-950/15 mb-2" aria-hidden="true" />

          <p className="text-xs sm:text-[13px] font-serif text-[#48142A]/80 tracking-wide">
            <span>Designed with love by </span>
            <a
              href="https://github.com/Algoryxz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#1E0412] underline decoration-rose-900/35 underline-offset-4 hover:decoration-rose-900 hover:text-[#881337] transition-all duration-300"
            >
              Algoryxz
            </a>
          </p>

          <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.18em] uppercase text-[#701A36]/50 font-normal">
            Made for little things worth keeping.
          </p>
        </div>
      </section>
    </main>
  );
}
