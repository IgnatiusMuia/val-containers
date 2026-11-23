"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  submitEnquiryAction,
  type EnquiryActionState,
} from "@/lib/actions/enquiries";
import { Icon } from "@/components/ui/Icons";

const interests = [
  "General enquiry",
  "Buying a container",
  "Site office or kiosk fabrication",
  "Refrigeration",
  "Container home",
  "Delivery question",
];

const fieldClass =
  "h-11 w-full border border-ink/20 bg-bone px-3 text-[13px] text-ink placeholder:text-ink/30 focus:border-ember-deep focus:outline-none";

const initialState: EnquiryActionState = {};

export function ContactForm() {
  const [state, action, pending] = useActionState(
    submitEnquiryAction,
    initialState,
  );

  if (state.ok && state.reference) {
    return (
      <div className="border border-ink/15 bg-bone-2/40 p-6 sm:p-8">
        <div className="grid h-11 w-11 place-items-center bg-ember text-ink">
          <Icon name="check" className="h-5 w-5" />
        </div>
        <h3 className="mt-5 font-display text-[26px] font-semibold tracking-[-0.03em] text-ink">
          Message saved.
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
          Your reference is{" "}
          <span className="font-mono text-ink">{state.reference}</span>. Continue
          on WhatsApp so the yard sees it immediately.
        </p>
        {state.whatsappUrl ? (
          <a
            href={state.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex h-12 items-center justify-center gap-2 bg-whatsapp text-[13px] font-medium text-white"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            Continue on WhatsApp
          </a>
        ) : null}
        <Link
          href="/enquire"
          className="mt-4 inline-flex text-[11px] text-ink/45 underline decoration-ink/20 underline-offset-4 hover:text-ink"
        >
          Open the full enquiry form
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="source" value="contact-page" />
      <input type="hidden" name="pagePath" value="/contact" />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {state.error ? (
        <p className="border border-red-700/25 bg-red-700/5 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block font-mono text-[8.5px] uppercase tracking-[0.12em] text-ink/45"
          >
            Name *
          </label>
          <input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className={fieldClass}
          />
        </div>
        <div>
          <label
            htmlFor="contact-phone"
            className="mb-1.5 block font-mono text-[8.5px] uppercase tracking-[0.12em] text-ink/45"
          >
            Phone / WhatsApp *
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+254…"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block font-mono text-[8.5px] uppercase tracking-[0.12em] text-ink/45"
          >
            Email (optional)
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.co.ke"
            className={fieldClass}
          />
        </div>
        <div>
          <label
            htmlFor="contact-interest"
            className="mb-1.5 block font-mono text-[8.5px] uppercase tracking-[0.12em] text-ink/45"
          >
            Interest
          </label>
          <select
            id="contact-interest"
            name="useCase"
            defaultValue={interests[0]}
            className={fieldClass}
          >
            {interests.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block font-mono text-[8.5px] uppercase tracking-[0.12em] text-ink/45"
        >
          What do you need? *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Size, use, delivery town, timeline — or just ask a question."
          className="w-full resize-y border border-ink/20 bg-bone px-3 py-2.5 text-[13px] leading-relaxed text-ink placeholder:text-ink/30 focus:border-ember-deep focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 bg-whatsapp text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <Icon name="whatsapp" className="h-4 w-4" />
        {pending ? "Saving…" : "Save message & open WhatsApp"}
      </button>
      <p className="text-center text-[10px] leading-relaxed text-ink/35">
        The message is saved with a reference before WhatsApp opens. No payment
        is taken on this site.
      </p>
    </form>
  );
}
