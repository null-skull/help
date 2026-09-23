"use client";

import { useEffect, useRef } from "react";
import { HERO2 } from "@/lib/home-new-content";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";
import { openBookDemo } from "@/lib/book-demo-modal";

export default function Hero2() {
  const mockupRef = useRef<HTMLDivElement>(null);

  // Scroll-scrubbed zoom on the browser mockup, matching the scale/parallax
  // treatment used elsewhere on this page (see FeaturesSticky's sticky panel).
  useEffect(() => {
    const mockup = mockupRef.current;
    if (!mockup || prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = getGsap();
    const tween = gsap.fromTo(
      mockup,
      { scale: 0.92, y: 40 },
      {
        scale: 1.06,
        y: -10,
        ease: "none",
        scrollTrigger: {
          trigger: mockup,
          start: "top 90%",
          end: "top 20%",
          scrub: 0.9,
        },
      }
    );

    // The trigger's start/end are measured against the DOM layout at creation
    // time. The <video> above loads asynchronously and can change this
    // section's height once its intrinsic size resolves, and Fast Refresh in
    // dev can leave a stale measurement after edits shift content around —
    // both cases just need ScrollTrigger to recalc against the current layout.
    const video = mockup.querySelector("video");
    const refresh = () => ScrollTrigger.refresh();
    video?.addEventListener("loadedmetadata", refresh);
    const raf = requestAnimationFrame(refresh);

    return () => {
      cancelAnimationFrame(raf);
      video?.removeEventListener("loadedmetadata", refresh);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <Section id="product-showcase" className="border-b px-gutter py-section">
      <Reveal as="div" selector="*" className="mx-auto flex max-w-[min(100%,42em)] flex-col items-center gap-4 text-center text-lead">
        <h2 className="text-h2 font-medium leading-[1.1] text-fg">
          {HERO2.heading}
        </h2>
        <p className="text-lead leading-relaxed text-fg-muted">{HERO2.sub}</p>
        <div className="flex flex-wrap justify-center gap-4 pt-2 sm:gap-6">
          <button
            onClick={openBookDemo}
            className="cursor-pointer rounded-full bg-primary px-btn-x py-btn-y text-base font-medium text-fg transition hover:scale-[1.03] hover:bg-primary-hover active:bg-primary-active shadow-primary active:scale-[0.98]"
          >
            {HERO2.primaryCta}
          </button>
          <button className="cursor-pointer rounded-full border border-line-strong bg-card/40 px-btn-x py-btn-y text-base font-medium text-fg backdrop-blur-sm transition hover:scale-[1.03] hover:border-primary hover:bg-card-hover active:scale-[0.98]">
            {HERO2.secondaryCta}
          </button>
        </div>
      </Reveal>

      <Reveal as="div" className="mt-stack">
        <div className="mx-auto max-w-mockup">
          <div
            ref={mockupRef}
            className="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] will-change-transform"
          >
            <div className="flex items-center gap-2 border-b border-line bg-card-2 px-4 py-3">
              <span className="size-3 rounded-full" style={{ background: "#FF5F57" }} />
              <span className="size-3 rounded-full" style={{ background: "#FFBD2E" }} />
              <span className="size-3 rounded-full" style={{ background: "#28CA41" }} />
              <div className="ml-3 rounded-md bg-page px-3 py-1 text-xs text-fg-subtle">
                helpperr.com
              </div>
            </div>
            <video src="/home-new/Hero.mp4" autoPlay loop muted playsInline className="block h-auto w-full" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
