import Link from "next/link";
import { getAdminContainers } from "@/lib/containers/admin";
import { formatKES } from "@/lib/format";

export const instant = false;

const statusStyles: Record<string, string> = {
  available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  reserved: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  sold: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  draft: "border-bone/20 bg-bone/5 text-bone/50",
  archived: "border-red-500/30 bg-red-500/10 text-red-200",
};

export default async function AdminContainersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;

  let rows: Awaited<ReturnType<typeof getAdminContainers>> = [];
  let error: string | null = null;

  try {
    rows = await getAdminContainers();
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Could not load listings.";
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ember">Inventory</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Listings<span className="text-ember">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/50">
            Create, edit and publish the units shown on the public catalogue.
          </p>
        </div>
        <Link
          href="/admin/containers/new"
          className="border border-ember bg-ember px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-ember-deep hover:bg-ember-deep"
        >
          New listing
        </Link>
      </div>

      {saved ? (
        <p className="mt-6 border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          Listing {saved}.
        </p>
      ) : null}

      {error ? (
        <div className="mt-6 border border-red-500/25 bg-red-500/5 p-5">
          <p className="text-sm text-red-200">{error}</p>
          <p className="mt-2 text-xs leading-relaxed text-bone/45">
            Run the Supabase migration if the tables are missing.
          </p>
        </div>
      ) : (
        <div className="mt-8 border border-bone/12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-bone/10 font-mono text-[9px] uppercase tracking-[0.16em] text-bone/30">
                <tr>
                  <th className="px-4 py-3 font-normal">Listing</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Price</th>
                  <th className="px-4 py-3 font-normal">Stock</th>
                  <th className="px-4 py-3 font-normal">Updated</th>
                  <th className="px-4 py-3 text-right font-normal">Actions</th>
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
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        href={`/admin/containers/${row.id}`}
                        className="font-mono text-[10px] uppercase tracking-[0.14em] text-ember transition-colors hover:text-bone"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/containers/${row.slug}`}
                        className="ml-4 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/40 transition-colors hover:text-bone"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length === 0 ? (
            <p className="px-4 py-8 text-sm text-bone/45">
              No listings yet. Run{" "}
              <code className="font-mono text-bone/70">npm run db:seed</code> or
              add the first listing.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
