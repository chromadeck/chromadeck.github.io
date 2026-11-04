"use client";

export function Video() {
  return (
    <section id="video" aria-labelledby="video-title" className="py-30 sm:py-40 border-y border-border">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="flex flex-col gap-10">
          <div className="flex max-w-[620px] flex-col gap-5">
            <p className="eyebrow">See it in action</p>
            <h2 id="video-title" className="t-h2 text-foreground">
              Watch ChromaDeck work
            </h2>
            <p className="t-lead text-muted">
              A quick walkthrough of the monitor dashboard, preset library, apply dialog, and pin
              workflow — direct from the v0.8.2 interface.
            </p>
          </div>

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
        </div>
      </div>
    </section>
  );
}
