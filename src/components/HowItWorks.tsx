const STEPS = [
  {
    number: "01",
    title: "Create",
    desc: "The sidebar lists your monitors (connected, plus last-known offline ones); the library deck below holds presets. Fresh installs start empty: + Create (or Create preset) — name it, tweak sliders with stated neutrals, attach an ICC profile, capture live NVCP state, or set a color tag.",
  },
  {
    number: "02",
    title: "Apply… per monitor",
    desc: "Click a preset pad (or Apply… on a pinned preset) to open the Apply dialog: pick the target monitor — your last target per preset is remembered — toggle Pin, then Apply.",
  },
  {
    number: "03",
    title: "Pinned · Enforced · Managed",
    desc: "A pinned preset stays enforced — the tray-resident loop restores it if games, HDR toggles, or driver updates stomp it. Manage each monitor from the sidebar (✎ rename, Reset, Unpin, Identify) and hit Reapply in the footer anytime.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-10 md:mb-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink">
            How it works
          </h2>
          <p className="text-base text-muted-foreground max-w-[65ch] mx-auto mt-3 leading-relaxed">
            Three steps from install to per-monitor color confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <div
              key={s.number}
              className="rounded-2xl bg-card border border-border p-6 text-center shadow-brutal transition-all duration-[90ms] hover:shadow-[6px_6px_0_#000] active:translate-y-[4px] active:shadow-none"
              style={{
                animation: `fade-up-inner 350ms ${(i * 0.1).toFixed(2)}s both`,
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <span className="inline-flex items-center justify-center size-10 rounded-lg bg-accent-soft border border-border">
                  <span className="font-mono text-lg font-bold text-primary">
                    {s.number}
                  </span>
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 text-ink">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}