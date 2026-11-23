import { describe, expect, it } from "vitest";
import { progressAt, triggerY } from "../lib/scroll";

// Element at y=2000, 500px tall, in a 1000px viewport.
const top = 2000;
const h = 500;
const vh = 1000;

describe("triggerY", () => {
  it("resolves element edge against viewport line", () => {
    expect(triggerY("top bottom", top, h, vh)).toBe(1000); // top enters at the bottom
    expect(triggerY("top top", top, h, vh)).toBe(2000);
    expect(triggerY("bottom top", top, h, vh)).toBe(2500); // fully scrolled past
    expect(triggerY("bottom bottom", top, h, vh)).toBe(1500);
    expect(triggerY("top 70%", top, h, vh)).toBe(1300);
    expect(triggerY("center center", top, h, vh)).toBe(1750);
  });
});

describe("progressAt", () => {
  it("clamps to 0..1 across the range", () => {
    expect(progressAt(900, 1000, 2000)).toBe(0);
    expect(progressAt(1500, 1000, 2000)).toBe(0.5);
    expect(progressAt(2600, 1000, 2000)).toBe(1);
  });

  it("treats an empty range as a step", () => {
    expect(progressAt(999, 1000, 1000)).toBe(0);
    expect(progressAt(1000, 1000, 1000)).toBe(1);
  });
});
