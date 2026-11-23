import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  deleteGalleryItemAction,
  saveGalleryItemAction,
} from "@/lib/actions/content";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { SmartImage } from "@/components/ui/SmartImage";

export const instant = false;

interface GalleryRow {
  id: string;
  title: string;
  caption: string;
  src: string;
  alt: string;
  position: number;
  publication_status: string;
}

const inputClass =
  "w-full border border-bone/15 bg-coal px-3 py-2 text-sm text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none";

export default async function AdminGalleryPage() {
  await requireAdmin("content");

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("gallery_items")
    .select("id, title, caption, src, alt, position, publication_status")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as GalleryRow[];

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
          Yard gallery<span className="text-ember">.</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-bone/45">
          Published items appear on the home page. Use a public image URL or a
          path from the media library.
        </p>
      </div>

      {error ? (
        <p className="mt-6 border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-200">
          {error.message}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <form
            key={row.id}
            action={saveGalleryItemAction}
            className="border border-bone/12 bg-ink p-4"
          >
            <input type="hidden" name="id" value={row.id} />
            <div className="flex gap-3">
              <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden border border-bone/10 bg-coal">
                <SmartImage
                  src={row.src}
                  alt={row.alt}
                  fill
                  sizes="112px"
                  wrapperClassName="absolute inset-0"
                  className="object-cover"
                  fallbackLabel=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <input
                  name="title"
                  defaultValue={row.title}
                  required
                  className={inputClass}
                  aria-label="Title"
                />
                <input
                  name="src"
                  defaultValue={row.src}
                  required
                  className={`${inputClass} mt-2 font-mono text-[10px]`}
                  aria-label="Image URL or path"
                />
              </div>
            </div>
            <input
              name="alt"
              defaultValue={row.alt}
              required
              className={`${inputClass} mt-2`}
              aria-label="Alt text"
            />
            <input
              name="caption"
              defaultValue={row.caption}
              className={`${inputClass} mt-2`}
              aria-label="Caption"
            />
            <div className="mt-2 grid grid-cols-[1fr_90px_1fr_auto] gap-2">
              <select
                name="publicationStatus"
                defaultValue={row.publication_status}
                className={inputClass}
                aria-label="Publication status"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <input
                name="position"
                type="number"
                defaultValue={row.position}
                className={inputClass}
                aria-label="Position"
              />
              <button
                type="submit"
                className="h-9 bg-ember px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-ink"
              >
                Save
              </button>
              <ConfirmButton
                type="submit"
                formAction={deleteGalleryItemAction}
                message="Delete this gallery item?"
                className="h-9 border border-red-500/20 px-2 font-mono text-[8px] uppercase tracking-[0.1em] text-red-300/60 hover:text-red-200"
              >
                Del
              </ConfirmButton>
            </div>
          </form>
        ))}
      </div>

      <form
        action={saveGalleryItemAction}
        className="mt-8 border border-ember/25 bg-ember/5 p-4"
      >
        <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-ember">
          Add gallery item
        </h2>
        <div className="mt-3 grid gap-2">
          <input
            name="title"
            required
            placeholder="Title"
            className={inputClass}
          />
          <input
            name="src"
            required
            placeholder="Paste a media path or https://…"
            className={inputClass}
          />
          <input
            name="alt"
            required
            placeholder="Alt text describing the image"
            className={inputClass}
          />
          <input
            name="caption"
            placeholder="Caption (optional)"
            className={inputClass}
          />
          <div className="grid grid-cols-[1fr_90px_1fr] gap-2">
            <select
              name="publicationStatus"
              defaultValue="draft"
              className={inputClass}
              aria-label="Publication status"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <input
              name="position"
              type="number"
              defaultValue={rows.length}
              className={inputClass}
              aria-label="Position"
            />
            <button
              type="submit"
              className="h-9 bg-ember px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-ink"
            >
              Add item
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
