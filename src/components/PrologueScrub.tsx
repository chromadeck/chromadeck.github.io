"use client";

import { useEffect, useRef, useState } from "react";

/**
 * PrologueScrub — the reference's signature "noise → voice" scroll effect
 * (ANIMATION-SPEC §P1).
 *
 * Every word is wrapped in a span. As the section moves through the viewport,
 * each word's blur/opacity/colour interpolates from a "noise" state to a
 * crisp "voice" state. Words clear on a stagger so the sentence resolves
 * progressively instead of all at once.
 *
 * Scroll progress is measured per-section (0 when the section top hits the
 * bottom of the viewport, 1 when its bottom leaves the top), so the effect
 * reads as tied to the reader's own position.
 *
 * Accessibility: the visible words are aria-hidden; a visually hidden copy
 * carries the real text for screen readers. Reduced motion renders the
 * final state immediately.
 */

type PrologueScrubProps = {
  /** One entry per paragraph. */
  paragraphs: string[];
  /** Words that resolve first and stay emphasised (e.g. the theme word). */
  emphasis?: string[];
};

const NOISE_BLUR = 7;
const NOISE_OPACITY = 0.22;

export function PrologueScrub({ paragraphs, emphasis = [] }: PrologueScrubProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [reduced, setReduced] = useState(false);

  // Flatten to words once, keeping paragraph boundaries.
  const paragraphsWords = paragraphs.map((p) =>
    p
      .trim()
      .split(/\s+/)
      .filter(Boolean),
  );
  const totalWords = paragraphsWords.reduce((n, w) => n + w.length, 0);
  const emphasisSet = new Set(emphasis.map((w) => w.toLowerCase()));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const words = Array.from(section.querySelectorAll<HTMLElement>("[data-word]"));
    if (words.length === 0) return;

    let frame = 0;
    let last = -1;

    const apply = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 → section top at viewport bottom; 1 → section bottom at viewport top.
      const span = rect.height + vh;
      const raw = (vh - rect.top) / span;
      const progress = Math.min(1, Math.max(0, raw));
      if (Math.abs(progress - last) < 0.001) return;
      last = progress;

      // A word finishes resolving by `settle` of the section's travel, so the
      // last line is fully crisp before the section leaves.
      const settle = 0.72;
      const step = settle / words.length;

      for (let i = 0; i < words.length; i++) {
        const start = i * step;
        const end = start + step * 2.6;
        const t = Math.min(1, Math.max(0, (progress - start) / (end - start)));
        // easeOutCubic keeps the tail of each word's resolve soft
        const eased = 1 - Math.pow(1 - t, 3);
        const el = words[i];
        const isEmphasis = emphasisSet.has((el.textContent || "").toLowerCase().replace(/[^\w’']/g, ""));

        el.style.filter = `blur(${(NOISE_BLUR * (1 - eased)).toFixed(2)}px)`;
        el.style.opacity = String(
          (NOISE_OPACITY + (1 - NOISE_OPACITY) * eased).toFixed(3),
        );
        el.style.color = isEmphasis
          ? `color-mix(in srgb, var(--rx-signal) ${Math.round(eased * 100)}%, var(--rx-noise))`
          : "";
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, totalWords, emphasis]);

  // Paragraph/word index bookkeeping for the stagger.
  let flatIndex = 0;

  return (
    <section
      id="prologue"
      ref={sectionRef}
      aria-labelledby="prologue-title"
      className="py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        {/* Real text for assistive tech; the animated copy is decorative. */}
        <div className="sr-only">
          <h2 id="prologue-title">Prologue</h2>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div aria-hidden="true" className="space-y-8">
          {paragraphsWords.map((words, pi) => (
            <p
              key={pi}
              className="rx-font-display text-[clamp(1.6rem,4.2vw,3.1rem)] font-[750] leading-[1.18] tracking-[-0.025em] text-foreground"
            >
              {words.map((w) => {
                const idx = flatIndex++;
                return (
                  <span
                    key={idx}
                    data-word
                    className="inline-block whitespace-pre will-change-[filter,opacity]"
                    style={
                      reduced
                        ? undefined
                        : {
                            filter: `blur(${NOISE_BLUR}px)`,
                            opacity: NOISE_OPACITY,
                          }
                    }
                  >
                    {w}
                    {idx < totalWords - 1 ? " " : ""}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
