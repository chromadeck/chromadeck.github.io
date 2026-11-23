"use client";
import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "./motion";

/**
 * Scroll progress, the way the scrollcraft engine does it: native scrolling
 * (compositor-threaded, so it stays smooth while the page works), one shared
 * rAF loop, positions measured once per layout change rather than per frame,
 * and each effect's progress lerped toward its target so wheel notches glide.
 *
 * Range notation is "<element edge> <viewport line>", for example
 * "top bottom" (element top meets viewport bottom) or "bottom 40%".
 */

type Entry = {
  el: HTMLElement;
  start: string;
  end: string;
  cb: (p: number) => void;
  y0: number;
  y1: number;
  cur: number;
  primed: boolean;
};

/** Fraction of the remaining distance covered per frame. Engine default. */
const LERP = 0.18;
const entries = new Set<Entry>();
let raf = 0;
let listening = false;
let ro: ResizeObserver | null = null;

/** Scroll offset at which `edge` of the element meets `line` in the viewport. */
export function triggerY(spec: string, top: number, height: number, vh: number): number {
  const [edge = "top", line = "bottom"] = spec.trim().split(/\s+/);
  const at = edge === "bottom" ? top + height : edge === "center" ? top + height / 2 : top;
  const pos =
    line === "top" ? 0 : line === "bottom" ? vh : line === "center" ? vh / 2 : (parseFloat(line) / 100) * vh;
  return at - pos;
}

export function progressAt(y: number, y0: number, y1: number): number {
  if (y1 <= y0) return y >= y1 ? 1 : 0;
  return Math.min(1, Math.max(0, (y - y0) / (y1 - y0)));
}

function measure() {
  const vh = window.innerHeight;
  const sy = window.scrollY;
  for (const e of entries) {
    const r = e.el.getBoundingClientRect();
    const top = r.top + sy;
    e.y0 = triggerY(e.start, top, r.height, vh);
    e.y1 = triggerY(e.end, top, r.height, vh);
  }
}

function frame() {
  raf = 0;
  const y = window.scrollY;
  const rate = prefersReducedMotion() ? 1 : LERP;
  let moving = false;
  for (const e of entries) {
    const target = progressAt(y, e.y0, e.y1);
    if (!e.primed) {
      e.cur = target;
      e.primed = true;
    } else if (e.cur !== target) {
      e.cur += (target - e.cur) * rate;
      if (Math.abs(target - e.cur) < 0.0005) e.cur = target;
      else moving = true;
    } else {
      continue;
    }
    e.cb(e.cur);
  }
  if (moving) schedule();
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(frame);
}

function remeasure() {
  measure();
  schedule();
}

function start() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", remeasure);
  ro = new ResizeObserver(remeasure);
  ro.observe(document.body);
}

function stop() {
  if (!listening || entries.size > 0) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", remeasure);
  ro?.disconnect();
  ro = null;
}

/**
 * Scroll progress 0..1 for one element between `start` and `end`.
 * The callback runs only when progress changes. `onProgress` should be stable.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  opts: { start?: string; end?: string; enabled?: boolean } = {},
) {
  const { start: s = "top bottom", end = "bottom top", enabled = true } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const entry: Entry = { el, start: s, end, cb: onProgress, y0: 0, y1: 0, cur: 0, primed: false };
    entries.add(entry);
    start();
    remeasure();
    return () => {
      entries.delete(entry);
      stop();
    };
    // onProgress is expected to be stable (useCallback with no deps).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, s, end, enabled]);
}
