"use client";

import { useCallback, useRef } from "react";
import { Button } from "./ui";
import { REPO_URL } from "../lib/releases";
import { useScrollProgress } from "../lib/scroll";
import { prefersReducedMotion } from "../lib/motion";

/**
 * Hero: object one of the catalog. The main window, with the apply dialog
 * open over it, the way the app actually stacks them.
 *
 * Two planes. As the page scrolls, the dashboard sinks and recedes a little
 * while the dialog lifts toward the reader, so the dialog separates from the
 * window behind it. Copy rides at 1x. Reduced motion keeps the overlap and
 * drops the movement.
 */
export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLElement>(null);
  const front = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((p: number) => {
    // p runs 0..1 while the stage crosses the viewport; motion starts at ~0.35.
    const t = Math.max(0, (p - 0.3) / 0.7);
    if (back.current) back.current.style.transform = `translate3d(0, ${t * 70}px, 0) scale(${1 - t * 0.035})`;
    if (front.current) front.current.style.transform = `translate3d(0, ${t * -110}px, 0)`;
  }, []);

  useScrollProgress(stage, onProgress, {
    enabled: typeof window !== "undefined" && !prefersReducedMotion(),
  });

  return (
    <section id="top" className="pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="enter max-w-[760px]">
          <h1 className="t-hero text-balance text-foreground">
            Colour presets, <span className="text-primary">per monitor.</span>
          </h1>
          <p className="t-lead mt-6 max-w-[48ch] text-pretty text-muted">
            A free Windows app that saves brightness, contrast, gamma and colour as presets, then
            applies them per monitor.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="#download">Download</Button>
            <Button href={REPO_URL} variant="ghost" external icon={false}>
              Source on GitHub
            </Button>
          </div>
        </div>

        <div ref={stage} className="hero-stage enter-slow">
          <figure ref={back} className="hero-plane window">
            <div className="window-bar">
              <span className="label text-subtle">ChromaDeck / main window</span>
              <span className="label hidden text-subtle sm:inline">Sample data</span>
            </div>
            <img
              src="/app/dashboard.png"
              width={2560}
              height={1600}
              alt="ChromaDeck main window. Three monitor cards sit at the top, with Warm Cinema applied to an LG UltraGear. The preset library runs along the bottom."
              className="gradable block h-auto w-full"
              fetchPriority="high"
            />
          </figure>

          <div ref={front} className="hero-plane hero-dialog">
            <img
              src="/app/apply.png"
              width={1040}
              height={904}
              alt="The apply dialog, open over the main window. Photo Vibrant is about to be applied to the LG UltraGear."
              className="gradable block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
