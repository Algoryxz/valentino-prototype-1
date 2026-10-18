"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WorldTheme } from "./types";

interface DimensionalEntranceProps {
  theme: WorldTheme;
  recipientName?: string;
  greeting?: string;
  isReducedMotion: boolean;
  onSettled?: () => void;
  children: React.ReactNode;
}

export const DimensionalEntrance: React.FC<DimensionalEntranceProps> = ({
  theme,
  recipientName,
  greeting,
  isReducedMotion,
  onSettled,
  children,
}) => {
  const [stage, setStage] = useState<"revealing" | "settled">(
    isReducedMotion ? "settled" : "revealing"
  );

  useEffect(() => {
    if (isReducedMotion) {
      setStage("settled");
      onSettled?.();
      return;
    }

    // Soft, cinematic entrance sequence timer — brief, calm, and never blocks user
    const settleTimer = setTimeout(() => {
      setStage("settled");
      onSettled?.();
    }, 1400);

    // Instant settle on any user navigation action (scroll, wheel, touch, keydown)
    const handleEarlySettle = () => {
      setStage("settled");
      onSettled?.();
    };

    window.addEventListener("scroll", handleEarlySettle, { once: true, passive: true });
    window.addEventListener("wheel", handleEarlySettle, { once: true, passive: true });
    window.addEventListener("touchstart", handleEarlySettle, { once: true, passive: true });
    window.addEventListener("keydown", handleEarlySettle, { once: true, passive: true });

    return () => {
      clearTimeout(settleTimer);
      window.removeEventListener("scroll", handleEarlySettle);
      window.removeEventListener("wheel", handleEarlySettle);
      window.removeEventListener("touchstart", handleEarlySettle);
      window.removeEventListener("keydown", handleEarlySettle);
    };
  }, [isReducedMotion, onSettled]);

  return (
    <div className="relative w-full">
      <AnimatePresence>
        {stage === "revealing" && !isReducedMotion && (
          <motion.div
            key="entrance-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.0, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center select-none"
            aria-hidden="true"
          >
            {/* Luminous Atmospheric Iris Bloom */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.25, 1.6],
                opacity: [0, 0.8, 0],
              }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full blur-[80px] ${
                theme === "cloud-nine"
                  ? "bg-[radial-gradient(circle,rgba(255,225,235,0.9)_0%,rgba(254,205,225,0.5)_50%,transparent_75%)]"
                  : theme === "midnight-rose"
                  ? "bg-[radial-gradient(circle,rgba(244,63,94,0.45)_0%,rgba(159,18,57,0.3)_50%,transparent_75%)]"
                  : "bg-[radial-gradient(circle,rgba(16,185,129,0.35)_0%,rgba(6,78,59,0.25)_50%,transparent_75%)]"
              }`}
            />

            {/* Recipient Arrival Whisper */}
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [12, 0, 0, -8],
                filter: ["blur(4px)", "blur(0px)", "blur(0px)", "blur(6px)"],
              }}
              transition={{ duration: 2.1, times: [0, 0.3, 0.75, 1], ease: "easeInOut" }}
              className="relative z-10 text-center px-6 space-y-2"
            >
              {greeting && (
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-sans font-medium opacity-80">
                  {greeting}
                </p>
              )}
              {recipientName && (
                <h2 className="text-2xl sm:text-3xl font-serif font-light tracking-widest drop-shadow-md">
                  {recipientName}
                </h2>
              )}
              <p className="text-[10px] tracking-[0.25em] uppercase opacity-60 font-sans pt-1">
                Entering your world
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main World Content with Smooth Environmental Settling */}
      <motion.div
        initial={isReducedMotion ? { opacity: 1 } : { opacity: 0.85, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
