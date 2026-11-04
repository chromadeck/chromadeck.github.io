"use client";
import { Reveal } from "./Reveal";
import { ScrubHeading } from "./ScrubHeading";

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
    <section id="requirements" aria-labelledby="requirements-title" className="py-30 sm:py-40">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <Reveal>
          <div className="flex flex-col gap-6">
            <p className="eyebrow">Requirements &amp; support</p>
            <ScrubHeading
              id="requirements-title"
              className="mt-1 text-[36px] leading-[1.1] font-semibold tracking-[-0.05em] text-foreground sm:text-[52px]"
            >
              What you need to know
            </ScrubHeading>
            <p className="text-[17px] leading-relaxed text-muted sm:text-[19px]">
              ChromaDeck is a Windows utility. These are the verified capabilities and limitations —
              nothing more is claimed.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REQUIREMENTS.map((r, i) => (
            <Reveal key={r.label} staggerMs={i * 40}>
              <div className="card h-full p-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">
                    {r.label}
                  </span>
                </div>
                <p className="text-[18px] leading-tight font-semibold tracking-[-0.03em] text-foreground sm:text-[20px]">
                  {r.value}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-muted">{r.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
