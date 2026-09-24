"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Users } from "lucide-react";
import { PRICING, PRICING_PAGE } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";
import { openBookDemo } from "@/lib/book-demo-modal";

const teamConfig = PRICING.plans.find((plan) => plan.seats)!.seats!;
const SEAT_OPTIONS = Array.from(
  { length: teamConfig.max - teamConfig.min + 1 },
  (_, i) => teamConfig.min + i
);

function SeatSelect({ seats, onChange }: { seats: number; onChange: (n: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-line-strong bg-card-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:border-accent"
      >
        <Users size={14} className="text-fg-muted" />
        {seats}
        <ChevronDown size={14} className={`text-fg-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          data-lenis-prevent
          className="absolute right-0 top-full z-10 mt-2 max-h-56 w-24 overflow-y-auto overscroll-contain rounded-lg border border-line bg-card py-1 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]"
        >
          {SEAT_OPTIONS.map((n) => (
            <li key={n}>
              <button
                type="button"
                role="option"
                aria-selected={n === seats}
                onClick={() => {
                  onChange(n);
                  setOpen(false);
                }}
                className={`w-full cursor-pointer px-3 py-1.5 text-left text-sm transition-colors ${
                  n === seats ? "bg-accent text-page" : "text-fg-muted hover:bg-accent/10 hover:text-fg"
                }`}
              >
                {n}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlanCard({ plan }: { plan: (typeof PRICING.plans)[number] }) {
  const [seats, setSeats] = useState(teamConfig.default);
  const isTeam = Boolean(plan.seats);

  const totalPrice = isTeam ? Number(plan.price.replace("$", "")) * seats : null;
  const totalCredits = isTeam
    ? Number(plan.credits.replace(/[^0-9]/g, "")) * seats
    : null;

  return (
    <div
      className={`flex flex-col gap-6 rounded-2xl border p-card ${
        plan.highlight
          ? "border-primary/60 bg-gradient-to-b from-primary/12 to-card tone-glow-soft"
          : "border-line bg-card"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-lead font-medium text-fg">{plan.name}</span>
        {isTeam ? (
          <SeatSelect seats={seats} onChange={setSeats} />
        ) : (
          plan.highlight && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium uppercase tracking-widest text-page">
              Most Popular
            </span>
          )
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-price font-medium text-fg">{plan.price}</span>
          <span className="text-sm text-fg-muted">{isTeam ? "/ user / month" : plan.period}</span>
        </div>
        <p className="text-sm text-fg-muted">{plan.description}</p>
        {isTeam && (
          <p className="text-xs text-fg-subtle">
            ${totalPrice}/month total for {seats} seats · {teamConfig.min}–{teamConfig.max} users
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1 border-y border-line py-4">
        <span className="text-2xl font-medium text-fg">
          {isTeam ? `${totalCredits!.toLocaleString()} credits` : plan.credits}
        </span>
        <span className="text-xs text-fg-subtle">{plan.creditsNote}</span>
      </div>

      <ul className="flex flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-fg-muted">
            <Check size={16} className="mt-0.5 shrink-0 text-accent" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={openBookDemo}
        className={`mt-auto cursor-pointer rounded-full px-btn-x py-btn-y text-base font-medium transition hover:scale-[1.03] active:scale-[0.98] ${
          plan.highlight
            ? "bg-primary text-fg shadow-primary hover:bg-primary-hover active:bg-primary-active"
            : "border border-line-strong bg-card-2 text-fg hover:border-primary hover:bg-card-hover"
        }`}
      >
        {plan.cta}
      </button>
    </div>
  );
}

/** Plan cards plus the credit top-ups strip — shared by the home page's
 *  pricing section and the /pricing page. */
export function PricingPlans() {
  return (
    <>
      <Reveal selector=":scope > div" className="grid grid-cols-1 gap-grid md:grid-cols-2 lg:grid-cols-3 md:[&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
        {PRICING.plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </Reveal>

      <Reveal
        as="div"
        className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-dashed border-line p-card md:flex-row md:items-center"
      >
        <div className="flex flex-col gap-1">
          <span className="text-lead font-medium text-fg">{PRICING.topUps.heading}</span>
          <p className="max-w-xl text-sm leading-relaxed text-fg-muted">{PRICING.topUps.description}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {PRICING.topUps.items.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-1 rounded-xl border border-line bg-card-2 px-5 py-3"
            >
              <span className="text-sm font-medium text-fg">{item.name}</span>
              <span className="text-xs text-fg-muted">
                {item.credits} — {item.price}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </>
  );
}

export default function Pricing() {
  return (
    <Section id="pricing" className="tone-yellow flex flex-col gap-stack border-b px-gutter py-section">
      <Reveal as="div" className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-split">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
            {PRICING.badge}
          </span>
          <h2 className="max-w-xl text-h2 font-medium leading-[1.1] text-fg">
            {PRICING.heading.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <p className="max-w-[28em] text-lead leading-relaxed text-fg-muted lg:max-w-[min(28em,42%)] lg:pt-2">{PRICING.description}</p>
      </Reveal>

      <PricingPlans />

      <Link
        href="/pricing#compare"
        className="group inline-flex w-fit items-center gap-2 self-center text-base font-medium text-accent transition-colors hover:text-primary-hover"
      >
        {PRICING_PAGE.compareLink}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </Section>
  );
}
