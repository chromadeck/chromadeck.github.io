import { useState, useEffect } from "react";
import { fetchLatestRelease, formatBytes, Release } from "../lib/releases";

interface AssetCard {
  title: string;
  fileName: string;
  icon: string;
  getUrl: (r: Release) => string | null;
  getSize: (r: Release) => string | null;
}

const ASSETS: AssetCard[] = [
  {
    title: "MSI Installer",
    fileName: "ChromaDeck_*_x64_en-US.msi",
    icon: "◆",
    getUrl: (r) => r.msi?.browser_download_url ?? null,
    getSize: (r) => r.msi ? formatBytes(r.msi.size) : null,
  },
  {
    title: "Setup Wizard",
    fileName: "ChromaDeck_*_x64-setup.exe",
    icon: "●",
    getUrl: (r) => r.setup?.browser_download_url ?? null,
    getSize: (r) => r.setup ? formatBytes(r.setup.size) : null,
  },
  {
    title: "Portable ZIP",
    fileName: "ChromaDeck_*_x64-portable.zip",
    icon: "■",
    getUrl: (r) => r.portable?.browser_download_url ?? null,
    getSize: (r) => r.portable ? formatBytes(r.portable.size) : null,
  },
];

export function Download() {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLatestRelease().then((r) => {
      if (!cancelled) {
        setRelease(r);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="download" className="py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-10 md:mb-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink">
            Download
          </h2>
          <p className="text-base text-muted-foreground max-w-[65ch] mx-auto mt-3 leading-relaxed">
            {release ? `${release.tag} — ` : ""}Windows 10/11 x64, WebView2
            included on 10 1809+ and Windows 11.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ASSETS.map((asset, i) => {
            const url = release ? asset.getUrl(release) : null;
            const size = release ? asset.getSize(release) : null;

            return (
              <div
                key={asset.title}
                className="rounded-2xl bg-card border border-border p-6 flex flex-col gap-4 shadow-brutal transition-all duration-[90ms] hover:shadow-[6px_6px_0_#000]"
                style={{
                  animation: `fade-up-inner 350ms ${(i * 0.08).toFixed(2)}s both`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-primary">
                    {asset.icon}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {asset.title}
                  </h3>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {asset.fileName}
                </p>
                {size && (
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {size}
                  </p>
                )}
                {loading ? (
                  <div className="rounded-lg bg-muted h-10 animate-pulse border border-border" />
                ) : url ? (
                  <a
                    href={url}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-primary-foreground border border-border shadow-brutal-sm hover:shadow-brutal active:translate-y-[2px] active:shadow-none transition-all duration-[90ms]"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 4 L4 20 20 20 Z" />
                    </svg>
                    Download
                  </a>
                ) : (
                  <span className="rounded-lg bg-muted/50 px-4 py-2.5 text-center text-[11px] font-mono text-muted-foreground border border-border">
                    Unavailable
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Requirements */}
        <div className="mt-12 rounded-2xl bg-card border border-border p-6 shadow-brutal">
          <h3 className="font-display text-lg font-semibold mb-3 text-ink">
            System requirements
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground font-mono">
            <li className="flex items-start gap-2">
              <span className="text-primary">●</span>
              <span>Windows 10 or Windows 11, 64-bit (x64)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">●</span>
              <span>WebView2 runtime (preinstalled on Windows 10 1809+ and Windows 11)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning">▲</span>
              <span>NVIDIA GPU required for NVCP-native engine, digital vibrance &amp; hue; other GPUs fall back to OS-level controls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">●</span>
              <span>GDI fallback for brightness/contrast on non-NVIDIA displays</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">●</span>
              <span>Portable ZIP keeps settings in a data folder next to the exe (CHROMADECK_DATA_DIR override)</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}