import { useEffect, useState } from "react";
import { fetchLatestRelease } from "../lib/releases";

export function Nav() {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLatestRelease().then((r) => {
      if (!cancelled) setVersion(r.tag);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-paper/80 backdrop-blur-sm">
      <div className="mx-auto max-w-[1400px] flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <svg className="size-8" viewBox="0 0 32 32" aria-label="ChromaDeck">
            <rect x="0" y="0" width="32" height="32" rx="4" fill="#FBF7F3" />
            <rect x="4" y="4" width="24" height="24" rx="3" fill="#ECE7DC" />
            <circle cx="16" cy="16" r="6" fill="#3DDC97" />
            <rect x="9" y="12" width="6" height="8" rx="1" fill="#000000" opacity="0.6" />
          </svg>
          <span
            className="font-display text-xl font-semibold tracking-tight text-ink"
          >
            ChromaDeck
          </span>
          {version ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2 py-0.5 text-[10px] font-mono leading-none uppercase tracking-wider text-muted-foreground border border-border">
              {version}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2 py-0.5 border border-border">
              <span className="animate-pulse size-2 rounded-full bg-primary" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-5 mr-2">
            {[
              ["Compare", "#compare"],
              ["Features", "#features"],
              ["How it works", "#how-it-works"],
              ["Download", "#download"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors duration-200 hover:text-ink"
              >
                {label}
              </a>
            ))}
          </div>
          <a
            href="https://github.com/miiidev/ChromaDeck/releases"
            className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 font-display text-xs font-semibold text-primary-foreground border border-border shadow-brutal-sm hover:shadow-brutal active:translate-y-[2px] active:shadow-none transition-all duration-[90ms]"
          >
            Download
          </a>
        </div>
      </div>
    </nav>
  );
}