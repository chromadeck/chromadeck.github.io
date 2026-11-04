"use client";

import { Reveal } from "./Reveal";
import { ScrubText } from "./ScrubText";

export function Video() {
  return (
    <section id="video" aria-labelledby="video-title" className="scroll-mt-24 border-y border-border py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="flex flex-col gap-10">
          <Reveal>
            <div className="flex max-w-[620px] flex-col gap-5">
              <p className="chapter eyebrow">
                <span>04</span>
                <span>See it in action</span>
              </p>
              <h2 id="video-title" className="t-h2 text-foreground">
                Watch ChromaDeck work
              </h2>
              <ScrubText
                lead
                paragraphs={[
                  "A quick walkthrough of the monitor dashboard, preset library, apply dialog, and pin workflow — direct from the v0.8.2 interface.",
                ]}
              />
            </div>
          </Reveal>

          <Reveal staggerMs={90}>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[8px] border border-border bg-surface">
              <video
                controls
                playsInline
                preload="metadata"
                aria-label="ChromaDeck product walkthrough"
                className="h-full w-full object-contain"
              >
                <source src="/video/chromadeck-walkthrough.mp4" type="video/mp4" />
                Your browser does not support embedded video.{" "}
                <a href="/video/chromadeck-walkthrough.mp4">Download the walkthrough.</a>
              </video>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
