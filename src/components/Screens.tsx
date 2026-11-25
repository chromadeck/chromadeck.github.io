"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useScrollProgress } from "../lib/scroll";
import { SCREENS, type Screen } from "../lib/screens";

/**
 * Screens: the catalog. On wide screens with motion allowed it is a pan
 * rail: the section pins and vertical scroll walks the screens sideways.
 * Each screen carries the same label schema. On phones and under reduced
 * motion the same items stack, so every screen stays reachable.
 */

const PAN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
/** Vertical scroll spent per pixel of lateral travel. */
const RATE = 0.7;

function ScreenItem({ s }: { s: Screen }) {
  return (
    <article className="screen-item" style={{ "--w": s.width, "--hue": s.hue } as CSSProperties}>
      <div className="screen-frame">
        <img src={s.src} width={s.w} height={s.h} alt={s.alt} loading="lazy" className="block h-auto w-full" />
      </div>
      <div className="mt-4 flex items-center gap-2.5">
        <span className="size-2.5 shrink-0 rounded-[2px] bg-[var(--hue)]" aria-hidden="true" />
        <h3 className="t-h3 text-foreground">{s.title}</h3>
      </div>
      <p className="t-body mt-2 max-w-[56ch] text-muted">{s.body}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {s.chips.map((c) => (
          <li key={c} className="label border border-border-hover px-2 py-1 text-subtle">
            {c}
          </li>
        ))}
      </ul>
    </article>
  );
}

function usePanMode(): boolean {
  const [pan, setPan] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(PAN_QUERY);
    const sync = () => setPan(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return pan;
}

export function Screens() {
  const pan = usePanMode();
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const overflow = useRef(0);
  const items = useRef<{ node: HTMLElement; left: number }[]>([]);
  const [height, setHeight] = useState<number | null>(null);

  // Measure the rail and size the section so the travel is exact.
  useEffect(() => {
    const el = rail.current;
    if (!pan || !el) {
      setHeight(null);
      if (el) el.style.transform = "";
      return;
    }
    const measure = () => {
      overflow.current = Math.max(0, el.scrollWidth - window.innerWidth);
      // Cache item positions here so the per-frame handler never reads layout.
      items.current = (Array.from(el.children) as HTMLElement[]).map((node) => ({ node, left: node.offsetLeft }));
      setHeight(Math.round(overflow.current * RATE + window.innerHeight));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pan]);

  const onProgress = useCallback((p: number) => {
    const el = rail.current;
    if (!el) return;
    const x = -p * overflow.current;
    el.style.transform = `translate3d(${x}px, 0, 0)`;
    // Items after the first settle in as they cross into view.
    const vw = window.innerWidth;
    items.current.forEach(({ node, left }, i) => {
      if (i === 0) return;
      const settle = Math.min(1, Math.max(0, (vw * 0.98 - (left + x)) / (vw * 0.4)));
      node.style.opacity = String(0.55 + 0.45 * settle);
      node.style.transform = `translate3d(0, ${(1 - settle) * 28}px, 0)`;
    });
  }, []);

  useScrollProgress(section, onProgress, { start: "top top", end: "bottom bottom", enabled: pan && height !== null });

  return (
    <section
      ref={section}
      id="screens"
      aria-labelledby="screens-title"
      className={`scroll-mt-16 border-t border-border ${pan ? "screens--pan" : "screens--stack"}`}
      style={pan && height ? { height } : undefined}
    >
      <div className="screens-stage">
        <div ref={rail} className="screens-rail">
          <header className="screens-intro">
            <h2 id="screens-title" className="t-h1 text-foreground">
              Four screens. One job.
            </h2>
            <p className="t-lead mt-5 text-muted">
              Colour work lives in one window. No driver control panel, no nested menus.
            </p>
          </header>
          {SCREENS.map((s) => (
            <ScreenItem key={s.id} s={s} />
          ))}
          <p className="screens-outro t-body text-muted">
            All four ship in the current release.{" "}
            <a href="#download" className="text-foreground underline decoration-border-hover underline-offset-4 hover:decoration-primary">
              Download
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
