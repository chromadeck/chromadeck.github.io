"use client";

import { useEffect, type ReactNode } from "react";
import { REDUCED_MOTION_QUERY, prefersReducedMotion, setupLenis } from "../../lib/motion";

/**
 * MotionProvider — owns the cross-cutting runtime concerns.
 *
 * 1. Lenis smooth scrolling (+ GSAP ScrollTrigger sync), only when motion is
 *    allowed. Refcounted inside setupLenis so StrictMode double-mounts are safe.
 * 2. The `data-rx-rm` mirror of prefers-reduced-motion on <html>.
 *
 * Hydration note: every DOM mutation here happens inside useEffect, i.e. after
 * hydration has completed. Nothing is written during render, so the client
 * tree matches the server HTML. The <html> element also carries
 * suppressHydrationWarning because extensions commonly inject attributes there
 * before React boots — that is not a render mismatch we can fix.
 */

let lenisRequested = false;

export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const applyRm = () => {
      document.documentElement.toggleAttribute("data-rx-rm", mq.matches);
    };
    applyRm();
    mq.addEventListener("change", applyRm);

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
