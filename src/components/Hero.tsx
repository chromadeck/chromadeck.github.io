"use client";

import { Button, useRelease } from "./ui";
import { REPO_URL } from "../lib/releases";

/**
 * Hero — ChromaDeck's proposition at full display scale.
 *
 * Centred composition: eyebrow, oversized display headline, serif lead, then
 * the two calls to action. The screenshot sits below the fold line so the
 * headline owns the first screen.
 */

export function Hero() {
  const release = useRelease();

  return (
    <section id="top" className="pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="enter mx-auto flex max-w-[62ch] flex-col items-center text-center">
          <p className="eyebrow">Display control / made simple</p>

          <h1 className="t-hero mt-6 text-balance text-foreground">
            Your display.
            <br />
            Your colours.
            <br />
            <span className="text-primary">Your control.</span>
          </h1>

          <p className="t-lead mt-8 max-w-[54ch] text-pretty text-muted">
            ChromaDeck is a free Windows utility for building display colour presets and applying
            them per monitor — brightness, contrast, gamma, RGB gains, vibrance and hue, saved once
            and switched in a click.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="#download">Download ChromaDeck</Button>
            <Button href={REPO_URL} variant="ghost" external icon={false}>
              Explore on GitHub
            </Button>
          </div>

          <p className="t-meta mt-7 text-subtle">
            {release.tag} stable · Windows 10/11 x64 · MIT licensed
          </p>
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
          <figcaption className="t-meta mt-4 flex flex-wrap justify-between gap-3 text-subtle">
            <span>Main window — monitor dashboard above the preset library</span>
            <span>v0.8.2 · sample data</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
