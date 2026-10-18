"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger once on the client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Lenis is for marketing and showroom/public reading pages only.
    // Studio (/edit/*) strictly uses native controlled canvas scrolling.
    if (pathname?.startsWith("/edit/")) {
      return;
    }

    let lenisInstance: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setupLenis = () => {
      // Respect user's reduced motion preference: if reduced, use instant native scroll
      if (motionQuery.matches) {
        if (lenisInstance) {
          if (tickerCallback) gsap.ticker.remove(tickerCallback);
          lenisInstance.destroy();
          lenisInstance = null;
          lenisRef.current = null;
          if (typeof window !== "undefined") {
            delete (window as unknown as { __valentinoLenis?: Lenis }).__valentinoLenis;
          }
        }
        return;
      }

      if (lenisInstance) return;

      const isHomepage = pathname === "/";

      // Homepage: PRESERVE EXACT ORIGINAL CONFIGURATION AND BEHAVIOR
      // Non-homepage: Calm, responsive, user-controlled scroll with natural touch
      const lenis = isHomepage
        ? new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.95,
            touchMultiplier: 1.2,
            infinite: false,
          })
        : new Lenis({
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.0,
            syncTouch: false,
            infinite: false,
          });

      lenisInstance = lenis;
      lenisRef.current = lenis;
      if (typeof window !== "undefined") {
        (window as unknown as { __valentinoLenis?: Lenis }).__valentinoLenis = lenis;
      }

      // Connect Lenis to GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    };

    setupLenis();

    const handleMotionChange = () => {
      if (motionQuery.matches) {
        if (lenisInstance) {
          if (tickerCallback) gsap.ticker.remove(tickerCallback);
          lenisInstance.destroy();
          lenisInstance = null;
          lenisRef.current = null;
          if (typeof window !== "undefined") {
            delete (window as unknown as { __valentinoLenis?: Lenis }).__valentinoLenis;
          }
        }
      } else {
        setupLenis();
      }
    };

    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
      }
      lenisRef.current = null;
      if (typeof window !== "undefined") {
        delete (window as unknown as { __valentinoLenis?: Lenis }).__valentinoLenis;
      }
    };
  }, [pathname]);

  return <>{children}</>;
}
