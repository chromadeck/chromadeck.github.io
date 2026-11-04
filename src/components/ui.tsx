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

/** DESIGN.md button: 8px radius, 13px bold label, trailing icon nested in a disc. */
export function Button({ href, children, variant = "primary", external, icon = true, wrap = false, className = "" }: BtnProps) {
  const size = wrap ? "min-h-11 py-2.5 whitespace-normal text-left" : "h-11 whitespace-nowrap";
  const base = `press inline-flex items-center gap-3 rounded-[8px] text-[13px] font-semibold ${size} transition-colors`;
  const look =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : "border border-border bg-surface text-foreground";
  const pad = icon ? "pl-5 pr-1.5" : "px-5";
  return (
    <a
      href={href}
      className={`${base} ${look} ${pad} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className={`btn-content inline-flex items-center ${wrap ? "min-w-0 [overflow-wrap:anywhere]" : ""}`}>{children}</span>
      {icon && (
        <span
          className={`press-icon grid size-8 place-items-center rounded-full ${
            variant === "primary" ? "bg-primary-foreground/10" : "bg-surface-hover"
          }`}
          aria-hidden="true"
        >
          <ArrowRight size={14} strokeWidth={2.2} />
        </span>
      )}
    </a>
  );
}

/** Small mono pill, matches the app's badge. */
export function Chip({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`chip inline-flex items-center rounded-full border px-2 py-[3px] font-mono text-[10px] uppercase leading-none ${
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
      <h2 className="mt-3 text-[28px] leading-[1.1] font-semibold tracking-[-0.04em] text-foreground sm:text-[40px]">
        {title}
      </h2>
      {lead && <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">{lead}</p>}
    </div>
  );
}
