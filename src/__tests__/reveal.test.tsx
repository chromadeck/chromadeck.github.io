import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { Reveal } from "../components/Reveal";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

describe("Reveal", () => {
  it("renders without hiding content in the static markup", () => {
    const html = renderToStaticMarkup(createElement(Reveal, { staggerMs: 120, children: "hi" }));
    expect(html).toContain("reveal");
    expect(html).toContain("--stagger-ms:120ms");
    // SSR output must not carry the pending flag; only the client effect sets it,
    // so server-rendered HTML is always visible.
    expect(html).not.toContain("data-pending");
  });
});

describe("design tokens (CSS contract with ChromaDeck DESIGN.md)", () => {
  it("uses the app's dark palette and mint accent", () => {
    for (const t of ["#060608", "#0d0e11", "#15161a", "#1b1d22", "#5eead4", "#f4f1ea", "#a1a7af", "#858b94"]) {
      expect(css).toContain(t);
    }
  });

  it("ships the app's easings and a reduced-motion path", () => {
    expect(css).toContain("--ease-fluid: cubic-bezier(0.32, 0.72, 0, 1)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps reveal fail-safe: visible by default, hidden only while pending", () => {
    // The reveal must never be able to strand content at opacity 0. Default
    // state is visible; only [data-pending] hides it.
    expect(css).toContain(".reveal[data-pending]");
    expect(css).toMatch(/\.reveal\s*\{\s*opacity:\s*1;/);
  });

  it("has no shadows, blur or gradients", () => {
    expect(css).not.toMatch(/box-shadow|backdrop-filter|blur\(|gradient\(/);
  });
});
