"use client";
import { Reveal } from "./Reveal";
import { ScrubText } from "./ScrubText";
import { Layers, MonitorSmartphone, Pin, Zap } from "lucide-react";

/**
 * Features — landscape cards.
 *
 * Each card is deliberately wider than it is tall: a 2-up grid at a wide max
 * width, with the icon and eyebrow in a left rail and the copy on the right.
 * That keeps the section short while staying readable, instead of stacking
 * four tall blocks.
 */

const FEATURES = [
  {
    id: "preset-management",
    Icon: Layers,
    eyebrow: "Presets",
    title: "Preset management",
    body: "Create named colour presets with brightness, contrast, gamma, RGB gains, vibrance and hue. Name them, give them a colour tag and category, and keep them organised.",
    tag: "Applied to LG UltraGear",
    active: true,
  },
  {
    id: "multi-monitor",
    Icon: MonitorSmartphone,
    eyebrow: "Displays",
    title: "Multi-monitor management",
    body: "Enumerate every connected display through one interface. Serials are shown alongside names so each physical screen stays identifiable, including offline monitors.",
    tag: "Default",
    active: false,
  },
  {
    id: "apply-pin",
    Icon: Pin,
    eyebrow: "Apply",
    title: "Apply, pin and enforce",
    body: "Apply a preset to the appropriate display, pin it so it survives reboots and standby, and let ChromaDeck re-apply in the background every ten seconds.",
    tag: "Pinned — reapply every 10s",
    active: false,
  },
  {
    id: "workflow",
    Icon: Zap,
    eyebrow: "Workflow",
    title: "Convenient daily workflow",
    body: "Start with Windows, reapply on demand, reset a monitor to defaults and probe its current state — all from the app shell without nested driver menus.",
    tag: "Autostart — reapply",
    active: false,
  },
];

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-24 border-y border-border py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <Reveal>
          <p className="chapter eyebrow">
            <span>01</span>
            <span>What it does</span>
          </p>
          <h2 id="features-title" className="t-h2 mt-4 text-foreground">
            Features
          </h2>
          <ScrubText
            className="mt-5 max-w-[62ch]"
            lead
            paragraphs={[
              "Build once, apply anywhere. Every display gets its own colour without nested driver menus.",
            ]}
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.id} staggerMs={i * 70}>
              <article className="card lift group flex h-full flex-col gap-4 p-6 sm:flex-row sm:gap-5 sm:p-7">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full border sm:size-11 ${
                    f.active
                      ? "border-primary-border bg-primary-subtle text-primary"
                      : "border-border-hover bg-surface-hover text-muted"
                  }`}
                  aria-hidden="true"
                >
                  <f.Icon size={18} strokeWidth={1.9} />
                </span>

                <div className="min-w-0">
                  <p className="eyebrow">{f.eyebrow}</p>
                  <h3 className="t-h3 mt-2 text-foreground">{f.title}</h3>
                  <p className="t-body mt-2.5 text-muted">{f.body}</p>
                  <span
                    className={`t-meta tag-lift mt-4 inline-block tracking-wider ${
                      f.active ? "text-foreground" : "text-subtle"
                    }`}
                  >
                    {f.tag}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
