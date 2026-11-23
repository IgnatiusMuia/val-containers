"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AdminMediaRecord } from "@/lib/containers/admin";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  createMediaUploadAction,
  deleteMediaAction,
  finalizeMediaAction,
  moveMediaAction,
  updateMediaAltAction,
} from "@/lib/actions/media";
import { buttonStyles } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { SmartImage } from "@/components/ui/SmartImage";

const BUCKET = "container-media";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const inputClass =
  "h-10 w-full border border-bone/15 bg-coal px-3 text-sm text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none";

export function MediaManager({
  containerId,
  media,
}: {
  containerId: string;
  media: AdminMediaRecord[];
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isVideo = file?.type.startsWith("video/") ?? false;

  async function uploadFile(fileToUpload: File) {
    const ticket = await createMediaUploadAction(
      containerId,
      fileToUpload.name,
    );
    if (ticket.error || !ticket.ticket) {
      throw new Error(ticket.error ?? "Could not start upload.");
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) throw new Error("Supabase is not configured.");

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .uploadToSignedUrl(ticket.ticket.path, ticket.ticket.token, fileToUpload, {
        contentType: fileToUpload.type || "application/octet-stream",
      });

    if (uploadError) throw new Error(uploadError.message);
    return ticket.ticket.path;
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError("Choose a photo or MP4 first.");
      return;
    }

    const kind = file.type.startsWith("video/") ? "video" : "image";
    const limit = kind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;

    if (file.size > limit) {
      setError(
        kind === "video"
          ? "Video is larger than 50 MB."
          : "Image is larger than 8 MB.",
      );
      return;
    }

    if (
      kind === "image" &&
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setError("Use a JPEG, PNG or WebP image.");
      return;
    }

    if (kind === "video" && file.type !== "video/mp4") {
      setError("Use an MP4 video.");
      return;
    }

    setBusy(true);

    try {
      const path = await uploadFile(file);
      let posterPath: string | undefined;

      if (kind === "video" && posterFile) {
        if (posterFile.size > MAX_IMAGE_BYTES) {
          throw new Error("Poster image is larger than 8 MB.");
        }
        posterPath = await uploadFile(posterFile);
      }

      const result = await finalizeMediaAction({
        containerId,
        path,
        kind,
        alt,
        posterPath,
      });

      if (result.error) throw new Error(result.error);

      setFile(null);
      setPosterFile(null);
      setAlt("");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function runMediaAction(
    id: string,
    action: () => Promise<{ error?: string }>,
  ) {
    setBusyId(id);
    setError(null);
    const result = await action();
    setBusyId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <section className="mt-8 border border-bone/12 bg-ink p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember">
            Media
          </h2>
          <p className="mt-2 text-sm text-bone/50">
            First item is the primary photo. Videos need a poster image.
          </p>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/30">
          {media.length} item{media.length === 1 ? "" : "s"}
        </span>
      </div>

      {error ? (
        <p className="mt-4 border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleUpload} className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-bone/40">
            Photo or MP4
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setPosterFile(null);
            }}
            className="block w-full text-xs text-bone/50 file:mr-3 file:border-0 file:bg-bone/10 file:px-3 file:py-2 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.14em] file:text-bone/70"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-bone/40">
            Alt text
          </label>
          <input
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Describe what the photo shows"
            className={inputClass}
          />
        </div>
        {isVideo ? (
          <div className="sm:col-span-2">
            <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-bone/40">
              Video poster
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setPosterFile(event.target.files?.[0] ?? null)
              }
              className="block w-full text-xs text-bone/50 file:mr-3 file:border-0 file:bg-bone/10 file:px-3 file:py-2 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.14em] file:text-bone/70"
            />
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            {busy ? "Uploading…" : "Upload media"}
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-3">
        {media.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-3 border border-bone/10 bg-coal p-3 sm:grid-cols-[110px_1fr_auto]"
          >
            <div className="relative aspect-[4/3] overflow-hidden border border-bone/10 bg-ink">
              {item.kind === "image" ? (
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="110px"
                  wrapperClassName="absolute inset-0"
                  className="object-cover"
                  fallbackLabel=""
                />
              ) : (
                <div className="grid h-full place-items-center text-bone/40">
                  <Icon name="play" className="h-5 w-5" />
                </div>
              )}
              {index === 0 ? (
                <span className="absolute left-1.5 top-1.5 bg-ember px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-ink">
                  Primary
                </span>
              ) : null}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/35">
                  {item.kind}
                </span>
                <span className="truncate font-mono text-[9px] text-bone/25">
                  {item.src}
                </span>
              </div>
              <input
                defaultValue={item.alt}
                aria-label={`Alt text for ${item.kind}`}
                onBlur={(event) => {
                  if (event.target.value.trim() === item.alt) return;
                  void runMediaAction(item.id, () =>
                    updateMediaAltAction(item.id, event.target.value),
                  );
                }}
                className="mt-2 h-9 w-full border border-bone/12 bg-ink px-2.5 text-xs text-bone/70 focus:border-ember focus:outline-none"
              />
            </div>

            <div className="flex items-start gap-1.5 sm:justify-end">
              <button
                type="button"
                disabled={busyId !== null || index === 0}
                onClick={() =>
                  void runMediaAction(item.id, () =>
                    moveMediaAction(item.id, "up"),
                  )
                }
                aria-label="Move media up"
                className="grid h-8 w-8 place-items-center border border-bone/12 text-bone/45 transition-colors hover:border-bone/35 hover:text-bone disabled:opacity-25"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={busyId !== null || index === media.length - 1}
                onClick={() =>
                  void runMediaAction(item.id, () =>
                    moveMediaAction(item.id, "down"),
                  )
                }
                aria-label="Move media down"
                className="grid h-8 w-8 place-items-center border border-bone/12 text-bone/45 transition-colors hover:border-bone/35 hover:text-bone disabled:opacity-25"
              >
                ↓
              </button>
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => {
                  if (!window.confirm("Remove this media item?")) return;
                  void runMediaAction(item.id, () =>
                    deleteMediaAction(item.id),
                  );
                }}
                aria-label="Delete media"
                className="grid h-8 w-8 place-items-center border border-red-500/20 text-red-300/60 transition-colors hover:border-red-500/50 hover:text-red-200 disabled:opacity-25"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 ? (
        <p className="mt-5 text-sm text-bone/40">
          No media yet. The public page will show the branded placeholder until
          you upload a photo.
        </p>
      ) : null}
    </section>
  );
}
