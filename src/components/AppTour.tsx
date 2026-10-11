import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";

const SHOTS = [
  {
    src: "/tour-empty.png",
    alt: "Fresh install: empty library with a Create preset call to action",
    caption:
      "Fresh installs start empty — no seeded preset, nothing pinned. The library fills only with presets you create.",
  },
  {
    src: "/tour-create.png",
    alt: "Create preset dialog with neutral defaults and a live preview strip",
    caption:
      "Create opens neutral — gamma 1.00, brightness and contrast 50 — with a live preview strip, so a preset changes nothing until you move a slider.",
  },
  {
    src: "/tour-edit.png",
    alt: "Editing the Valorant preset: gamma 1.25, brightness 55, contrast 55, vibrance 100",
    caption:
      "Tune with stated neutrals — every slider shows its neutral point, so a fresh preset changes nothing until you move one.",
  },
  {
    src: "/tour-apply.png",
    alt: "Apply dialog: pick the target monitor with an optional Pin toggle",
    caption:
      "Apply… picks the target monitor — your last target per preset is remembered — with one Pin toggle.",
  },
  {
    src: "/tour-select.png",
    alt: "Select mode: checkbox cards ready for batch delete",
    caption:
      "Select mode arms checkbox cards — in the app they tremble side-to-side while armed, like this shot.",
    tremble: true,
  },
  {
    src: "/tour-delete-batch.png",
    alt: "Batch delete confirmation for one preset",
    caption:
      "Batch delete always confirms — Delete (1) counts your selection before anything is destroyed.",
  },
  {
    src: "/tour-delete.png",
    alt: "Single delete confirmation from the trash icon",
    caption:
      "The trash icon deletes one preset — with its own confirmation, since there is no undo.",
  },
  {
    src: "/tour-rename.png",
    alt: "Renaming a monitor inline in the sidebar",
    caption:
      "Monitors are user-renamable — ✎ edits inline, Save commits, identity stays on EDID underneath.",
  },
];

const STEP_MS = 4500;

export function AppTour() {
  const [step, setStep] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const autoplay = !hovering && !stopped && !reduced;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(
      () => setStep((s) => (s + 1) % SHOTS.length),
      STEP_MS,
    );
    return () => window.clearInterval(id);
  }, [autoplay, step]);

  const shot = SHOTS[step];

  return (
    <section id="tour" className="py-20 md:py-24" data-step={step}>
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-10 md:mb-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink">
            Take the tour
          </h2>
          <p className="text-base text-muted-foreground max-w-[65ch] mx-auto mt-3 leading-relaxed">
            The real app, real presets — every shot captured from v0.8.0.
          </p>
        </div>

        <Reveal>
          <div
            className={`mx-auto max-w-[900px] rounded-2xl bg-card border border-border shadow-brutal overflow-hidden ${!autoplay ? "tour-paused" : ""}`}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onFocus={() => setHovering(true)}
            onBlur={() => setHovering(false)}
          >
            <div className="relative">
              {SHOTS.map((s, i) => (
                <img
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`w-full h-auto transition-opacity duration-500 ease-[var(--ease-out)] ${
                    i === step
                      ? `relative opacity-100 ${s.tremble ? "tour-select-tremble" : ""} ${!reduced ? "tour-kenburns" : ""}`
                      : "pointer-events-none absolute inset-0 opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Captions + controls */}
        <div className="mx-auto max-w-[900px] mt-5 flex flex-col items-center gap-4">
          <p key={step} className="font-mono text-xs text-ink text-center min-h-8">
            <span className="text-muted-foreground">
              0{step + 1} / 0{SHOTS.length} —{" "}
            </span>
            {shot.caption}
          </p>
          <div className="flex items-center gap-1.5 w-full max-w-[560px]">
            {SHOTS.map((s, i) => (
              <button
                key={s.src}
                aria-label={`Go to step ${i + 1}: ${s.alt}`}
                onClick={() => {
                  setStep(i);
                  setStopped(true);
                }}
                className={`relative h-2 flex-1 overflow-hidden rounded-full border border-ink transition-colors duration-200 ease-[var(--ease-out)] ${
                  i < step ? "bg-ink" : "bg-paper hover:bg-muted"
                }`}
              >
                {i === step &&
                  (autoplay ? (
                    <span
                      key={step}
                      className="tour-progress-fill absolute inset-0 bg-ink"
                    />
                  ) : (
                    <span className="absolute inset-0 bg-ink" />
                  ))}
              </button>
            ))}
            <button
              onClick={() => {
                setStep(0);
                setStopped(false);
              }}
              className="ml-2 shrink-0 rounded-lg border border-border bg-secondary px-3 py-1 font-mono text-[11px] text-ink shadow-brutal-sm hover:shadow-brutal active:translate-y-[2px] active:shadow-none transition-all duration-[90ms] ease-[var(--ease-out)]"
            >
              Replay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
