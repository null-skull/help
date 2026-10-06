"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { scrollToSection } from "@/lib/lenis";

type Item = { id: string; title: string };

const num = (i: number) => String(i + 1).padStart(2, "0");

function onJump(e: React.MouseEvent, id: string) {
  e.preventDefault();
  scrollToSection(`#${id}`);
  history.replaceState(null, "", `#${id}`);
}

/**
 * "On this page" navigation for a legal document. Desktop: a sticky sidebar
 * that highlights the section currently in view. Phones/tablets: a
 * collapsible list above the content.
 */
export default function LegalToc({ items, label = "On this page" }: { items: Item[]; label?: string }) {
  const [active, setActive] = useState(items[0]?.id);

  // The active section is the last one whose heading has passed the upper
  // third of the viewport.
  useEffect(() => {
    const sections = items.map((it) => document.getElementById(it.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <>
      {/* Phones / tablets */}
      <details className="group rounded-2xl border border-line bg-card lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
          {label}
          <ChevronDown size={18} aria-hidden className="text-fg-muted transition-transform group-open:rotate-180" />
        </summary>
        <ol className="flex flex-col border-t border-line px-2 py-2">
          {items.map((it, i) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => onJump(e, it.id)}
                className="flex gap-3 rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-card-hover hover:text-fg"
              >
                <span className="text-accent">{num(i)}</span>
                {it.title}
              </a>
            </li>
          ))}
        </ol>
      </details>

      {/* Desktop */}
      <nav aria-label={label} className="hidden lg:block">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-fg-subtle">{label}</p>
        <ol className="flex flex-col border-l border-line">
          {items.map((it, i) => {
            const isActive = it.id === active;
            return (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  onClick={(e) => onJump(e, it.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`-ml-px flex gap-3 border-l py-2 pl-4 text-sm leading-snug transition-colors ${
                    isActive ? "border-accent text-fg" : "border-transparent text-fg-muted hover:text-fg"
                  }`}
                >
                  <span className={isActive ? "text-accent" : "text-fg-subtle"}>{num(i)}</span>
                  {it.title}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
