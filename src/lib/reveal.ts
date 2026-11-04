import { useEffect, useRef } from "react";

/**
 * One-way scroll reveal, guaranteed to resolve.
 *
 * Design:
 * 1. CSS leaves content VISIBLE by default.
 * 2. The hook hides only elements genuinely below the fold at mount, using a
 *    `data-pending` attribute, then removes it when they come into view.
 * 3. A single shared rAF loop (one for the whole page, not one per element)
 *    re-checks pending elements while any remain. This matters because Lenis
 *    smooth scrolling does not dispatch native `scroll` events, so a
 *    scroll-listener-only approach leaves elements stranded. The loop stops
 *    as soon as nothing is pending.
 *
 * With no JS, no observer support, or reduced motion, nothing is ever hidden.
 */

type Pending = { el: HTMLElement; done: () => void };

const registry = new Set<Pending>();
let loopHandle = 0;
let listening = false;

function inView(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  return r.top < vh * 0.94 && r.bottom > 0;
}

function tick() {
  loopHandle = 0;
  for (const entry of registry) {
    if (!entry.el.hasAttribute("data-pending")) {
      registry.delete(entry);
      continue;
    }
    if (inView(entry.el)) {
      entry.el.removeAttribute("data-pending");
      entry.done();
      registry.delete(entry);
    }
  }
  if (registry.size > 0) loopHandle = requestAnimationFrame(tick);
}

function ensureLoop() {
  if (loopHandle === 0) loopHandle = requestAnimationFrame(tick);
  if (listening) return;
  listening = true;
  // Resize changes layout, so re-arm the loop.
  window.addEventListener(
    "resize",
    () => {
      if (registry.size > 0) ensureLoop();
    },
    { passive: true },
  );
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const vh = window.innerHeight || 0;
    if (el.getBoundingClientRect().top < vh * 0.92) return; // already visible

    el.setAttribute("data-pending", "");

    let io: IntersectionObserver | null = null;
    const entry: Pending = {
      el,
      done: () => {
        io?.disconnect();
        io = null;
      },
    };

    // Primary: IntersectionObserver (cheap, no polling once resolved).
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          el.removeAttribute("data-pending");
          entry.done();
          registry.delete(entry);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);

    // Safety: shared rAF loop for anything the observer misses (Lenis scroll).
    registry.add(entry);
    ensureLoop();

    return () => {
      io?.disconnect();
      registry.delete(entry);
      el.removeAttribute("data-pending"); // never leave content hidden
    };
  }, []);

  return ref;
}
