"use client";

import type { MouseEvent } from "react";
import { scrollToSection } from "@/lib/lenis";

// Site links are "/" (home), "/#section" (a home-page section) or a route like
// "/pricing". Rendered through next/link, they navigate normally — except when
// the target is on the page already showing, where we smooth-scroll instead of
// letting the router jump. Returns true when the click was handled here.
export function handleSiteLinkClick(e: MouseEvent, href: string, pathname: string) {
  if (pathname !== "/") return false;

  if (href === "/") {
    e.preventDefault();
    scrollToSection("#hero");
    return true;
  }

  if (href.startsWith("/#")) {
    e.preventDefault();
    scrollToSection(href.slice(1));
    return true;
  }

  return false;
}

/** A link is "active" when it points at the route currently shown. */
export function isActiveLink(href: string, pathname: string) {
  return !href.includes("#") && href === pathname;
}
