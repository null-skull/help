"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";
import AskQuestionCard from "@/components/home-new/AskQuestionCard";

type FAQContent = {
  heading: string;
  sub: string;
  items: { question: string; answer: string; defaultOpen?: boolean }[];
};

// Defaults to the home page FAQ; other pages pass their own content and id.
export default function FAQSection({
  content = FAQ,
  id = "faq",
}: {
  content?: FAQContent;
  id?: string;
}) {
  const defaultIndex = content.items.findIndex((item) => item.defaultOpen);
  const [openIndex, setOpenIndex] = useState(defaultIndex === -1 ? 0 : defaultIndex);

  return (
    <Section id={id} className="tone-cyan flex flex-col gap-10 border-b px-gutter py-section lg:flex-row lg:gap-split">
      {/* Heading column stays pinned below the sticky nav while the answers
          scroll past (desktop only, where the two columns sit side by side). */}
      <Reveal as="div" className="flex max-w-heading flex-1 flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
        <h2 className="text-h2 font-medium leading-[1.1] text-fg">
          {content.heading}
        </h2>
        <p className="text-lead leading-relaxed text-fg-muted">{content.sub}</p>
        <div className="mt-4">
          <AskQuestionCard />
        </div>
      </Reveal>

      <Reveal
        selector=":scope > div"
        className="flex flex-1 flex-col gap-6 rounded-2xl px-inset py-6"
      >
        {content.items.map((item, index) => {
          const isOpen = index === openIndex;
          return (
            <div key={item.question}>
              {index > 0 && <div className="mb-6 h-px w-full bg-line" />}
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 py-2 text-left"
                aria-expanded={isOpen}
              >
                <span
                  className={`text-title font-medium transition-colors ${isOpen ? "text-fg" : "text-fg-muted"}`}
                >
                  {item.question}
                </span>
                <ChevronDown
                  size={24}
                  className={`shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-accent" : "text-fg-muted"
                  }`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] pt-2" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-base leading-relaxed text-fg-muted">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </Reveal>
    </Section>
  );
}
