import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatKES } from "@/lib/format";
import { Icon } from "@/components/ui/Icons";

export const instant = false;

interface ContainerRow {
  id: string;
  reference: string;
  slug: string;
  name: string;
  status: string;
  publication_status: string;
  price: number;
  stock: number;
  updated_at: string;
}

interface EnquiryRow {
  id: string;
  reference: string;
  name: string;
  status: string;
  created_at: string;
}

const statusStyles: Record<string, string> = {
  available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  reserved: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  sold: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  unavailable: "border-bone/20 bg-bone/5 text-bone/50",
  inspection: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  draft: "border-bone/20 bg-bone/5 text-bone/50",
  archived: "border-red-500/30 bg-red-500/10 text-red-200",
  new: "border-ember/40 bg-ember/10 text-ember",
  under_review: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  contacted: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  awaiting_customer: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  quotation_discussed: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  negotiation: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  converted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  closed: "border-bone/20 bg-bone/5 text-bone/45",
  cancelled: "border-red-500/20 bg-red-500/5 text-red-300/60",
};

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const [{ error, reset }, supabase] = await Promise.all([
    searchParams,
    createSupabaseServerClient(),
  ]);
  const notice =
    reset === "1"
      ? "Password updated. You are signed in."
      : error === "forbidden"
        ? "You do not have permission to open that section."
        : error === "owner-only"
          ? "Only the owner can change settings or manage the team."
          : null;

  if (!supabase) {
    return (
      <div className="border border-ember/25 bg-ember/5 p-6">
        <h1 className="font-display text-2xl font-bold text-bone">
          Supabase is not configured
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone/55">
          Add the Supabase environment variables, then apply the admin CMS
          migration.
        </p>
      </div>
    );
  }

  const [
    containersResult,
    newEnquiries,
    allEnquiries,
    contentDrafts,
    mediaCount,
    recentEnquiriesResult,
  ] = await Promise.all([
    supabase
      .from("containers")
      .select(
        "id, reference, slug, name, status, publication_status, price, stock, updated_at",
      )
      .order("updated_at", { ascending: false }),
    supabase
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("enquiries")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("site_content_drafts")
      .select("key", { count: "exact", head: true }),
    supabase
      .from("container_media")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("enquiries")
      .select("id, reference, name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (containersResult.error) {
    return (
      <div className="border border-red-500/25 bg-red-500/5 p-6">
        <h1 className="font-display text-2xl font-bold text-bone">
          Database not ready
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone/55">
          Apply{" "}
          <code className="font-mono text-bone/75">
            supabase/migrations/202611240001_admin_cms.sql
          </code>{" "}
          to add the admin CMS tables.
        </p>
        <p className="mt-4 font-mono text-xs text-red-200/80">
          {containersResult.error.message}
        </p>
      </div>
    );
  }

  const containers = (containersResult.data ?? []) as ContainerRow[];
  const recentEnquiries = (recentEnquiriesResult.data ?? []) as EnquiryRow[];
  const published = containers.filter(
    (row) => row.publication_status === "published",
  );
  const available = containers.filter((row) => row.status === "available");
  const units = containers.reduce((sum, row) => sum + row.stock, 0);

  const stats = [
    {
      label: "Published listings",
      value: published.length,
      detail: `${containers.length} total records`,
      href: "/admin/containers",
    },
    {
      label: "Available now",
      value: available.length,
      detail: `${units} stock units`,
      href: "/admin/containers?status=available",
    },
    {
      label: "New enquiries",
      value: newEnquiries.count ?? 0,
      detail: `${allEnquiries.count ?? 0} total enquiries`,
      href: "/admin/enquiries",
    },
    {
      label: "Content drafts",
      value: contentDrafts.count ?? 0,
      detail: `${mediaCount.count ?? 0} media files`,
      href: "/admin/content",
    },
  ];

  return (
    <div>
      {notice ? (
        <p className="mb-6 border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {notice}
        </p>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ember">Operations</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Yard overview<span className="text-ember">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/50">
            Listings, media, content and enquiries in one place. Public pages
            update after each publish.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/containers/new"
            className="inline-flex h-10 items-center gap-2 bg-ember px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink"
          >
            <Icon name="plus" className="h-3.5 w-3.5" />
            Add container
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex h-10 items-center gap-2 border border-bone/15 px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/55 transition-colors hover:border-bone/35 hover:text-bone"
          >
            Enquiries
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-px border border-bone/12 bg-bone/12 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-ink p-5 transition-colors hover:bg-coal"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
              {stat.label}
            </p>
            <p className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-bone">
              {stat.value}
            </p>
            <p className="mt-2 flex items-center justify-between gap-2 text-[10.5px] text-bone/30">
              {stat.detail}
              <Icon
                name="arrow-up-right"
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="border border-bone/12 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bone/12 px-4 py-3">
            <div>
              <h2 className="text-sm font-medium text-bone">Latest inventory</h2>
              <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-bone/30">
                Newest updated first
              </p>
            </div>
            <Link
              href="/admin/containers"
              className="text-[10.5px] text-ember transition-colors hover:text-bone"
            >
              View all
            </Link>
          </div>

          {containers.length === 0 ? (
            <p className="px-4 py-8 text-sm text-bone/45">
              No containers yet. Add the first listing.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="border-b border-bone/10 font-mono text-[8px] uppercase tracking-[0.14em] text-bone/30">
                  <tr>
                    <th className="px-4 py-3 font-normal">Listing</th>
                    <th className="px-4 py-3 font-normal">Status</th>
                    <th className="px-4 py-3 font-normal">Price</th>
                    <th className="px-4 py-3 font-normal">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bone/8">
                  {containers.slice(0, 6).map((row) => (
                    <tr key={row.id} className="hover:bg-coal/70">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/containers/${row.id}`}
                          className="text-bone/80 transition-colors hover:text-ember"
                        >
                          {row.name}
                        </Link>
                        <p className="mt-0.5 font-mono text-[9px] text-bone/25">
                          {row.reference}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <span
                            className={`inline-flex border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] ${
                              statusStyles[row.publication_status] ??
                              statusStyles.draft
                            }`}
                          >
                            {row.publication_status}
                          </span>
                          <span
                            className={`inline-flex border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] ${
                              statusStyles[row.status] ?? statusStyles.draft
                            }`}
                          >
                            {row.status}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-bone/55">
                        {formatKES(row.price)}
                      </td>
                      <td className="px-4 py-3 text-bone/55">{row.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border border-bone/12 lg:col-span-5">
          <div className="flex items-center justify-between gap-3 border-b border-bone/12 px-4 py-3">
            <div>
              <h2 className="text-sm font-medium text-bone">Latest enquiries</h2>
              <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-bone/30">
                Customer messages
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-[10.5px] text-ember transition-colors hover:text-bone"
            >
              Inbox
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="px-4 py-8">
              <p className="text-sm text-bone/45">No enquiries yet.</p>
              <p className="mt-2 text-[11px] leading-relaxed text-bone/30">
                New quote requests will appear here with a reference number.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-bone/8">
              {recentEnquiries.map((enquiry) => (
                <li key={enquiry.id}>
                  <Link
                    href={`/admin/enquiries/${enquiry.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-coal/70"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] text-bone/75">
                        {enquiry.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[9px] text-bone/25">
                        {enquiry.reference}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] ${
                        statusStyles[enquiry.status] ?? statusStyles.draft
                      }`}
                    >
                      {enquiry.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
