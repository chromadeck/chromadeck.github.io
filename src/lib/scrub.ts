/**
 * Scroll-linked text scrub.
 *
 * Adopted from the reference site's "words resolve as you scroll" behaviour
 * (ANIMATION-SPEC §P1), applied to ChromaDeck's own copy.
 *
 * Performance contract:
 * - Only `opacity` and `transform` are written — both compositor-only, so no
 *   repaint or reflow during scroll. Deliberately no blur: animating blur on
 *   dozens of spans per frame is a reliable way to make scrolling janky.
 * - One shared rAF loop drives every registered block, and only while at least
 *   one block is in view (gated by IntersectionObserver).
 * - Progress is compared to the last written value, so a still viewport writes
 *   nothing at all.
 *
 * Fail-safe contract (learned the hard way):
 * - The hidden starting state is applied from JS *only* when the first frame
 *   actually runs. If rAF is throttled, blocked, or the tab is backgrounded,
 *   the CSS default (fully visible) stands — text can never be stranded faint.
 * - A watchdog clears the armed state if no write happens within 1.5s.
 * - Reduced motion registers nothing.
 */

type ScrubEntry = {
  el: HTMLElement;
  units: HTMLElement[];
  visible: boolean;
  last: number;
  primed: boolean;
};

const entries = new Set<ScrubEntry>();
let frameHandle = 0;

const FADE_FROM = 0.22;
const RISE_EM = 0.16;

function frame() {
  frameHandle = 0;
  let anyVisible = false;

  for (const entry of entries) {
    if (!entry.visible) continue;
    anyVisible = true;

    // Prime the hidden start state only now that we know we can animate it.
    if (!entry.primed) {
      entry.primed = true;
      entry.el.classList.add("is-armed");
    }

    const rect = entry.el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const from = vh * 0.9;
    const to = vh * 0.34;
    const progress = Math.min(1, Math.max(0, (from - rect.top) / (from - to)));

    if (Math.abs(progress - entry.last) < 0.004) continue;
    entry.last = progress;

    const count = entry.units.length;
    const step = 0.62 / count;

    for (let i = 0; i < count; i++) {
      const start = i * step;
      const t = Math.min(1, Math.max(0, (progress - start) / (step * 2.4)));
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const unit = entry.units[i];
      unit.style.opacity = (FADE_FROM + (1 - FADE_FROM) * eased).toFixed(3);
      unit.style.transform = `translateY(${(RISE_EM * (1 - eased)).toFixed(3)}em)`;
    }
  }

  if (anyVisible) frameHandle = requestAnimationFrame(frame);
}

function kick() {
  if (frameHandle === 0) frameHandle = requestAnimationFrame(frame);
}

export function registerScrub(el: HTMLElement, units: HTMLElement[]): () => void {
  const entry: ScrubEntry = { el, units, visible: false, last: -1, primed: false };

  const io = new IntersectionObserver(
    (events) => {
      for (const event of events) {
        entry.visible = event.isIntersecting;
        if (entry.visible) {
          entry.last = -1; // force a fresh write on entry
          kick();
        }
      }
    },
    { rootMargin: "20% 0px 20% 0px", threshold: 0 },
  );
  io.observe(el);

  entries.add(entry);
  kick();

  // Watchdog: if nothing animated, make sure nothing is left faint.
  const watchdog = window.setTimeout(() => {
    if (!entry.primed) {
      entry.el.classList.remove("is-armed");
      for (const unit of units) {
        unit.style.opacity = "";
        unit.style.transform = "";
      }
    }
  }, 1500);

  return () => {
    clearTimeout(watchdog);
    io.disconnect();
    entries.delete(entry);
    el.classList.remove("is-armed");
  };
}
