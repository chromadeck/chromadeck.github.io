// ── NVCP transfer math (TS port) ─────────────────────────────────────────
// Line-for-line port of `nvgamma.rs` in miiidev/ChromaDeck plus the RGB-gains
// post-multiplier from `color.rs::apply_color` (NVAPI path).
//
// Behavioral source: nvBrightness by Pete Batard (observed driver behavior).
// Neutral inputs (B=50, C=50 UI; gamma=1.0; gains=1) yield the identity ramp.
//
// Vibrance/hue are NVAPI DVC registers (driver-side) and CANNOT be exact in
// a browser — `applyVibranceHue` below is a clearly-labeled visual
// approximation, never claimed as driver-exact.

/** UI scale 0–100 → internal 80–120 (100 = neutral). */
export function uiToInternal(ui: number): number {
  return 80 + ui * 0.4;
}

/** Internal 80–120 → UI scale 0–100. */
export function internalToUi(v: number): number {
  return (v - 80) / 0.4;
}

/**
 * Single NVCP ramp value for a normalized input `x` (0..1).
 * @param brightness internal 80–120, 100 = neutral
 * @param contrast   internal 80–120, 100 = neutral
 * @param gammaExp   gamma exponent (0.3–2.8)
 */
export function nvcpRampValue(
  x: number,
  brightness: number,
  contrast: number,
  gammaExp: number,
): number {
  const c = (contrast - 100) / 100;
  const shaped = c <= 0 ? (c + 1) * (x - 0.5) : (x - 0.5) / (1 - c);
  const v = Math.min(1, Math.max(0, (brightness - 100) / 100 + shaped + 0.5));
  return Math.min(1, Math.max(0, Math.pow(v, 1 / gammaExp)));
}

export interface NvcpParams {
  brightness: number; // UI 0–100, 50 neutral
  contrast: number; // UI 0–100, 50 neutral
  gamma: number; // exponent 0.3–2.8, 1.0 neutral
  rgbGains: [number, number, number]; // 0–10, 1.0 neutral
}

/**
 * Build a 256-entry per-channel LUT (0–255) from preset params.
 * Mirrors `nvcp_ramp` (1024-entry float) + RGB-gains post-multiplier,
 * sampled at display byte resolution.
 */
export function buildLut(params: NvcpParams): {
  r: Uint8Array;
  g: Uint8Array;
  b: Uint8Array;
} {
  const bInt = uiToInternal(params.brightness);
  const cInt = uiToInternal(params.contrast);
  const lut = {
    r: new Uint8Array(256),
    g: new Uint8Array(256),
    b: new Uint8Array(256),
  };
  const gains = [params.rgbGains[0], params.rgbGains[1], params.rgbGains[2]];
  const chans = [lut.r, lut.g, lut.b];
  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    const v = nvcpRampValue(x, bInt, cInt, params.gamma);
    for (let ch = 0; ch < 3; ch++) {
      chans[ch][i] = Math.min(255, Math.round(v * gains[ch] * 255));
    }
  }
  return lut;
}

/**
 * APPROXIMATION (not driver-exact): map vibrance 0–100 (50 neutral) to a
 * CSS-style saturation factor and hue 0–359 to a hue-rotate angle.
 * The driver applies these in its DVC registers; this is a preview only.
 */
export function vibranceHueApprox(
  vibrance: number,
  hueDeg: number,
): { saturate: number; hueRotate: number } {
  return {
    saturate: Math.max(0, vibrance / 50),
    hueRotate: ((hueDeg % 360) + 360) % 360,
  };
}
