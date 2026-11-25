"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { ScrubText } from "./ScrubText";
import { useScrollProgress } from "../lib/scroll";
import { prefersReducedMotion } from "../lib/motion";
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

  // Reveal: the frame wipes open from the bottom edge as it rises into view.
  const frame = useRef<HTMLDivElement>(null);
  const onReveal = useCallback((p: number) => {
    const t = Math.min(1, Math.max(0, p / 0.55));
    const eased = 1 - Math.pow(1 - t, 3);
    if (frame.current) frame.current.style.clipPath = `inset(${(1 - eased) * 100}% 0 0 0)`;
  }, []);
  useScrollProgress(frame, onReveal, {
    start: "top 95%",
    end: "top 30%",
    enabled: typeof window !== "undefined" && !prefersReducedMotion(),
  });

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
    <section id="video" aria-labelledby="video-title" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <div className="flex flex-col gap-12">
          <Reveal>
            <div className="flex max-w-[640px] flex-col gap-5">
              <h2 id="video-title" className="t-h1 text-foreground">
                Watch a preset go on.
              </h2>
              <ScrubText
                lead
                paragraphs={[
                  "The walkthrough covers the monitor dashboard, the preset library, the apply dialog and pinning.",
                ]}
              />
            </div>
          </Reveal>

          <div>
            <div ref={frame} className="video-frame relative aspect-[16/9] w-full overflow-hidden border border-border bg-surface">
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
          </div>
        </div>
      </div>
    </section>
  );
}
