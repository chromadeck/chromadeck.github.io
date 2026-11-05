"use client";

export { formatBytes } from "../lib/releases";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { FALLBACK, fetchLatestRelease, type Release } from "../lib/releases";

/** Official seven-tile C mark (from ChromaDeck public/chromadeck.png). */
export function Logo({ size = 22 }: { size?: number }) {
  return <img src="/chromadeck.png" width={size} height={size} alt="" aria-hidden="true" />;
}

let cached: Promise<Release> | null = null;
/** Latest stable release; renders the verified fallback until the API answers. */
export function useRelease(): Release {
  const [r, setR] = useState<Release>(FALLBACK);
  useEffect(() => {
    let live = true;
    (cached ??= fetchLatestRelease()).then((x) => live && setR(x));
    return () => {
      live = false;
    };
  }, []);
  return r;
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  icon?: boolean;
  /** Allow the label to wrap (for long dynamic labels like download filenames). */
  wrap?: boolean;
  className?: string;
};

/** DESIGN.md button: 8px radius, larger 14px bold label, trailing icon in a disc. */
export function Button({ href, children, variant = "primary", external, icon = true, wrap = false, className = "" }: BtnProps) {
  const size = wrap ? "min-h-[52px] py-3 whitespace-normal text-left" : "h-[52px] whitespace-nowrap";
  const base = `press inline-flex items-center gap-3 rounded-[8px] text-[14px] font-semibold ${size} transition-colors`;
  /* Hover distinctions: primary brightens (motion + glow-lift), ghost fills
     darker like a card surface. Same curves, different colour channel. */
  const look =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:brightness-110"
      : "border border-border bg-surface text-foreground hover:bg-surface-hover hover:border-border-hover";
  const pad = icon ? "pl-6 pr-2" : "px-6";
  return (
    <a
      href={href}
      className={`${base} ${look} ${pad} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className={`btn-content inline-flex items-center ${wrap ? "min-w-0 [overflow-wrap:anywhere]" : ""}`}>{children}</span>
      {icon && (
        <span
          className={`press-icon grid size-9 place-items-center rounded-full ${
            variant === "primary" ? "bg-primary-foreground/10" : "bg-surface-hover"
          }`}
          aria-hidden="true"
        >
          <ArrowRight size={15} strokeWidth={2.2} />
        </span>
      )}
    </a>
  );
}

/** Pill chip, matches the app's badge. Sized to read as a control, not a label. */
export function Chip({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`chip inline-flex h-8 items-center rounded-full border px-3.5 font-mono text-[11px] uppercase leading-none tracking-[0.04em] ${
        active ? "border-primary-border bg-primary-subtle text-primary" : "border-border-hover text-muted"
      }`}
    >
      {children}
    </span>
  );
}

export function SectionHead({
  id,
  label,
  title,
  lead,
}: {
  id?: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <div className="max-w-[640px]">
      <p className="eyebrow" id={id}>
        {label}
      </p>
      <h2 className="t-h2 mt-3 text-foreground">{title}</h2>
      {lead && <p className="t-body mt-4 text-muted">{lead}</p>}
    </div>
  );
}
