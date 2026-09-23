"use client";

import { useEffect, useRef } from "react";
import { HERO } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";
import { onPreloadDone } from "@/lib/preloader-gate";
import { openBookDemo } from "@/lib/book-demo-modal";

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const rest = restRef.current;
    const steps = stepsRef.current;
    if (!heading || !rest || !steps) return;

    const stepItems = Array.from(steps.children) as HTMLElement[];

    if (prefersReducedMotion()) {
      heading.style.opacity = "1";
      rest.style.opacity = "1";
      rest.style.transform = "none";
      stepItems.forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "none";
      });
      return;
    }

    const { gsap } = getGsap();
    gsap.set(heading, { opacity: 0.001, y: 60, scale: 0.96 });
    gsap.set(rest, { opacity: 0, y: 24 });
    gsap.set(stepItems, { opacity: 0, y: 24 });

    // Wait for the preloader to finish before playing the entrance, so it
    // isn't wasted running invisibly underneath the loading overlay.
    let tl: ReturnType<typeof gsap.timeline> | null = null;
    const start = () => {
      tl = gsap.timeline({ delay: 0.15 });
      tl.to(heading, { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: "power2.out" })
        .to(rest, { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" }, "-=0.7")
        .to(stepItems, { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: "power2.out" }, "-=0.55");
    };

    onPreloadDone(start);

    return () => {
      tl?.kill();
    };
  }, []);

  return (
    <Section id="hero" className="tone-yellow flex min-h-[820px] flex-col gap-stack border-b px-gutter py-section lg:flex-row lg:gap-split">
      <div className="flex flex-col items-center justify-between gap-stack lg:flex-1 lg:pt-10">
        {/* <div className="flex flex-col items-center justify-between gap-stack lg:flex-1 lg:pt-10"> */}
        <div>
          <h1
            ref={headingRef}
            className="text-display font-medium leading-[1.1] text-fg"
          >
            {HERO.heading}
          </h1>
          <div ref={restRef} className="flex flex-col items-start gap-4 pt-4">
            <p className="max-w-[36em] text-lead leading-relaxed text-fg-muted">{HERO.sub}</p>
            <div className="flex flex-wrap gap-4 pt-6 sm:gap-6">
              <button
                onClick={openBookDemo}
                className="cursor-pointer rounded-full bg-fg px-btn-x py-btn-y text-base font-medium text-page transition-transform hover:scale-[1.03] hover:bg-white active:scale-[0.98]"
              >
                {HERO.primaryCta}
              </button>
              <button className="cursor-pointer rounded-full border border-fg px-btn-x py-btn-y text-base font-medium text-fg transition-transform hover:scale-[1.03] hover:bg-fg hover:text-page active:scale-[0.98]">
                {HERO.secondaryCta}
              </button>
            </div>
          </div>
        </div>

        {/* <div ref={stepsRef} className="flex flex-col gap-6 sm:flex-row opacity-0">
          {HERO.steps.map((step) => (
            <div key={step.label} className="flex flex-1 flex-col gap-1 py-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-title font-medium text-accent">{step.number}</span>
                <span className="text-title font-medium text-fg">{step.label}</span>
              </div>
              <p className="text-sm leading-relaxed text-fg-muted">{step.body}</p>
            </div>
          ))}
        </div> */}
      </div>

      <div className="relative hidden h-auto min-h-[400px] flex-1 overflow-hidden rounded-2xl border border-line lg:block">
        <video
          src="/home-new/Hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </Section>
  );
}
