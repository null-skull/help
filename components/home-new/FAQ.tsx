"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";

export default function FAQSection() {
  const defaultIndex = FAQ.items.findIndex((item) => item.defaultOpen);
  const [openIndex, setOpenIndex] = useState(defaultIndex === -1 ? 0 : defaultIndex);

  return (
    <Section id="faq" className="tone-cyan flex flex-col gap-10 border-b px-gutter py-section lg:flex-row lg:gap-split">
      <Reveal as="div" className="flex max-w-heading flex-1 flex-col gap-4">
        <h2 className="text-h2 font-medium leading-[1.1] text-fg">
          {FAQ.heading}
        </h2>
        <p className="text-lead leading-relaxed text-fg-muted">{FAQ.sub}</p>
      </Reveal>

      <Reveal
        selector=":scope > div"
        className="flex flex-1 flex-col gap-6 rounded-2xl px-inset py-6"
      >
        {FAQ.items.map((item, index) => {
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
