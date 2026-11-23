import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { leadStatuses, type LeadStatus } from "@/lib/validation/lead";
import { LeadStatusSelect } from "./LeadStatusSelect";

export const instant = false;

interface LeadRow {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  message: string | null;
  interest: string | null;
  source: string | null;
  page_path: string | null;
  status: LeadStatus;
  metadata: Record<string, unknown> | null;
  created_at: string;
  containers: { slug: string; name: string } | { slug: string; name: string }[] | null;
}

function metadataLine(metadata: Record<string, unknown> | null) {
  if (!metadata) return "";
  return ["type", "size", "condition", "timeline", "location"]
    .map((key) => metadata[key])
    .filter((value): value is string => typeof value === "string" && Boolean(value))
    .join(" · ");
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const activeStatus = leadStatuses.includes(params.status as LeadStatus)
    ? (params.status as LeadStatus)
    : null;

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="border border-ember/25 bg-ember/5 p-6">
        <h1 className="font-display text-2xl font-bold text-bone">
          Supabase is not configured
        </h1>
      </div>
    );
  }

  let query = supabase
    .from("leads")
    .select(
      "id, name, phone, email, message, interest, source, page_path, status, metadata, created_at, containers ( slug, name )",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (activeStatus) query = query.eq("status", activeStatus);

  const { data, error } = await query;
  const rows = (data ?? []) as LeadRow[];

  return (
    <div>
      <div>
        <p className="eyebrow text-ember">Enquiries</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
          Leads<span className="text-ember">.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/50">
          Every contact form and quote request is saved here before WhatsApp
          opens.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        <Link
          href="/admin/leads"
          className={`border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors ${
            activeStatus
              ? "border-bone/15 text-bone/45 hover:border-bone/35 hover:text-bone"
              : "border-ember bg-ember text-ink"
          }`}
        >
          All
        </Link>
        {leadStatuses.map((status) => (
          <Link
            key={status}
            href={`/admin/leads?status=${status}`}
            className={`border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors ${
              activeStatus === status
                ? "border-ember bg-ember text-ink"
                : "border-bone/15 text-bone/45 hover:border-bone/35 hover:text-bone"
            }`}
          >
            {status}
          </Link>
        ))}
      </div>

      {error ? (
        <p className="mt-6 border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-200">
          {error.message}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {rows.map((lead) => {
          const container = Array.isArray(lead.containers)
            ? (lead.containers[0] ?? null)
            : lead.containers;

          return (
          <article key={lead.id} className="border border-bone/12 bg-coal p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-bone/85">
                  {lead.name || "Unnamed enquiry"}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-bone/30">
                  {new Date(lead.created_at).toLocaleString("en-KE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {lead.source ? ` · ${lead.source}` : ""}
                </p>
              </div>
              <LeadStatusSelect leadId={lead.id} status={lead.status} />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.4fr]">
              <div className="space-y-1.5 text-xs text-bone/55">
                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="block transition-colors hover:text-bone"
                  >
                    {lead.phone}
                  </a>
                ) : null}
                {lead.email ? (
                  <a
                    href={`mailto:${lead.email}`}
                    className="block break-all transition-colors hover:text-bone"
                  >
                    {lead.email}
                  </a>
                ) : null}
                {lead.interest ? (
                  <p className="text-bone/40">{lead.interest}</p>
                ) : null}
                {container ? (
                  <Link
                    href={`/containers/${container.slug}`}
                    className="block text-ember transition-colors hover:text-bone"
                  >
                    {container.name}
                  </Link>
                ) : null}
                {lead.page_path ? (
                  <p className="font-mono text-[9px] text-bone/25">
                    {lead.page_path}
                  </p>
                ) : null}
              </div>

              <div>
                {metadataLine(lead.metadata) ? (
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/35">
                    {metadataLine(lead.metadata)}
                  </p>
                ) : null}
                {lead.message ? (
                  <p className="whitespace-pre-line text-xs leading-relaxed text-bone/60">
                    {lead.message}
                  </p>
                ) : (
                  <p className="text-xs text-bone/30">No message.</p>
                )}
              </div>
            </div>
          </article>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 border border-bone/12 p-6 text-sm text-bone/40">
          No enquiries in this view yet.
        </p>
      ) : null}
    </div>
  );
}
