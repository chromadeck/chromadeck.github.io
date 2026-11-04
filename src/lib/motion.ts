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
  ) => LenisLike)({
    // Lenis owns its own rAF loop. Driving it from GSAP's ticker produced very
    // slow programmatic scrolls, so we only tell ScrollTrigger to re-read.
    autoRaf: true,
    // Duration-based easing re-eases on every wheel tick, which reads as
    // jitter when events arrive at irregular intervals. Lerp interpolates
    // toward the target every frame and stays smooth under bursty input.
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
    // Let Lenis handle the wheel/touch itself and keep native keys and
    // scrollbar dragging untouched.
    syncTouch: false,
    // No anchor interception: our nav calls scrollToElement() explicitly and
    // two scroll drivers fighting over the same target causes visible judder.
    anchors: false,
    autoResize: true,
  });

  activeLenis = lenis;
  const steps: Teardown[] = [];

  // ScrollTrigger reads the Lenis-smoothed position.
  lenis.on("scroll", () => ScrollTrigger.update());

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

/** Smooth-scroll to an element id, centring it in the viewport. */
export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  if (activeLenis) {
    activeLenis.scrollTo(el, { offset: 0 });
  } else {
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "center",
    });
  }
}

/**
 * Centre an element in the viewport, accounting for the fixed header.
 *
 * Used for every in-page navigation (nav links, skip links, anchor buttons) so
 * a section lands centred rather than flush under the header. Falls back to a
 * native smooth scroll when Lenis is not running.
 */
export function scrollToElement(el: HTMLElement, extraOffset = 0) {
  if (typeof document === "undefined") return;
  const rect = el.getBoundingClientRect();
  const centred = rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
  const target = Math.max(0, centred + extraOffset);
  if (activeLenis) {
    activeLenis.scrollTo(target, {
      offset: 0,
      // A shorter, damped glide than the default 1s+ reads as responsive
      // rather than sluggish, and avoids a long tail after the target is hit.
      duration: 0.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
  } else {
    window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}
