import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FAQ_ASK } from "@/lib/home-new-content";

// Support card under the FAQ heading: a checker-tiled panel with a short
// prompt and a link to the contact page.
export default function AskQuestionCard() {
  return (
    <Link href={FAQ_ASK.href} className="group block">
      <div className="relative isolate overflow-hidden rounded-2xl border border-line-strong transition-colors group-hover:border-accent/50">
        <div aria-hidden className="card-tiles absolute inset-0 -z-10 opacity-40" />

        <div className="flex flex-col gap-6 p-card">
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
    </Link>
  );
}
