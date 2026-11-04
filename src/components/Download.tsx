"use client";
import * as React from "react";
import { useRelease, formatBytes, Button, Chip } from "./ui";

const STABLE_TAG = "v0.8.1";

export function Download() {
  const release = useRelease();
  const [warn, setWarn] = React.useState(false);
  const backoff = () => setWarn(true);

  const asset = (a: { name: string; size: number } | null) =>
    a ? `${a.name} · ${formatBytes(a.size)}` : null;

  return (
    <section id="download" aria-labelledby="download-title" className="py-34 sm:py-44 border-y border-border">
      <div className="mx-auto max-w-[1300px] px-6 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Get ChromaDeck</p>
            <h2 id="download-title" className="mt-4 text-[36px] leading-[1.1] font-semibold tracking-[-0.05em] text-foreground sm:text-[52px]">
              Ready to take control of your display?
            </h2>
            <p className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-muted sm:text-[19px]">
              Get ChromaDeck and start building your own display colour experience.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Chip active>Windows 10 / 11 x64</Chip>
              <Chip active>MIT licensed</Chip>
              <Chip active>Free</Chip>
            </div>
          </div>

          <div className="rounded-[8px] border border-border bg-surface p-8">
            <h3 className="text-[16px] font-semibold text-foreground mb-6">
              {release.tag} — Windows x64
            </h3>
            <Button href={release.msi!.browser_download_url} className="w-full" icon={false} wrap>
              MSI installer ({asset(release.msi)})
            </Button>
            <Button href={release.setup!.browser_download_url} className="w-full mt-3" icon={false} wrap>
              Setup wizard ({asset(release.setup)})
            </Button>
            <Button href={release.portable!.browser_download_url} className="w-full mt-3" icon={false} wrap>
              Portable ZIP ({asset(release.portable)})
            </Button>
            <Button href={release.exe!.browser_download_url} variant="ghost" className="w-full mt-3" icon={false} wrap>
              Standalone executable ({asset(release.exe)})
            </Button>
            <p className="mt-6 font-mono text-[11px] text-subtle leading-relaxed">
              Source release page:{" "}
              <a href={release.url} target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-border-hover underline-offset-2 hover:decoration-primary">
                GitHub releases
              </a>
            </p>
            <p className="mt-5 font-mono text-[11px] text-subtle leading-relaxed">
              Windows 10/11 x64 only; NVIDIA driver colour path with GDI fallback elsewhere. No guaranteed HDR or hardware backlight control.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-[8px] border border-destructive-foreground/20 bg-surface text-[11px] font-mono text-danger-foreground press transition-colors"
              onClick={backoff}
            >
              <span className="btn-content">
                <span aria-hidden="true">⚠</span> Show verified fallback
              </span>
            </button>
            {warn && (
              <p className="mt-4 font-mono text-[11px] text-subtle">
                GitHub API unreachable — showing verified stable fallback: {STABLE_TAG}.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
