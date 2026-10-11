import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "../lib/reveal";

/**
 * Two-way scroll-reveal wrapper. The wrapper owns the reveal transition
 * (opacity/translate/blur); children keep their own press/hover transitions
 * on an inner element so the two never fight over `transition-property`.
 */
export function Reveal({
  children,
  className = "",
  style,
  staggerMs = 0,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  staggerMs?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ ...style, "--stagger-ms": `${staggerMs}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
