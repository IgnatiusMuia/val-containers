import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  discardContentDraftAction,
  publishContentAction,
  saveContentDraftAction,
} from "@/lib/actions/content";

export const instant = false;

interface ContentRow {
  key: string;
  page: string;
  label: string;
  type: "text" | "textarea";
  value: string;
  position: number;
}

const pageLabels: Record<string, string> = {
  global: "Global",
  home: "Home page",
  about: "About page",
  delivery: "Delivery page",
  contact: "Contact page",
};

export default async function AdminContentPage() {
  await requireAdmin("content");

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

  const [{ data: contentData, error }, { data: draftData }] = await Promise.all([
    supabase
      .from("site_content")
      .select("key, page, label, type, value, position")
      .order("page", { ascending: true })
      .order("position", { ascending: true }),
    supabase.from("site_content_drafts").select("key, value"),
  ]);

  if (error) {
    return (
      <div className="border border-red-500/25 bg-red-500/5 p-5 text-sm text-red-200">
        {error.message}
      </div>
    );
  }

  const rows = (contentData ?? []) as unknown as ContentRow[];
  const drafts = new Map(
    ((draftData ?? []) as unknown as { key: string; value: string }[]).map(
      (row) => [row.key, row.value],
    ),
  );

  const grouped = Object.entries(
    rows.reduce<Record<string, ContentRow[]>>((groups, row) => {
      (groups[row.page] ??= []).push(row);
      return groups;
    }, {}),
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ember">Content</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Site copy<span className="text-ember">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/50">
            Edit the text shown on public pages. Save a draft, then publish when
            it is ready.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/content/faqs"
            className="border border-bone/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/50 transition-colors hover:border-bone/35 hover:text-bone"
          >
            FAQs
          </Link>
          <Link
            href="/admin/content/gallery"
            className="border border-bone/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/50 transition-colors hover:border-bone/35 hover:text-bone"
          >
            Gallery
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {grouped.map(([page, pageRows]) => (
          <section key={page}>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-bone">
                {pageLabels[page] ?? page}
              </h2>
              <span className="h-px flex-1 bg-bone/10" />
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-bone/25">
                {pageRows.length} fields
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {pageRows.map((row) => {
                const draft = drafts.get(row.key);
                const value = draft ?? row.value;
                const changed = draft !== undefined && draft !== row.value;

                return (
                  <form
                    key={row.key}
                    className="border border-bone/12 bg-ink p-4"
                  >
                    <input type="hidden" name="key" value={row.key} />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <label
                          htmlFor={`content-${row.key}`}
                          className="text-[13px] font-medium text-bone/80"
                        >
                          {row.label}
                        </label>
                        <p className="mt-0.5 font-mono text-[8px] text-bone/25">
                          {row.key}
                        </p>
                      </div>
                      {changed ? (
                        <span className="border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-amber-200">
                          Draft saved
                        </span>
                      ) : null}
                    </div>

                    {row.type === "textarea" ? (
                      <textarea
                        id={`content-${row.key}`}
                        name="value"
                        rows={3}
                        defaultValue={value}
                        className="mt-3 w-full border border-bone/15 bg-coal px-3 py-2 text-sm leading-relaxed text-bone focus:border-ember focus:outline-none"
                      />
                    ) : (
                      <input
                        id={`content-${row.key}`}
                        name="value"
                        defaultValue={value}
                        className="mt-3 h-10 w-full border border-bone/15 bg-coal px-3 text-sm text-bone focus:border-ember focus:outline-none"
                      />
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="submit"
                        formAction={saveContentDraftAction}
                        className="h-8 border border-bone/15 px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-bone/50 transition-colors hover:border-bone/35 hover:text-bone"
                      >
                        Save draft
                      </button>
                      <button
                        type="submit"
                        formAction={publishContentAction}
                        className="h-8 bg-ember px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-ink"
                      >
                        Publish
                      </button>
                      {changed ? (
                        <button
                          type="submit"
                          formAction={discardContentDraftAction}
                          className="h-8 border border-bone/10 px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30 transition-colors hover:text-bone"
                        >
                          Discard draft
                        </button>
                      ) : null}
                    </div>
                  </form>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 border border-bone/12 p-6 text-sm text-bone/45">
          No content rows found. Apply the admin CMS migration.
        </p>
      ) : null}
    </div>
  );
}
