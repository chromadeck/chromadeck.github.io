"use client";

import { useEffect, useRef } from "react";

/**
 * ScrubHeading — section headline with the reference's word-resolve device.
 *
 * Words sharpen as the heading travels into view, so each section "arrives"
 * rather than simply appearing. Kept deliberately subtle at heading scale
 * (less blur than a display statement, so it never reads as broken text).
 *
 * Accessibility: aria-label carries the plain sentence; word spans are
 * decorative. Reduced motion renders resolved and attaches no listeners.
 */

type ScrubHeadingProps = {
  children: string;
  as?: "h2" | "h3";
  id?: string;
  className?: string;
  accent?: string[];
};

const normalize = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}’']/gu, "");
const SOFT_BLUR = 4;
const SOFT_OPACITY = 0.35;

export function ScrubHeading({
  children,
  as: Tag = "h2",
  id,
  className = "",
  accent = [],
}: ScrubHeadingProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const words = children.trim().split(/\s+/).filter(Boolean);
  const accentSet = new Set(accent.map(normalize));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-hword]"));
    if (spans.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => {
        s.style.filter = "none";
        s.style.opacity = "1";
      });
      return;
    }

    let frame = 0;
    let visible = false;
    let last = -1;

    const render = () => {
      frame = 0;
      if (!visible) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Heading resolves over the bottom 45% of the viewport travel.
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.75)));
      if (Math.abs(progress - last) < 0.002) return;
      last = progress;

      // Normalise so the final word finishes exactly at progress 1.
      const spread = 0.55;
      const step = spread / spans.length;
      spans.forEach((span, i) => {
        const start = i * step;
        const end = i === spans.length - 1 ? 1 : start + step * 3;
        const t = Math.min(1, Math.max(0, (progress - start) / (end - start)));
        const eased = 1 - Math.pow(1 - t, 3);
        span.style.filter = `blur(${(SOFT_BLUR * (1 - eased)).toFixed(2)}px)`;
        span.style.opacity = (SOFT_OPACITY + (1 - SOFT_OPACITY) * eased).toFixed(3);
        if (span.dataset.accent === "true") {
          span.style.color = `color-mix(in srgb, var(--rx-signal) ${Math.round(eased * 100)}%, var(--rx-muted))`;
        }
      });    };

    const onScroll = () => {
      if (!visible || frame) return;
      frame = requestAnimationFrame(render);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) onScroll();
        else last = -1;
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Tag ref={ref} id={id} className={className} aria-label={children}>
      {words.map((w, i) => (
        <span
          key={i}
          data-hword
          data-accent={accentSet.has(normalize(w)) ? "true" : undefined}
          aria-hidden="true"
          className="inline-block whitespace-pre"
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
