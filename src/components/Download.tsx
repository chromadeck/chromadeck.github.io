"use client";
import { useRelease, formatBytes } from "./ui";
import { Reveal } from "./Reveal";
import { ArrowDown } from "lucide-react";
import type { ReleaseAsset } from "../lib/releases";

type Row = { key: string; label: string; note: string; asset: ReleaseAsset | null; recommended?: boolean };

/**
 * Download: one row per installer, newest release first. The MSI is marked
 * recommended. Rows with no asset in the release are left out.
 */
export function Download() {
  const release = useRelease();

  const rows: Row[] = [
    { key: "msi", label: "MSI installer", note: "The in-app updater installs this format.", asset: release.msi, recommended: true },
    { key: "setup", label: "Setup wizard", note: "A guided .exe installer.", asset: release.setup },
    { key: "portable", label: "Portable ZIP", note: "Unzip and run. No install step.", asset: release.portable },
    { key: "exe", label: "Standalone executable", note: "Single file.", asset: release.exe },
  ];
  const available = rows.filter((r) => r.asset);

  return (
    <section id="download" aria-labelledby="download-title" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <h2 id="download-title" className="t-h1 max-w-[14ch] text-foreground">
              Get ChromaDeck.
            </h2>
            <p className="t-lead mt-5 max-w-[44ch] text-muted">
              Free, MIT licensed, no account. Pick an installer. If you are not sure, take the MSI.
            </p>
            <dl className="label-plate mt-10">
              {[
                ["Release", release.tag],
                ["Platform", "Windows 10 / 11 x64"],
                ["Colour path", "NVAPI, GDI fallback"],
                ["Licence", "MIT"],
                ["Account", "None"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label text-subtle">{k}</dt>
                  <dd className="text-[var(--t-sm)] text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="label mt-6 leading-relaxed text-subtle">
              Files come from the{" "}
              <a
                href={release.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-border-hover underline-offset-4 hover:decoration-primary"
              >
                {release.tag} GitHub release
              </a>
              .
            </p>
          </Reveal>

          <Reveal staggerMs={80}>
            <ul className="border-t border-border">
              {available.map((r) => (
                <li key={r.key} className="border-b border-border">
                  <a
                    href={r.asset!.browser_download_url}
                    className="download-row group grid grid-cols-[1fr_auto] items-center gap-4 py-5 sm:px-4"
                  >
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-3">
                        <span className="t-h3 text-foreground">{r.label}</span>
                        {r.recommended && (
                          <span className="label border border-primary-border bg-primary-subtle px-2 py-0.5 text-primary">
                            Recommended
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-[var(--t-sm)] text-muted">{r.note}</span>
                      <span className="label mt-2 block break-all text-subtle">
                        {r.asset!.name} · {formatBytes(r.asset!.size)}
                      </span>
                    </span>
                    <span
                      className="download-icon grid size-11 place-items-center border border-border-hover text-muted"
                      aria-hidden="true"
                    >
                      <ArrowDown size={18} strokeWidth={2} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
