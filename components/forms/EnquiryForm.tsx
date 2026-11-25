"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  submitEnquiryAction,
  type EnquiryActionState,
} from "@/lib/actions/enquiries";
import { buttonStyles } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";

export interface EnquiryContainerOption {
  id: string;
  label: string;
  reference: string;
}

const initialState: EnquiryActionState = {};

const inputClass =
  "h-11 w-full border border-ink/20 bg-bone px-3 text-[13px] text-ink placeholder:text-ink/50 focus:border-ember-deep focus:outline-2 focus:outline-offset-2 focus:outline-ember-deep";
const labelClass =
  "mb-1.5 block font-mono text-[8.5px] uppercase tracking-[0.12em] text-ink/60";
const textareaClass =
  "w-full resize-y border border-ink/20 bg-bone px-3 py-2.5 text-[13px] leading-relaxed text-ink placeholder:text-ink/50 focus:border-ember-deep focus:outline-2 focus:outline-offset-2 focus:outline-ember-deep";

function FieldError({
  errors,
  name,
}: {
  errors?: Record<string, string[]>;
  name: string;
}) {
  const message = errors?.[name]?.[0];
  if (!message) return null;
  return (
    <p id={`${name}-error`} role="alert" className="mt-1 text-[11px] text-red-700">
      {message}
    </p>
  );
}

export function EnquiryForm({
  containers,
  defaultContainerId = "",
  source = "enquire-page",
  pagePath = "/enquire",
}: {
  containers: EnquiryContainerOption[];
  defaultContainerId?: string;
  source?: string;
  pagePath?: string;
}) {
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
        <h2 className="mt-5 font-display text-[26px] font-semibold tracking-[-0.03em] text-ink">
          Enquiry saved.
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
          Your reference is{" "}
          <span className="font-mono text-ink">{state.reference}</span>. Send
          the prepared message on WhatsApp so the yard sees it immediately.
        </p>
        {state.whatsappUrl ? (
          <a
            href={state.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex h-12 items-center justify-center gap-2 bg-whatsapp text-[13px] font-medium text-ink transition-opacity hover:opacity-90"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            Continue on WhatsApp
          </a>
        ) : null}
        <Link
          href="/enquire"
          className="mt-4 inline-flex text-[11px] text-ink/60 underline decoration-ink/20 underline-offset-4 hover:text-ink"
        >
          Send another enquiry
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="pagePath" value={pagePath} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {state.error ? (
        <p
          role="alert"
          className="border border-red-700/25 bg-red-700/5 px-3 py-2 text-sm text-red-800"
        >
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="enquiry-name" className={labelClass}>
            Name *
          </label>
          <input
            id="enquiry-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={Boolean(state.fieldErrors?.name)}
            aria-describedby={
              state.fieldErrors?.name ? "name-error" : undefined
            }
            className={inputClass}
          />
          <FieldError errors={state.fieldErrors} name="name" />
        </div>
        <div>
          <label htmlFor="enquiry-phone" className={labelClass}>
            Phone / WhatsApp *
          </label>
          <input
            id="enquiry-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+254…"
            aria-invalid={Boolean(state.fieldErrors?.phone)}
            aria-describedby={
              state.fieldErrors?.phone ? "phone-error" : undefined
            }
            className={inputClass}
          />
          <FieldError errors={state.fieldErrors} name="phone" />
        </div>
        <div>
          <label htmlFor="enquiry-email" className={labelClass}>
            Email
          </label>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.co.ke"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={
              state.fieldErrors?.email ? "email-error" : undefined
            }
            className={inputClass}
          />
          <FieldError errors={state.fieldErrors} name="email" />
        </div>
        <div>
          <label htmlFor="enquiry-company" className={labelClass}>
            Company
          </label>
          <input
            id="enquiry-company"
            name="company"
            autoComplete="organization"
            placeholder="Optional"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="enquiry-container" className={labelClass}>
            Container
          </label>
          <select
            id="enquiry-container"
            name="containerId"
            defaultValue={defaultContainerId}
            className={inputClass}
          >
            <option value="">Not sure / general enquiry</option>
            {containers.map((container) => (
              <option key={container.id} value={container.id}>
                {container.label} · {container.reference}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="enquiry-quantity" className={labelClass}>
            Quantity
          </label>
          <input
            id="enquiry-quantity"
            name="quantity"
            type="number"
            min={1}
            max={1000}
            defaultValue={1}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="enquiry-condition" className={labelClass}>
            Condition preference
          </label>
          <select
            id="enquiry-condition"
            name="conditionPreference"
            className={inputClass}
            defaultValue=""
          >
            <option value="">Any / advise me</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>
        <div>
          <label htmlFor="enquiry-timeline" className={labelClass}>
            Timeline
          </label>
          <input
            id="enquiry-timeline"
            name="timeline"
            placeholder="e.g. within 2 weeks"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="enquiry-location" className={labelClass}>
            Delivery location
          </label>
          <input
            id="enquiry-location"
            name="deliveryLocation"
            placeholder="Town or site"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="enquiry-county" className={labelClass}>
            County
          </label>
          <input
            id="enquiry-county"
            name="deliveryCounty"
            placeholder="Optional"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="enquiry-use" className={labelClass}>
          What is it for?
        </label>
        <input
          id="enquiry-use"
          name="useCase"
          placeholder="Storage, site office, kiosk, cold storage…"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="enquiry-message" className={labelClass}>
          Requirements *
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          required
          rows={5}
          placeholder="Size, quantity, site access, power, finish — anything that helps us quote accurately."
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={
            state.fieldErrors?.message ? "message-error" : undefined
          }
          className={textareaClass}
        />
        <FieldError errors={state.fieldErrors} name="message" />
      </div>

      <div>
        <label htmlFor="enquiry-photo" className={labelClass}>
          Site photo or reference image (optional)
        </label>
        <input
          id="enquiry-photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-[11px] text-ink/50 file:mr-3 file:border-0 file:bg-ink/8 file:px-3 file:py-2 file:font-mono file:text-[9px] file:uppercase file:tracking-[0.12em] file:text-ink/65"
        />
        <p className="mt-1 text-[10px] text-ink/35">
          JPEG, PNG or WebP, up to 8 MB. Stored privately for the yard.
        </p>
      </div>

      <div>
        <label htmlFor="enquiry-contact-method" className={labelClass}>
          Preferred reply
        </label>
        <select
          id="enquiry-contact-method"
          name="preferredContact"
          defaultValue="whatsapp"
          className={inputClass}
        >
          <option value="whatsapp">WhatsApp</option>
          <option value="phone">Phone call</option>
          <option value="email">Email</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className={buttonStyles({
          variant: "dark",
          size: "lg",
          className: "w-full",
        })}
      >
        {pending ? "Saving enquiry…" : "Save enquiry & open WhatsApp"}
      </button>
      <p className="text-center text-[10px] leading-relaxed text-ink/35">
        We save the enquiry first so it is not lost, then open WhatsApp with the
        reference filled in. No payment is taken on this site.
      </p>
    </form>
  );
}
