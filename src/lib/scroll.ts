"use client";
import { useEffect, type RefObject } from "react";

/**
 * Scroll progress for one element, 0..1, via GSAP ScrollTrigger.
 * `start` and `end` use ScrollTrigger notation ("top bottom", "bottom top").
 * The callback runs on every scroll frame and once on refresh. Returns
 * nothing; the trigger is killed on unmount.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  opts: { start?: string; end?: string; enabled?: boolean } = {},
) {
  const { start = "top bottom", end = "bottom top", enabled = true } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let cancelled = false;
    let kill = () => {};

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const st = ScrollTrigger.create({
          trigger: el,
          start,
          end,
          onUpdate: (self) => onProgress(self.progress),
          onRefresh: (self) => onProgress(self.progress),
        });
        kill = () => st.kill();
      })
      .catch((err: unknown) => {
        // Scroll effects are progressive. The static layout stays usable.
        console.warn("Scroll progress unavailable:", err);
      });

    return () => {
      cancelled = true;
      kill();
    };
    // onProgress is expected to be stable (defined once per component).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, start, end, enabled]);
}
