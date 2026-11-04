"use client";

import { useEffect, useRef } from "react";
import { registerScrub } from "../lib/scrub";

/**
 * ScrubText — paragraph whose words resolve as it scrolls into view.
 *
 * The motion is adopted from the reference site; the copy is ChromaDeck's own.
 * Each word starts faint and slightly low, then settles to full opacity and
 * rest position on a stagger, so a paragraph arrives as a sentence being read
 * rather than a block fading in.
 *
 * Accessibility: the animated words are aria-hidden and a visually hidden
 * duplicate carries the real text. Reduced motion renders the final state and
 * registers no scroll work.
 */

type ScrubTextProps = {
  /** One entry per paragraph. */
  paragraphs: string[];
  className?: string;
  /** Larger type for a lead statement. */
  lead?: boolean;
};

export function ScrubText({ paragraphs, className = "", lead = false }: ScrubTextProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const units = Array.from(root.querySelectorAll<HTMLElement>("[data-unit]"));
    if (units.length === 0) return;

    return registerScrub(root, units);
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {/* Real text for assistive tech. */}
      <div className="sr-only">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div aria-hidden="true">
        {paragraphs.map((p, pi) => (
          <p
            key={pi}
            className={
              lead
                ? "t-lead text-pretty text-muted [&:not(:first-child)]:mt-4"
                : "t-body text-pretty text-muted [&:not(:first-child)]:mt-4"
            }
          >
            {p.split(/\s+/).filter(Boolean).map((word, wi) => (
              <span key={wi} data-unit className="scrub-unit">
                {word}
                {" "}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
