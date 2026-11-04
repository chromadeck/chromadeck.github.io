import { useEffect, useRef } from "react";

/**
 * One-way scroll reveal, guaranteed to resolve.
 *
 * Design:
 * 1. CSS leaves content VISIBLE by default. This hook hides only elements
 *    genuinely below the fold at mount, then removes the flag when they enter
 *    view — so no JS, a missed observer, or an error can never strand content
 *    at opacity 0.
 * 2. IntersectionObserver is the primary trigger. It is async and runs off the
 *    critical path, so normal scrolling costs nothing.
 * 3. A cheap safety-net timer backs it up (Lenis does not dispatch native
 *    `scroll` events). It polls on an interval rather than every frame, so it
 *    never forces per-frame layout reads — reading getBoundingClientRect() for
 *    many elements each frame is exactly what makes scroll feel jittery.
 *    The timer stops as soon as nothing is pending.
 */

type Pending = { el: HTMLElement };

const registry = new Set<Pending>();
let timer: number | null = null;

/** Poll interval for the safety net — coarse on purpose. */
const POLL_MS = 180;

function inView(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  return r.top < vh * 0.94 && r.bottom > 0;
}

function poll() {
  timer = null;
  for (const entry of Array.from(registry)) {
    if (!entry.el.hasAttribute("data-pending")) {
      registry.delete(entry);
      continue;
    }
    if (inView(entry.el)) {
      entry.el.removeAttribute("data-pending");
      registry.delete(entry);
    }
  }
  if (registry.size > 0) timer = window.setTimeout(poll, POLL_MS);
}

function arm() {
  if (timer === null && registry.size > 0) timer = window.setTimeout(poll, POLL_MS);
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

    const entry: Pending = { el };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          el.removeAttribute("data-pending");
          registry.delete(entry);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);

    registry.add(entry);
    arm();

    return () => {
      io.disconnect();
      registry.delete(entry);
      el.removeAttribute("data-pending");
    };
  }, []);

  return ref;
}
