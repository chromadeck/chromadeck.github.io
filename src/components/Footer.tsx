import { Logo, Button } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Logo size={24} />
          <span className="text-[17px] font-semibold tracking-[-0.03em] text-foreground">ChromaDeck</span>
        </div>
        <p className="text-[15px] leading-relaxed text-muted max-w-[64ch] mb-8">
          A free per-monitor display colour manager for Windows. Build colour presets once,
          apply and pin them per display.
        </p>
        <nav className="flex flex-wrap gap-6 font-mono text-[11px] uppercase">
          <a href="#top" className="hover:text-foreground underline decoration-border-hover underline-offset-2">
            Home
          </a>
          <a href="#features" className="hover:text-foreground underline decoration-border-hover underline-offset-2">
            Features
          </a>
          <a href="#download" className="hover:text-foreground underline decoration-border-hover underline-offset-2">
            Download
          </a>
          <a
            href="https://github.com/miiidev/ChromaDeck"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline decoration-border-hover underline-offset-2"
          >
            Source
          </a>
        </nav>
        <div className="mt-10 border-t border-border pt-8 flex flex-wrap justify-between gap-4">
          <span className="font-mono text-[11px] text-subtle">
            © 2026 ChromaDeck · MIT License
          </span>
          <div className="flex items-center gap-6 font-mono text-[11px] text-subtle">
            <a href="#top" className="underline decoration-border-hover underline-offset-2 hover:text-foreground">
              GitHub
            </a>
            <a href="#download" className="press inline-flex h-11 items-center justify-center rounded-[8px] border border-border bg-surface px-5 text-[11px] font-medium transition-colors hover:bg-surface-hover">
              Download
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
