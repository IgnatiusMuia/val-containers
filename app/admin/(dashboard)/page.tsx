import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatKES } from "@/lib/format";

export const instant = false;

const statusStyles: Record<string, string> = {
  available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  reserved: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  sold: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  draft: "border-bone/20 bg-bone/5 text-bone/50",
  archived: "border-red-500/30 bg-red-500/10 text-red-200",
};

export default async function AdminOverviewPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="border border-ember/25 bg-ember/5 p-6">
        <h1 className="font-display text-2xl font-bold text-bone">
          Supabase is not configured
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone/55">
          Add the Supabase environment variables, then run the initial
          migration. The admin dashboard will populate after the first owner is
          added to <code className="font-mono text-bone/75">admin_users</code>.
        </p>
      </div>
    );
  }

  const [{ data: containers, error: containersError }, { count: newLeads }] =
    await Promise.all([
      supabase
        .from("containers")
        .select("id, slug, name, status, price, stock, featured, updated_at")
        .order("updated_at", { ascending: false }),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
    ]);

  if (containersError) {
    return (
      <div className="border border-red-500/25 bg-red-500/5 p-6">
        <h1 className="font-display text-2xl font-bold text-bone">
          Database not ready
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone/55">
          Run the migration in{" "}
          <code className="font-mono text-bone/75">
            supabase/migrations/202611230001_initial.sql
          </code>{" "}
          in the Supabase SQL editor, then reload this page.
        </p>
        <p className="mt-4 font-mono text-xs text-red-200/80">
          {containersError.message}
        </p>
      </div>
    );
  }

  const rows = containers ?? [];
  const available = rows.filter((row) => row.status === "available").length;
  const drafts = rows.filter((row) => row.status === "draft").length;
  const featured = rows.filter((row) => row.featured).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ember">Operations</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Yard overview<span className="text-ember">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/50">
            Manage listings, media and enquiries. Public pages update after each
            save.
          </p>
        </div>
        <Link
          href="/"
          className="border border-bone/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/55 transition-colors hover:border-bone/35 hover:text-bone"
        >
          View site ↗
        </Link>
      </div>

      <div className="mt-8 grid gap-px border border-bone/12 bg-bone/12 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total listings", rows.length],
          ["Available", available],
          ["Drafts", drafts],
          ["New leads", newLeads ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="bg-ink p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/35">
              {label}
            </p>
            <p className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-bone">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 border border-bone/12">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bone/12 px-4 py-3">
          <div>
            <h2 className="text-sm font-medium text-bone">Containers</h2>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-bone/30">
              {featured} featured
            </p>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/30">
            Newest updated first
          </span>
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-sm text-bone/45">
            No containers yet. Seed the existing listings or add the first one
            from the next build step.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-bone/10 font-mono text-[9px] uppercase tracking-[0.16em] text-bone/30">
                <tr>
                  <th className="px-4 py-3 font-normal">Listing</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Price</th>
                  <th className="px-4 py-3 font-normal">Stock</th>
                  <th className="px-4 py-3 font-normal">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bone/8">
                {rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-coal/70">
                    <td className="px-4 py-3">
                      <p className="text-bone/80">{row.name}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-bone/30">
                        {row.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${
                          statusStyles[row.status] ?? statusStyles.draft
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-bone/60">
                      {formatKES(row.price)}
                    </td>
                    <td className="px-4 py-3 text-bone/60">{row.stock}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-bone/40">
                      {new Date(row.updated_at).toLocaleDateString("en-KE", {
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
        )}
      </div>
    </div>
  );
}
