"use client";

import { useEffect, useRef, useState } from "react";
import { FEATURES } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";

// Accent-tinted gradient shown behind (or instead of, if the video file
// isn't there yet) each feature's video.
const GRADIENT = "from-accent/20 via-page to-page";

export default function FeaturesSticky() {
  const rowRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { ScrollTrigger } = getGsap();

    const triggers = itemRefs.current.map((el, i) => {
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      });
    });

    return () => {
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) video.play().catch(() => {});
      else video.pause();
    });
  }, [active]);

  return (
    <Section id="features" className="tone-peach flex flex-col gap-stack border-b px-gutter py-section">
      <Reveal as="div">
        <h2 className="max-w-heading text-h2 font-medium leading-[1.1] text-fg">
          <span className="text-fg-muted">{FEATURES.heading.muted}</span>
          <span>{FEATURES.heading.emphasis}</span>
        </h2>
      </Reveal>

      {/* Mobile / tablet: each feature carries its own inline video */}
      <div className="flex flex-col gap-10 lg:hidden">
        {FEATURES.items.map((item) => (
          <Reveal key={item.title} as="div" selector="*" className="flex flex-col gap-4">
            <div className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br ${GRADIENT}`}>
              <video
                src={item.video}
                muted
                loop
                playsInline
                preload="none"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <h3 className="text-h3 font-medium leading-[1.1] text-fg">{item.title}</h3>
            <p className="text-base leading-relaxed text-fg-muted">{item.body}</p>
          </Reveal>
        ))}
      </div>

      {/* Desktop: sticky video panel on the right, active feature drives which video plays */}
      <div ref={rowRef} className="hidden lg:flex lg:flex-row lg:gap-split">
        <div className="flex flex-col gap-stack lg:flex-1">
          {FEATURES.items.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="flex min-h-[70vh] flex-col justify-center gap-4 lg:max-w-feature-copy"
            >
              <Reveal as="div" selector="*" className="flex flex-col gap-4">
                <span className={`text-sm font-medium ${i === active ? "text-accent" : "text-fg-muted/70"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`text-h3 font-medium leading-[1.1] transition-colors ${i === active ? "text-fg" : "text-fg-muted/70"}`}>
                  {item.title}
                </h3>
                <p className="text-lead leading-relaxed text-fg-muted">{item.body}</p>
              </Reveal>
            </div>
          ))}
        </div>

        <div className="lg:flex-1">
          <div className="sticky top-24 h-sticky-panel overflow-hidden rounded-2xl">
            {FEATURES.items.map((item, i) => (
              <div
                key={item.title}
                className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ${GRADIENT} ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={item.video}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
