import { describe, expect, it } from "vitest";
// @ts-expect-error - @types/node not installed; test-only node:fs read
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { Reveal } from "../components/Reveal";

const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("Reveal", () => {
  it("renders hidden with stagger variable (no is-visible pre-intersection)", () => {
    const html = renderToStaticMarkup(<Reveal staggerMs={120}>hi</Reveal>);
    expect(html).toContain("reveal");
    expect(html).not.toContain("is-visible");
    expect(html).toContain("--stagger-ms:120ms");
  });
});

describe("motion foundation (CSS contract)", () => {
  it("ships a global prefers-reduced-motion path", () => {
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".reveal.is-visible");
  });

  it("defines hero entrance + shot reveal + custom easings", () => {
    expect(css).toContain("@keyframes hero-line-up");
    expect(css).toContain("@keyframes shot-reveal");
    expect(css).toContain("--ease-out: cubic-bezier(0.22, 1, 0.36, 1)");
  });
});
