import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { fetchLatestRelease } from "../lib/releases";

export function Hero() {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLatestRelease().then((r) => {
      if (!cancelled) {
        setDownloadUrl(r.msi?.browser_download_url ?? null);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20"
    >
      <div className="mx-auto max-w-[1400px] px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left copy */}
        <div className="flex flex-col gap-6 max-w-[540px]">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tighter text-ink">
            Per-monitor color<br />
            <span className="text-primary">pinned</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-[65ch]">
            Save color presets — brightness, contrast, gamma, RGB
            gains, digital vibrance, hue, and ICC profiles — and apply, pin,
            or enforce them per monitor from a single deck-style UI.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {loading ? (
              <span className="rounded-lg bg-muted px-6 py-3 border border-border">
                <span className="animate-pulse size-3 rounded-full bg-primary" />
              </span>
            ) : downloadUrl ? (
              <a
                href={downloadUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display font-semibold text-primary-foreground border border-border shadow-brutal-sm hover:shadow-brutal active:translate-y-[2px] active:shadow-none transition-all duration-[90ms]"
              >
                <Download className="size-5" strokeWidth={2} />
                Download MSI
              </a>
            ) : (
              <a
                href="https://github.com/miiidev/ChromaDeck/releases"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display font-semibold text-primary-foreground border border-border shadow-brutal-sm hover:shadow-brutal active:translate-y-[2px] active:shadow-none transition-all duration-[90ms]"
              >
                View releases
              </a>
            )}
            <a
              href="https://github.com/miiidev/ChromaDeck"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-5 py-2.5 font-display text-sm text-ink shadow-brutal-sm hover:shadow-brutal active:translate-y-[2px] active:shadow-none transition-all duration-[90ms]"
            >
              <ExternalLink className="size-5" strokeWidth={2} />
              GitHub
            </a>
          </div>

          <p className="text-[10px] font-mono text-muted-foreground tracking-wide leading-snug">
            Windows 10/11 x64 · WebView2 · NVIDIA GPU recommended for full
            NVCP-native engine
          </p>
        </div>

        {/* Right real app screenshot */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/app-library.png"
            alt="The ChromaDeck preset library deck"
            className="w-full max-w-[640px] rounded-2xl border border-border"
            loading="eager"
          />
          <p className="font-mono text-[10px] text-muted-foreground tracking-wide">
            The real ChromaDeck library deck — v0.8.0 light neobrutalist theme.
          </p>
        </div>
      </div>
    </section>
  );
}