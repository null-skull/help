"use client";

import { Check, Minus } from "lucide-react";
import { PRICING, PRICING_PAGE } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";
import { openBookDemo } from "@/lib/book-demo-modal";

const { comparison } = PRICING_PAGE;
const HIGHLIGHT = PRICING.plans.findIndex((plan) => plan.highlight);

function Value({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <>
        <Check size={18} className="mx-auto text-accent" aria-hidden />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus size={18} className="mx-auto text-fg-subtle" aria-hidden />
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span className="text-sm text-fg">{value}</span>;
}

// Tints the recommended plan's column so it reads as one continuous band.
const colTint = (i: number) => (i === HIGHLIGHT ? "bg-primary/[0.06]" : "");

export default function PricingComparison() {
  return (
    <Section id="compare" className="tone-yellow flex flex-col gap-stack border-b px-gutter py-section">
      <Reveal as="div" selector="*" className="mx-auto flex max-w-[42em] flex-col items-center gap-4 text-center">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
          {comparison.badge}
        </span>
        <h2 className="text-h2 font-medium leading-[1.1] text-fg">{comparison.heading}</h2>
        <p className="text-lead leading-relaxed text-fg-muted">{comparison.sub}</p>
      </Reveal>

      {/* Phones: one card per plan listing every row — a 4-column table would
          only show a single plan at a time there. */}
      <Reveal selector=":scope > div" className="flex flex-col gap-grid md:hidden">
        {PRICING.plans.map((plan, p) => (
          <div
            key={plan.name}
            className={`overflow-hidden rounded-2xl border bg-card ${
              p === HIGHLIGHT ? "border-primary/60 tone-glow-soft" : "border-line"
            }`}
          >
            <div className={`flex items-center justify-between gap-4 p-card ${colTint(p)}`}>
              <div className="flex flex-col gap-1">
                <span className="text-title font-medium text-fg">{plan.name}</span>
                <span className="text-sm text-fg-muted">
                  <span className="text-lead font-medium text-fg">{plan.price}</span> {plan.period}
                </span>
              </div>
              <button
                onClick={openBookDemo}
                className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
                  p === HIGHLIGHT
                    ? "bg-primary text-fg shadow-primary hover:bg-primary-hover active:bg-primary-active"
                    : "border border-line-strong bg-card-2 text-fg hover:border-primary hover:bg-card-hover"
                }`}
              >
                {plan.cta}
              </button>
            </div>
            {comparison.groups.map((group) => (
              <div key={group.title} className="border-t border-line">
                <p className="bg-card-2 px-card py-2.5 text-xs font-medium uppercase tracking-widest text-accent">
                  {group.title}
                </p>
                <dl>
                  {group.rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4 border-t border-line px-card py-3">
                      <dt className="text-sm text-fg-muted">{row.label}</dt>
                      <dd className="relative text-right">
                        <Value value={row.values[p]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        ))}
      </Reveal>

      <Reveal as="div" className="hidden overflow-hidden rounded-2xl border border-line bg-card md:block">
        {/* Scrolls sideways if it ever gets narrower than the table.
            `relative` keeps the absolutely-positioned sr-only labels inside the
            scroll box — otherwise they escape it and widen the page. No
            data-lenis-prevent here: this is only a horizontal fallback, and that
            attribute makes Lenis ignore vertical wheel scrolling over the whole
            table, so the page stutters or stops while the cursor is on it. */}
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">Helpperr plan comparison</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="sticky left-0 z-10 w-[34%] bg-card p-card align-bottom">
                  <span className="text-sm font-medium text-fg-muted">Plans</span>
                </th>
                {PRICING.plans.map((plan, i) => (
                  <th key={plan.name} scope="col" className={`p-card text-center align-bottom ${colTint(i)}`}>
                    <div className="flex flex-col items-center gap-3">
                      {i === HIGHLIGHT && (
                        <span className="rounded-full bg-accent px-3 py-1 text-[0.65rem] font-medium uppercase tracking-widest text-page">
                          Most Popular
                        </span>
                      )}
                      <span className="text-title font-medium text-fg">{plan.name}</span>
                      <span className="text-sm font-normal text-fg-muted">
                        <span className="text-lead font-medium text-fg">{plan.price}</span> {plan.period}
                      </span>
                      <button
                        onClick={openBookDemo}
                        className={`mt-1 w-full max-w-[11rem] cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
                          i === HIGHLIGHT
                            ? "bg-primary text-fg shadow-primary hover:bg-primary-hover active:bg-primary-active"
                            : "border border-line-strong bg-card-2 text-fg hover:border-primary hover:bg-card-hover"
                        }`}
                      >
                        {plan.cta}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {comparison.groups.map((group) => (
              <tbody key={group.title}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={PRICING.plans.length + 1}
                    className="sticky left-0 bg-card-2 px-card py-3 text-xs font-medium uppercase tracking-widest text-accent"
                  >
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label} className="border-t border-line transition-colors hover:bg-card-hover/60">
                    <th scope="row" className="sticky left-0 z-10 bg-card px-card py-4 text-sm font-normal text-fg-muted">
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td key={i} className={`px-card py-4 text-center ${colTint(i)}`}>
                        <Value value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
