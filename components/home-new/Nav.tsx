"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import { handleSiteLinkClick, isActiveLink } from "@/lib/site-links";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  // Hide the header while scrolling down, bring it back on any scroll up.
  // Lenis drives the real window scroll, so plain scroll events see it too.
  useEffect(() => {
    const SHOW_NEAR_TOP = 120; // always visible this close to the top
    const THRESHOLD = 6; // ignore sub-pixel / jittery movements
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y < SHOW_NEAR_TOP) setHidden(false);
      else if (y - lastY > THRESHOLD) setHidden(true);
      else if (lastY - y > THRESHOLD) setHidden(false);
      else return; // too small to count — keep lastY as the reference point
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // A route change starts at the top of the new page — show the header there.
  // (Adjusting state during render on a prop change, per React's guidance,
  // instead of an effect that would render twice.)
  const [routeShown, setRouteShown] = useState(pathname);
  if (routeShown !== pathname) {
    setRouteShown(pathname);
    setHidden(false);
  }

  return (
    <header
      // Named so page transitions leave the header in place (see globals.css).
      style={{ viewTransitionName: "site-header" }}
      className={`site-header-in sticky top-0 z-50 border-b border-line bg-page/80 backdrop-blur-xl transition-[translate] duration-300 ease-out ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Section>
        <div className="flex items-center gap-split px-gutter py-3.5">
        <Link
          href="/"
          onClick={(e) => handleSiteLinkClick(e, "/", pathname)}
          className="w-logo shrink-0"
          aria-label="Helpperr home"
        >
          <Image src="/home-new/icons/white.svg" alt="helpperr" width={260} height={30}/>
        </Link>

        <nav className="hidden flex-1 items-center lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActiveLink(link.href, pathname);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleSiteLinkClick(e, link.href, pathname)}
                aria-current={active ? "page" : undefined}
                className={`group relative cursor-pointer px-nav-link py-6 text-base font-medium transition-colors hover:text-fg ${
                  active ? "text-fg" : "text-fg-muted"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-4 inset-x-nav-link h-px origin-left bg-fg transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden lg:block">
          <button className="cursor-pointer rounded-full bg-primary px-btn-x py-btn-y text-base font-medium text-fg transition hover:scale-[1.03] hover:bg-primary-hover active:bg-primary-active shadow-primary active:scale-[0.98]">
            Get Started
          </button>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="ml-auto cursor-pointer text-fg lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div data-lenis-prevent className="absolute inset-x-0 top-full h-[calc(100dvh-100%)] overflow-y-auto overscroll-contain border-t border-line bg-page lg:hidden">
          <div className="flex flex-col gap-1 px-gutter py-4">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(link.href, pathname);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    setMenuOpen(false);
                    handleSiteLinkClick(e, link.href, pathname);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`cursor-pointer rounded-lg px-3 py-3 text-base font-medium ${
                    active ? "bg-card text-fg" : "text-fg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => setMenuOpen(false)}
              className="mt-2 cursor-pointer rounded-full bg-primary px-btn-x py-btn-y text-base font-medium text-fg transition hover:bg-primary-hover active:bg-primary-active shadow-primary active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
      </Section>
    </header>
  );
}
