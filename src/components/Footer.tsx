import { Logo } from "./ui";
import { REPO_URL } from "../lib/releases";

const GROUPS = [
  {
    title: "Product",
    links: [
      { href: "#screens", label: "Screens" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#video", label: "Walkthrough" },
      { href: "#download", label: "Download" },
    ],
  },
  {
    title: "Source",
    links: [
      { href: REPO_URL, label: "GitHub" },
      { href: `${REPO_URL}/releases`, label: "Releases" },
      { href: `${REPO_URL}/issues`, label: "Issues" },
    ],
  },
];

/** Footer: a closing call to report issues, then link groups and the licence line. */
export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h2 className="t-h1 max-w-[16ch] text-foreground">Found a bug? Tell us.</h2>
            <p className="t-body mt-4 max-w-[48ch] text-muted">
              ChromaDeck is built in the open. Open an issue on GitHub and include your GPU and
              monitor model.
            </p>
            <a
              href={`${REPO_URL}/issues/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="press label mt-7 inline-flex h-11 items-center border border-border-hover px-5 text-foreground hover:border-primary hover:text-primary"
            >
              Open an issue
            </a>
          </div>

          {GROUPS.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <p className="label text-subtle">{g.title}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-[var(--t-sm)] text-muted hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-6">
          <span className="flex items-center gap-3">
            <Logo size={20} />
            <span className="label text-muted">ChromaDeck</span>
          </span>
          <span className="label text-subtle">© 2026 · MIT licence · Windows 10 / 11 x64</span>
        </div>
      </div>
    </footer>
  );
}
