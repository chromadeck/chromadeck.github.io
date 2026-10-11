import { Reveal } from "./Reveal";

const FEATURES = [
  {
    icon: "●",
    title: "EDID Pin",
    desc: "Presets bind to display EDID — survives docking, reconnects, and reboots. Every monitor keeps its own assignment.",
  },
  {
    icon: "■",
    title: "NVCP-native engine",
    desc: "Brightness, contrast, gamma use NVIDIA's own transfer math and driver API. Results match the NVIDIA Control Panel exactly.",
  },
  {
    icon: "▲",
    title: "Vibrance & Hue",
    desc: "Digital vibrance and hue driven through the NVIDIA driver — same control as NVCP, with per-display support detection.",
  },
  {
    icon: "◆",
    title: "ICC Profiles",
    desc: "Bundle .icc / .icm files into presets and associate them per monitor. Full color pipeline in one tap.",
  },
  {
    icon: "⬡",
    title: "Pin & Enforce",
    desc: "Pin one preset per monitor. A background loop restores it if games, HDR toggles, or driver updates stomp it.",
  },
  {
    icon: "↗",
    title: "Import NVCP State",
    desc: "Capture the driver's live color state straight into a new preset — no need to match settings by hand.",
  },
  {
    icon: "◎",
    title: "Apply dialog",
    desc: "Preset pad or Apply… opens a dialog: pick the target monitor (your last target per preset is remembered), toggle Pin, then Apply.",
  },
  {
    icon: "◐",
    title: "Reset, duplicate, delete",
    desc: "Full-default reset (and unpins), one-click duplicate, delete with confirmation — plus Select for multi-delete from the deck toolbar.",
  },
  {
    icon: "▦",
    title: "Identify + IN USE",
    desc: "Identify flashes every monitor's number on screen. Cards show IN USE while pinned or applied on a connected monitor.",
  },
  {
    icon: "○",
    title: "Empty by default",
    desc: "Fresh installs start with an idle library: no seeded preset, nothing pinned or applied. Highlighting always means a real user action.",
  },
  {
    icon: "◫",
    title: "Tray-native window",
    desc: "Closing hides to the tray (right-click: Show / Reapply now / Quit); every re-open replays the staged load animation. Footer shows preset/monitor/pin counts, Reapply, and the Start with Windows toggle.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-20 md:py-24"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-10 md:mb-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink">
            Everything in one deck
          </h2>
          <p className="text-base text-muted-foreground max-w-[65ch] mx-auto mt-3 leading-relaxed">
            No registry spelunking, no NVCP tabs. One preset deck to rule every
            display.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} staggerMs={Math.min(i, 4) * 60}>
            <div className="rounded-2xl bg-card border border-border p-6 shadow-brutal transition-all duration-[90ms] ease-[var(--ease-out)] hover:shadow-[6px_6px_0_#000] active:translate-y-[4px] active:shadow-none h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary font-mono text-sm">{f.icon}</span>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {f.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}