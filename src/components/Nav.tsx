"use client";
import { useEffect, useState, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./ui";
import { REPO_URL } from "../lib/releases";
import { scrollToElement } from "../lib/motion";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#video", label: "Video" },
  { href: "#requirements", label: "Requirements" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  /** Centre the target section instead of aligning it under the header. */
  const jump = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    scrollToElement(target);
    close();
    history.replaceState(null, "", href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 sm:px-10"
      >
        <a
          href="#top"
          className="flex items-center gap-3"
          aria-label="ChromaDeck home"
          onClick={close}
        >
          <Logo size={24} />
          <span className="t-h3 text-foreground">ChromaDeck</span>
        </a>

        <div className="hidden items-center gap-1.5 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => jump(e, l.href)}
              className="nav-link inline-flex h-11 items-center rounded-full px-5 text-[var(--t-sm)] text-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link inline-flex h-11 items-center rounded-full px-5 text-[var(--t-sm)] text-muted hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="#download"
            onClick={(e) => jump(e, "#download")}
            className="press ml-3 inline-flex h-12 items-center rounded-full bg-primary px-7 text-[var(--t-sm)] font-semibold text-primary-foreground hover:brightness-110"
          >
            Download
          </a>
        </div>

        <button
          type="button"
          className="grid size-12 place-items-center rounded-[8px] text-foreground lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`mobile-menu border-t border-border bg-background px-6 pb-8 lg:hidden ${
          open ? "is-open" : "hidden"
        }`}
      >
        <ul className="flex flex-col py-3">
          {[...LINKS, { href: REPO_URL, label: "GitHub" }].map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => {
                  if (l.href.startsWith("#")) jump(e, l.href);
                  else close();
                }}
                className="mobile-menu-item flex h-14 items-center border-b border-border text-[var(--t-base)] text-foreground"
                style={{ "--mobile-delay": `${i * 40}ms` } as React.CSSProperties}
                {...(l.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#download"
          onClick={(e) => jump(e, "#download")}
          className="press mt-5 flex h-12 items-center justify-center rounded-full bg-primary text-[var(--t-sm)] font-semibold text-primary-foreground hover:brightness-110"
        >
          Download for Windows
        </a>
      </div>
    </header>
  );
}
