import { Sparkles, Video, PenTool, BookOpen, ShieldCheck, Repeat, TrendingUp, Users, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { FEATURE_HUB } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";

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

const LEFT = FEATURE_HUB.items.slice(0, 4);
const RIGHT = FEATURE_HUB.items.slice(4);

const LEFT_Y = [8, 36, 64, 92];
const RIGHT_Y = [8, 36, 64, 92];

// A curved connector that sweeps toward the opposite side of the hub's
// centerline before arriving, so lines from different heights weave and
// cross each other near the middle instead of radiating in as straight spokes.
function connectorPath(x1: number, y1: number) {
  const midX = (x1 + 50) / 2;
  const mirroredY = 100 - y1;
  return `M ${x1},${y1} C ${midX},${y1} ${midX},${mirroredY} 50,50`;
}

function Node({ label, icon }: { label: string; icon: string }) {
  const Icon = ICONS[icon];
  return (
    <div className="flex size-node max-w-full flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-card p-3 text-center shadow-lg shadow-black/30 transition-colors hover:border-line-strong hover:bg-card-hover">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
        <Icon size={24} className="text-accent" />
      </span>
      <span className="text-xs font-medium leading-tight text-fg">{label}</span>
    </div>
  );
}

export default function FeatureHub() {
  return (
    <Section id="platform" className="tone-cyan flex flex-col gap-stack border-b px-gutter py-section">
      <Reveal as="div" className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-split">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
            <Sparkles size={12} />
            {FEATURE_HUB.badge}
          </span>
          <h2 className="max-w-xl text-h2 font-medium leading-[1.1] text-fg">
            {FEATURE_HUB.heading.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <p className="max-w-[28em] text-lead leading-relaxed text-fg-muted lg:max-w-[min(28em,42%)] lg:pt-2">{FEATURE_HUB.description}</p>
      </Reveal>

      {/* Desktop / tablet: radial hub diagram */}
      <div className="relative hidden h-hub-diagram w-full lg:block">
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <filter id="hub-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {LEFT.map((_, i) => (
            <path
              key={`l-${i}`}
              d={connectorPath(6, LEFT_Y[i])}
              fill="none"
              stroke="var(--hn-border)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {RIGHT.map((_, i) => (
            <path
              key={`r-${i}`}
              d={connectorPath(94, RIGHT_Y[i])}
              fill="none"
              stroke="var(--hn-border)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Glowing accent pulse traveling from each feature toward the center */}
          {LEFT.map((_, i) => (
            <path
              key={`lg-${i}`}
              className="hub-glow-line"
              d={connectorPath(6, LEFT_Y[i])}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
              filter="url(#hub-glow)"
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          ))}
          {RIGHT.map((_, i) => (
            <path
              key={`rg-${i}`}
              className="hub-glow-line"
              d={connectorPath(94, RIGHT_Y[i])}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
              filter="url(#hub-glow)"
              style={{ animationDelay: `${i * 0.35 + 0.15}s` }}
            />
          ))}
        </svg>

        {LEFT.map((item, i) => (
          <div
            key={item.label}
            className="absolute -translate-y-1/2"
            style={{ left: "6%", top: `${LEFT_Y[i]}%` }}
          >
            <Reveal as="div">
              <Node label={item.label} icon={item.icon} />
            </Reveal>
          </div>
        ))}

        {RIGHT.map((item, i) => (
          <div
            key={item.label}
            className="absolute -translate-x-full -translate-y-1/2"
            style={{ left: "94%", top: `${RIGHT_Y[i]}%` }}
          >
            <Reveal as="div">
              <Node label={item.label} icon={item.icon} />
            </Reveal>
          </div>
        ))}

        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: "50%", top: "50%" }}
        >
          <div className="relative flex size-hub items-center justify-center rounded-3xl bg-card tone-glow">
            <Image
              src="/home-new/icons/Layer_1-1.svg"
              alt="Helpperr"
              width={188}
              height={188}
              className="h-auto w-[72%]"
            />
          </div>
        </div>
      </div>

      {/* Mobile / tablet: simple grid of the same uniform boxes */}
      <div className="grid grid-cols-2 place-items-center gap-4 sm:grid-cols-4 lg:hidden">
        {FEATURE_HUB.items.map((item) => (
          <Node key={item.label} label={item.label} icon={item.icon} />
        ))}
      </div>
    </Section>
  );
}
