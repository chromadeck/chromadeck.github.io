"use client";
import * as React from "react";
import { useRelease, formatBytes, Button, Chip } from "./ui";
import { Reveal } from "./Reveal";
import { ScrubText } from "./ScrubText";

const STABLE_TAG = "v0.8.1";

export function Download() {
  const release = useRelease();
  const [warn, setWarn] = React.useState(false);

  const asset = (a: { name: string; size: number } | null) =>
    a ? `${a.name} · ${formatBytes(a.size)}` : null;

  return (
    <section id="download" aria-labelledby="download-title" className="scroll-mt-24 border-y border-border py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="chapter eyebrow">
                <span>05</span>
                <span>Get ChromaDeck</span>
              </p>
              <h2 id="download-title" className="t-h2 mt-4 text-foreground">
                Ready to take control of your display?
              </h2>
              <ScrubText
                className="mt-5 max-w-[52ch]"
                lead
                paragraphs={[
                  "Get ChromaDeck and start building your own display colour experience.",
                ]}
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <Chip active>Windows 10 / 11 x64</Chip>
                <Chip active>MIT licensed</Chip>
                <Chip active>Free</Chip>
              </div>
            </div>
          </Reveal>

          <Reveal staggerMs={80}>
            <div className="rounded-[8px] border border-border bg-surface p-8">
            <h3 className="t-h3 mb-6 text-foreground">{release.tag} — Windows x64</h3>

            <div className="flex flex-col gap-3">
              <Button href={release.msi!.browser_download_url} className="w-full" icon={false} wrap>
                MSI installer ({asset(release.msi)})
              </Button>
              <Button href={release.setup!.browser_download_url} className="w-full" icon={false} wrap>
                Setup wizard ({asset(release.setup)})
              </Button>
              <Button href={release.portable!.browser_download_url} className="w-full" icon={false} wrap>
                Portable ZIP ({asset(release.portable)})
              </Button>
              <Button
                href={release.exe!.browser_download_url}
                variant="ghost"
                className="w-full"
                icon={false}
                wrap
              >
                Standalone executable ({asset(release.exe)})
              </Button>
            </div>

            <p className="t-meta mt-6 leading-relaxed text-subtle">
              Source release page:{" "}
              <a
                href={release.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-border-hover underline-offset-2 hover:decoration-primary"
              >
                GitHub releases
              </a>
            </p>
            <p className="t-meta mt-4 leading-relaxed text-subtle">
              Windows 10/11 x64 only; NVIDIA driver colour path with GDI fallback elsewhere. No
              guaranteed HDR or hardware backlight control.
            </p>

            <button
              type="button"
              className="press t-meta mt-5 inline-flex items-center gap-2 rounded-[8px] border border-border-hover bg-surface px-3 py-2 text-muted transition-colors hover:text-foreground"
              onClick={() => setWarn(true)}
            >
              <span className="btn-content">Show verified fallback</span>
            </button>

            {warn && (
              <p className="t-meta mt-4 text-subtle">
                GitHub API unreachable — showing verified stable fallback: {STABLE_TAG}.
              </p>
            )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
