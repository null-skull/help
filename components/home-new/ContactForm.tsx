"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, CircleHelp, type LucideIcon } from "lucide-react";
import { CONTACT_PAGE } from "@/lib/home-new-content";
import { openBookDemo } from "@/lib/book-demo-modal";

const ICONS: Record<string, LucideIcon> = { CalendarDays, CircleHelp };

const FIELD =
  "w-full rounded-lg border border-line-strong bg-card-2 px-4 py-2.5 text-base text-fg placeholder:text-fg-subtle outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/25";

/** Side cards: alternatives to writing in (book a demo, read the FAQs). */
export function ContactOptions() {
  return (
    <div className="flex flex-col gap-4">
      {CONTACT_PAGE.side.map((item) => {
        const Icon = ICONS[item.icon];
        const inner = (
          <>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Icon size={20} />
            </span>
            <span className="flex flex-1 flex-col gap-1">
              <span className="text-base font-medium text-fg">{item.title}</span>
              <span className="text-sm leading-relaxed text-fg-muted">{item.body}</span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                {item.cta}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </>
        );
        const className =
          "group flex w-full cursor-pointer items-start gap-4 rounded-2xl border border-line bg-card p-5 text-left transition-colors hover:border-line-strong hover:bg-card-hover";

        return item.action === "demo" ? (
          <button key={item.title} type="button" onClick={openBookDemo} className={className}>
            {inner}
          </button>
        ) : (
          <Link key={item.title} href={item.action} className={className}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-card p-card py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-success text-page">
          <Check size={22} strokeWidth={2.5} />
        </span>
        <h2 className="text-title font-medium text-fg">{CONTACT_PAGE.success.title}</h2>
        <p className="max-w-sm text-sm leading-relaxed text-fg-muted">{CONTACT_PAGE.success.body}</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 cursor-pointer text-sm font-medium text-accent hover:text-primary-hover"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-5 rounded-2xl border border-line bg-card p-card"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="text-sm font-medium text-fg">
            Name
          </label>
          <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder="Jane Doe" className={FIELD} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="text-sm font-medium text-fg">
            Work email
          </label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="jane@company.com" className={FIELD} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-topic" className="text-sm font-medium text-fg">
          Topic
        </label>
        <select id="contact-topic" name="topic" defaultValue={CONTACT_PAGE.topics[0]} className={`${FIELD} cursor-pointer`}>
          {CONTACT_PAGE.topics.map((topic) => (
            <option key={topic} value={topic} className="bg-card-2">
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-fg">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className={`${FIELD} resize-y`}
        />
      </div>

      <button
        type="submit"
        className="mt-1 cursor-pointer self-start rounded-full bg-primary px-btn-x py-btn-y text-base font-medium text-fg shadow-primary transition hover:scale-[1.03] hover:bg-primary-hover active:scale-[0.98] active:bg-primary-active"
      >
        Send message
      </button>
    </form>
  );
}
