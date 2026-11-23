"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { ContainerSpecs } from "@/data/containers";
import {
  initialContainerActionState,
  type ContainerActionState,
} from "@/lib/actions/container-state";
import { buttonStyles } from "@/components/ui/Button";

export interface ContainerFormValues {
  id?: string;
  reference?: string;
  slug: string;
  name: string;
  shortName: string;
  type: "plain" | "fabricated" | "refrigerated";
  size: "20ft" | "40ft" | "40ft-hc";
  condition: "new" | "used";
  conditionLabel: string;
  grade: string;
  price: number;
  currency: string;
  location: string;
  deliveryInfo: string;
  refrigerationStatus:
    | "not_applicable"
    | "unverified"
    | "working"
    | "needs_service";
  lastInspectedAt: string;
  verified: boolean;
  stock: number;
  year: number;
  status:
    | "draft"
    | "available"
    | "reserved"
    | "sold"
    | "archived"
    | "unavailable"
    | "inspection";
  publicationStatus: "draft" | "published" | "archived";
  featured: boolean;
  photosAreRepresentative: boolean;
  description: string;
  highlights: string[];
  conditionNotes: string[];
  included: string[];
  features: string[];
  bestFor: string[];
  specs: ContainerSpecs;
}

const inputClass =
  "h-11 w-full border border-bone/15 bg-coal px-3 text-sm text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none";
const textareaClass =
  "w-full border border-bone/15 bg-coal px-3 py-2.5 text-sm leading-relaxed text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none";
const labelClass =
  "mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-bone/40";

function FieldError({
  errors,
  name,
}: {
  errors?: Record<string, string[]>;
  name: string;
}) {
  const message = errors?.[name]?.[0];
  if (!message) return null;
  return <p className="mt-1 text-[11px] text-red-300">{message}</p>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-bone/12 bg-ink p-5 sm:p-6">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function ContainerForm({
  action,
  initial,
  submitLabel,
}: {
  action: (
    state: ContainerActionState,
    formData: FormData,
  ) => Promise<ContainerActionState>;
  initial: ContainerFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    initialContainerActionState,
  );
  const [currency, setCurrency] = useState(initial.currency);

  return (
    <form action={formAction} className="space-y-5">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      {state.error ? (
        <p className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      <Section title="Identity">
        {initial.reference ? (
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/35">
            Reference <span className="text-bone/70">{initial.reference}</span>
          </p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="name">
              Listing name
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={initial.name}
              className={inputClass}
            />
            <FieldError errors={state.fieldErrors} name="name" />
          </div>
          <div>
            <label className={labelClass} htmlFor="shortName">
              Short name
            </label>
            <input
              id="shortName"
              name="shortName"
              required
              defaultValue={initial.shortName}
              className={inputClass}
            />
            <FieldError errors={state.fieldErrors} name="shortName" />
          </div>
          <div>
            <label className={labelClass} htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              required
              defaultValue={initial.slug}
              placeholder="20ft-dry-wind-watertight"
              className={inputClass}
            />
            <FieldError errors={state.fieldErrors} name="slug" />
          </div>
          <div>
            <label className={labelClass} htmlFor="publicationStatus">
              Publication
            </label>
            <select
              id="publicationStatus"
              name="publicationStatus"
              defaultValue={initial.publicationStatus}
              className={inputClass}
            >
              <option value="draft">Draft — not public</option>
              <option value="published">Published — visible on site</option>
              <option value="archived">Archived — hidden</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="status">
              Availability
            </label>
            <select
              id="status"
              name="status"
              defaultValue={
                ["available", "reserved", "sold", "unavailable", "inspection"].includes(
                  initial.status,
                )
                  ? initial.status
                  : "available"
              }
              className={inputClass}
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="unavailable">Unavailable</option>
              <option value="inspection">Inspection only</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              required
              defaultValue={initial.location}
              placeholder="Nairobi yard"
              className={inputClass}
            />
            <FieldError errors={state.fieldErrors} name="location" />
          </div>
          <div>
            <label className={labelClass} htmlFor="currency">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className={inputClass}
            >
              <option value="KES">KES</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="Classification and price">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="type">
              Type
            </label>
            <select
              id="type"
              name="type"
              defaultValue={initial.type}
              className={inputClass}
            >
              <option value="plain">Plain / dry</option>
              <option value="fabricated">Fabricated</option>
              <option value="refrigerated">Refrigerated</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="size">
              Size
            </label>
            <select
              id="size"
              name="size"
              defaultValue={initial.size}
              className={inputClass}
            >
              <option value="20ft">20ft</option>
              <option value="40ft">40ft</option>
              <option value="40ft-hc">40ft High Cube</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="condition">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              defaultValue={initial.condition}
              className={inputClass}
            >
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="conditionLabel">
              Condition label
            </label>
            <input
              id="conditionLabel"
              name="conditionLabel"
              defaultValue={initial.conditionLabel}
              placeholder="Used · WWT"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="grade">
              Grade
            </label>
            <input
              id="grade"
              name="grade"
              defaultValue={initial.grade}
              placeholder="B+"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="year">
              Year
            </label>
            <input
              id="year"
              name="year"
              type="number"
              min={1990}
              max={2100}
              required
              defaultValue={initial.year}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="price">
              Price ({currency})
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              step={1000}
              required
              defaultValue={initial.price}
              className={inputClass}
            />
            <FieldError errors={state.fieldErrors} name="price" />
          </div>
          <div>
            <label className={labelClass} htmlFor="stock">
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min={0}
              required
              defaultValue={initial.stock}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="refrigerationStatus">
              Refrigeration
            </label>
            <select
              id="refrigerationStatus"
              name="refrigerationStatus"
              defaultValue={initial.refrigerationStatus}
              className={inputClass}
            >
              <option value="not_applicable">Not applicable</option>
              <option value="unverified">Unverified</option>
              <option value="working">Working — tested</option>
              <option value="needs_service">Needs service</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="lastInspectedAt">
              Last inspected
            </label>
            <input
              id="lastInspectedAt"
              name="lastInspectedAt"
              type="date"
              defaultValue={initial.lastInspectedAt}
              className={inputClass}
            />
            <FieldError errors={state.fieldErrors} name="lastInspectedAt" />
          </div>
          <div className="flex flex-col justify-end gap-3 pb-1">
            <label className="flex items-center gap-2 text-xs text-bone/65">
              <input
                type="checkbox"
                name="verified"
                defaultChecked={initial.verified}
                className="h-4 w-4 accent-ember"
              />
              Verified by the yard
            </label>
            <label className="flex items-center gap-2 text-xs text-bone/65">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={initial.featured}
                className="h-4 w-4 accent-ember"
              />
              Featured on the home page
            </label>
            <label className="flex items-center gap-2 text-xs text-bone/65">
              <input
                type="checkbox"
                name="photosAreRepresentative"
                defaultChecked={initial.photosAreRepresentative}
                className="h-4 w-4 accent-ember"
              />
              Photos are yard examples
            </label>
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass} htmlFor="deliveryInfo">
            Delivery notes
          </label>
          <textarea
            id="deliveryInfo"
            name="deliveryInfo"
            rows={2}
            defaultValue={initial.deliveryInfo}
            placeholder="Delivery and offload are quoted after the site access check."
            className={textareaClass}
          />
        </div>
      </Section>

      <Section title="Copy">
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              defaultValue={initial.description}
              className={textareaClass}
            />
            <FieldError errors={state.fieldErrors} name="description" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="highlights">
                Highlights — one per line
              </label>
              <textarea
                id="highlights"
                name="highlights"
                rows={4}
                defaultValue={initial.highlights.join("\n")}
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="conditionNotes">
                Condition notes — one per line
              </label>
              <textarea
                id="conditionNotes"
                name="conditionNotes"
                rows={4}
                defaultValue={initial.conditionNotes.join("\n")}
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="included">
                Included — one per line
              </label>
              <textarea
                id="included"
                name="included"
                rows={4}
                defaultValue={initial.included.join("\n")}
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="features">
                Features — one per line
              </label>
              <textarea
                id="features"
                name="features"
                rows={4}
                defaultValue={initial.features.join("\n")}
                className={textareaClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="bestFor">
                Best for — one per line
              </label>
              <textarea
                id="bestFor"
                name="bestFor"
                rows={3}
                defaultValue={initial.bestFor.join("\n")}
                className={textareaClass}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Specifications">
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["external", "External dimensions"],
              ["internal", "Internal dimensions"],
              ["tare", "Tare weight"],
              ["payload", "Payload"],
              ["door", "Door opening"],
              ["volume", "Volume"],
              ["floor", "Floor area"],
              ["flooring", "Flooring"],
              ["ventilation", "Ventilation"],
            ] as const
          ).map(([name, label]) => (
            <div key={name}>
              <label className={labelClass} htmlFor={name}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                defaultValue={initial.specs[name]}
                className={inputClass}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="extraSpecs">
              Extra specs — one per line as Label: Value
            </label>
            <textarea
              id="extraSpecs"
              name="extraSpecs"
              rows={4}
              defaultValue={initial.specs.extra
                .map((item) => `${item.label}: ${item.value}`)
                .join("\n")}
              className={textareaClass}
            />
          </div>
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className={buttonStyles({ className: "min-w-40" })}
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/admin/containers"
          className="border border-bone/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/55 transition-colors hover:border-bone/35 hover:text-bone"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
