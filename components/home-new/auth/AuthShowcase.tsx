"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  PenTool,
  Repeat,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { AUTH, FEATURE_HUB } from "@/lib/home-new-content";
import { prefersReducedMotion } from "@/lib/gsap";

const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Video,
  PenTool,
  BookOpen,
  ShieldCheck,
  Repeat,
  TrendingUp,
  Users,
};

// The eight platform features sit on a 3×3 grid around the Helpperr hub
// (percent positions inside the square diagram).
const EDGE = 14;
const POSITIONS: [number, number][] = [
  [EDGE, EDGE],
  [50, EDGE],
  [100 - EDGE, EDGE],
  [100 - EDGE, 50],
  [100 - EDGE, 100 - EDGE],
  [50, 100 - EDGE],
  [EDGE, 100 - EDGE],
  [EDGE, 50],
];

const ROTATE_MS = 6000;

/**
 * Right-hand panel of the login screen: the platform hub diagram (same
 * features, icons and accent pulse as the home page's Platform section) with
 * a rotating caption above it.
 */
export default function AuthShowcase() {
  const slides = AUTH.showcase;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  const slide = slides[index];
  const items = FEATURE_HUB.items.slice(0, POSITIONS.length);

  return (
    <div
      className="relative isolate flex h-full flex-col items-center justify-center gap-14 overflow-hidden rounded-2xl border border-line bg-card px-card py-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-[58%] -z-10 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      {/* Rotating caption — keyed so each one eases in. */}
      <div aria-live="polite" className="flex min-h-[5.5rem] max-w-[28rem] flex-col items-center gap-2 text-center">
        <div key={index} className="auth-step-in flex flex-col items-center gap-2">
          <h2 className="text-title font-medium text-fg">{slide.heading}</h2>
          <p className="text-sm leading-relaxed text-fg-muted">{slide.sub}</p>
        </div>
      </div>

      {/* Hub diagram */}
      <div aria-hidden className="relative aspect-square w-full max-w-[26rem]">
        <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="auth-hub-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="1.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dotted frame around the outer ring */}
          <polygon
            points={POSITIONS.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke="var(--hn-border-strong)"
            strokeWidth="1"
            strokeDasharray="2 4"
            vectorEffect="non-scaling-stroke"
          />
          {/* Dotted spokes into the hub */}
          {POSITIONS.map(([x, y], i) => (
            <line
              key={`s-${i}`}
              x1={x}
              y1={y}
              x2={50}
              y2={50}
              stroke="var(--hn-border-strong)"
              strokeWidth="1"
              strokeDasharray="2 4"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* Accent pulse travelling into the hub (same animation as Platform) */}
          {POSITIONS.map(([x, y], i) => (
            <line
              key={`g-${i}`}
              className="hub-glow-line"
              x1={x}
              y1={y}
              x2={50}
              y2={50}
              stroke="var(--accent)"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
              filter="url(#auth-hub-glow)"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </svg>

        {items.map((item, i) => {
          const Icon = ICONS[item.icon];
          const [x, y] = POSITIONS[i];
          return (
            <div
              key={item.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span className="flex size-12 items-center justify-center rounded-xl border border-line-strong bg-card-2 text-accent shadow-lg shadow-black/40">
                <Icon size={20} />
              </span>
              <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-card/90 px-1.5 py-0.5 text-xs font-medium text-fg-muted">
                {item.label}
              </span>
            </div>
          );
        })}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="tone-glow flex size-20 items-center justify-center rounded-2xl border border-line-strong bg-card">
            <Image src="/home-new/icons/Layer_1-1.svg" alt="" width={188} height={188} className="size-12" />
          </span>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.heading}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show message ${i + 1} of ${slides.length}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-accent" : "w-1.5 bg-fg-subtle/50 hover:bg-fg-subtle"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
