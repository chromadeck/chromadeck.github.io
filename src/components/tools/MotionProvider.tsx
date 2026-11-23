"use client";

import { useEffect, type ReactNode } from "react";
import { REDUCED_MOTION_QUERY } from "../../lib/motion";

/**
 * MotionProvider: mirrors prefers-reduced-motion onto <html> as
 * `data-rx-rm`.
 *
 * Scrolling is native on purpose. A JS smooth-scroll layer (Lenis, removed)
 * moves the page from the main thread, so any frame the page spends on its
 * own scroll effects became a stutter in the scroll itself. Native scrolling
 * runs on the compositor thread and stays smooth; the scroll effects glide by
 * lerping their own progress instead (see lib/scroll.ts).
 *
 * The DOM write happens in useEffect, after hydration, so the client tree
 * matches the server HTML.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const applyRm = () => {
      document.documentElement.toggleAttribute("data-rx-rm", mq.matches);
    };
    applyRm();
    mq.addEventListener("change", applyRm);
    return () => mq.removeEventListener("change", applyRm);
  }, []);

  return <>{children}</>;
}
