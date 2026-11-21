import { describe, expect, it } from "vitest";
import {
  NEUTRAL,
  SCROLL_PRESET,
  blend,
  chooseManual,
  getRegrade,
  gradeRgb,
  isIdentity,
  rampFor,
  readout,
  scrollGrade,
  setScroll,
  statusOf,
  tableValues,
} from "../lib/regrade";

const g = (p: typeof NEUTRAL) => ({ params: p.params, vibrance: p.vibrance });

describe("regrade math", () => {
  it("neutral is the identity grade and leaves colours untouched", () => {
    expect(isIdentity(g(NEUTRAL))).toBe(true);
    const ramp = rampFor(g(NEUTRAL));
    expect(gradeRgb("#5eead4", ramp)).toEqual([0x5e, 0xea, 0xd4]);
    expect(tableValues(ramp.r, 3)).toBe("0.0000 0.5020 1.0000");
  });

  it("blend at 0 and 1 hits the endpoints", () => {
    expect(blend(g(NEUTRAL), g(SCROLL_PRESET), 0)).toEqual(g(NEUTRAL));
    expect(blend(g(NEUTRAL), g(SCROLL_PRESET), 1).params.rgbGains).toEqual(SCROLL_PRESET.params.rgbGains);
  });

  it("Low Blue cuts blue more than red on white", () => {
    const [r, , b] = gradeRgb("#ffffff", rampFor(g(SCROLL_PRESET)));
    expect(b).toBeLessThan(r);
  });

  it("readout uses the app's notation", () => {
    expect(readout(g(NEUTRAL))).toBe("γ 1.00 · B 50 · C 50 · V 50 · RGB 1.00 1.00 1.00");
  });
});

describe("regrade store", () => {
  it("scroll drives the grade until the visitor chooses", () => {
    setScroll(0.5, false);
    expect(statusOf(getRegrade())).toBe("applying");
    expect(isIdentity(scrollGrade(getRegrade()))).toBe(false);
    setScroll(1, true);
    expect(statusOf(getRegrade())).toBe("pinned");
    chooseManual("vibrant");
    expect(statusOf(getRegrade())).toBe("preview");
  });

  it("clamps scroll strength", () => {
    setScroll(4, false);
    expect(getRegrade().scroll).toBe(1);
  });
});
