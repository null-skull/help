import Image from "next/image";
import { LOGO_MARQUEE } from "@/lib/home-new-content";
import Section from "@/components/home-new/Section";

export default function LogoMarquee() {
  const logos = [...LOGO_MARQUEE.logos, ...LOGO_MARQUEE.logos];

  return (
    <Section className="relative flex flex-col items-center gap-6 overflow-hidden border-b px-gutter py-3.5">
      <p className="text-base font-medium text-fg">{LOGO_MARQUEE.label}</p>

      <div className="w-full overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-[72px]">
          {logos.map((logo, i) => (
            <Image
              key={`${logo.name}-${i}`}
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={48}
              className="h-12 w-auto shrink-0 opacity-80"
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-r from-page to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-l from-page to-transparent" />
    </Section>
  );
}
