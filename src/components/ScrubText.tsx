"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScrubText — the reference site's signature scroll effect, applied to
 * ChromaDeck's own copy.
 *
 * Every word is span-wrapped. As the block travels through the viewport each
 * word interpolates from a "soft" state (blurred, faint, low-contrast) to a
 * resolved state (sharp, full-contrast), on a stagger so the sentence resolves
 * progressively rather than all at once.
 *
 * This is a motion device, not a layout: it works on any paragraph you hand it.
 *
 * Performance:
 * - One IntersectionObserver gates the whole thing; no scroll work at all while
 *   the block is offscreen.
 * - Scroll handler is rAF-coalesced and only writes to elements whose resolved
 *   value actually changed.
 * - Only `filter`/`opacity`/`color` are touched — no layout properties.
 *
 * Accessibility: the animated copy is aria-hidden; a visually hidden duplicate
 * carries the real text. prefers-reduced-motion renders the resolved state and
 * never attaches listeners.
 */

type ScrubTextProps = {
  /** Paragraphs, rendered as separate blocks. */
  paragraphs: string[];
  /** Words to accent once resolved (case-insensitive, punctuation-insensitive). */
  accent?: string[];
  /** Renders at display scale (use for hero-adjacent statements). */
  display?: boolean;
  className?: string;
};

const SOFT_BLUR = 6;
const SOFT_OPACITY = 0.18;

const normalize = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}’']/gu, "");

export function ScrubText({ paragraphs, accent = [], display = false, className = "" }: ScrubTextProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [reduced, setReduced] = useState(false);

  const blocks = paragraphs.map((p) => p.trim().split(/\s+/).filter(Boolean));
  const totalWords = blocks.reduce((n, b) => n + b.length, 0);
  const accentSet = new Set(accent.map(normalize));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const words = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"));
    if (words.length === 0) return;

    let frame = 0;
    let active = false;
    let lastProgress = -1;

    const render = () => {
      frame = 0;
      if (!active) return;

      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Resolve between "block top enters the lower viewport" and "block top
      // reaches the upper-middle", so the sentence is fully crisp while it is
      // still centred on screen — not as it leaves.
      const from = vh * 0.88;
      const to = vh * 0.34;
      const progress = Math.min(1, Math.max(0, (from - rect.top) / (from - to)));

      if (Math.abs(progress - lastProgress) < 0.002) return;
      lastProgress = progress;

      const step = 1 / words.length;

      for (let i = 0; i < words.length; i++) {
        const start = i * step * 0.78;
        const end = start + step * 2.2;
        const t = Math.min(1, Math.max(0, (progress - start) / (end - start)));
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic

        const el = words[i];
        const blur = (SOFT_BLUR * (1 - eased)).toFixed(2);
        const opacity = (SOFT_OPACITY + (1 - SOFT_OPACITY) * eased).toFixed(3);

        el.style.filter = `blur(${blur}px)`;
        el.style.opacity = opacity;

        if (el.dataset.accent === "true") {
          el.style.color = `color-mix(in srgb, var(--rx-signal) ${Math.round(eased * 100)}%, var(--rx-muted))`;
        }
      }
    };

    const onScroll = () => {
      if (!active || frame) return;
      frame = requestAnimationFrame(render);
    };

    // Only listen while the block is anywhere near the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) onScroll();
        else lastProgress = -1;
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(root);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, totalWords]);

  let flat = 0;

  return (
    <div ref={rootRef} className={className}>
      {/* Text for assistive tech — the animated layer below is decorative. */}
      <div className="sr-only">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div aria-hidden="true" className={display ? "space-y-6" : "space-y-5"}>
        {blocks.map((words, bi) => (
          <p
            key={bi}
            className={
              display
                ? "rx-font-display text-[clamp(1.5rem,3.6vw,2.75rem)] font-[750] leading-[1.16] tracking-[-0.025em] text-foreground"
                : "rx-font-serif text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.5] text-muted"
            }
          >
            {words.map((word) => {
              const idx = flat++;
              const isAccent = accentSet.has(normalize(word));
              return (
                <span
                  key={idx}
                  data-word
                  data-accent={isAccent ? "true" : undefined}
                  className="inline-block whitespace-pre"
                  style={
                    reduced
                      ? undefined
                      : {
                          filter: `blur(${SOFT_BLUR}px)`,
                          opacity: SOFT_OPACITY,
                        }
                  }
                >
                  {word}
                  {idx < totalWords - 1 ? " " : ""}
                </span>
              );
            })}
          </p>
        ))}
      </div>
    </div>
  );
}
