"use client";

import { Button, useRelease } from "./ui";
import { REPO_URL } from "../lib/releases";
import { ScrubText } from "./ScrubText";
import { HeroHeading } from "./HeroHeading";

/**
 * Hero — ChromaDeck's own proposition, delivered with the reference's
 * motion language: per-letter display entrance, then a scrubbed statement.
 */

export function Hero() {
  const release = useRelease();

  return (
    <section id="top" className="pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <p className="eyebrow">Display control / made simple</p>

        <HeroHeading />

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

        {/* Scrubbed statement — ChromaDeck's own positioning line. */}
        <ScrubText
          className="mt-24 max-w-[900px] sm:mt-32"
          display
          accent={["display", "preset"]}
          paragraphs={[
            "One set of colour values should never have to serve every screen.",
            "ChromaDeck keeps a preset per display, applies it in a click, and re-applies it when something else disturbs the ramp.",
          ]}
        />
      </div>
    </section>
  );
}
