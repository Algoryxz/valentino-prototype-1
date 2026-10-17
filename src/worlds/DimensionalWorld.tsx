"use client";

import React, { useState, useEffect } from "react";
import { motion, useSpring, useScroll, useTransform } from "motion/react";
import { DimensionalWorldProps } from "./types";
import { useDeviceTier } from "./useDeviceTier";
import { AtmosphericCanvas } from "./AtmosphericCanvas";
import { DimensionalEntrance } from "./DimensionalEntrance";

export const DimensionalWorld: React.FC<DimensionalWorldProps> = ({
  theme,
  accentVariant = "default",
  activeScene = "welcome",
  pacing = "balanced",
  children,
  recipientName,
  greeting,
  className = "",
}) => {
  const { tier, isReducedMotion, isMobile, canHover } = useDeviceTier();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  // Restrained, well-damped spring-smoothed pointer parallax
  const springConfig =
    pacing === "calm"
      ? { damping: 42, stiffness: 60 }
      : pacing === "cinematic"
      ? { damping: 38, stiffness: 75 }
      : { damping: 40, stiffness: 70 };

  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    if (isReducedMotion || !canHover) return;

    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
      setPointer({ x, y });
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, [isReducedMotion, canHover, mouseX, mouseY]);

  // Restrained parallax transforms by depth layer (subtle ambient depth, zero reading distraction)
  const distantEnvX = useTransform(mouseX, (v) => (isReducedMotion || !canHover ? 0 : v * -7));
  const distantEnvY = useTransform(mouseY, (v) => (isReducedMotion || !canHover ? 0 : v * -4));

  const atmosphereX = useTransform(mouseX, (v) => (isReducedMotion || !canHover ? 0 : v * -4));
  const atmosphereY = useTransform(mouseY, (v) => (isReducedMotion || !canHover ? 0 : v * -2));

  // Foreground vignette is kept nearly static to prevent edge wobbling while reading
  const foregroundX = useTransform(mouseX, (v) => (isReducedMotion || !canHover ? 0 : v * 2));
  const foregroundY = useTransform(mouseY, (v) => (isReducedMotion || !canHover ? 0 : v * 1));

  return (
    <DimensionalEntrance
      theme={theme}
      recipientName={recipientName}
      greeting={greeting}
      isReducedMotion={isReducedMotion}
    >
      <div
        data-dimensional-world={theme}
        data-device-tier={tier}
        data-scene={activeScene}
        data-accent-variant={accentVariant}
        className={`relative w-full min-h-[100dvh] overflow-x-hidden ${className}`}
        style={{ perspective: "1400px" }}
      >
        {/* =========================================================================
            LAYER 0: DEEP BACKGROUND (Atmospheric Horizon & Radiant Gradient)
           ========================================================================= */}
        <div
          data-layer="0-deep-background"
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 transition-colors duration-1000"
          style={{
            background:
              theme === "cloud-nine"
                ? activeScene === "finale"
                  ? "radial-gradient(ellipse at 50% 20%, #FFF0F5 0%, #FED9E8 40%, #E9D5FF 80%, #DDD6FE 100%)"
                  : activeScene === "memories"
                  ? "radial-gradient(ellipse at 50% 25%, #FFF5F7 0%, #FFE4EE 50%, #FBCFE8 100%)"
                  : "radial-gradient(ellipse at 50% 15%, #FFF5F7 0%, #FFEBF2 45%, #FDE2ED 75%, #FBCFE8 100%)"
                : theme === "midnight-rose"
                ? activeScene === "finale"
                  ? "radial-gradient(ellipse at 50% 20%, #1A0510 0%, #10020A 50%, #060104 100%)"
                  : "radial-gradient(ellipse at 50% 20%, #15030D 0%, #0D0207 60%, #050103 100%)"
                : theme === "kage"
                ? "radial-gradient(ellipse at 50% 20%, #0B120E 0%, #070B09 60%, #030504 100%)"
                : theme === "apricot-film"
                ? "radial-gradient(ellipse at 50% 20%, #24140A 0%, #170C05 55%, #0B0603 100%)"
                : theme === "wildflower-paper"
                ? "radial-gradient(ellipse at 50% 20%, #16241A 0%, #0F1812 60%, #080D0A 100%)"
                : "radial-gradient(ellipse at 50% 20%, #092038 0%, #051424 60%, #020810 100%)",
          }}
        />

        {/* =========================================================================
            LAYER 1: DISTANT ENVIRONMENT (Distant Sky / Sunset Haze / Mountain Silhouette)
           ========================================================================= */}
        <motion.div
          data-layer="1-distant-environment"
          aria-hidden="true"
          style={{
            x: distantEnvX,
            y: isReducedMotion ? 0 : distantEnvY,
          }}
          className="pointer-events-none fixed inset-x-[-4%] -top-[5%] h-[115%] z-1 will-change-transform opacity-75"
        >
          {theme === "cloud-nine" && (
            <div
              className="w-full h-full"
              style={{
                background:
                  "radial-gradient(ellipse 110% 70% at 50% 10%, rgba(254, 215, 226, 0.8) 0%, rgba(253, 230, 238, 0.4) 40%, transparent 75%)",
              }}
            />
          )}

          {theme === "midnight-rose" && (
            <div className="relative w-full h-full">
              {/* Moonbeam illumination cone */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 85% at 50% -5%, rgba(255, 245, 235, 0.12) 0%, rgba(244, 63, 94, 0.08) 45%, transparent 80%)",
                }}
              />
              {/* Distant garden arbor silhouette */}
              <div
                className="absolute bottom-0 inset-x-0 h-48 opacity-25 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 100%, rgba(24, 4, 16, 0.9) 0%, rgba(13, 2, 7, 0.7) 60%, transparent 100%)",
                }}
              />
            </div>
          )}

          {theme === "kage" && (
            <div className="relative w-full h-full">
              {/* Soft Vermilion / Amber Temple Lantern Glow */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 65% 55% at 50% 10%, rgba(224, 35, 28, 0.16) 0%, rgba(255, 90, 60, 0.07) 35%, rgba(16, 185, 129, 0.05) 55%, transparent 75%)",
                }}
              />
              {/* Distant Kyoto Mountain Ridge Silhouette */}
              <div
                className="absolute bottom-0 inset-x-0 h-52 opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 100%, rgba(3, 5, 4, 0.95) 0%, rgba(7, 11, 9, 0.75) 60%, transparent 100%)",
                }}
              />
            </div>
          )}

          {theme === "apricot-film" && (
            <div className="relative w-full h-full">
              {/* Warm 16mm Analog Sunbeam Cone */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 75% 65% at 50% 5%, rgba(244, 162, 97, 0.18) 0%, rgba(231, 111, 81, 0.1) 40%, transparent 80%)",
                }}
              />
            </div>
          )}

          {theme === "wildflower-paper" && (
            <div className="relative w-full h-full">
              {/* Meadow Garden Sunlit Mist */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 50% 8%, rgba(192, 132, 252, 0.12) 0%, rgba(163, 184, 153, 0.1) 45%, transparent 75%)",
                }}
              />
            </div>
          )}

          {theme === "ocean-letter" && (
            <div className="relative w-full h-full">
              {/* Oceanic Horizon Moonbeam Glow */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 5%, rgba(56, 189, 248, 0.16) 0%, rgba(14, 116, 144, 0.08) 50%, transparent 80%)",
                }}
              />
            </div>
          )}
        </motion.div>

        {/* =========================================================================
            LAYER 2: VOLUMETRIC ATMOSPHERE (Volumetric Clouds / Mist / Luminous Glow)
           ========================================================================= */}
        <motion.div
          data-layer="2-atmosphere"
          aria-hidden="true"
          style={{
            x: atmosphereX,
            y: isReducedMotion ? 0 : atmosphereY,
          }}
          className="pointer-events-none fixed inset-0 z-2 will-change-transform"
        >
          {theme === "cloud-nine" && (
            <>
              {/* Soft Center Sunlight Glow */}
              <div
                className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[1100px] h-[550px] rounded-full blur-[75px] opacity-75"
                style={{
                  background:
                    "radial-gradient(circle at 50% 35%, rgba(255, 248, 238, 0.95) 0%, rgba(254, 225, 220, 0.6) 45%, rgba(253, 205, 225, 0.25) 70%, transparent 100%)",
                }}
              />
              {/* Floating Cloud Silhouettes */}
              <div className="absolute top-16 -left-16 w-80 h-36 bg-white/40 rounded-full blur-2xl animate-[pulse_7s_ease-in-out_infinite]" />
              <div className="absolute top-44 -right-20 w-96 h-44 bg-pink-200/35 rounded-full blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />
            </>
          )}

          {theme === "midnight-rose" && (
            <>
              {/* Candlelight / Starlight Glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[500px] rounded-full blur-[80px] opacity-55"
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(244, 63, 94, 0.25) 0%, rgba(190, 18, 60, 0.15) 45%, transparent 75%)",
                }}
              />
              <div className="absolute top-20 -left-10 w-72 h-36 bg-rose-950/40 rounded-full blur-3xl" />
              <div className="absolute top-60 -right-16 w-80 h-40 bg-purple-950/30 rounded-full blur-3xl" />
            </>
          )}

          {theme === "kage" && (
            <>
              {/* Kyoto Sanctuary Mist & Stone Lantern Warmth */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[550px] rounded-full blur-[90px] opacity-45 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 25%, rgba(224, 35, 28, 0.2) 0%, rgba(16, 185, 129, 0.12) 45%, transparent 75%)",
                }}
              />
              <div className="absolute top-28 -left-16 w-80 h-40 bg-emerald-950/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-52 -right-16 w-[22rem] h-44 bg-[#0a120e]/40 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          {theme === "apricot-film" && (
            <>
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] sm:w-[1000px] h-[520px] rounded-full blur-[85px] opacity-50 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(244, 162, 97, 0.25) 0%, rgba(231, 111, 81, 0.15) 50%, transparent 75%)",
                }}
              />
              <div className="absolute top-24 -left-12 w-80 h-40 bg-[#3d1f0e]/30 rounded-full blur-3xl" />
            </>
          )}

          {theme === "wildflower-paper" && (
            <>
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[500px] rounded-full blur-[85px] opacity-45 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(192, 132, 252, 0.18) 0%, rgba(163, 184, 153, 0.18) 50%, transparent 75%)",
                }}
              />
              <div className="absolute top-24 -left-12 w-80 h-40 bg-[#1e2d22]/35 rounded-full blur-3xl" />
            </>
          )}

          {theme === "ocean-letter" && (
            <>
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] sm:w-[1000px] h-[520px] rounded-full blur-[85px] opacity-50 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.22) 0%, rgba(14, 116, 144, 0.14) 50%, transparent 75%)",
                }}
              />
              <div className="absolute top-24 -right-12 w-[22rem] h-44 bg-[#0a233a]/40 rounded-full blur-3xl" />
            </>
          )}
        </motion.div>

        {/* =========================================================================
            LAYER 3: MIDGROUND DYNAMIC PARTICLES (Hardware-Accelerated Canvas)
           ========================================================================= */}
        <AtmosphericCanvas
          theme={theme}
          tier={tier}
          isReducedMotion={isReducedMotion}
          className="z-3"
        />

        {/* =========================================================================
            LAYER 4 & 5: PRIMARY STORY & INTERACTIVE CONTENT
           ========================================================================= */}
        <div data-layer="4-primary-story" className="relative z-10 w-full">
          {children}
        </div>

        {/* =========================================================================
            LAYER 6: FOREGROUND ACCENT DEPTH (Soft edge vignette & light wrap)
           ========================================================================= */}
        <motion.div
          data-layer="5-foreground-wrap"
          aria-hidden="true"
          style={{
            x: foregroundX,
            y: isReducedMotion ? 0 : foregroundY,
          }}
          className="pointer-events-none fixed inset-0 z-20 will-change-transform"
        >
          {theme === "cloud-nine" && (
            <div
              className="w-full h-full opacity-40 mix-blend-soft-light"
              style={{
                background:
                  "radial-gradient(circle at center, transparent 65%, rgba(251, 207, 232, 0.6) 100%)",
              }}
            />
          )}

          {theme === "midnight-rose" && (
            <div
              className="w-full h-full opacity-60"
              style={{
                background:
                  "radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.6) 100%)",
              }}
            />
          )}

          {theme === "kage" && (
            <div
              className="w-full h-full opacity-70"
              style={{
                background:
                  "radial-gradient(circle at center, transparent 55%, rgba(5, 9, 7, 0.75) 100%)",
              }}
            />
          )}
        </motion.div>
      </div>
    </DimensionalEntrance>
  );
};
