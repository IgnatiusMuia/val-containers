import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminMedia } from "@/lib/containers/admin";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const instant = false;

export default async function AdminMediaPage() {
  await requireAdmin("media");

  let media: Awaited<ReturnType<typeof getAdminMedia>> = [];
  let error: string | null = null;

  try {
    media = await getAdminMedia();
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Could not load media.";
  }

  const images = media.filter((item) => item.kind === "image").length;
  const videos = media.length - images;
  const covers = media.filter((item) => item.is_cover).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ember">Media</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Library<span className="text-ember">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/50">
            Every uploaded photo and video across the fleet. Set covers, correct
            alt text or remove files. New uploads live on each listing page.
          </p>
        </div>
        <Link
          href="/admin/containers"
          className="border border-bone/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/50 transition-colors hover:border-bone/35 hover:text-bone"
        >
          Manage listings
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:max-w-md">
        {[
          ["Photos", images],
          ["Videos", videos],
          ["Covers", covers],
        ].map(([label, value]) => (
          <div key={label} className="border border-bone/10 bg-ink px-3 py-2.5">
            <p className="font-display text-2xl font-bold text-bone">{value}</p>
            <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-bone/35">
              {label}
            </p>
          </div>
        ))}
      </div>

      {error ? (
        <p className="mt-6 border border-red-500/25 bg-red-500/5 p-5 text-sm text-red-200">
          {error}
        </p>
      ) : (
        <MediaLibrary media={media} />
      )}
    </div>
  );
}
