"use client";
import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "../lib/reveal";

/** One-way scroll-reveal wrapper (opacity + translate only). */
export function Reveal({
  children,
  className = "",
  staggerMs = 0,
}: {
  children: ReactNode;
  className?: string;
  staggerMs?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--stagger-ms": `${staggerMs}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
