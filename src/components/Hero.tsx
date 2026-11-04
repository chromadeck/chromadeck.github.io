"use client";

import { Button, useRelease } from "./ui";
import { REPO_URL } from "../lib/releases";

/**
 * Hero — ChromaDeck's proposition at a restrained, readable scale.
 *
 * No per-letter display treatment and no oversized statement block: the
 * interaction smoothness lives in the page-level motion (eased reveals,
 * scroll-linked refinement), not in a giant headline.
 */

export function Hero() {
  const release = useRelease();

  return (
    <section id="top" className="pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <p className="eyebrow enter">Display control / made simple</p>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-20">
          <div>
            <h1 className="t-h1 enter max-w-[16ch] text-foreground">
              Your display. Your colours. Your control.
            </h1>

            <p className="t-lead enter mt-6 max-w-[46ch] text-muted">
              ChromaDeck is a free Windows utility for building display colour presets and
              applying them per monitor — brightness, contrast, gamma, RGB gains, vibrance and
              hue, saved once and switched in a click.
            </p>

            <div className="enter mt-8 flex flex-wrap gap-4">
              <Button href="#download">Download ChromaDeck</Button>
              <Button href={REPO_URL} variant="ghost" external icon={false}>
                Explore on GitHub
              </Button>
            </div>

            <p className="t-meta enter mt-6 text-subtle">
              {release.tag} stable · Windows 10/11 x64 · MIT licensed
            </p>
          </div>

          <figure className="enter-slow">
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
      </div>
    </section>
  );
}
