import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminContainers } from "@/lib/containers/admin";
import { formatKES } from "@/lib/format";
import {
  archiveContainerAction,
  deleteContainerAction,
  duplicateContainerAction,
} from "@/lib/actions/containers";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const instant = false;

const statusStyles: Record<string, string> = {
  available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  reserved: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  sold: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  unavailable: "border-bone/20 bg-bone/5 text-bone/50",
  inspection: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  draft: "border-bone/20 bg-bone/5 text-bone/50",
  published: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  archived: "border-red-500/30 bg-red-500/10 text-red-200",
};

const notices: Record<string, string> = {
  created: "Listing created.",
  updated: "Listing updated.",
  archived: "Listing archived.",
  deleted: "Listing deleted.",
  duplicated: "Listing duplicated as a draft.",
};

export default async function AdminContainersPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    status?: string;
    publication?: string;
  }>;
}) {
  const { saved, status, publication } = await searchParams;
  await requireAdmin("inventory");

  let rows: Awaited<ReturnType<typeof getAdminContainers>> = [];
  let error: string | null = null;

  try {
    rows = await getAdminContainers();
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Could not load listings.";
  }

  const filtered = rows.filter((row) => {
    if (status && row.status !== status) return false;
    if (publication && row.publication_status !== publication) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ember">Inventory</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Listings<span className="text-ember">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/50">
            Create, verify and publish the units shown on the public catalogue.
          </p>
        </div>
        <Link
          href="/admin/containers/new"
          className="border border-ember bg-ember px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-ember-deep hover:bg-ember-deep"
        >
          New listing
        </Link>
      </div>

      {saved && notices[saved] ? (
        <p className="mt-6 border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {notices[saved]}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-1.5">
        {[
          { label: "All", href: "/admin/containers" },
          {
            label: "Published",
            href: "/admin/containers?publication=published",
          },
          { label: "Drafts", href: "/admin/containers?publication=draft" },
          {
            label: "Available",
            href: "/admin/containers?status=available",
          },
          {
            label: "Reserved",
            href: "/admin/containers?status=reserved",
          },
        ].map((filter) => {
          const current = new URLSearchParams({
            ...(status ? { status } : {}),
            ...(publication ? { publication } : {}),
          }).toString();
          const href = `/admin/containers${current ? `?${current}` : ""}`;
          const active = filter.href === href;
          return (
            <Link
              key={filter.label}
              href={filter.href}
              className={`border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors ${
                active
                  ? "border-ember bg-ember text-ink"
                  : "border-bone/15 text-bone/45 hover:border-bone/35 hover:text-bone"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {error ? (
        <div className="mt-6 border border-red-500/25 bg-red-500/5 p-5">
          <p className="text-sm text-red-200">{error}</p>
          <p className="mt-2 text-xs leading-relaxed text-bone/45">
            Apply the Supabase migration if the tables are missing.
          </p>
        </div>
      ) : (
        <div className="mt-6 border border-bone/12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-bone/10 font-mono text-[9px] uppercase tracking-[0.16em] text-bone/30">
                <tr>
                  <th className="px-4 py-3 font-normal">Listing</th>
                  <th className="px-4 py-3 font-normal">Publication</th>
                  <th className="px-4 py-3 font-normal">Availability</th>
                  <th className="px-4 py-3 font-normal">Price</th>
                  <th className="px-4 py-3 font-normal">Stock</th>
                  <th className="px-4 py-3 font-normal">Updated</th>
                  <th className="px-4 py-3 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bone/8">
                {filtered.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-coal/70">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/containers/${row.id}`}
                        className="text-bone/80 transition-colors hover:text-ember"
                      >
                        {row.name}
                      </Link>
                      <p className="mt-0.5 font-mono text-[9px] text-bone/25">
                        {row.reference} · {row.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${
                          statusStyles[row.publication_status] ??
                          statusStyles.draft
                        }`}
                      >
                        {row.publication_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${
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
                        className="font-mono text-[9px] uppercase tracking-[0.12em] text-ember transition-colors hover:text-bone"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/containers/${row.slug}`}
                        target="_blank"
                        className="ml-3 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/35 transition-colors hover:text-bone"
                      >
                        View
                      </Link>
                      <form
                        action={duplicateContainerAction}
                        className="ml-3 inline"
                      >
                        <input type="hidden" name="id" value={row.id} />
                        <button
                          type="submit"
                          className="font-mono text-[9px] uppercase tracking-[0.12em] text-bone/35 transition-colors hover:text-bone"
                        >
                          Copy
                        </button>
                      </form>
                      {row.publication_status !== "archived" ? (
                        <form
                          action={archiveContainerAction}
                          className="ml-3 inline"
                        >
                          <input type="hidden" name="id" value={row.id} />
                          <input type="hidden" name="slug" value={row.slug} />
                          <ConfirmButton
                            type="submit"
                            message={`Archive ${row.name}? It will disappear from the public site.`}
                            className="font-mono text-[9px] uppercase tracking-[0.12em] text-bone/35 transition-colors hover:text-amber-200"
                          >
                            Archive
                          </ConfirmButton>
                        </form>
                      ) : (
                        <form
                          action={deleteContainerAction}
                          className="ml-3 inline"
                        >
                          <input type="hidden" name="id" value={row.id} />
                          <input type="hidden" name="slug" value={row.slug} />
                          <ConfirmButton
                            type="submit"
                            message={`Permanently delete ${row.name}? This cannot be undone.`}
                            className="font-mono text-[9px] uppercase tracking-[0.12em] text-red-300/60 transition-colors hover:text-red-200"
                          >
                            Delete
                          </ConfirmButton>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-sm text-bone/45">
              No listings match this filter.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
