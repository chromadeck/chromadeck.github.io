import { useState } from "react";
import { Reveal } from "./Reveal";

export function Promo() {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  return (
    <section id="video" className="py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-10 md:mb-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink">
            Watch it work
          </h2>
          <p className="text-base text-muted-foreground max-w-[65ch] mx-auto mt-3 leading-relaxed">
            Thirty-eight seconds, end to end — the real app, no narration
            needed.
          </p>
        </div>

        <Reveal>
          <div className="mx-auto max-w-[900px] rounded-2xl bg-card border border-border shadow-brutal overflow-hidden">
            {reduced ? (
              <img
                src="/promo-poster.jpg"
                alt="ChromaDeck promo video preview"
                className="block w-full h-auto"
                loading="lazy"
              />
            ) : (
              <video
                className="block w-full h-auto"
                src="/promo.mp4"
                poster="/promo-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="ChromaDeck promo video"
              />
            )}
          </div>
        </Reveal>
        <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground tracking-wide">
          chromadeck-promo.mp4 · 38s · muted autoplay, pauses with
          reduced-motion.
        </p>
      </div>
    </section>
  );
}
