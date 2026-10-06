"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";
import { onPreloadDone } from "@/lib/preloader-gate";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** CSS selector (relative to this wrapper) for the items to stagger. Defaults to direct children. */
  selector?: string;
  stagger?: number;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements;
};

export default function Reveal({
  children,
  className,
  selector,
  stagger = 0.1,
  y = 30,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = selector ? el.querySelectorAll(selector) : Array.from(el.children);
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      (targets as NodeListOf<HTMLElement> | HTMLElement[]).forEach((t) => {
        (t as HTMLElement).style.opacity = "1";
        (t as HTMLElement).style.transform = "none";
      });
      return;
    }

    const { gsap } = getGsap();
    gsap.set(targets, { opacity: 0, y });

    // Hold off starting the entrance animation (and measuring its scroll
    // trigger) until the preloader has finished, so above-the-fold content
    // doesn't play its reveal invisibly underneath the loading overlay.
    let tween: ReturnType<typeof gsap.to> | null = null;
    const start = () => {
      const { gsap } = getGsap();
      tween = gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    };

    onPreloadDone(start);

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // data-reveal* mirror the props so the static export (vanilla/) can
    // replay the same animation without React.
    // @ts-expect-error dynamic tag ref typing
    <Tag ref={ref} className={className} data-reveal="" data-reveal-selector={selector} data-reveal-y={y} data-reveal-stagger={stagger}>
      {children}
    </Tag>
  );
}
