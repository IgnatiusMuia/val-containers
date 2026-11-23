"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminLibraryMedia } from "@/lib/containers/admin";
import {
  deleteMediaAction,
  setCoverMediaAction,
  updateMediaAltAction,
} from "@/lib/actions/media";
import { SmartImage } from "@/components/ui/SmartImage";
import { Icon } from "@/components/ui/Icons";

type KindFilter = "all" | "image" | "video";

export function MediaLibrary({ media }: { media: AdminLibraryMedia[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return media.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (!needle) return true;
      const container = item.containers?.name ?? "";
      const reference = item.containers?.reference ?? "";
      return [item.alt, item.src, container, reference]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [kind, media, query]);

  async function run(
    id: string,
    action: () => Promise<{ error?: string }>,
    message: string,
  ) {
    setBusyId(id);
    setError(null);
    setNotice(null);
    const result = await action();
    setBusyId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    setNotice(message);
    router.refresh();
  }

  async function copyUrl(item: AdminLibraryMedia) {
    const url = /^https?:\/\//i.test(item.src)
      ? item.src
      : new URL(item.src, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Media URL copied.");
      setError(null);
    } catch {
      setError("Could not copy the URL. Select it manually instead.");
    }
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", "All"],
              ["image", "Photos"],
              ["video", "Videos"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setKind(value)}
              className={`border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors ${
                kind === value
                  ? "border-ember bg-ember text-ink"
                  : "border-bone/15 text-bone/45 hover:border-bone/35 hover:text-bone"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search alt text, file or container"
          aria-label="Search media"
          className="h-8 min-w-[220px] flex-1 border border-bone/15 bg-coal px-3 text-xs text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none"
        />
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/30">
          {filtered.length} of {media.length}
        </span>
      </div>

      {error ? (
        <p className="mt-4 border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mt-4 border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {notice}
        </p>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col border border-bone/10 bg-ink p-3"
          >
            <div className="relative aspect-[4/3] overflow-hidden border border-bone/10 bg-coal">
              {item.kind === "image" || item.poster ? (
                <SmartImage
                  src={item.kind === "image" ? item.src : item.poster!}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 90vw"
                  wrapperClassName="absolute inset-0"
                  className="object-cover"
                  fallbackLabel=""
                />
              ) : (
                <div className="grid h-full place-items-center text-bone/40">
                  <Icon name="play" className="h-6 w-6" />
                </div>
              )}
              <span className="absolute left-1.5 top-1.5 bg-coal/85 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-bone/60">
                {item.kind}
              </span>
              {item.is_cover ? (
                <span className="absolute right-1.5 top-1.5 bg-ember px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-ink">
                  Cover
                </span>
              ) : null}
            </div>

            <div className="mt-3 min-w-0">
              {item.containers ? (
                <Link
                  href={`/admin/containers/${item.container_id}`}
                  className="truncate font-mono text-[9px] uppercase tracking-[0.12em] text-ember/80 transition-colors hover:text-ember"
                >
                  {item.containers.reference} · {item.containers.name}
                </Link>
              ) : (
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-bone/30">
                  Unlinked media
                </span>
              )}
              <input
                defaultValue={item.alt}
                aria-label={`Alt text for ${item.containers?.name ?? item.kind}`}
                onBlur={(event) => {
                  if (event.target.value.trim() === item.alt) return;
                  void run(
                    item.id,
                    () => updateMediaAltAction(item.id, event.target.value),
                    "Alt text updated.",
                  );
                }}
                className="mt-2 h-9 w-full border border-bone/12 bg-coal px-2.5 text-xs text-bone/70 focus:border-ember focus:outline-none"
              />
              <p className="mt-1 truncate font-mono text-[9px] text-bone/25">
                {item.src}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={busyId !== null || item.is_cover}
                onClick={() =>
                  void run(
                    item.id,
                    () => setCoverMediaAction(item.id),
                    "Cover updated.",
                  )
                }
                className="h-8 border border-bone/12 px-2.5 font-mono text-[8px] uppercase tracking-[0.12em] text-ember transition-colors hover:border-ember/40 disabled:opacity-25"
              >
                Set cover
              </button>
              <button
                type="button"
                onClick={() => void copyUrl(item)}
                className="h-8 border border-bone/12 px-2.5 font-mono text-[8px] uppercase tracking-[0.12em] text-bone/50 transition-colors hover:border-bone/35 hover:text-bone"
              >
                Copy URL
              </button>
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => {
                  if (!window.confirm("Remove this media item?")) return;
                  void run(
                    item.id,
                    () => deleteMediaAction(item.id),
                    "Media deleted.",
                  );
                }}
                aria-label="Delete media"
                className="ml-auto grid h-8 w-8 place-items-center border border-red-500/20 text-red-300/60 transition-colors hover:border-red-500/50 hover:text-red-200 disabled:opacity-25"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 border border-bone/10 bg-ink p-5 text-sm text-bone/45">
          {media.length === 0
            ? "No media yet. Upload photos and video from a listing page."
            : "No media matches those filters."}
        </p>
      ) : null}
    </div>
  );
}
