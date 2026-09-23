import type { Metadata } from "next";
import { PRICING_PAGE } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";
import { PricingPlans } from "@/components/home-new/Pricing";
import PricingComparison from "@/components/home-new/PricingComparison";
import FAQSection from "@/components/home-new/FAQ";
import CTASection from "@/components/home-new/CTA";
import PageTransition from "@/components/home-new/PageTransition";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, credit-based pricing for Helpperr. Start free for 14 days, go Pro for $15/month, or share a credit pool with your team for $25 per seat.",
};

export default function PricingPage() {
  return (
    <PageTransition>
      <Section className="tone-yellow flex flex-col gap-stack border-b px-gutter py-section">
        <Reveal as="div" selector="*" className="mx-auto flex max-w-[46em] flex-col items-center gap-5 text-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
            {PRICING_PAGE.badge}
          </span>
          <h1 className="text-display font-medium leading-[1.05] text-fg">{PRICING_PAGE.heading}</h1>
          <p className="max-w-[36em] text-lead leading-relaxed text-fg-muted">{PRICING_PAGE.sub}</p>
        </Reveal>

        <PricingPlans />
      </Section>

      <PricingComparison />
      <FAQSection content={PRICING_PAGE.faq} id="pricing-faq" />
      <CTASection />
    </PageTransition>
  );
}
