"use client";
import { Reveal } from "./Reveal";
import { ScrubHeading } from "./ScrubHeading";

const FEATURES = [
  {
    id: "preset-management",
    eyebrow: "Presets",
    title: "Preset management",
    body: "Create named colour presets with brightness, contrast, gamma, RGB gains, vibrance and hue. Name them, give them a colour tag and category, and keep them organised.",
    tag: "Applied to LG UltraGear",
    activeVariant: true,
  },
  {
    id: "multi-monitor",
    eyebrow: "Displays",
    title: "Multi-monitor management",
    body: "Enumerate every connected display through one interface. Serials are shown alongside names so each physical screen stays identifiable, including offline monitors.",
    tag: "Default",
    activeVariant: false,
  },
  {
    id: "apply-pin",
    eyebrow: "Apply",
    title: "Apply, pin and enforce",
    body: "Apply a preset to the appropriate display, pin it so it survives reboots and standby, and let ChromaDeck re-apply in the background (polling approximately every 10 seconds).",
    tag: "Pinned — reapply every 10s",
    activeVariant: false,
  },
  {
    id: "workflow",
    eyebrow: "Workflow",
    title: "Convenient daily workflow",
    body: "Start with Windows, reapply on demand, reset a monitor to defaults and probe its current state — all from the app shell without opening nested driver menus.",
    tag: "Autostart — reapply",
    activeVariant: false,
  },
];

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="py-30 sm:py-40 border-y border-border">
      <div className="mx-auto max-w-[720px] px-6 sm:px-10">
        <Reveal>
          <p className="eyebrow">What it does</p>
          <ScrubHeading
            id="features-title"
            className="mt-4 text-[36px] leading-[1.1] font-semibold tracking-[-0.05em] text-foreground sm:text-[52px]"
            accent={["colour"]}
          >
            Features
          </ScrubHeading>
          <p className="mt-6 text-[17px] leading-relaxed text-muted sm:text-[19px]">
            Build once, apply anywhere. Every display gets its own colour without nested driver menus.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:gap-10">
          {FEATURES.map((f) => (
            <Reveal key={f.id} staggerMs={70} className="card p-8">
              <p className="eyebrow mb-3">{f.eyebrow}</p>
              <h3 className="text-[20px] leading-tight font-semibold tracking-[-0.03em] text-foreground sm:text-[24px]">
                {f.title}
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed text-muted sm:text-[18px]">{f.body}</p>
              <div className="mt-6 flex items-end gap-2">
                <span className={`tag-scale font-mono text-[10px] tracking-wider text-subtle font-normal ${f.activeVariant ? "text-foreground" : ""}`}>
                  {f.tag}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
