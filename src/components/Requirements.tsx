"use client";
import { Reveal } from "./Reveal";

/** Requirements — what ChromaDeck needs and what it supports.
 *
 *  Every claim below is verified against the desktop source code.
 *  Nothing here invents OS support, GPU requirements, or performance numbers.
 */
const REQUIREMENTS = [
  {
    label: "Operating system",
    value: "Windows 10 / 11 x64",
    note: "Native Windows display APIs; not macOS or Linux.",
  },
  {
    label: "Graphics path",
    value: "NVIDIA NVAPI (native) · GDI fallback",
    note: "Per-display colour via NVAPI where supported; automatic GDI fallback on other displays.",
  },
  {
    label: "Colour controls",
    value: "Brightness · Contrast · Gamma · RGB gains · Vibrance · Hue",
    note: "Per-channel RGB gains and vibrance/hue preview in the editor.",
  },
  {
    label: "Preset library",
    value: "Create · Edit · Duplicate · Delete",
    note: "Colour tags, categories, and per-monitor pinning.",
  },
  {
    label: "Monitor support",
    value: "Connected · Default · Offline states",
    note: "Serial numbers shown; Identify overlay maps entries to physical displays.",
  },
  {
    label: "Background enforcement",
    value: "Polling ≈ every 10 s",
    note: "Re-applies pinned presets automatically; manual Reapply also available.",
  },
  {
    label: "Autostart",
    value: "Windows startup",
    note: "Tray icon with Show / Reapply / Quit.",
  },
  {
    label: "Licence",
    value: "MIT",
    note: "Free software; source on GitHub.",
  },
];

export function Requirements() {
  return (
    <section id="requirements" aria-labelledby="requirements-title" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <Reveal>
          <div className="flex flex-col gap-5">
            <p className="eyebrow">Requirements &amp; support</p>
            <h2 id="requirements-title" className="t-h2 text-foreground">
              What you need to know
            </h2>
            <p className="t-lead text-muted">
              ChromaDeck is a Windows utility. These are the verified capabilities and limitations —
              nothing more is claimed.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REQUIREMENTS.map((r, i) => (
            <Reveal key={r.label} staggerMs={i * 40}>
              <div className="card h-full p-6">
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="t-meta uppercase tracking-wider text-subtle">{r.label}</span>
                </div>
                <p className="t-h3 text-foreground">{r.value}</p>
                <p className="mt-3 text-[var(--t-sm)] leading-relaxed text-muted">{r.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
