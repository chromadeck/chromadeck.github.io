"use client";

import { useEffect, type ReactNode } from "react";
import { REDUCED_MOTION_QUERY, prefersReducedMotion, setupLenis } from "../../lib/motion";

/**
 * MotionProvider — owns the two cross-cutting runtime concerns:
 *
 * 1. Lenis smooth scrolling (+ GSAP ScrollTrigger sync), only when the user
 *    allows motion. Refcounted inside setupLenis, so StrictMode double-mounts
 *    are safe.
 * 2. The `data-rx-rm` mirror of prefers-reduced-motion, so CSS can opt out of
 *    smooth-scroll-specific styling without a JS branch.
 *
 * Renders children unchanged; no extra DOM.
 */

let lenisRequested = false;

export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Mirror the reduced-motion preference onto <html>.
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const applyRm = () => {
      document.documentElement.toggleAttribute("data-rx-rm", mq.matches);
    };
    applyRm();
    mq.addEventListener("change", applyRm);

    // Start smooth scrolling once, when motion is allowed.
    let teardown: (() => void) | null = null;
    let cancelled = false;
    if (!prefersReducedMotion() && !lenisRequested) {
      lenisRequested = true;
      setupLenis().then((t) => {
        if (cancelled) {
          t();
          lenisRequested = false;
        } else {
          teardown = t;
        }
      });
    }

    return () => {
      cancelled = true;
      mq.removeEventListener("change", applyRm);
      if (teardown) {
        teardown();
        lenisRequested = false;
      }
    };
  }, []);

  return <>{children}</>;
}
