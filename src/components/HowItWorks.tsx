"use client";
import { Reveal } from "./Reveal";
import { ScrubText } from "./ScrubText";

const STEPS = [
  { n: "01", label: "Create", title: "Build your preset", body: "Set brightness, contrast, gamma, RGB gains, vibrance and hue, then save it with a name, colour tag and category." },
  { n: "02", label: "Organize", title: "Keep your library tidy", body: "The preset library keeps every configuration named and searchable. Applied presets sit on their monitor card instead of duplicating in the library." },
  { n: "03", label: "Apply", title: "Apply to a display", body: "Pick a connected monitor and apply in one click. Pin it so ChromaDeck re-applies in the background, approximately every 10 seconds." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-24 border-y border-border py-24 sm:py-32">
      <div className="mx-auto max-w-[760px] px-6 sm:px-10">
        <Reveal>
          <p className="chapter eyebrow">
            <span>02</span>
            <span>Three steps</span>
          </p>
          <h2 id="how-title" className="t-h2 mt-4 text-foreground">
            Build once, apply everywhere
          </h2>
          <ScrubText
            className="mt-5"
            lead
            paragraphs={[
              "Create a colour configuration once, keep it in your library and switch between displays in a click.",
            ]}
          />
        </Reveal>

        <div className="relative mt-16">
          <div className="absolute -left-[32px] top-1 bottom-1 hidden w-px bg-border lg:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.label} staggerMs={i * 80} className="mb-20 last:mb-0">
              <div className="grid items-center gap-4 sm:grid-cols-[56px_1fr] lg:grid-cols-[64px_1fr]">
                <span className="font-mono text-[var(--t-xl)] font-semibold tracking-[-0.04em] text-primary">
                  {s.n}
                </span>
                <span
                  className={`t-meta w-fit rounded-full border px-2.5 py-1 uppercase ${
                    s.label === "Apply"
                      ? "border-primary-border bg-primary-subtle text-primary"
                      : "border-border-hover text-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              <h3 className="t-h3 mt-3 text-foreground">{s.title}</h3>
              <p className="t-body mt-3 text-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
