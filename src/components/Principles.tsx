"use client";
import { Reveal } from "./Reveal";

/**
 * Principles: what ChromaDeck does and does not do, set as a dense
 * definition list. Every claim matches the desktop app's behaviour. Nothing
 * here adds OS support, GPU support or performance numbers the app lacks.
 */
const PRINCIPLES = [
  {
    title: "One monitor at a time",
    body: "A preset targets one physical display. ChromaDeck lists each monitor by name and serial, offline ones included. Identify shows which entry is which screen.",
  },
  {
    title: "NVIDIA first, GDI elsewhere",
    body: "On NVIDIA GPUs ChromaDeck sets colour through NVAPI. Other displays use the Windows GDI gamma ramp.",
  },
  {
    title: "Pinned means pinned",
    body: "Windows and other apps can overwrite the colour ramp. ChromaDeck re-applies a pinned preset about every 10 seconds.",
  },
  {
    title: "Defaults stay reachable",
    body: "Reset returns a monitor to its defaults. Probe reads the colour state it has right now.",
  },
  {
    title: "Runs from the tray",
    body: "ChromaDeck can start with Windows. The tray icon has Show, Reapply and Quit.",
  },
  {
    title: "Free and open source",
    body: "MIT licensed. The source, the issue tracker and every release are on GitHub.",
  },
];

export function Principles() {
  return (
    <section id="principles" aria-labelledby="principles-title" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 sm:px-10 sm:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <h2 id="principles-title" className="t-h1 max-w-[14ch] text-foreground">
            A short list of rules.
          </h2>
          <p className="t-body mt-5 max-w-[40ch] text-muted">
            Windows 10 and 11, x64 only. No macOS or Linux build. No HDR or hardware backlight
            control.
          </p>
        </div>

        <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} staggerMs={(i % 2) * 60}>
              <dt className="text-[var(--t-md)] font-semibold text-foreground">{p.title}</dt>
              <dd className="mt-2 text-[var(--t-sm)] leading-relaxed text-muted">{p.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
