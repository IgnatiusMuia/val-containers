import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteFaqAction, saveFaqAction } from "@/lib/actions/content";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const instant = false;

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  category: string;
  position: number;
  active: boolean;
}

const inputClass =
  "w-full border border-bone/15 bg-coal px-3 py-2 text-sm text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none";

export default async function AdminFaqsPage() {
  await requireAdmin("content");

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, category, position, active")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  const rows = (data ?? []) as unknown as FaqRow[];

  return (
    <div>
      <Link
        href="/admin/content"
        className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35 transition-colors hover:text-bone"
      >
        ← Content
      </Link>
      <div className="mt-4">
        <p className="eyebrow text-ember">Content</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-bone">
          FAQs<span className="text-ember">.</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-bone/45">
          The home page and public FAQ sections read from this list.
        </p>
      </div>

      {error ? (
        <p className="mt-6 border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-200">
          {error.message}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <form
            key={row.id}
            action={saveFaqAction}
            className="border border-bone/12 bg-ink p-4"
          >
            <input type="hidden" name="id" value={row.id} />
            <div className="grid gap-3">
              <input
                name="question"
                defaultValue={row.question}
                required
                className={inputClass}
                aria-label="Question"
              />
              <textarea
                name="answer"
                defaultValue={row.answer}
                required
                rows={3}
                className={inputClass}
                aria-label="Answer"
              />
              <div className="grid gap-3 sm:grid-cols-[1fr_100px_120px_auto] sm:items-center">
                <input
                  name="category"
                  defaultValue={row.category}
                  className={inputClass}
                  aria-label="Category"
                />
                <input
                  name="position"
                  type="number"
                  defaultValue={row.position}
                  className={inputClass}
                  aria-label="Position"
                />
                <label className="flex items-center gap-2 text-[11px] text-bone/55">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={row.active}
                    className="h-4 w-4 accent-ember"
                  />
                  Active
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="h-9 bg-ember px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-ink"
                  >
                    Save
                  </button>
                  <ConfirmButton
                    type="submit"
                    formAction={deleteFaqAction}
                    message="Delete this FAQ?"
                    className="h-9 border border-red-500/20 px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-red-300/60 hover:text-red-200"
                  >
                    Delete
                  </ConfirmButton>
                </div>
              </div>
            </div>
          </form>
        ))}
      </div>

      <form
        action={saveFaqAction}
        className="mt-8 border border-ember/25 bg-ember/5 p-4"
      >
        <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-ember">
          Add FAQ
        </h2>
        <div className="mt-3 grid gap-3">
          <input
            name="question"
            required
            placeholder="Question"
            className={inputClass}
          />
          <textarea
            name="answer"
            required
            rows={3}
            placeholder="Answer"
            className={inputClass}
          />
          <div className="grid gap-3 sm:grid-cols-[1fr_100px_120px_auto] sm:items-center">
            <input
              name="category"
              defaultValue="general"
              className={inputClass}
              aria-label="Category"
            />
            <input
              name="position"
              type="number"
              defaultValue={rows.length}
              className={inputClass}
              aria-label="Position"
            />
            <label className="flex items-center gap-2 text-[11px] text-bone/55">
              <input
                type="checkbox"
                name="active"
                defaultChecked
                className="h-4 w-4 accent-ember"
              />
              Active
            </label>
            <button
              type="submit"
              className="h-9 bg-ember px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-ink"
            >
              Add FAQ
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
