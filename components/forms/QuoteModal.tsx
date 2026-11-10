"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icons";
import { buttonStyles } from "@/components/ui/Button";
import { site } from "@/data/site";
import { cn } from "@/lib/format";
import { quoteMessage, waLink } from "@/lib/whatsapp";
import { useQuote } from "./QuoteProvider";

const STORAGE_KEY = "vc-quote-nudge";

const useCases = [
  "Home / dwelling",
  "Site office",
  "Storage",
  "Retail / kiosk",
  "Cold storage",
  "Events",
  "Something else",
] as const;

const types = [
  { value: "Plain / dry", hint: "Standard cargo-worthy unit" },
  { value: "Fabricated", hint: "Cut, welded and finished to use" },
  { value: "Refrigerated", hint: "Temperature-controlled" },
  { value: "Not sure yet", hint: "We will advise on the call" },
] as const;

const sizes = ["20ft", "40ft", "40ft high cube", "Not sure yet"] as const;
const conditions = ["New", "Used – inspected", "Not sure yet"] as const;
const timelines = ["Ready now", "2–4 weeks", "Just exploring"] as const;

interface Values {
  useCase: string;
  type: string;
  size: string;
  condition: string;
  timeline: string;
  location: string;
  name: string;
  phone: string;
  notes: string;
}

const initialValues: Values = {
  useCase: "",
  type: "",
  size: "",
  condition: "",
  timeline: "",
  location: "",
  name: "",
  phone: "",
  notes: "",
};

const stepCopy = [
  {
    title: "What do you need it for?",
    body: "A quick picture of the job helps us recommend the right unit — not just the cheapest one.",
  },
  {
    title: "Size and condition.",
    body: "Not sure? Pick that option and we will guide you on the call.",
  },
  {
    title: "Where is it going?",
    body: "We deliver countrywide from our Nairobi yard. Share the town or county and any access notes.",
  },
  {
    title: "Who should we call?",
    body: "We will reply on WhatsApp with availability, a delivered price and next steps.",
  },
] as const;

function Choice({
  active,
  onClick,
  children,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-h-12 items-start justify-between gap-3 border px-4 py-3 text-left transition-colors duration-200",
        active
          ? "border-ember bg-ember/10"
          : "border-bone/15 hover:border-bone/35",
      )}
    >
      <span>
        <span
          className={cn(
            "block text-[14px] font-medium leading-tight",
            active ? "text-bone" : "text-bone/80",
          )}
        >
          {children}
        </span>
        {hint ? (
          <span className="mt-1 block text-[11px] leading-snug text-bone/40">
            {hint}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          "mt-0.5 grid h-4 w-4 shrink-0 place-items-center border",
          active
            ? "border-ember bg-ember text-ink"
            : "border-bone/25 text-transparent",
        )}
        aria-hidden="true"
      >
        <Icon name="check" className="h-2.5 w-2.5" />
      </span>
    </button>
  );
}

function FieldLabel({
  children,
  htmlFor,
  optional,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  optional?: boolean;
}) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/55"
      >
        {children}
      </label>
      {optional ? (
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-bone/30">
          Optional
        </span>
      ) : null}
    </div>
  );
}

export function QuoteModal() {
  const { isOpen, closeQuote, openQuote } = useQuote();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggered = useRef(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<Values>(initialValues);

  const update = (key: keyof Values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const stepValid =
    step === 0
      ? Boolean(values.useCase && values.type)
      : step === 1
        ? Boolean(values.size && values.condition)
        : step === 2
          ? values.location.trim().length > 1
          : values.name.trim().length > 1 &&
            values.phone.replace(/\D/g, "").length >= 9;

  useEffect(() => {
    if (!isOpen) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, "opened");
    } catch {
      /* storage can be blocked */
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previous = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeQuote();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const nodes = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => node.offsetParent !== null);

      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      previous?.focus?.();
    };
  }, [isOpen, closeQuote]);

  useEffect(() => {
    if (!isOpen && !triggered.current) {
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) triggered.current = true;
      } catch {
        /* ignore */
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen || pathname.startsWith("/contact")) return;

    let triggeredOnce = false;

    const fire = () => {
      if (triggeredOnce || triggered.current) return;
      triggeredOnce = true;
      triggered.current = true;
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) return;
        sessionStorage.setItem(STORAGE_KEY, "nudge");
      } catch {
        /* storage can be blocked */
      }
      openQuote("scroll-nudge");
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const progress =
        (window.scrollY + window.innerHeight) / Math.max(doc.scrollHeight, 1);
      if (progress >= 0.52) fire();
    };

    const onExitIntent = (event: MouseEvent) => {
      if (event.clientY <= 0) fire();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onExitIntent);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onExitIntent);
    };
  }, [isOpen, pathname, openQuote]);

  const message = quoteMessage({
    useCase: values.useCase,
    type: values.type,
    size: values.size,
    condition: values.condition,
    timeline: values.timeline,
    location: values.location.trim(),
    name: values.name.trim(),
    phone: values.phone.trim(),
    notes: values.notes.trim(),
  });
  const link = waLink(message);

  const handleNext = () => {
    if (!stepValid) return;
    setStep((current) => Math.min(3, current + 1));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stepValid) return;
    window.open(link, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  const summary = [
    ["Use", values.useCase],
    ["Type", values.type],
    ["Size", values.size],
    ["Condition", values.condition],
    ["Timeline", values.timeline || "Flexible"],
    ["Delivery", values.location.trim()],
  ].filter(([, value]) => value);

  return (
    <AnimatePresence
      onExitComplete={() => {
        setStep(0);
        setSubmitted(false);
      }}
    >
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close quote form"
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            onClick={closeQuote}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative flex max-h-[92svh] w-full max-w-2xl flex-col overflow-hidden border border-bone/15 bg-coal"
          >
            <div className="flex items-start justify-between gap-6 border-b border-bone/10 px-5 py-4 sm:px-7">
              <div>
                <p className="eyebrow text-ember">Free quote</p>
                <p className="mt-1 text-[11px] text-bone/40">
                  Four quick questions. No obligation.
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeQuote}
                aria-label="Close quote form"
                className="-mr-1 grid h-9 w-9 place-items-center border border-bone/15 text-bone/60 transition-colors hover:border-bone/40 hover:text-bone"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <div className="h-px w-full bg-bone/10">
              <div
                className="h-px bg-ember transition-[width] duration-300 ease-out"
                style={{
                  width: submitted ? "100%" : `${((step + 1) / 4) * 100}%`,
                }}
              />
            </div>

            <div className="overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
              {submitted ? (
                <div className="py-4 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-whatsapp/15 text-whatsapp">
                    <Icon name="check" className="h-7 w-7" />
                  </div>
                  <h2
                    id="quote-title"
                    className="mt-5 font-display text-2xl font-bold tracking-[-0.03em] text-bone"
                  >
                    Your request is ready
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-bone/60">
                    WhatsApp should have opened with your details. Send the
                    message and we will reply with availability, a delivered
                    price and next steps.
                  </p>
                  <div className="mx-auto mt-6 grid max-w-md gap-2.5 sm:grid-cols-2">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonStyles({ variant: "primary", size: "md" })}
                    >
                      <Icon name="whatsapp" className="h-4 w-4" />
                      Open WhatsApp
                    </a>
                    <a
                      href={site.phoneHref}
                      className={buttonStyles({ variant: "outline", size: "md" })}
                    >
                      <Icon name="phone" className="h-4 w-4" />
                      Call the yard
                    </a>
                  </div>
                  <p className="mt-5 text-[11px] text-bone/35">
                    No WhatsApp? The yard answers calls 24/7 on{" "}
                    {site.phoneDisplay}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/35">
                    Step {step + 1} of 4
                  </p>
                  <h2
                    id="quote-title"
                    tabIndex={-1}
                    className="mt-2 font-display text-[clamp(1.5rem,3.5vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-bone outline-none"
                  >
                    {stepCopy[step].title}
                  </h2>
                  <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-bone/55">
                    {stepCopy[step].body}
                  </p>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={step}
                      initial={reduce ? false : { opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduce ? undefined : { opacity: 0, x: -14 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="mt-6"
                    >
                      {step === 0 ? (
                        <div className="space-y-6">
                          <div>
                            <FieldLabel>What is it for?</FieldLabel>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                              {useCases.map((item) => (
                                <Choice
                                  key={item}
                                  active={values.useCase === item}
                                  onClick={() => update("useCase", item)}
                                >
                                  {item}
                                </Choice>
                              ))}
                            </div>
                          </div>
                          <div>
                            <FieldLabel>Which type interests you?</FieldLabel>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {types.map((item) => (
                                <Choice
                                  key={item.value}
                                  active={values.type === item.value}
                                  onClick={() => update("type", item.value)}
                                  hint={item.hint}
                                >
                                  {item.value}
                                </Choice>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {step === 1 ? (
                        <div className="space-y-6">
                          <div>
                            <FieldLabel>Size</FieldLabel>
                            <div className="grid grid-cols-2 gap-2">
                              {sizes.map((item) => (
                                <Choice
                                  key={item}
                                  active={values.size === item}
                                  onClick={() => update("size", item)}
                                >
                                  {item}
                                </Choice>
                              ))}
                            </div>
                          </div>
                          <div>
                            <FieldLabel>Condition</FieldLabel>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                              {conditions.map((item) => (
                                <Choice
                                  key={item}
                                  active={values.condition === item}
                                  onClick={() => update("condition", item)}
                                >
                                  {item}
                                </Choice>
                              ))}
                            </div>
                          </div>
                          <div>
                            <FieldLabel>Timeline</FieldLabel>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                              {timelines.map((item) => (
                                <Choice
                                  key={item}
                                  active={values.timeline === item}
                                  onClick={() => update("timeline", item)}
                                >
                                  {item}
                                </Choice>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {step === 2 ? (
                        <div className="space-y-5">
                          <div>
                            <FieldLabel htmlFor="quote-location">
                              Town or county
                            </FieldLabel>
                            <input
                              id="quote-location"
                              name="location"
                              autoComplete="address-level2"
                              value={values.location}
                              onChange={(event) =>
                                update("location", event.target.value)
                              }
                              placeholder="e.g. Nakuru, Kilifi, Athi River"
                              className="h-12 w-full rounded-[2px] border border-bone/20 bg-ink px-4 text-base text-bone placeholder:text-bone/30 focus:border-ember focus:outline-none"
                            />
                          </div>
                          <div className="border-l-2 border-ember/60 bg-ink/60 px-4 py-3">
                            <p className="text-[12px] leading-relaxed text-bone/50">
                              Delivery is quoted from our Nairobi yard. If the
                              gate, road or offload point is tight, we will say
                              so before you pay.
                            </p>
                          </div>
                          <div>
                            <FieldLabel htmlFor="quote-notes" optional>
                              Site or access notes
                            </FieldLabel>
                            <textarea
                              id="quote-notes"
                              name="notes"
                              rows={3}
                              value={values.notes}
                              onChange={(event) =>
                                update("notes", event.target.value)
                              }
                              placeholder="e.g. offload on a slope, gate is 3 m wide"
                              className="w-full resize-none rounded-[2px] border border-bone/20 bg-ink px-4 py-3 text-base text-bone placeholder:text-bone/30 focus:border-ember focus:outline-none"
                            />
                          </div>
                        </div>
                      ) : null}

                      {step === 3 ? (
                        <div className="space-y-5">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <FieldLabel htmlFor="quote-name">Name</FieldLabel>
                              <input
                                id="quote-name"
                                name="name"
                                autoComplete="name"
                                value={values.name}
                                onChange={(event) =>
                                  update("name", event.target.value)
                                }
                                placeholder="Your name"
                                className="h-12 w-full rounded-[2px] border border-bone/20 bg-ink px-4 text-base text-bone placeholder:text-bone/30 focus:border-ember focus:outline-none"
                              />
                            </div>
                            <div>
                              <FieldLabel htmlFor="quote-phone">Phone</FieldLabel>
                              <input
                                id="quote-phone"
                                name="phone"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                value={values.phone}
                                onChange={(event) =>
                                  update("phone", event.target.value)
                                }
                                placeholder="+254 7XX XXX XXX"
                                className="h-12 w-full rounded-[2px] border border-bone/20 bg-ink px-4 text-base text-bone placeholder:text-bone/30 focus:border-ember focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="border border-bone/12 bg-ink/50">
                            <p className="border-b border-bone/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/40">
                              Your request
                            </p>
                            <dl className="divide-y divide-bone/8 px-4">
                              {summary.map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-start justify-between gap-6 py-2.5"
                                >
                                  <dt className="text-[12px] text-bone/40">
                                    {key}
                                  </dt>
                                  <dd className="text-right text-[12.5px] text-bone/80">
                                    {value}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                          <p className="text-[11px] leading-relaxed text-bone/35">
                            By sending this request you agree to be contacted
                            about your enquiry. We do not share your details.
                          </p>
                        </div>
                      ) : null}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-7 flex items-center justify-between gap-4 border-t border-bone/10 pt-5">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => setStep((current) => Math.max(0, current - 1))}
                        className="inline-flex h-10 items-center gap-2 px-1 text-[13px] text-bone/55 transition-colors hover:text-bone"
                      >
                        <Icon name="chevron-left" className="h-4 w-4" />
                        Back
                      </button>
                    ) : (
                      <span className="text-[11px] text-bone/35">
                        Takes about 30 seconds.
                      </span>
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!stepValid}
                        className={buttonStyles({
                          variant: "primary",
                          size: "md",
                          className: "min-w-[8.5rem]",
                        })}
                      >
                        Continue
                        <Icon name="arrow-right" className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!stepValid}
                        className={buttonStyles({
                          variant: "primary",
                          size: "md",
                          className: "min-w-[11rem]",
                        })}
                      >
                        <Icon name="whatsapp" className="h-4 w-4" />
                        Send on WhatsApp
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
