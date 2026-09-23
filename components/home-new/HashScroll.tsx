"use client";

import { useEffect } from "react";
import { onPreloadDone } from "@/lib/preloader-gate";
import { scrollToSection } from "@/lib/lenis";

// When the home page is reached via a link like "/#faq" from another page,
// scroll to that section once the preloader has released the page (it locks
// scrolling while it plays, so an earlier jump would be lost).
export default function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length < 2) return;
    let raf = 0;
    onPreloadDone(() => {
      raf = requestAnimationFrame(() => scrollToSection(hash));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
