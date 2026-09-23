import type { Metadata } from "next";
import { CONTACT_PAGE } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";
import ContactForm, { ContactOptions } from "@/components/home-new/ContactForm";
import PageTransition from "@/components/home-new/PageTransition";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Helpperr team about the product, pricing or your team's setup.",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <Section className="tone-cyan grid gap-stack border-b px-gutter py-section lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-split">
        <Reveal as="div" selector=":scope > *" className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
            {CONTACT_PAGE.badge}
          </span>
          <h1 className="text-display font-medium leading-[1.05] text-fg">{CONTACT_PAGE.heading}</h1>
          <p className="max-w-[32em] text-lead leading-relaxed text-fg-muted">{CONTACT_PAGE.sub}</p>
          <div className="mt-4">
            <ContactOptions />
          </div>
        </Reveal>

        <Reveal as="div">
          <ContactForm />
        </Reveal>
      </Section>
    </PageTransition>
  );
}
