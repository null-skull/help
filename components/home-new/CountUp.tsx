"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";
import { onPreloadDone } from "@/lib/preloader-gate";

export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/^(\d+(?:\.\d+)?)/);
    if (!match || prefersReducedMotion()) {
      el.textContent = value;
      return;
    }

    const target = parseFloat(match[1]);
    const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
    const suffix = value.slice(match[1].length);

    el.textContent = `0${suffix}`;

    const { gsap } = getGsap();
    let tween: ReturnType<typeof gsap.to> | null = null;
    const start = () => {
      const proxy = { val: 0 };
      tween = gsap.to(proxy, {
        val: target,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = `${proxy.val.toFixed(decimals)}${suffix}`;
        },
      });
    };

    onPreloadDone(start);

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [value]);

  return (
    <span ref={ref} className={className} data-countup={value}>
      {value}
    </span>
  );
}
