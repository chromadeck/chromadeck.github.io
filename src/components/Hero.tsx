"use client";
import type { CSSProperties } from "react";
import { Button, useRelease } from "./ui";
import { REPO_URL } from "../lib/releases";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const release = useRelease();
  return (
    <section id="top" className="pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <p className="eyebrow enter" style={d(0)}>
          Display control / made simple
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20">
          <h1 className="enter text-[40px] leading-[1.15] font-semibold tracking-[-0.03em] text-foreground sm:text-[52px] sm:leading-[1.05] sm:tracking-[-0.04em] lg:text-[76px] lg:leading-[0.98] lg:tracking-[-0.045em]" style={d(60)}>
            Your display.
            <br />
            Your colours.
            <br />
            <span className="hero-glow text-primary">Your control.</span>
          </h1>

          <div className="enter lg:pb-2" style={d(120)}>
            <p className="max-w-[48ch] text-[18px] leading-relaxed text-muted sm:text-[20px]">
              ChromaDeck is a free Windows utility for building display colour presets and
              applying them per monitor — brightness, contrast, gamma, RGB gains, vibrance and
              hue, saved once and switched in a click.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
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

        <figure className="enter-slow mt-18 sm:mt-24" style={d(220)}>
          <img
            src="/app/dashboard.png"
            width={2560}
            height={1600}
            alt="ChromaDeck main window: a monitor dashboard with three displays, one with the Warm Cinema preset applied, above a horizontal library of colour presets and a status bar with Autostart and Reapply."
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
