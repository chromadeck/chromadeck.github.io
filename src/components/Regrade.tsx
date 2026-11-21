"use client";
import { useEffect, useRef, useState } from "react";
import {
  PRESETS,
  blend,
  chooseManual,
  getRegrade,
  gradeRgb,
  isIdentity,
  presetById,
  rampFor,
  readout,
  scrollGrade,
  statusOf,
  subscribeRegrade,
  tableValues,
  type Grade,
  type RegradeState,
} from "../lib/regrade";
import { prefersReducedMotion } from "../lib/motion";
import { useActiveSection } from "../lib/sections";

/** Base tokens, mirrored from globals.css @theme. */
const TOKENS: Record<string, string> = {
  background: "#060608",
  surface: "#0d0e11",
  "surface-raised": "#15161a",
  "surface-hover": "#1b1d22",
  foreground: "#f4f1ea",
  muted: "#a1a7af",
  subtle: "#858b94",
  primary: "#5eead4",
  "primary-foreground": "#060608",
};

const STATUS_LABEL = {
  neutral: "Neutral",
  applying: "Applying",
  applied: "Applied",
  pinned: "Pinned",
  preview: "Preview",
} as const;

const targetOf = (s: RegradeState): Grade => {
  if (!s.manual) return scrollGrade(s);
  const p = presetById(s.manual);
  return { params: p.params, vibrance: p.vibrance };
};

/** Writes one grade to the SVG filter, the token variables and the readout. */
function writeGrade(g: Grade, filter: SVGFilterElement | null, out: HTMLElement | null) {
  const root = document.documentElement;
  if (out) out.textContent = readout(g);
  if (isIdentity(g)) {
    root.classList.remove("is-graded");
    for (const k of Object.keys(TOKENS)) root.style.removeProperty(`--color-${k}`);
    root.style.removeProperty("--color-primary-subtle");
    root.style.removeProperty("--color-primary-border");
    return;
  }
  const ramp = rampFor(g);
  if (filter) {
    filter.querySelector("feFuncR")?.setAttribute("tableValues", tableValues(ramp.r));
    filter.querySelector("feFuncG")?.setAttribute("tableValues", tableValues(ramp.g));
    filter.querySelector("feFuncB")?.setAttribute("tableValues", tableValues(ramp.b));
    filter.querySelector("feColorMatrix")?.setAttribute("values", ramp.saturate.toFixed(3));
  }
  for (const [k, hex] of Object.entries(TOKENS)) {
    root.style.setProperty(`--color-${k}`, `rgb(${gradeRgb(hex, ramp).join(" ")})`);
  }
  const [r, gg, b] = gradeRgb(TOKENS.primary, ramp);
  root.style.setProperty("--color-primary-subtle", `rgb(${r} ${gg} ${b} / 0.12)`);
  root.style.setProperty("--color-primary-border", `rgb(${r} ${gg} ${b} / 0.3)`);
  root.classList.add("is-graded");
}

/**
 * Regrade: the page's signature move. A fixed control in the style of a
 * monitor's on-screen display. It runs ChromaDeck's gamma ramp over every
 * screenshot, the walkthrough and the page colours at once.
 */
export function Regrade() {
  const filterRef = useRef<SVGFilterElement>(null);
  const readoutRef = useRef<HTMLParagraphElement>(null);
  const [view, setView] = useState<RegradeState>(getRegrade);
  // Hidden over the hero so it never covers the hero planes.
  const shown = useActiveSection() !== null || view.manual !== null || view.scroll > 0;

  useEffect(() => {
    let shown: Grade = targetOf(getRegrade());
    let lastManual = getRegrade().manual;
    let raf = 0;

    const apply = (s: RegradeState) => {
      setView(s);
      const target = targetOf(s);
      cancelAnimationFrame(raf);
      const manualChanged = s.manual !== lastManual;
      lastManual = s.manual;
      if (!manualChanged || prefersReducedMotion()) {
        shown = target;
        writeGrade(shown, filterRef.current, readoutRef.current);
        return;
      }
      const from = shown;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 360);
        const eased = 1 - Math.pow(1 - t, 3);
        shown = blend(from, target, eased);
        writeGrade(shown, filterRef.current, readoutRef.current);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    writeGrade(shown, filterRef.current, readoutRef.current);
    const off = subscribeRegrade(apply);
    return () => {
      off();
      cancelAnimationFrame(raf);
      writeGrade({ params: presetById("neutral").params, vibrance: 50 }, null, null);
    };
  }, []);

  const status = statusOf(view);
  const active = view.manual ?? (view.scroll >= 0.5 ? "low-blue" : "neutral");

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <filter ref={filterRef} id="cd-grade" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0 1" />
            <feFuncG type="table" tableValues="0 1" />
            <feFuncB type="table" tableValues="0 1" />
          </feComponentTransfer>
          <feColorMatrix type="saturate" values="1" />
        </filter>
      </svg>

      <aside aria-label="Page colour preset" className={`osd ${shown ? "is-shown" : ""}`}>
        <div className="flex items-center justify-between gap-6">
          <p className="label text-subtle">Page preset</p>
          <p className="label text-primary" aria-live="polite">
            {STATUS_LABEL[status]}
          </p>
        </div>
        <div role="radiogroup" aria-label="Preset" className="osd-presets">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={active === p.id}
              onClick={() => chooseManual(p.id)}
              className="osd-preset label"
            >
              {p.name}
            </button>
          ))}
        </div>
        <p ref={readoutRef} className="osd-readout label tabular-nums text-muted" />
      </aside>
    </>
  );
}
