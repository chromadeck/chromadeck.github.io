import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Promo } from "../components/Promo";

describe("Promo", () => {
  it("renders muted autoplay video with poster", () => {
    const html = renderToStaticMarkup(<Promo />);
    expect(html).toContain('id="video"');
    expect(html).toContain("/promo.mp4");
    expect(html).toContain("/promo-poster.jpg");
    expect(html).toContain("muted");
  });
});
