import {
  UserPlus,
  MonitorPlay,
  GraduationCap,
  ClipboardList,
  BookOpen,
  FileCode,
  Headset,
  Server,
  Presentation,
  Users2,
  type LucideIcon,
} from "lucide-react";
import { USE_CASES } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";

const ICONS: Record<string, LucideIcon> = {
  UserPlus,
  MonitorPlay,
  GraduationCap,
  ClipboardList,
  BookOpen,
  FileCode,
  Headset,
  Server,
  Presentation,
  Users2,
};

export default function UseCases() {
  return (
    <Section id="use-cases" className="tone-lime flex flex-col gap-stack border-b px-gutter py-section">
      <Reveal as="div" className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-split">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
            <ClipboardList size={12} />
            {USE_CASES.badge}
          </span>
          <h2 className="max-w-xl text-h2 font-medium leading-[1.1] text-fg">
            {USE_CASES.heading}
          </h2>
        </div>
        <p className="max-w-[28em] text-lead leading-relaxed text-fg-muted lg:max-w-[min(28em,42%)] lg:pt-2">{USE_CASES.description}</p>
      </Reveal>

      <Reveal
        selector=":scope > div"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      >
        {USE_CASES.items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <div
              key={item.label}
              className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-card p-5 transition-colors hover:border-accent/50"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <Icon size={20} className="text-accent" />
              </span>
              <span className="text-sm font-medium leading-tight text-fg">{item.label}</span>
            </div>
          );
        })}
      </Reveal>
    </Section>
  );
}
