import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatKES } from "@/lib/format";

export const instant = false;

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

const statuses = [
  "all",
  "new",
  "under_review",
  "contacted",
  "awaiting_customer",
  "quotation_discussed",
  "negotiation",
  "converted",
  "closed",
  "cancelled",
] as const;

interface EnquiryRow {
  id: string;
  reference: string;
  customer_name: string;
  phone: string;
  container_name: string | null;
  status: string;
  quotation_total: number | null;
  created_at: string;
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin("enquiries");
  const { status, q } = await searchParams;
  const activeStatus = status && statuses.includes(status as never) ? status : "all";
  const query = (q ?? "").replace(/[^a-zA-Z0-9 @.+_-]/g, "").slice(0, 80);

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

  let request = supabase
    .from("enquiries")
    .select(
      "id, reference, customer_name, phone, container_name, status, quotation_total, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (activeStatus !== "all") request = request.eq("status", activeStatus);
  if (query) {
    request = request.or(
      `reference.ilike.%${query}%,customer_name.ilike.%${query}%,phone.ilike.%${query}%`,
    );
  }

  const { data, error } = await request;
  const rows = (data ?? []) as unknown as EnquiryRow[];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ember">Enquiries</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Inbox<span className="text-ember">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/50">
            Every website enquiry is saved here with a reference before WhatsApp
            opens.
          </p>
        </div>
        <Link
          href="/enquire"
          target="_blank"
          className="border border-bone/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/50 transition-colors hover:border-bone/35 hover:text-bone"
        >
          Open public form ↗
        </Link>
      </div>

      <form action="/admin/enquiries" method="get" className="mt-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search reference, name or phone"
          className="h-10 min-w-56 flex-1 border border-bone/15 bg-coal px-3 text-sm text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none"
        />
        {activeStatus !== "all" ? (
          <input type="hidden" name="status" value={activeStatus} />
        ) : null}
        <button
          type="submit"
          className="h-10 border border-bone/15 px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-bone/55 transition-colors hover:border-bone/35 hover:text-bone"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {statuses.map((item) => {
          const params = new URLSearchParams();
          if (item !== "all") params.set("status", item);
          if (query) params.set("q", query);
          const href = `/admin/enquiries${params.toString() ? `?${params.toString()}` : ""}`;
          return (
            <Link
              key={item}
              href={href}
              className={`border px-2.5 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.12em] transition-colors ${
                activeStatus === item
                  ? "border-ember bg-ember text-ink"
                  : "border-bone/15 text-bone/40 hover:border-bone/35 hover:text-bone"
              }`}
            >
              {item.replaceAll("_", " ")}
            </Link>
          );
        })}
      </div>

      {error ? (
        <p className="mt-6 border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-200">
          {error.message}
        </p>
      ) : (
        <div className="mt-6 border border-bone/12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="border-b border-bone/10 font-mono text-[9px] uppercase tracking-[0.16em] text-bone/30">
                <tr>
                  <th className="px-4 py-3 font-normal">Reference</th>
                  <th className="px-4 py-3 font-normal">Customer</th>
                  <th className="px-4 py-3 font-normal">Container</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Quote</th>
                  <th className="px-4 py-3 font-normal">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bone/8">
                {rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-coal/70">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/enquiries/${row.id}`}
                        className="font-mono text-[10px] text-ember transition-colors hover:text-bone"
                      >
                        {row.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/enquiries/${row.id}`}
                        className="text-bone/80 transition-colors hover:text-ember"
                      >
                        {row.customer_name}
                      </Link>
                      <p className="mt-0.5 font-mono text-[9px] text-bone/30">
                        {row.phone}
                      </p>
                    </td>
                    <td className="max-w-48 truncate px-4 py-3 text-bone/50">
                      {row.container_name ?? "General"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] ${
                          statusStyles[row.status] ?? statusStyles.closed
                        }`}
                      >
                        {row.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-bone/50">
                      {row.quotation_total
                        ? formatKES(row.quotation_total)
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-bone/35">
                      {new Date(row.created_at).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 ? (
            <p className="px-4 py-10 text-sm text-bone/45">
              No enquiries match this view.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
