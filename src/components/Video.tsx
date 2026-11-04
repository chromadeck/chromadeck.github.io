"use client";

export function Video() {
  return (
    <section id="video" aria-labelledby="video-title" className="py-30 sm:py-40 border-y border-border">
      <div className="mx-auto max-w-[1300px] px-6 sm:px-10">
        <div className="flex flex-col gap-10 sm:gap-12">
          <div className="flex max-w-[640px] flex-col gap-6">
            <p className="eyebrow">See it in action</p>
            <h2 id="video-title" className="text-[36px] leading-[1.1] font-semibold tracking-[-0.05em] text-foreground sm:text-[52px]">
              Watch ChromaDeck work
            </h2>
            <p className="text-[17px] leading-relaxed text-muted sm:text-[19px]">
              A quick walkthrough of the monitor dashboard, preset library,
              apply dialog, and pin workflow — direct from the v0.8.2 interface.
            </p>
          </div>

          <div className="relative w-full rounded-[8px] border border-border bg-surface overflow-hidden aspect-[16/9]">
            <video
              controls
              playsInline
              preload="metadata"
              aria-label="ChromaDeck product walkthrough"
              className="h-full w-full object-contain"
            >
              <source src="/video/chromadeck-walkthrough.mp4" type="video/mp4" />
              Your browser does not support embedded video.{' '}
              <a href="/video/chromadeck-walkthrough.mp4">Download the walkthrough.</a>
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
