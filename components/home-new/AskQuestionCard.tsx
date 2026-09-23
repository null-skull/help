import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FAQ_ASK } from "@/lib/home-new-content";

// Support card under the FAQ heading: a slate, checker-tiled panel with a
// cut-out portrait on the left whose head rises above the card's top edge,
// and a short prompt + link to the contact page on the right.
export default function AskQuestionCard() {
  return (
    // pt-* is headroom for the portrait to overflow the card's top edge.
    <Link href={FAQ_ASK.href} className="group relative block sm:pt-12">
      <div className="relative isolate overflow-hidden rounded-2xl border border-line-strong  from-line-strong to-card-2 transition-colors group-hover:border-accent/50">
        <div aria-hidden className="card-tiles absolute inset-0 -z-10 opacity-40" />

        <div className="flex min-h-[14rem] flex-col justify-between gap-6 p-card sm:ml-[42%] sm:items-end sm:text-right">
          <div className="flex flex-col gap-2">
            <span className="text-base font-semibold text-fg">{FAQ_ASK.title}</span>
            <p className="max-w-[22rem] text-sm leading-relaxed text-fg-muted">{FAQ_ASK.body}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-3 border-b border-fg pb-2 text-lg font-medium text-fg transition-colors group-hover:border-accent group-hover:text-accent">
            {FAQ_ASK.cta}
            <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>

      {/* Sits on the card's bottom edge and is taller than the card, so the
          head pokes out above it. Hidden on phones, where the card is too
          narrow to share with text. */}
      <Image
        src="/home-new/faq-support.png"
        alt=""
        width={240}
        height={332}
        className="pointer-events-none absolute bottom-px left-[5%] hidden h-[calc(100%-1px)] w-auto select-none transition-transform duration-500 group-hover:-translate-y-1 sm:block"
      />
    </Link>
  );
}
