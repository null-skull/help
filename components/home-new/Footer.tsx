"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { FOOTER } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";
import { scrollToSection } from "@/lib/lenis";
import { openBookDemo } from "@/lib/book-demo-modal";

const SOCIAL_ICONS = [
  { name: "Twitter", src: "/home-new/icons/twitter.svg" },
  { name: "LinkedIn", src: "/home-new/icons/linkedin.svg" },
  { name: "GitHub", src: "/home-new/icons/github.svg" },
];

export default function Footer() {
  return (
    <footer className="tone-lime relative isolate overflow-hidden bg-page">
      <div aria-hidden className="footer-blobs">
        <span className="footer-blob footer-blob--a" />
        <span className="footer-blob footer-blob--b" />
      </div>

      <Section className="flex flex-col px-gutter">
        {/* Sign-up call to action */}
        <Reveal
          as="div"
          selector=":scope > div"
          className="flex flex-col gap-stack py-section lg:flex-row lg:items-center lg:justify-between lg:gap-split"
        >
          <div className="flex max-w-heading flex-col gap-4">
            <h2 className="text-h2 font-medium leading-[1.1] text-fg">
              {FOOTER.cta.heading.map((line, i) => (
                <span key={i} className="lg:block">
                  {line}{" "}
                </span>
              ))}
            </h2>
            <p className="max-w-[36em] text-lead leading-relaxed text-fg-muted">{FOOTER.cta.sub}</p>
          </div>

          <div className="flex w-full flex-col gap-4 lg:max-w-[34rem]">
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                openBookDemo();
              }}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                required
                placeholder={FOOTER.cta.placeholder}
                className="min-w-0 flex-1 rounded-full border border-line bg-card/60 px-btn-x py-btn-y text-base text-fg placeholder:text-fg-muted/70 outline-none backdrop-blur-md transition-colors focus:border-accent"
              />
              <button
                type="submit"
                className="shrink-0 cursor-pointer rounded-full bg-fg px-btn-x py-btn-y text-base font-medium text-page transition-transform hover:scale-[1.03] hover:bg-white active:scale-[0.98]"
              >
                {FOOTER.cta.button}
              </button>
            </form>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
              {FOOTER.cta.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2">
                  <Check size={14} className="shrink-0 text-accent" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="h-px w-full bg-line" />

        {/* Brand + link columns */}
        <Reveal
          selector=":scope > div"
          className="grid gap-stack py-section lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-split"
        >
          <div className="flex flex-col gap-6">
            <div className="w-logo">
              <Image src="/home-new/icons/Layer_1.svg" alt={FOOTER.brand} width={260} height={30} />
            </div>
            <p className="max-w-[24rem] text-sm leading-relaxed text-fg-muted">{FOOTER.description}</p>
            <div className="flex items-center divide-x divide-line" aria-label={FOOTER.social.label}>
              {SOCIAL_ICONS.map((icon) => (
                <a
                  key={icon.name}
                  href="#"
                  aria-label={icon.name}
                  className="cursor-pointer px-4 opacity-70 transition-opacity first:pl-0 hover:opacity-100"
                >
                  <Image src={icon.src} alt="" width={18} height={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-10">
            {FOOTER.columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-5">
                <span className="text-title font-medium text-fg">{col.title}</span>
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      if (link.label === "Book a Demo") {
                        e.preventDefault();
                        openBookDemo();
                        return;
                      }
                      if (!link.href.startsWith("#")) return;
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="w-fit cursor-pointer text-sm text-fg/85 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-col items-center gap-1 border-t border-line py-8 text-center text-sm text-fg-muted sm:flex-row sm:justify-center sm:gap-3">
          <p>{FOOTER.copyright}</p>
          <span aria-hidden className="hidden sm:inline">
            ·
          </span>
          <p>{FOOTER.tagline}</p>
        </div>
      </Section>
    </footer>
  );
}
