"use client";

import { useEffect, useRef } from "react";

/**
 * HeroHeading — per-letter display headline.
 *
 * The reference animates its H1 in one letter at a time on load. This is the
 * same device applied to ChromaDeck's own headline: letters rise and fade in on
 * a short stagger, once, on mount.
 *
 * - GSAP is imported dynamically so the static export code-splits it and SSR
 *   never touches `window`.
 * - Reduced motion sets the final state and skips the animation entirely.
 * - The heading keeps a readable aria-label; individual letters are decorative.
 */

const LINES: string[] = [
  "Your display.",
  "Your colours.",
  "Your control.",
];

export function HeroHeading() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const played = useRef(false);

  useEffect(() => {
    if (played.current) return;
    const h1 = headingRef.current;
    if (!h1) return;

    const letters = Array.from(h1.querySelectorAll<HTMLElement>("[data-letter]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      letters.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      played.current = true;
      return;
    }

    played.current = true;
    let cancelled = false;

    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      gsap.set(letters, { opacity: 0, yPercent: 16 });
      gsap.to(letters, {
        opacity: 1,
        yPercent: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.016,
        delay: 0.06,
        // Clear the inline styles afterwards so nothing fights later CSS.
        onComplete: () => {
          letters.forEach((el) => {
            el.style.willChange = "auto";
          });
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <h1
      ref={headingRef}
      className="rx-display-1 mt-6 text-foreground"
      aria-label="Your display. Your colours. Your control."
    >
      {LINES.map((line, li) => (
        <span key={li} aria-hidden="true" className="block">
          {line.split("").map((ch, ci) => (
            <span
              key={ci}
              data-letter
              style={{ display: "inline-block", willChange: "transform, opacity" }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
