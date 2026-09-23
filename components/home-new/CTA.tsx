import { CTA } from "@/lib/home-new-content";
import Reveal from "@/components/Reveal";
import { openBookDemo } from "@/lib/book-demo-modal";

export default function CTASection() {
  return (
    <div id="cta" className="relative isolate flex items-center justify-center overflow-hidden border-y border-line px-gutter py-section-lg">
      <div aria-hidden className="cta-glow" />
      <Reveal
        as="div"
        selector="*"
        className="relative flex max-w-heading flex-1 flex-col items-center justify-center gap-4 text-center"
      >
        <h2 className="text-display font-medium leading-[1.1] text-fg">
          {CTA.heading.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 pt-6 sm:gap-6">
          <button className="cursor-pointer rounded-full bg-fg px-btn-x py-btn-y text-base font-medium text-page transition-transform hover:scale-[1.03] hover:bg-white active:scale-[0.98]">
            {CTA.primaryCta}
          </button>
          <button
            onClick={openBookDemo}
            className="cursor-pointer rounded-full border border-fg px-btn-x py-btn-y text-base font-medium text-fg transition-transform hover:scale-[1.03] hover:bg-fg hover:text-page active:scale-[0.98]"
          >
            {CTA.secondaryCta}
          </button>
        </div>
      </Reveal>
    </div>
  );
}
