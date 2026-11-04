"use client";

import { useEffect, useRef } from "react";
import { Button, useRelease } from "./ui";
import { REPO_URL } from "../lib/releases";

/**
 * Hero — ChromaDeck copy, rendered in the reference DNA type system.
 *
 * The reference site's hero headline is split into per-letter spans and
 * animated in on load (ANIMATION-SPEC §L2). We keep ChromaDeck's own words
 * and apply the same treatment: three display lines, each revealed with a
 * per-letter stagger.
 */

const LINES = [
  ["Y", "o", "u", "r", " ", "d", "i", "s", "p", "l", "a", "y", "."],
  ["Y", "o", "u", "r", " ", "c", "o", "l", "o", "u", "r", "s", "."],
];

export function Hero() {
  const release = useRelease();
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    if (playedRef.current) return;
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const h1 = headingRef.current;
    if (!h1) return;

    const letters = Array.from(h1.querySelectorAll<HTMLElement>("[data-letter]"));

    // Reduced motion: land on the final state immediately.
    if (reduced) {
      letters.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      playedRef.current = true;
      return;
    }

    playedRef.current = true;
    let cancelled = false;

    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      gsap.set(letters, { opacity: 0, yPercent: 18 });
      gsap.to(letters, {
        opacity: 1,
        yPercent: 0,
        duration: 0.62,
        ease: "power3.out",
        stagger: 0.018,
        delay: 0.08,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="top" className="pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <p className="eyebrow enter" style={{ "--d": "0ms" } as React.CSSProperties}>
          Display control / made simple
        </p>

        <h1
          ref={headingRef}
          className="rx-display-1 mt-6 text-foreground"
          aria-label="Your display. Your colours. Your control."
        >
          {LINES.map((line, li) => (
            <span key={li} aria-hidden="true" className="block">
              {line.map((ch, ci) => (
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
          <span aria-hidden="true" className="block text-[color:var(--rx-signal)]">
            {"Your control.".split("").map((ch, ci) => (
              <span
                key={ci}
                data-letter
                style={{ display: "inline-block", willChange: "transform, opacity" }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20">
          <p className="rx-font-serif max-w-[46ch] text-[19px] leading-relaxed text-muted sm:text-[21px]">
            ChromaDeck is a free Windows utility for building display colour presets and
            applying them per monitor — brightness, contrast, gamma, RGB gains, vibrance and
            hue, saved once and switched in a click.
          </p>

          <div>
            <div className="flex flex-wrap gap-4">
              <Button href="#download">Download ChromaDeck</Button>
              <Button href={REPO_URL} variant="ghost" external icon={false}>
                Explore on GitHub
              </Button>
            </div>
            <p className="mt-6 font-mono text-[12px] text-subtle">
              {release.tag} stable · Windows 10/11 x64 · MIT licensed
            </p>
          </div>
        </div>

        <figure className="enter-slow mt-16 sm:mt-20">
          <img
            src="/app/dashboard.png"
            width={2560}
            height={1600}
            alt="ChromaDeck main window: a monitor dashboard with three displays, one with the Warm Cinema preset applied, above a horizontal library of colour presets."
            className="shot"
            fetchPriority="high"
          />
          <figcaption className="mt-4 flex flex-wrap justify-between gap-3 font-mono text-[11px] text-subtle">
            <span>Main window — monitor dashboard above the preset library</span>
            <span>v0.8.2 interface · sample data</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
