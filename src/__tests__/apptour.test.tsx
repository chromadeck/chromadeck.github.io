import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AppTour } from "../components/AppTour";

describe("AppTour", () => {
  it("renders all eight screenshot steps with initial caption", () => {
    const html = renderToStaticMarkup(<AppTour />);
    expect(html).toContain('id="tour"');
    expect(html).toContain("Fresh installs start empty");
    for (let i = 1; i <= 8; i++) {
      expect(html).toContain(`Go to step ${i}`);
    }
    for (const src of [
      "tour-empty",
      "tour-create",
      "tour-edit",
      "tour-apply",
      "tour-select",
      "tour-delete-batch",
      "tour-delete",
      "tour-rename",
    ]) {
      expect(html).toContain(src);
    }
    expect(html).toContain("Replay");
  });
});
