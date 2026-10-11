import { useState } from "react";
import { Reveal } from "./Reveal";

function Short({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full max-w-[240px] rounded-2xl bg-card border border-border shadow-brutal overflow-hidden">
        {reduced ? (
          <img
            src="/promo-short-poster.jpg"
            alt="ChromaDeck vertical short preview"
            className="block w-full h-auto"
            loading="lazy"
          />
        ) : (
          <video
            className="block w-full h-auto"
            src="/promo-short.mp4"
            poster="/promo-short-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="ChromaDeck vertical short"
          />
        )}
      </div>
      <p className="font-mono text-[10px] text-muted-foreground tracking-wide text-center">
        Vertical cut — repost to TikTok / Shorts / Reels.
      </p>
    </div>
  );
}

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
            Twenty-seven seconds, end to end — the real app, no narration
            needed.
          </p>
        </div>

        <div className="mx-auto max-w-[1100px] grid md:grid-cols-[1fr_240px] gap-8 items-start justify-items-center">
          <Reveal className="w-full">
            <div className="rounded-2xl bg-card border border-border shadow-brutal overflow-hidden">
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
          <Reveal staggerMs={120}>
            <Short reduced={reduced} />
          </Reveal>
        </div>
        <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground tracking-wide">
          27s each · muted autoplay, stills under reduced-motion.
        </p>
      </div>
    </section>
  );
}
