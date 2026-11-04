"use client";
import { Reveal } from "./Reveal";

const STEPS = [
  { n: "01", label: "Create", title: "Build your preset", body: "Set brightness, contrast, gamma, RGB gains, vibrance and hue, then save it with a name, colour tag and category." },
  { n: "02", label: "Organize", title: "Keep your library tidy", body: "The preset library keeps every configuration named and searchable. Applied presets sit on their monitor card instead of duplicating in the library." },
  { n: "03", label: "Apply", title: "Apply to a display", body: "Pick a connected monitor and apply in one click. Pin it so ChromaDeck re-applies in the background, approximately every 10 seconds." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="py-30 sm:py-40 border-y border-border">
      <div className="mx-auto max-w-[720px] px-6 sm:px-10">
        <Reveal>
          <p className="eyebrow">Three steps</p>
          <h2 id="how-title" className="mt-4 text-[36px] leading-[1.1] font-semibold tracking-[-0.05em] text-foreground sm:text-[52px]">
            Build once, apply everywhere
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-muted sm:text-[19px]">
            Create a colour configuration once, keep it in your library and switch between displays in a click.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto max-w-[720px] px-6 sm:px-10 mt-20 relative">
        <div className="hidden lg:block absolute -left-[32px] top-[4px] bottom-[1px] w-[1px] bg-border" />
        {STEPS.map((s, i) => (
          <Reveal key={s.label} staggerMs={80} className="mb-24 last:mb-0">
            <div className="grid items-start gap-5 sm:grid-cols-[60px_1fr] sm:items-center lg:grid-cols-[72px_1fr]">
              <span className="font-mono text-[20px] font-semibold tracking-[-0.04em] text-primary">{s.n}</span>
              <div className="flex items-center gap-4">
                <span className={`font-mono text-[10px] uppercase tracking-wider ${s.label === "Apply" ? "border-primary-border bg-primary-subtle text-primary" : "border-border-hover text-muted"}`}>
                  {s.label}
                </span>
              </div>
            </div>
            <h3 className="mt-2 text-[20px] leading-tight font-semibold tracking-[-0.03em] text-foreground sm:text-[24px]">
              {s.title}
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-muted sm:text-[18px]">{s.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
