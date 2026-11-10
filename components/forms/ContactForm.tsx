"use client";

import { useState, type FormEvent } from "react";
import { contactMessage, waLink } from "@/lib/whatsapp";
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

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(interests[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = waLink(
      contactMessage({ name, phone, email, interest, message }),
    );
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="border border-ink/15 bg-bone-2/40 p-6 sm:p-8">
        <div className="grid h-11 w-11 place-items-center bg-ember text-ink">
          <Icon name="check" className="h-5 w-5" />
        </div>
        <h3 className="mt-5 font-display text-[26px] font-semibold tracking-[-0.03em] text-ink">
          WhatsApp is open.
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
          If the message did not open, use the link below. We reply during yard
          hours and usually within a few minutes.
        </p>
        <a
          href={waLink(
            contactMessage({ name, phone, email, interest, message }),
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex h-12 items-center justify-center gap-2 bg-whatsapp text-[13px] font-medium text-white"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          Open WhatsApp again
        </a>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 text-[11px] text-ink/45 underline decoration-ink/20 underline-offset-4 hover:text-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            value={name}
            onChange={(event) => setName(event.target.value)}
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
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            name="interest"
            value={interest}
            onChange={(event) => setInterest(event.target.value)}
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
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Size, use, delivery town, timeline — or just ask a question."
          className="w-full resize-y border border-ink/20 bg-bone px-3 py-2.5 text-[13px] leading-relaxed text-ink placeholder:text-ink/30 focus:border-ember-deep focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-2 bg-whatsapp text-[13px] font-medium text-white transition-opacity hover:opacity-90"
      >
        <Icon name="whatsapp" className="h-4 w-4" />
        Send on WhatsApp
      </button>
      <p className="text-center text-[10px] leading-relaxed text-ink/35">
        This opens WhatsApp with your message ready to send. No account or form
        database is involved.
      </p>
    </form>
  );
}
