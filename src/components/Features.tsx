"use client";
import { Reveal } from "./Reveal";

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
      <div className="mx-auto max-w-[760px] px-6 sm:px-10">
        <Reveal>
          <p className="eyebrow">What it does</p>
          <h2 id="features-title" className="t-h2 mt-4 text-foreground">
            Features
          </h2>
          <p className="t-lead mt-5 text-muted">
            Build once, apply anywhere. Every display gets its own colour without nested driver menus.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {FEATURES.map((f, i) => (
            <Reveal key={f.id} staggerMs={i * 60} className="card p-8">
              <p className="eyebrow mb-3">{f.eyebrow}</p>
              <h3 className="t-h3 text-foreground">{f.title}</h3>
              <p className="t-body mt-3 text-muted">{f.body}</p>
              <div className="mt-6">
                <span
                  className={`tag-scale t-meta tracking-wider font-normal ${
                    f.activeVariant ? "text-foreground" : "text-subtle"
                  }`}
                >
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
