"use client";
import { useEffect, useState } from "react";

/** The page's index. The nav lists these and marks the one in view. */
export const SECTIONS = [
  { id: "screens", label: "Screens" },
  { id: "how-it-works", label: "How it works" },
  { id: "video", label: "Walkthrough" },
  { id: "principles", label: "Principles" },
  { id: "download", label: "Download" },
] as const;

/** Id of the section crossing the middle of the viewport, or null. */
export function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        setActive(SECTIONS.find((s) => visible.has(s.id))?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return active;
}
