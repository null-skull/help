import { ANNOUNCEMENT } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";
import Reveal from "@/components/Reveal";

export default function AnnouncementBar() {
  return (
    <Section className="tone-yellow relative overflow-hidden border-b px-gutter py-3.5">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[15.25rem] w-[max(87.5rem,100%)] -translate-x-1/2 -translate-y-1/2 bg-repeat-x opacity-40"
        style={{ backgroundImage: "url(/home-new/stripe-texture.svg)" }}
      />
      <Reveal as="div" className="relative flex items-center gap-2.5" selector="*" y={10}>
        <span className="shrink-0 whitespace-nowrap rounded-2xl bg-accent px-4 py-1.5 text-sm font-medium tracking-[0.03em] text-page">
          {ANNOUNCEMENT.badge}
        </span>
        <p className="line-clamp-2 min-w-0 text-sm font-medium text-fg sm:truncate sm:text-base">{ANNOUNCEMENT.text}</p>
      </Reveal>
    </Section>
  );
}
