"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  AtSign,
  CircleAlert,
  CircleCheck,
  CircleX,
  LoaderCircle,
  MailCheck,
} from "lucide-react";
import { AUTH } from "@/lib/home-new-content";
import {
  AuthError,
  checkEmail,
  checkUsername,
  continueWithGoogle,
  sendMagicLink,
  signUp,
} from "@/lib/auth-client";

// ---------------------------------------------------------------------------
// Flow: email → (registered) inbox
//             → (new) username → inbox
// The email lives here in the parent, so it survives every step and is
// pre-filled again after "Change email".
// ---------------------------------------------------------------------------

type Step = { name: "email" } | { name: "username" } | { name: "inbox"; isNew: boolean };

export default function AuthFlow() {
  const [step, setStep] = useState<Step>({ name: "email" });
  const [email, setEmail] = useState("");
  // Move focus into each new step, but not on first page load (that would pop
  // the keyboard open on phones before the visitor has done anything).
  const [navigated, setNavigated] = useState(false);

  const go = (next: Step) => {
    setNavigated(true);
    setStep(next);
  };
  const changeEmail = () => go({ name: "email" });

  return (
    // Keyed by step so each screen mounts fresh and plays the entrance motion.
    <div key={step.name} className="auth-step-in">
      {step.name === "email" && (
        <EmailStep
          initialEmail={email}
          focusOnMount={navigated}
          onResult={(value, registered) => {
            setEmail(value);
            go(registered ? { name: "inbox", isNew: false } : { name: "username" });
          }}
        />
      )}
      {step.name === "username" && (
        <UsernameStep email={email} onChangeEmail={changeEmail} onDone={() => go({ name: "inbox", isNew: true })} />
      )}
      {step.name === "inbox" && <InboxStep email={email} isNew={step.isNew} onChangeEmail={changeEmail} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared pieces — the site's existing field, button and message styles.
// ---------------------------------------------------------------------------

const FIELD =
  "w-full rounded-full border bg-card-2 px-5 py-btn-y text-base text-fg placeholder:text-fg-subtle outline-none transition focus:ring-3 disabled:opacity-60";
const FIELD_OK = "border-line-strong focus:border-primary focus:ring-primary/25";
const FIELD_ERROR = "border-error focus:border-error focus:ring-error/25";

function Spinner({ className = "" }: { className?: string }) {
  return <LoaderCircle size={18} aria-hidden className={`animate-spin ${className}`} />;
}

function PrimaryButton({
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      aria-busy={loading || undefined}
      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-btn-x py-btn-y text-base font-medium text-fg shadow-primary transition hover:bg-primary-hover active:scale-[0.98] active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:bg-primary disabled:active:scale-100"
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function SecondaryButton({
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      aria-busy={loading || undefined}
      className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-line-strong bg-card-2 px-btn-x py-btn-y text-base font-medium text-fg transition hover:border-primary hover:bg-card-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-line-strong disabled:hover:bg-card-2 disabled:active:scale-100"
    >
      {children}
    </button>
  );
}

type Tone = "error" | "success" | "muted";

function Message({ id, tone, children }: { id?: string; tone: Tone; children: React.ReactNode }) {
  const Icon = tone === "error" ? CircleAlert : tone === "success" ? CircleCheck : null;
  const color = tone === "error" ? "text-error" : tone === "success" ? "text-success" : "text-fg-subtle";
  return (
    <p id={id} className={`flex items-start gap-2 text-sm leading-snug ${color}`}>
      {Icon && <Icon size={16} aria-hidden className="mt-px shrink-0" />}
      <span>{children}</span>
    </p>
  );
}

function StepHeader({ heading, sub, focus }: { heading: string; sub?: React.ReactNode; focus?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focus) ref.current?.focus();
  }, [focus]);
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {/* tabIndex -1 so focus can move here when a step replaces the form. */}
      <h1 ref={ref} tabIndex={-1} className="text-h3 font-medium leading-[1.15] text-fg outline-none">
        {heading}
      </h1>
      {sub && <p className="text-base leading-relaxed text-fg-muted">{sub}</p>}
    </div>
  );
}

/** Fills a "{key}" placeholder in copy with a highlighted node. */
function fill(template: string, key: string, node: React.ReactNode) {
  const [before, after] = template.split(`{${key}}`);
  return (
    <>
      {before}
      {node}
      {after}
    </>
  );
}

// ---------------------------------------------------------------------------
// 1. Email
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function EmailStep({
  initialEmail,
  focusOnMount,
  onResult,
}: {
  initialEmail: string;
  focusOnMount: boolean;
  onResult: (email: string, registered: boolean) => void;
}) {
  const copy = AUTH.email;
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  useEffect(() => {
    if (!focusOnMount) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [focusOnMount]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending || googlePending) return; // no duplicate submissions

    const email = value.trim();
    const problem = !email ? copy.errors.required : !EMAIL_RE.test(email) ? copy.errors.invalid : null;
    if (problem) {
      setError(problem);
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setGoogleError(null);
    setPending(true);
    try {
      const { registered } = await checkEmail(email);
      onResult(email.toLowerCase(), registered);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Something went wrong. Please try again.");
      setPending(false);
    }
  }

  async function google() {
    if (pending || googlePending) return;
    setError(null);
    setGoogleError(null);
    setGooglePending(true);
    try {
      await continueWithGoogle();
    } catch (err) {
      setGoogleError(err instanceof AuthError ? err.message : "Google sign-in failed. Please try again.");
    } finally {
      setGooglePending(false);
    }
  }

  const busy = pending || googlePending;

  return (
    <div className="flex flex-col gap-7">
      <StepHeader heading={copy.heading} sub={copy.sub} />

      <form noValidate onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={inputId} className="text-sm font-medium text-fg">
            {copy.label}
          </label>
          <input
            ref={inputRef}
            id={inputId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={copy.placeholder}
            value={value}
            disabled={pending}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`${FIELD} ${error ? FIELD_ERROR : FIELD_OK}`}
          />
          {error && (
            <div role="alert">
              <Message id={errorId} tone="error">
                {error}
              </Message>
            </div>
          )}
        </div>

        <PrimaryButton type="submit" loading={pending} disabled={googlePending}>
          {copy.cta}
        </PrimaryButton>
      </form>

      <div className="flex items-center gap-4" role="separator" aria-label={copy.divider}>
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs font-medium uppercase tracking-widest text-fg-subtle">{copy.divider}</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="flex flex-col gap-3">
        <SecondaryButton type="button" onClick={google} loading={googlePending} disabled={pending}>
          {googlePending ? <Spinner /> : <GoogleMark />}
          {copy.google}
        </SecondaryButton>
        {googleError && (
          <div role="alert">
            <Message tone="error">{googleError}</Message>
          </div>
        )}
      </div>

      <p className="text-center text-xs leading-relaxed text-fg-subtle">
        {copy.legal.prefix}{" "}
        <a href={copy.legal.privacy.href} className="text-fg-muted underline underline-offset-2 transition-colors hover:text-fg">
          {copy.legal.privacy.label}
        </a>{" "}
        {copy.legal.join}{" "}
        <a href={copy.legal.terms.href} className="text-fg-muted underline underline-offset-2 transition-colors hover:text-fg">
          {copy.legal.terms.label}
        </a>
        .
      </p>
      {/* Visually hidden status so screen readers hear the request start. */}
      <span className="sr-only" aria-live="polite">
        {busy ? "Working…" : ""}
      </span>
    </div>
  );
}

// Google's multicolour "G" brand mark (public/home-new/icons/google.svg).
function GoogleMark() {
  return (
    <Image
      src="/home-new/icons/google.svg"
      alt=""
      width={18}
      height={18}
      className="size-[1.125rem] shrink-0"
    />
  );
}

// ---------------------------------------------------------------------------
// 2. Username (new users)
// ---------------------------------------------------------------------------

type Availability = "idle" | "checking" | "available" | "taken" | "error";

function formatProblem(value: string): string | null {
  const e = AUTH.username.errors;
  if (!value) return e.required;
  if (!/^[a-z]/.test(value)) return e.start;
  if (!/^[a-z0-9._-]+$/.test(value)) return e.chars;
  if (value.length < 3) return e.tooShort;
  if (value.length > 20) return e.tooLong;
  return null;
}

function UsernameStep({
  email,
  onChangeEmail,
  onDone,
}: {
  email: string;
  onChangeEmail: () => void;
  onDone: () => void;
}) {
  const copy = AUTH.username;
  const inputId = useId();
  const statusId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [availability, setAvailability] = useState<Availability>("idle");
  const [checkError, setCheckError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Debounce + ignore stale responses: only the latest typed value may update
  // the availability state.
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef("");

  useEffect(() => {
    inputRef.current?.focus();
    return () => clearTimeout(timer.current);
  }, []);

  function scheduleCheck(next: string) {
    clearTimeout(timer.current);
    latest.current = next;
    if (formatProblem(next)) {
      setAvailability("idle");
      return;
    }
    setAvailability("checking");
    timer.current = setTimeout(async () => {
      try {
        const { available } = await checkUsername(next);
        if (latest.current === next) setAvailability(available ? "available" : "taken");
      } catch (err) {
        if (latest.current !== next) return;
        setCheckError(err instanceof AuthError ? err.message : "Couldn't check this username.");
        setAvailability("error");
      }
    }, 400);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (submitting || availability !== "available") {
      if (formatProblem(value)) inputRef.current?.focus();
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      await signUp(email, value);
      onDone();
    } catch (err) {
      const message = err instanceof AuthError ? err.message : "Something went wrong. Please try again.";
      setSubmitError(message);
      if (message.toLowerCase().includes("taken")) setAvailability("taken");
      setSubmitting(false);
      inputRef.current?.focus();
    }
  }

  // What to show under the field, in priority order.
  const problem = formatProblem(value);
  // Hide "too short / required" while the user is still typing their first
  // characters; show every other rule as soon as it's broken.
  const showProblem = problem && (touched || (value.length > 0 && problem !== copy.errors.tooShort));
  let status: React.ReactNode;
  let invalid = false;
  if (submitError) {
    status = <Message tone="error">{submitError}</Message>;
    invalid = true;
  } else if (showProblem) {
    status = <Message tone="error">{problem}</Message>;
    invalid = true;
  } else if (availability === "checking") {
    status = (
      <p className="flex items-center gap-2 text-sm text-fg-muted">
        <Spinner className="size-4" />
        {copy.status.checking}
      </p>
    );
  } else if (availability === "available") {
    status = <Message tone="success">{copy.status.available.replace("{username}", value)}</Message>;
  } else if (availability === "taken") {
    status = (
      <p className="flex items-start gap-2 text-sm leading-snug text-error">
        <CircleX size={16} aria-hidden className="mt-px shrink-0" />
        <span>{copy.status.taken.replace("{username}", value)}</span>
      </p>
    );
    invalid = true;
  } else if (availability === "error") {
    status = <Message tone="error">{checkError}</Message>;
    invalid = true;
  } else {
    status = <Message tone="muted">{copy.hint}</Message>;
  }

  return (
    <div className="flex flex-col gap-7">
      <StepHeader heading={copy.heading} sub={copy.sub} />

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line bg-card-2 px-4 py-3 text-sm text-fg-muted">
        {copy.signingUpAs}
        <strong className="min-w-0 break-all font-medium text-fg">{email}</strong>
        <button
          type="button"
          onClick={onChangeEmail}
          disabled={submitting}
          className="ml-auto cursor-pointer font-medium text-accent transition-colors hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copy.change}
        </button>
      </p>

      <form noValidate onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={inputId} className="text-sm font-medium text-fg">
            {copy.label}
          </label>
          <div className="relative">
            <AtSign size={16} aria-hidden className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              ref={inputRef}
              id={inputId}
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={20}
              placeholder={copy.placeholder}
              value={value}
              disabled={submitting}
              onChange={(e) => {
                // Usernames are lowercase and can't contain spaces.
                const next = e.target.value.toLowerCase().replace(/\s+/g, "");
                setValue(next);
                setSubmitError(null);
                setCheckError(null);
                scheduleCheck(next);
              }}
              onBlur={() => setTouched(true)}
              aria-invalid={invalid || undefined}
              aria-describedby={statusId}
              className={`${FIELD} pl-11 pr-12 ${invalid ? FIELD_ERROR : FIELD_OK}`}
            />
            {/* Trailing indicator mirrors the status line. */}
            <span aria-hidden className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
              {availability === "checking" && !showProblem && <Spinner className="size-4 text-fg-muted" />}
              {availability === "available" && !submitError && !showProblem && <CircleCheck size={18} className="text-success" />}
              {invalid && <CircleX size={18} className="text-error" />}
            </span>
          </div>
          <div id={statusId} aria-live="polite">
            {status}
          </div>
        </div>

        <PrimaryButton type="submit" loading={submitting} disabled={availability !== "available"}>
          {copy.cta}
        </PrimaryButton>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Check your inbox (existing and new users)
// ---------------------------------------------------------------------------

const RESEND_COOLDOWN_MS = 30_000;

function InboxStep({
  email,
  isNew,
  onChangeEmail,
}: {
  email: string;
  isNew: boolean;
  onChangeEmail: () => void;
}) {
  const copy = AUTH.inbox;
  // A link was just sent on the way here, so resending starts on cooldown.
  const [cooldownUntil, setCooldownUntil] = useState(() => Date.now() + RESEND_COOLDOWN_MS);
  const [now, setNow] = useState(() => Date.now());
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null);

  const secondsLeft = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));

  // Tick once a second while the cooldown runs.
  useEffect(() => {
    if (cooldownUntil <= Date.now()) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= cooldownUntil) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  async function resend() {
    if (resending || secondsLeft > 0) return;
    setNotice(null);
    setResending(true);
    try {
      await sendMagicLink(email);
      setNotice({ tone: "success", text: copy.resent });
      const t = Date.now();
      setNow(t);
      setCooldownUntil(t + RESEND_COOLDOWN_MS);
    } catch (err) {
      setNotice({ tone: "error", text: err instanceof AuthError ? err.message : "Couldn't resend the link. Please try again." });
    } finally {
      setResending(false);
    }
  }

  const emailNode = <strong className="break-all font-medium text-fg">{email}</strong>;

  return (
    <div className="flex flex-col gap-7">
      <span className="flex size-14 items-center justify-center self-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
        <MailCheck size={26} aria-hidden />
      </span>

      <StepHeader heading={copy.heading} sub={fill(isNew ? copy.newUser : copy.existing, "email", emailNode)} focus />

      <div className="flex flex-col gap-3">
        <SecondaryButton type="button" onClick={resend} loading={resending} disabled={secondsLeft > 0}>
          {resending && <Spinner />}
          {resending
            ? copy.resending
            : secondsLeft > 0
              ? copy.cooldown.replace("{seconds}", String(secondsLeft))
              : copy.resend}
        </SecondaryButton>
        <div aria-live="polite">{notice && <Message tone={notice.tone}>{notice.text}</Message>}</div>
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-line pt-6 text-center">
        <button
          type="button"
          onClick={onChangeEmail}
          className="inline-flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-primary-hover"
        >
          <ArrowLeft size={16} aria-hidden />
          {copy.change}
        </button>
        <p className="text-sm text-fg-subtle">{copy.help}</p>
      </div>
    </div>
  );
}
