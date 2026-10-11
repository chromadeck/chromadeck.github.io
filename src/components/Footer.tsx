export function Footer() {
  return (
    <footer className="border-t border-border py-8 md:py-10">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="size-6" viewBox="0 0 32 32" aria-label="ChromaDeck">
              <rect x="0" y="0" width="32" height="32" rx="4" fill="#FBF7F3" />
              <circle cx="16" cy="16" r="6" fill="#3DDC97" />
            </svg>
            <span className="font-display text-sm font-semibold text-ink">
              ChromaDeck
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              MIT
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/miiidev/ChromaDeck/releases"
              className="font-mono text-[11px] text-muted-foreground hover:text-ink transition-colors duration-200 ease-[var(--ease-out)]"
            >
              Releases
            </a>
            <span className="font-mono text-[10px] text-muted-foreground">·</span>
            <a
              href="https://github.com/miiidev/ChromaDeck"
              className="font-mono text-[11px] text-muted-foreground hover:text-ink transition-colors duration-200 ease-[var(--ease-out)]"
            >
              Source
            </a>
            <span className="font-mono text-[10px] text-muted-foreground">·</span>
            <a
              href="https://github.com/miiidev/ChromaDeck/blob/master/LICENSE"
              className="font-mono text-[11px] text-muted-foreground hover:text-ink transition-colors duration-200 ease-[var(--ease-out)]"
            >
              License
            </a>
          </div>
        </div>

        <p className="font-mono text-[10px] text-muted-foreground mt-4 leading-snug">
          Built with Tauri, React &amp; Tailwind CSS. Color engine references&nbsp;
          <a href="https://github.com/pbatard/nvBrightness" className="underline decoration-border decoration-dotted underline-offset-2 hover:text-ink">nvBrightness</a>,
          <a href="https://github.com/falahati/NvAPIWrapper" className="underline decoration-border decoration-dotted underline-offset-2 hover:text-ink">NvAPIWrapper</a>.
        </p>
      </div>
    </footer>
  );
}