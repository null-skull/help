import { STATS } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/home-new/CountUp";

export default function Stats() {
  return (
    <Section className="flex flex-col gap-stack border-b px-gutter py-section">
      <Reveal as="div">
        <h2 className="max-w-heading text-h2 font-medium leading-[1.1]">
          <span className="text-fg-muted">{STATS.heading.muted}</span>
          <span className="text-fg">{STATS.heading.emphasis}</span>
        </h2>
      </Reveal>

      <Reveal
        selector=":scope > div"
        className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-8 rounded-2xl px-inset py-6"
      >
        {STATS.items.map((stat) => (
          <div key={stat.label} className="flex flex-col items-start justify-center gap-1 py-2">
            <CountUp
              value={stat.value}
              className="text-display font-medium leading-[1.1] text-fg"
            />
            <span className="text-lead text-fg-muted">{stat.label}</span>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
