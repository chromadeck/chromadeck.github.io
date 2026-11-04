"use client";

/**
 * Motion core — shared by every section using the reference DNA.
 *
 * Architecture (ANIMATION-SPEC §Global):
 * - Lenis drives smooth scrolling when the user allows motion.
 * - GSAP's ticker drives Lenis; ScrollTrigger is kept in sync via the
 *   `scroll` event (the official GSAP + Lenis integration recipe).
 * - Everything degrades to native behaviour under prefers-reduced-motion.
 *
 * Modules are imported dynamically so the static export can code-split them
 * and SSR never touches `window`.
 */

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** SSR-safe reduced-motion probe. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

type LenisLike = {
  raf: (time: number) => void;
  on: (event: string, fn: (e: unknown) => void) => void;
  destroy: () => void;
  scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void;
};

type Teardown = () => void;

let teardownSteps: Teardown[] = [];
let refcount = 0;
let activeLenis: LenisLike | null = null;

/** The live Lenis instance, if smooth scrolling is active. */
export function getLenis(): LenisLike | null {
  return activeLenis;
}

/**
 * Create (or ref) the shared Lenis instance and sync it with GSAP's ticker.
 * Returns a teardown that decrements the refcount and destroys on zero.
 */
export async function setupLenis(): Promise<Teardown> {
  if (prefersReducedMotion()) return () => {};

  refcount += 1;
  if (activeLenis) return () => release();

  const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
    import("lenis"),
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new (Lenis as unknown as new (
    options?: Record<string, unknown>,
  ) => LenisLike)({ autoRaf: false });

  activeLenis = lenis;
  const steps: Teardown[] = [];

  // ScrollTrigger reads the Lenis-smoothed position.
  lenis.on("scroll", () => ScrollTrigger.update());

  // Single rAF loop: GSAP's ticker advances Lenis.
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  steps.push(() => gsap.ticker.remove(tick));

  teardownSteps = steps;
  return () => release();
}

function release() {
  refcount -= 1;
  if (refcount > 0) return;
  for (const fn of teardownSteps) fn();
  teardownSteps = [];
  activeLenis?.destroy();
  activeLenis = null;
}

/** Smooth-scroll to an element id, with or without Lenis. */
export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  if (activeLenis) {
    activeLenis.scrollTo(el, { offset: 0 });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}
