"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { ScrubText } from "./ScrubText";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Video section — the X/Netflix pattern for in-page video:
 * autoplay muted while the section is well in view, pause when it leaves,
 * and hand full control over the moment the user drives playback.
 *
 * Contracts:
 * - Autoplay only works muted, so the video starts muted with an always-visible
 *   mute pill. Nothing is ever lost: sound is one tap away.
 * - Once the user interacts with the player (click/keyboard on the controls, or
 *   seeking), autoplay management stops permanently — we never fight the user.
 * - Reduced motion skips autoplay entirely; the video plays only on click.
 * - All lifecycle logic is in one effect; failures to play() are swallowed.
 */

export function Video() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Set (and kept true) once the user drives playback themselves.
    let engaged = false;
    let inSection = false;

    const engage = () => {
      engaged = true;
    };
    // Interaction with the native control bar (or the element) counts.
    video.addEventListener("click", engage);
    video.addEventListener("keydown", engage);
    // Seeking is user intent even when events are synthetic.
    video.addEventListener("seeking", engage);

    const run = () => {
      if (engaged) return;
      if (inSection && video.paused) video.play().catch(() => {});
      else if (!inSection && !video.paused && !video.ended) video.pause();
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        inSection = entry.intersectionRatio >= 0.35;
        run();
      },
      // Only autoplay once a good chunk of the player is actually on screen.
      { threshold: [0, 0.35] },
    );
    io.observe(video);

    // Backgrounded tabs shouldn't keep decoding; foreground resumes smoothly.
    const onVisibility = () => {
      if (document.hidden) {
        if (inSection && !video.paused) video.pause();
      } else {
        run();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("click", engage);
      video.removeEventListener("keydown", engage);
      video.removeEventListener("seeking", engage);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
    // Unmuting is a signal the user is watching with intention: if autoplay
    // was interrupted by the browser, honour the tap by starting playback.
    if (!next && video.paused) video.play().catch(() => {});
  };

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
                ref={videoRef}
                controls
                muted
                playsInline
                preload="metadata"
                aria-label="ChromaDeck product walkthrough"
                className="h-full w-full object-contain"
              >
                <source src="/video/chromadeck-walkthrough.mp4" type="video/mp4" />
                Your browser does not support embedded video.{" "}
                <a href="/video/chromadeck-walkthrough.mp4">Download the walkthrough.</a>
              </video>
              <button
                type="button"
                onClick={toggleMute}
                aria-pressed={!muted}
                aria-label={muted ? "Unmute walkthrough" : "Mute walkthrough"}
                className="absolute right-3 top-3 z-10 flex h-8 items-center gap-2 rounded-full border border-border bg-surface px-3 t-meta uppercase tracking-wider text-subtle transition-colors hover:border-border-hover hover:text-foreground"
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                {muted ? "Muted" : "Sound on"}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
