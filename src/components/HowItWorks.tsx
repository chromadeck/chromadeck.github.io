"use client";
import { useCallback, useRef } from "react";
import { useScrollProgress } from "../lib/scroll";
import { SCROLL_PRESET, setScroll } from "../lib/regrade";

/** The editor's ten swatches: greys, then primaries and secondaries. */
const SWATCHES = ["#000000", "#333333", "#808080", "#d9d9d9", "#ff0000", "#00ff00", "#0000ff", "#00ffff", "#ff00ff", "#ffff00"];

const STEPS = [
  {
    title: "Build a preset",
    body: "Set brightness, contrast, gamma, RGB gains, vibrance and hue. Save it with a name, a category and a tag colour.",
  },
  {
    title: "Apply it to a monitor",
    body: `The colour changes on that display only. This page just did it to itself: ${SCROLL_PRESET.name}, through ChromaDeck's own gamma ramp.`,
  },
  {
    title: "Pin it",
    body: "A pinned preset survives reboots and standby. ChromaDeck re-applies it about every 10 seconds. Scroll back up and this page unpins.",
  },
];

const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

function SwatchRow({ label, graded }: { label: string; graded?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="label text-subtle">{label}</p>
        <p className="label text-subtle">10 swatches</p>
      </div>
      <div className={`mt-2 grid grid-cols-10 gap-1.5 ${graded ? "gradable" : ""}`} aria-hidden="true">
        {SWATCHES.map((c) => (
          <span key={c} className="aspect-[2/3] rounded-[3px]" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

/**
 * HowItWorks: the peak. Scrolling the steps applies a preset to the page
 * itself, scrubbed by the hand. "Apply" sits where the change happens, "Pin"
 * where it locks. A sticky colour bar, in the editor's own format, shows the
 * original against the graded page while the steps flow past.
 */
export function HowItWorks() {
  const list = useRef<HTMLOListElement>(null);

  const onProgress = useCallback((p: number) => {
    const s = Math.round(smooth((p - 0.28) / 0.3) * 50) / 50;
    setScroll(s, p > 0.76);
  }, []);

  useScrollProgress(list, onProgress, { start: "top 70%", end: "bottom 40%" });

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-16 pt-[22vh] pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <h2 id="how-title" className="t-h1 max-w-[16ch] text-foreground">
          Set it once. It stays set.
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
          <aside className="peak-panel lg:order-2" aria-label="Colour bar preview">
            <div className="border border-border bg-surface p-4 sm:p-5">
              <SwatchRow label="Original" />
              <div className="mt-4">
                <SwatchRow label="This page" graded />
              </div>
            </div>
          </aside>

          <ol ref={list} className="lg:order-1">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`peak-step ${i === 1 ? "peak-step--apply" : ""}`}>
                <span className="font-mono text-[var(--t-sm)] text-primary">Step {i + 1}</span>
                <h3 className={i === 1 ? "t-display mt-3 text-foreground" : "t-h2 mt-3 text-foreground"}>{s.title}</h3>
                <p className="t-lead mt-4 max-w-[46ch] text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
