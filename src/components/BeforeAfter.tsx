import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildLut,
  vibranceHueApprox,
  type NvcpParams,
} from "../lib/nvcp";

const PHOTO_SRC = "/compare-photo.jpg";

const DEFAULTS: NvcpParams & { vibrance: number; hue: number } = {
  brightness: 55,
  contrast: 55,
  gamma: 1.25,
  rgbGains: [1, 1, 1],
  vibrance: 100,
  hue: 0,
};

function Slider({
  label,
  value,
  min,
  max,
  step,
  neutral,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  neutral: string;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          {label} <span className="opacity-60">· {neutral}</span>
        </span>
        <span className="font-mono text-xs text-ink">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ink"
      />
    </label>
  );
}

export function BeforeAfter() {
  const [params, setParams] = useState(DEFAULTS);
  const [split, setSplit] = useState(50); // % — left = before
  const [photoOk, setPhotoOk] = useState(true);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLCanvasElement>(null);
  const afterRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef(0);

  const set = useCallback(
    <K extends keyof typeof DEFAULTS>(key: K, value: (typeof DEFAULTS)[K]) =>
      setParams((p) => ({ ...p, [key]: value })),
    [],
  );

  const lut = useMemo(
    () =>
      buildLut({
        brightness: params.brightness,
        contrast: params.contrast,
        gamma: params.gamma,
        rgbGains: params.rgbGains,
      }),
    [params.brightness, params.contrast, params.gamma, params.rgbGains],
  );
  const vh = useMemo(
    () => vibranceHueApprox(params.vibrance, params.hue),
    [params.vibrance, params.hue],
  );

  const paint = useCallback(() => {
    const img = imgRef.current;
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!img || !before || !after || !img.complete || img.naturalWidth === 0)
      return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    for (const c of [before, after]) {
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
    }
    const bctx = before.getContext("2d");
    const actx = after.getContext("2d");
    if (!bctx || !actx) return;

    bctx.drawImage(img, 0, 0);
    const src = bctx.getImageData(0, 0, w, h);
    const out = actx.createImageData(w, h);
    const d = src.data;
    const o = out.data;
    // Gamma-path LUT (bit-exact vs driver) …
    for (let i = 0; i < d.length; i += 4) {
      o[i] = lut.r[d[i]];
      o[i + 1] = lut.g[d[i + 1]];
      o[i + 2] = lut.b[d[i + 2]];
      o[i + 3] = d[i + 3];
    }
    actx.putImageData(out, 0, 0);
    // … then the vibrance/hue preview approximation (driver-side DVC).
    after.style.filter = `saturate(${vh.saturate}) hue-rotate(${vh.hueRotate}deg)`;
  }, [lut, vh]);

  const schedulePaint = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(paint);
  }, [paint]);

  useEffect(() => {
    const img = new Image();
    img.src = PHOTO_SRC;
    img.onload = () => {
      imgRef.current = img;
      schedulePaint();
    };
    img.onerror = () => setPhotoOk(false);
    imgRef.current = img;
    return () => cancelAnimationFrame(rafRef.current);
  }, [schedulePaint]);

  useEffect(() => {
    schedulePaint();
  }, [schedulePaint]);

  // Drag handling for the divider
  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      const el = frameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplit(Math.min(98, Math.max(2, pct)));
    };
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging]);

  return (
    <section id="compare" className="py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-10 md:mb-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink">
            See the preset working
          </h2>
          <p className="text-base text-muted-foreground max-w-[65ch] mx-auto mt-3 leading-relaxed">
            Drag the divider. The after side runs your photo through the real
            NVCP transfer math — the same LUT values the driver receives.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Compare frame */}
          <div>
            <div
              ref={frameRef}
              className="relative overflow-hidden rounded-2xl border border-border bg-card select-none shadow-brutal"
              style={{ touchAction: "none" }}
            >
              {photoOk ? (
                <>
                  <canvas ref={afterRef} className="block w-full h-auto" />
                  <canvas
                    ref={beforeRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
                  />
                  {/* Divider */}
                  <div
                    className="absolute inset-y-0 cursor-ew-resize"
                    style={{ left: `${split}%` }}
                    onPointerDown={(e) => {
                      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                      setDragging(true);
                    }}
                  >
                    <div className="absolute inset-y-0 -translate-x-1/2 w-0.5 bg-primary" />
                    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-primary text-primary-foreground font-mono text-xs px-2 py-1 border border-border">
                      ◂ ▸
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 rounded-lg bg-paper/80 px-2 py-0.5 font-mono text-[10px] text-ink border border-border">
                    BEFORE
                  </span>
                  <span className="absolute top-3 right-3 rounded-lg bg-primary px-2 py-0.5 font-mono text-[10px] text-primary-foreground border border-border">
                    AFTER
                  </span>
                  {/* Keyboard access */}
                  <input
                    type="range"
                    aria-label="Before after split"
                    min={2}
                    max={98}
                    value={Math.round(split)}
                    onChange={(e) => setSplit(Number(e.target.value))}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/2 accent-ink opacity-80"
                  />
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 p-16 text-center">
                  <span className="font-display text-lg font-semibold text-ink">
                    Drop your photo in <span className="font-mono text-primary">public/compare-photo.jpg</span>
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Landscape ~1600px wide works best — the compare view lights up automatically.
                  </span>
                </div>
              )}
            </div>
            <p className="mt-3 font-mono text-[10px] text-muted-foreground leading-snug">
              ● Gamma path (brightness / contrast / gamma / RGB gains) is bit-exact vs the
              driver LUT. ▲ Vibrance / hue are a preview approximation — those registers
              live driver-side.
            </p>
          </div>

          {/* Live sliders */}
          <div className="rounded-2xl bg-card border border-border p-5 flex flex-col gap-4 shadow-brutal">
            <span className="font-display text-sm font-semibold text-ink">
              Live preset
            </span>
            <Slider label="Brightness" value={params.brightness} min={0} max={100} step={0.5} neutral="50" format={(v) => v.toFixed(1)} onChange={(v) => set("brightness", v)} />
            <Slider label="Contrast" value={params.contrast} min={0} max={100} step={0.5} neutral="50" format={(v) => v.toFixed(1)} onChange={(v) => set("contrast", v)} />
            <Slider label="Gamma" value={params.gamma} min={0.3} max={2.8} step={0.05} neutral="1.0" format={(v) => v.toFixed(2)} onChange={(v) => set("gamma", v)} />
            <div className="grid grid-cols-3 gap-2">
              {(["r", "g", "b"] as const).map((ch, i) => (
                <label key={ch} className="block">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    {ch} <span className="opacity-60">· 1.0</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={2}
                    step={0.05}
                    value={params.rgbGains[i]}
                    onChange={(e) => {
                      const v = Math.min(2, Math.max(0, Number(e.target.value)));
                      const next: [number, number, number] = [...params.rgbGains] as [number, number, number];
                      next[i] = v;
                      set("rgbGains", next);
                    }}
                    className="w-full rounded-lg bg-muted px-2 py-1.5 font-mono text-xs text-ink border border-border"
                  />
                </label>
              ))}
            </div>
            <div className="border-t border-border pt-4 flex flex-col gap-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-danger-ink">
                ▲ Approximated preview
              </span>
              <Slider label="Vibrance" value={params.vibrance} min={0} max={100} step={1} neutral="50" format={(v) => v.toFixed(0)} onChange={(v) => set("vibrance", v)} />
              <Slider label="Hue" value={params.hue} min={0} max={359} step={1} neutral="0°" format={(v) => `${v.toFixed(0)}°`} onChange={(v) => set("hue", v)} />
            </div>
            <button
              onClick={() => setParams({ ...DEFAULTS, rgbGains: [...DEFAULTS.rgbGains] as [number, number, number] })}
              className="rounded-lg border border-border bg-secondary px-4 py-2 font-display text-sm text-ink shadow-brutal-sm hover:shadow-brutal active:translate-y-[2px] active:shadow-none transition-all duration-[90ms]"
            >
              Reset to defaults
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}