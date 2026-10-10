import { describe, expect, it } from "vitest";
import {
  buildLut,
  internalToUi,
  nvcpRampValue,
  uiToInternal,
  vibranceHueApprox,
} from "../lib/nvcp";

describe("ui/internal mapping", () => {
  it("roundtrips (mirrors ui_internal_mapping_roundtrips)", () => {
    expect(uiToInternal(50)).toBe(100);
    expect(uiToInternal(0)).toBe(80);
    expect(uiToInternal(100)).toBe(120);
    expect(internalToUi(88)).toBe(20);
    expect(internalToUi(uiToInternal(60))).toBe(60);
  });
});

describe("nvcpRampValue", () => {
  it("neutral inputs yield identity (mirrors neutral_inputs_yield_identity_float_ramp)", () => {
    for (let i = 0; i <= 1023; i += 7) {
      const expected = i / 1023;
      expect(nvcpRampValue(expected, 100, 100, 1)).toBeCloseTo(expected, 6);
    }
  });

  it("index 0 is 0 and full index is 1 at neutral", () => {
    expect(nvcpRampValue(0, 100, 100, 1)).toBe(0);
    expect(nvcpRampValue(1, 100, 100, 1)).toBeCloseTo(1, 6);
  });

  it("below-neutral brightness crushes, never lifts black", () => {
    // brightness UI 25 → internal 90
    expect(nvcpRampValue(1, 90, 100, 1)).toBeLessThan(1);
    expect(nvcpRampValue(0, 90, 100, 1)).toBe(0);
  });
});

describe("buildLut", () => {
  it("neutral preset is identity on all channels", () => {
    const lut = buildLut({
      brightness: 50,
      contrast: 50,
      gamma: 1,
      rgbGains: [1, 1, 1],
    });
    for (const i of [0, 1, 64, 128, 200, 255]) {
      expect(lut.r[i]).toBe(i);
      expect(lut.g[i]).toBe(i);
      expect(lut.b[i]).toBe(i);
    }
  });

  it("applies RGB gains as post-multiplier (mirrors gamma_ramp_per_channel_gains_work)", () => {
    const lut = buildLut({
      brightness: 50,
      contrast: 50,
      gamma: 1,
      rgbGains: [0.5, 1, 2],
    });
    expect(lut.r[255]).toBe(128); // 255*0.5=127.5 rounded
    expect(lut.g[255]).toBe(255);
    expect(lut.b[255]).toBe(255); // clamped
  });
});

describe("vibranceHueApprox", () => {
  it("neutral maps to identity factors", () => {
    expect(vibranceHueApprox(50, 0)).toEqual({ saturate: 1, hueRotate: 0 });
  });
});
