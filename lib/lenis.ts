"use client";

import type Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/gsap";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Smoothly scroll to a section, using the page's Lenis instance when available. */
export function scrollToSection(href: string) {
  if (!href.startsWith("#") || href.length < 2) return;
  const el = document.querySelector(href);
  if (!el) return;

  if (instance) {
    // 5.5rem clears the fixed header; read in rem because the root
    // font-size is fluid (see "Fluid page scaling" in globals.css).
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    instance.scrollTo(el as HTMLElement, { offset: -5.5 * rem, duration: 1.1 });
    return;
  }
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}
