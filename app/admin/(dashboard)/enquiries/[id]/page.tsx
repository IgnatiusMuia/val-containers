import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/format";
import {
  addEnquiryNoteAction,
  addEnquiryQuotationAction,
  assignEnquiryAction,
  updateEnquiryStatusAction,
  updateFollowUpAction,
} from "@/lib/actions/enquiry-admin";
import {
  enquiryStatusLabels,
  enquiryStatuses,
  type EnquiryStatus,
} from "@/lib/enquiry-status";
import { Icon } from "@/components/ui/Icons";

export const instant = false;

interface Enquiry {
  id: string;
  reference: string;
  customer_name: string;
  phone: string;
  email: string | null;
  company: string | null;
  preferred_contact: string;
  container_name: string | null;
  container_slug: string | null;
  container_reference: string | null;
  container_size: string | null;
  condition_preference: string | null;
  quantity: number | null;
  delivery_location: string | null;
  delivery_county: string | null;
  timeline: string | null;
  use_case: string | null;
  message: string | null;
  source: string;
  page_path: string | null;
  status: EnquiryStatus;
  assigned_to: string | null;
  follow_up_at: string | null;
  quotation_total: number | null;
  created_at: string;
  updated_at: string;
}

interface Note {
  id: string;
  author_id: string | null;
  body: string;
  created_at: string;
}

interface Quotation {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  delivery_included: boolean;
  valid_until: string | null;
  notes: string | null;
  created_at: string;
}

interface Activity {
  id: string;
  action: string;
  detail: Record<string, unknown>;
  created_at: string;
}

interface Attachment {
  id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  url: string | null;
}

const statusStyles: Record<string, string> = {
  new: "border-ember/40 bg-ember/10 text-ember",
  under_review: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  contacted: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  awaiting_customer: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  quotation_discussed: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  negotiation: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  converted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  closed: "border-bone/20 bg-bone/5 text-bone/45",
  cancelled: "border-red-500/30 bg-red-500/10 text-red-200",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function customerWhatsApp(phone: string, reference: string, name: string) {
  const digits = phone.replace(/\D/g, "");
  const message = `Hi ${name}, this is Val Containers following up on your enquiry ${reference}.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = await requireAdmin("enquiries");
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();
  const enquiry = data as unknown as Enquiry;

  const [notesResult, quotesResult, activityResult, attachmentsResult] =
    await Promise.all([
      supabase
        .from("enquiry_notes")
        .select("id, author_id, body, created_at")
        .eq("enquiry_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("enquiry_quotations")
        .select(
          "id, reference, amount, currency, delivery_included, valid_until, notes, created_at",
        )
        .eq("enquiry_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("enquiry_activity")
        .select("id, action, detail, created_at")
        .eq("enquiry_id", id)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("enquiry_attachments")
        .select("id, file_name, mime_type, file_size, storage_path")
        .eq("enquiry_id", id)
        .order("created_at", { ascending: true }),
    ]);

  const notes = (notesResult.data ?? []) as unknown as Note[];
  const quotations = (quotesResult.data ?? []) as unknown as Quotation[];
  const activity = (activityResult.data ?? []) as unknown as Activity[];
  const rawAttachments = (attachmentsResult.data ?? []) as unknown as Omit<
    Attachment,
    "url"
  >[];

  const attachments: Attachment[] = await Promise.all(
    rawAttachments.map(async (item) => {
      const { data: signed } = await supabase.storage
        .from("enquiry-media")
        .createSignedUrl(item.storage_path, 60 * 60);
      return { ...item, url: signed?.signedUrl ?? null };
    }),
  );

  return (
    <div>
      <Link
        href="/admin/enquiries"
        className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35 transition-colors hover:text-bone"
      >
        ← Enquiries
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember">
              {enquiry.reference}
            </p>
            <span
              className={`inline-flex border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] ${
                statusStyles[enquiry.status] ?? statusStyles.closed
              }`}
            >
              {enquiryStatusLabels[enquiry.status]}
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-bone sm:text-4xl">
            {enquiry.customer_name}
          </h1>
          <p className="mt-2 font-mono text-[10px] text-bone/35">
            {formatDateTime(enquiry.created_at)} · {enquiry.source}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={customerWhatsApp(
              enquiry.phone,
              enquiry.reference,
              enquiry.customer_name,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 bg-whatsapp px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white"
          >
            <Icon name="whatsapp" className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <a
            href={`tel:${enquiry.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex h-9 items-center gap-2 border border-bone/15 px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/55 transition-colors hover:border-bone/35 hover:text-bone"
          >
            <Icon name="phone" className="h-3.5 w-3.5" />
            Call
          </a>
          {enquiry.email ? (
            <a
              href={`mailto:${enquiry.email}`}
              className="inline-flex h-9 items-center gap-2 border border-bone/15 px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/55 transition-colors hover:border-bone/35 hover:text-bone"
            >
              <Icon name="mail" className="h-3.5 w-3.5" />
              Email
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <section className="border border-bone/12 bg-ink p-5">
            <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
              Requirements
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-[13.5px] leading-relaxed text-bone/70">
              {enquiry.message || "No message provided."}
            </p>

            <dl className="mt-5 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2">
              {[
                ["Phone", enquiry.phone],
                ["Email", enquiry.email || "—"],
                ["Company", enquiry.company || "—"],
                ["Preferred reply", enquiry.preferred_contact],
                ["Container", enquiry.container_name || "General"],
                ["Container ref", enquiry.container_reference || "—"],
                ["Size", enquiry.container_size || "—"],
                ["Quantity", enquiry.quantity ? String(enquiry.quantity) : "—"],
                ["Condition", enquiry.condition_preference || "—"],
                [
                  "Delivery",
                  [enquiry.delivery_location, enquiry.delivery_county]
                    .filter(Boolean)
                    .join(", ") || "—",
                ],
                ["Timeline", enquiry.timeline || "—"],
                ["Use", enquiry.use_case || "—"],
              ].map(([label, value]) => (
                <div key={label} className="bg-ink p-3">
                  <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-bone/25">
                    {label}
                  </dt>
                  <dd className="mt-1 text-[12px] leading-snug text-bone/65">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {enquiry.container_slug ? (
              <Link
                href={`/containers/${enquiry.container_slug}`}
                target="_blank"
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-ember"
              >
                View public listing
                <Icon name="arrow-up-right" className="h-3 w-3" />
              </Link>
            ) : null}
          </section>

          <section className="border border-bone/12 bg-ink p-5">
            <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
              Internal notes
            </h2>
            <form action={addEnquiryNoteAction} className="mt-4">
              <input type="hidden" name="id" value={enquiry.id} />
              <textarea
                name="body"
                rows={3}
                required
                placeholder="Add a note for the yard team…"
                className="w-full border border-bone/15 bg-coal px-3 py-2 text-sm text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none"
              />
              <button
                type="submit"
                className="mt-2 h-9 border border-bone/15 px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/55 transition-colors hover:border-bone/35 hover:text-bone"
              >
                Add note
              </button>
            </form>
            <ul className="mt-4 divide-y divide-bone/8">
              {notes.map((note) => (
                <li key={note.id} className="py-3">
                  <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-bone/65">
                    {note.body}
                  </p>
                  <p className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-bone/25">
                    {formatDateTime(note.created_at)}
                    {note.author_id === user.id ? " · you" : ""}
                  </p>
                </li>
              ))}
              {notes.length === 0 ? (
                <li className="py-3 text-sm text-bone/35">No notes yet.</li>
              ) : null}
            </ul>
          </section>

          <section className="border border-bone/12 bg-ink p-5">
            <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
              Quotations
            </h2>
            <form
              action={addEnquiryQuotationAction}
              className="mt-4 grid gap-3 sm:grid-cols-2"
            >
              <input type="hidden" name="id" value={enquiry.id} />
              <div>
                <label className="mb-1 block font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                  Amount
                </label>
                <input
                  name="amount"
                  type="number"
                  min={0}
                  step={1000}
                  required
                  className="h-10 w-full border border-bone/15 bg-coal px-3 text-sm text-bone focus:border-ember focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                  Currency
                </label>
                <select
                  name="currency"
                  defaultValue="KES"
                  className="h-10 w-full border border-bone/15 bg-coal px-3 text-sm text-bone focus:border-ember focus:outline-none"
                >
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                  Valid until
                </label>
                <input
                  name="validUntil"
                  type="date"
                  className="h-10 w-full border border-bone/15 bg-coal px-3 text-sm text-bone focus:border-ember focus:outline-none"
                />
              </div>
              <label className="flex items-end gap-2 pb-2 text-[11px] text-bone/55">
                <input
                  type="checkbox"
                  name="deliveryIncluded"
                  className="h-4 w-4 accent-ember"
                />
                Delivery included
              </label>
              <div className="sm:col-span-2">
                <label className="mb-1 block font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full border border-bone/15 bg-coal px-3 py-2 text-sm text-bone focus:border-ember focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="h-9 bg-ember px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-ink"
                >
                  Save quotation
                </button>
              </div>
            </form>

            <ul className="mt-4 divide-y divide-bone/8">
              {quotations.map((quote) => (
                <li key={quote.id} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="text-[13px] text-bone/75">
                      {formatMoney(quote.amount, quote.currency)}{" "}
                      <span className="font-mono text-[9px] text-bone/30">
                        {quote.reference}
                      </span>
                    </p>
                    <p className="mt-1 text-[10.5px] text-bone/35">
                      {quote.delivery_included ? "Delivery included" : "Delivery extra"}
                      {quote.valid_until ? ` · valid to ${quote.valid_until}` : ""}
                    </p>
                    {quote.notes ? (
                      <p className="mt-1 text-[11px] leading-relaxed text-bone/45">
                        {quote.notes}
                      </p>
                    ) : null}
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-bone/25">
                    {formatDateTime(quote.created_at)}
                  </span>
                </li>
              ))}
              {quotations.length === 0 ? (
                <li className="py-3 text-sm text-bone/35">No quotation yet.</li>
              ) : null}
            </ul>
          </section>
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <section className="border border-bone/12 bg-ink p-5">
            <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
              Status
            </h2>
            <form action={updateEnquiryStatusAction} className="mt-3 space-y-2">
              <input type="hidden" name="id" value={enquiry.id} />
              <select
                name="status"
                defaultValue={enquiry.status}
                className="h-10 w-full border border-bone/15 bg-coal px-3 text-sm text-bone focus:border-ember focus:outline-none"
              >
                {enquiryStatuses.map((status) => (
                  <option key={status} value={status}>
                    {enquiryStatusLabels[status]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="h-9 w-full border border-bone/15 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/55 transition-colors hover:border-bone/35 hover:text-bone"
              >
                Update status
              </button>
            </form>

            <form action={updateFollowUpAction} className="mt-4">
              <input type="hidden" name="id" value={enquiry.id} />
              <label className="mb-1 block font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                Follow up
              </label>
              <input
                name="followUpAt"
                type="date"
                defaultValue={enquiry.follow_up_at?.slice(0, 10) ?? ""}
                className="h-10 w-full border border-bone/15 bg-coal px-3 text-sm text-bone focus:border-ember focus:outline-none"
              />
              <button
                type="submit"
                className="mt-2 h-8 w-full border border-bone/15 font-mono text-[8px] uppercase tracking-[0.12em] text-bone/45 hover:text-bone"
              >
                Save follow-up
              </button>
            </form>

            {!enquiry.assigned_to ? (
              <form action={assignEnquiryAction} className="mt-3">
                <input type="hidden" name="id" value={enquiry.id} />
                <button
                  type="submit"
                  className="h-8 w-full border border-bone/15 font-mono text-[8px] uppercase tracking-[0.12em] text-bone/45 hover:text-bone"
                >
                  Assign to me
                </button>
              </form>
            ) : (
              <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.1em] text-bone/25">
                Assigned{enquiry.assigned_to === user.id ? " to you" : ""}
              </p>
            )}
          </section>

          {attachments.length > 0 ? (
            <section className="border border-bone/12 bg-ink p-5">
              <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
                Customer photos
              </h2>
              <ul className="mt-3 space-y-2">
                {attachments.map((file) => (
                  <li key={file.id}>
                    {file.url ? (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 text-[11.5px] text-ember hover:text-bone"
                      >
                        <span className="truncate">{file.file_name}</span>
                        <span className="font-mono text-[8px] text-bone/25">
                          {Math.round(file.file_size / 1024)} KB
                        </span>
                      </a>
                    ) : (
                      <span className="text-[11.5px] text-bone/35">
                        {file.file_name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="border border-bone/12 bg-ink p-5">
            <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
              Activity
            </h2>
            <ul className="mt-3 space-y-3">
              {activity.map((item) => (
                <li key={item.id}>
                  <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-bone/50">
                    {item.action.replaceAll("_", " ")}
                  </p>
                  <p className="mt-0.5 font-mono text-[8px] text-bone/25">
                    {formatDateTime(item.created_at)}
                  </p>
                </li>
              ))}
              {activity.length === 0 ? (
                <li className="text-sm text-bone/35">No activity yet.</li>
              ) : null}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
