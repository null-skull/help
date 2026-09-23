"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import { scrollToSection } from "@/lib/lenis";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-page/80 backdrop-blur-xl">
      <Section>
        <div className="flex items-center gap-split px-gutter py-3.5">
        <div className="w-logo shrink-0">
          <Image src="/home-new/icons/white.svg" alt="helpperr" width={260} height={30}/>
        </div>

        <nav className="hidden flex-1 items-center lg:flex">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (!link.href.startsWith("#")) return;
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className={`group relative cursor-pointer px-nav-link py-6 text-base font-medium transition-colors hover:text-fg ${
                i === 0 ? "text-fg" : "text-fg-muted"
              }`}
            >
              {link.label}
              <span className="absolute bottom-4 inset-x-nav-link h-px origin-left scale-x-0 bg-fg transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden lg:block">
          <button className="cursor-pointer rounded-full bg-primary px-btn-x py-btn-y text-base font-medium text-fg transition hover:scale-[1.03] hover:bg-primary-hover active:bg-primary-active shadow-primary active:scale-[0.98]">
            Get Started
          </button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="ml-auto cursor-pointer text-fg lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div data-lenis-prevent className="absolute inset-x-0 top-full h-[calc(100dvh-100%)] overflow-y-auto overscroll-contain border-t border-line bg-page lg:hidden">
          <div className="flex flex-col gap-1 px-gutter py-4">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  setMenuOpen(false);
                  if (!link.href.startsWith("#")) return;
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className={`cursor-pointer rounded-lg px-3 py-3 text-base font-medium ${
                  i === 0 ? "text-fg" : "text-fg-muted"
                }`}
              >
                {link.label}
              </a>
            ))}
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
