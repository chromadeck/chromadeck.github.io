"use client";

/**
 * Motion helpers. Scrolling is native: no smooth-scroll library. See
 * components/tools/MotionProvider.tsx for why, and lib/scroll.ts for the
 * scroll-driven effects.
 */

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** SSR-safe reduced-motion probe. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Smooth-scroll to an element id using the shared navigation logic. */
export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (el) scrollToElement(el);
}

/**
 * Navigate to an element, accounting for the fixed header.
 *
 * Short sections (smaller than the viewport) land centred; sections taller
 * than the viewport align with their top just under the header. Centring a
 * tall section would scroll its heading above the viewport.
 *
 * Used for every in-page navigation (nav links, skip links, anchor buttons).
 */
export function scrollToElement(el: HTMLElement, extraOffset = 0) {
  if (typeof document === "undefined") return;
  const header = document.querySelector<HTMLElement>("header");
  const headerH = header?.offsetHeight ?? 0;
  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY;
  const target = Math.max(
    0,
    (rect.height > window.innerHeight
      ? top - headerH // tall: top-aligned under the fixed header
      : top - (window.innerHeight - rect.height) / 2) + extraOffset, // short: centred
  );
  window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
