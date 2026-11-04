"use client";
import { Reveal } from "./Reveal";

const POINTS = [
  {
    before: "Digging through driver panels every time you switch tasks.",
    after: "Every configuration lives in one library, one click from applied.",
  },
  {
    before: "One set of values for a dark shooter, a photo edit and a late-night read.",
    after: "A named preset for each, tagged and grouped by category.",
  },
  {
    before: "Settings that drift when something else touches the gamma ramp.",
    after: "Pin a preset to a display and ChromaDeck re-applies it in the background.",
  },
];

export function Intro() {
  return (
    <section id="why-it-exists" aria-labelledby="intro-title" className="py-30 sm:py-40">
      <div className="mx-auto grid max-w-[1300px] gap-14 px-6 sm:px-10 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
        <Reveal>
          <p className="eyebrow">Why it exists</p>
          <h2
            id="intro-title"
            className="mt-4 text-[36px] leading-[1.1] font-semibold tracking-[-0.05em] text-foreground sm:text-[52px]"
          >
            Colour settings should be a choice, not a chore.
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-muted sm:text-[19px]">
            Different games, films and work benefit from different colour. ChromaDeck turns the
            values you would otherwise re-enter by hand into reusable presets for each display.
          </p>
        </Reveal>

        <ol className="divide-y divide-border border-y border-border">
          {POINTS.map((p, i) => (
            <li key={i}>
              <Reveal staggerMs={i * 70} className="grid gap-3 py-8 sm:grid-cols-[40px_1fr] sm:gap-8">
                <span className="font-mono text-[12px] text-subtle">0{i + 1}</span>
                <p className="text-[16px] leading-relaxed text-subtle line-through decoration-border-hover">
                  {p.before}
                </p>
                <p className="text-[17px] leading-relaxed text-foreground sm:col-start-2">{p.after}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
