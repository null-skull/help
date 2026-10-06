import { Fragment } from "react";
import { Calendar, Mail } from "lucide-react";
import type { LegalDoc } from "@/lib/legal-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";
import LegalToc from "@/components/home-new/legal/LegalToc";

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Renders copy with markdown-style [label](href) links. */
function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const [whole, label, href] = m;
    parts.push(text.slice(last, m.index));
    const external = href.startsWith("http");
    parts.push(
      <a
        key={m.index}
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        className="font-medium text-accent underline underline-offset-2 transition-colors hover:text-primary-hover"
      >
        {label}
      </a>
    );
    last = m.index + whole.length;
  }
  parts.push(text.slice(last));
  return <>{parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</>;
}

/** First mailto: address in a section, used for the contact card. */
function findEmail(doc: LegalDoc) {
  for (const s of doc.sections)
    for (const b of s.blocks)
      if (b.type === "p") {
        const m = b.text.match(/\(mailto:([^)]+)\)/);
        if (m) return m[1];
      }
  return null;
}

/**
 * A legal page (privacy policy, terms…) in the site theme: a header with the
 * last-updated date, then the numbered sections beside a sticky table of
 * contents. Content comes from lib/legal-content.ts.
 */
export default function LegalDocument({ doc }: { doc: LegalDoc }) {
  const email = findEmail(doc);

  return (
    <>
      <Section className="tone-cyan flex flex-col gap-5 border-b px-gutter py-section">
        <Reveal as="div" selector=":scope > *" className="flex max-w-heading flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
            {doc.badge}
          </span>
          <h1 className="text-display font-medium leading-[1.05] text-fg">{doc.title}</h1>
          <p className="inline-flex items-center gap-2 text-sm text-fg-muted">
            <Calendar size={16} aria-hidden className="text-fg-subtle" />
            Last updated: <time>{doc.updated}</time>
          </p>
        </Reveal>
      </Section>

      <Section className="tone-cyan grid gap-stack border-b px-gutter py-section lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-split">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <LegalToc items={doc.sections.map(({ id, title }) => ({ id, title }))} />
        </aside>

        <article className="flex max-w-[48rem] flex-col">
          {doc.sections.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="flex scroll-mt-28 flex-col gap-5 border-t border-line py-10 first:border-t-0 first:pt-0 last:pb-0"
            >
              <h2 id={`${section.id}-title`} className="flex items-baseline gap-4 text-h3 font-medium leading-tight text-fg">
                <span className="shrink-0 text-base font-medium text-accent">{String(i + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>

              {section.blocks.map((block, j) =>
                block.type === "p" ? (
                  <p key={j} className="text-base leading-relaxed text-fg-muted">
                    <Inline text={block.text} />
                  </p>
                ) : (
                  <ul key={j} className="flex flex-col gap-3">
                    {block.items.map((item) => (
                      <li
                        key={item.term}
                        className="flex gap-4 rounded-xl border border-line bg-card px-5 py-4 text-base leading-relaxed text-fg-muted"
                      >
                        <span aria-hidden className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-accent" />
                        <span>
                          <strong className="font-medium text-fg">{item.term}:</strong> {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )
              )}

              {/* The closing contact section also gets a direct email action. */}
              {i === doc.sections.length - 1 && email && (
                <a
                  href={`mailto:${email}`}
                  className="group mt-2 flex items-center gap-4 rounded-2xl border border-line-strong bg-card-2 p-5 transition-colors hover:border-accent/50"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Mail size={20} aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm text-fg-muted">Email our team</span>
                    <span className="break-all text-base font-medium text-fg transition-colors group-hover:text-accent">{email}</span>
                  </span>
                </a>
              )}
            </section>
          ))}
        </article>
      </Section>
    </>
  );
}
