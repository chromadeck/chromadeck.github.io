"use client";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    title: "Build a preset",
    body: "Set brightness, contrast, gamma, RGB gains, vibrance and hue. Save it with a name, a category and a tag colour.",
  },
  {
    title: "Apply it to a monitor",
    body: "Pick a monitor in the apply dialog, or drop the preset on its card. The colour changes on that display only.",
  },
  {
    title: "Pin it",
    body: "A pinned preset survives reboots and standby. ChromaDeck re-applies it about every 10 seconds.",
  },
];

/** HowItWorks: the three steps, in order, each separated by a rule. */
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <h2 id="how-title" className="t-h1 max-w-[16ch] text-foreground">
          Set it once. It stays set.
        </h2>

        <ol className="mt-12">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step">
              <Reveal staggerMs={i * 60} className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-10">
                <span className="font-mono text-[var(--t-sm)] text-primary">Step {i + 1}</span>
                <div>
                  <h3 className="t-h2 text-foreground">{s.title}</h3>
                  <p className="t-lead mt-3 max-w-[52ch] text-muted">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
