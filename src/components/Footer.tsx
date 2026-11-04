import { Logo } from "./ui";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#download", label: "Download" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-12 sm:px-10">
        <div className="mb-6 flex items-center gap-3">
          <Logo size={24} />
          <span className="t-h3 text-foreground">ChromaDeck</span>
        </div>

        <p className="t-body mb-8 max-w-[60ch] text-muted">
          A free per-monitor display colour manager for Windows. Build colour presets once,
          apply and pin them per display.
        </p>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="t-meta uppercase text-muted underline decoration-border-hover underline-offset-2 transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com/miiidev/ChromaDeck"
            target="_blank"
            rel="noopener noreferrer"
            className="t-meta uppercase text-muted underline decoration-border-hover underline-offset-2 transition-colors hover:text-foreground"
          >
            Source
          </a>
        </nav>

        <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-border pt-8">
          <span className="t-meta text-subtle">© 2026 ChromaDeck · MIT License</span>
          <span className="t-meta text-subtle">Windows 10/11 x64</span>
        </div>
      </div>
    </footer>
  );
}
