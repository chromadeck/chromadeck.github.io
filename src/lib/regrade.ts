import { buildLut, vibranceHueApprox, type NvcpParams } from "./nvcp";

/**
 * Regrade: applies a ChromaDeck colour preset to this web page.
 *
 * The gamma ramp is the app's own NVCP transfer math (see nvcp.ts). Vibrance
 * uses the labelled approximation from the same module. The page has two
 * inputs: the visitor's explicit choice, and scroll strength from the
 * "How it works" act. An explicit choice always wins over scroll.
 */

export type Preset = {
  id: string;
  name: string;
  params: NvcpParams;
  vibrance: number;
};

/** Page demo presets. Values are shown live in the readout. */
export const PRESETS: readonly Preset[] = [
  { id: "neutral", name: "Neutral", params: { brightness: 50, contrast: 50, gamma: 1, rgbGains: [1, 1, 1] }, vibrance: 50 },
  { id: "low-blue", name: "Low Blue", params: { brightness: 48, contrast: 50, gamma: 1, rgbGains: [1, 0.86, 0.62] }, vibrance: 50 },
  { id: "vibrant", name: "Vibrant", params: { brightness: 50, contrast: 57, gamma: 1.05, rgbGains: [1, 1, 1] }, vibrance: 82 },
  { id: "warm-cinema", name: "Warm Cinema", params: { brightness: 45, contrast: 56, gamma: 0.9, rgbGains: [1, 0.84, 0.7] }, vibrance: 42 },
];

export const NEUTRAL = PRESETS[0];
/** The preset the scroll act applies. */
export const SCROLL_PRESET = PRESETS[1];

export function presetById(id: string): Preset {
  return PRESETS.find((p) => p.id === id) ?? NEUTRAL;
}

/** A displayable grade: preset values blended toward neutral by strength t. */
export type Grade = { params: NvcpParams; vibrance: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function blend(from: Grade, to: Grade, t: number): Grade {
  return {
    params: {
      brightness: lerp(from.params.brightness, to.params.brightness, t),
      contrast: lerp(from.params.contrast, to.params.contrast, t),
      gamma: lerp(from.params.gamma, to.params.gamma, t),
      rgbGains: [0, 1, 2].map((i) => lerp(from.params.rgbGains[i], to.params.rgbGains[i], t)) as [
        number,
        number,
        number,
      ],
    },
    vibrance: lerp(from.vibrance, to.vibrance, t),
  };
}

export function isIdentity(g: Grade): boolean {
  const p = g.params;
  return (
    Math.abs(p.brightness - 50) < 0.01 &&
    Math.abs(p.contrast - 50) < 0.01 &&
    Math.abs(p.gamma - 1) < 0.001 &&
    p.rgbGains.every((v) => Math.abs(v - 1) < 0.001) &&
    Math.abs(g.vibrance - 50) < 0.01
  );
}

export type Ramp = { r: Uint8Array; g: Uint8Array; b: Uint8Array; saturate: number };

export function rampFor(g: Grade): Ramp {
  return { ...buildLut(g.params), saturate: vibranceHueApprox(g.vibrance, 0).saturate };
}

/** feFuncX tableValues: the 256-entry ramp sampled to n points in 0..1. */
export function tableValues(lut: Uint8Array, n = 33): string {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.round((i / (n - 1)) * 255);
    out.push((lut[idx] / 255).toFixed(4));
  }
  return out.join(" ");
}

/** Luminance-preserving saturation, the same matrix as SVG feColorMatrix saturate. */
function saturateRgb(r: number, g: number, b: number, s: number): [number, number, number] {
  const m = [
    0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s,
    0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s,
    0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s,
  ];
  const c = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
  return [
    c(m[0] * r + m[1] * g + m[2] * b),
    c(m[3] * r + m[4] * g + m[5] * b),
    c(m[6] * r + m[7] * g + m[8] * b),
  ];
}

/** Run one #rrggbb colour through a ramp. Returns [r, g, b]. */
export function gradeRgb(hex: string, ramp: Ramp): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const r = ramp.r[(n >> 16) & 255];
  const g = ramp.g[(n >> 8) & 255];
  const b = ramp.b[n & 255];
  return saturateRgb(r, g, b, ramp.saturate);
}

/** Readout text, in the app's own notation. */
export function readout(g: Grade): string {
  const p = g.params;
  const gains = p.rgbGains.map((v) => v.toFixed(2)).join(" ");
  return `γ ${p.gamma.toFixed(2)} · B ${Math.round(p.brightness)} · C ${Math.round(p.contrast)} · V ${Math.round(
    g.vibrance,
  )} · RGB ${gains}`;
}

/* ── Store ─────────────────────────────────────────────────────────────── */

export type Status = "neutral" | "applying" | "applied" | "pinned" | "preview";

export type RegradeState = {
  /** Explicit visitor choice, or null to let scroll drive. */
  manual: string | null;
  /** 0..1 from the How it works act. */
  scroll: number;
  /** True once the visitor has scrolled past the Pin step. */
  pinned: boolean;
};

let state: RegradeState = { manual: null, scroll: 0, pinned: false };
const listeners = new Set<(s: RegradeState) => void>();

export function getRegrade(): RegradeState {
  return state;
}

export function subscribeRegrade(fn: (s: RegradeState) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function emit(next: RegradeState) {
  state = next;
  for (const fn of listeners) fn(state);
}

export function chooseManual(id: string) {
  emit({ ...state, manual: id });
}

export function setScroll(scroll: number, pinned: boolean) {
  const s = Math.min(1, Math.max(0, scroll));
  if (s === state.scroll && pinned === state.pinned) return;
  emit({ ...state, scroll: s, pinned });
}

/** The grade scroll alone would show. */
export function scrollGrade(s: RegradeState): Grade {
  return blend(NEUTRAL, SCROLL_PRESET, s.scroll);
}

export function statusOf(s: RegradeState): Status {
  if (s.manual) return "preview";
  if (s.scroll <= 0) return "neutral";
  if (s.scroll < 1) return "applying";
  return s.pinned ? "pinned" : "applied";
}
