"use server";

import { revalidatePath, updateTag } from "next/cache";
import sharp from "sharp";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MediaActionState } from "@/lib/actions/media-state";

const BUCKET = "container-media";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const IMAGE_FORMATS = new Set(["jpeg", "png", "webp"]);

function invalidateContainer(slug: string) {
  updateTag("containers");
  updateTag(`container:${slug}`);
  revalidatePath("/");
  revalidatePath("/containers");
  revalidatePath(`/containers/${slug}`);
  revalidatePath("/sitemap.xml");
}

async function getContainerSlug(containerId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("containers")
    .select("slug")
    .eq("id", containerId)
    .maybeSingle();

  return data?.slug ?? null;
}

async function validateImage(buffer: Buffer) {
  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    return "Image is larger than 8 MB.";
  }

  try {
    const metadata = await sharp(buffer).metadata();
    if (!metadata.format || !IMAGE_FORMATS.has(metadata.format)) {
      return "Use a JPEG, PNG or WebP image.";
    }
  } catch {
    return "That file is not a readable image.";
  }

  return null;
}

function validateVideo(buffer: Buffer, path: string) {
  if (buffer.byteLength > MAX_VIDEO_BYTES) {
    return "Video is larger than 50 MB.";
  }
  if (!path.toLowerCase().endsWith(".mp4")) {
    return "Video must be an MP4 file.";
  }
  if (buffer.subarray(4, 8).toString("ascii") !== "ftyp") {
    return "That file is not a valid MP4.";
  }
  return null;
}

async function removeObjects(paths: string[]) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const valid = paths.filter(Boolean);
  if (valid.length === 0) return;
  await supabase.storage.from(BUCKET).remove(valid);
}

export async function createMediaUploadAction(
  containerId: string,
  fileName: string,
): Promise<MediaActionState> {
  await requireAdmin("media");

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const safeName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-80);

  const path = `${containerId}/${crypto.randomUUID()}-${safeName || "upload"}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);

  if (error) return { error: error.message };

  return { ok: true, ticket: { path, token: data.token } };
}

export async function finalizeMediaAction({
  containerId,
  path,
  kind,
  alt,
  posterPath,
}: {
  containerId: string;
  path: string;
  kind: "image" | "video";
  alt: string;
  posterPath?: string;
}): Promise<MediaActionState> {
  await requireAdmin("media");

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const cleanAlt = alt.trim();
  if (cleanAlt.length < 3) return { error: "Add meaningful alt text." };
  if (cleanAlt.length > 220) return { error: "Alt text is too long." };
  if (!path.startsWith(`${containerId}/`)) {
    return { error: "Invalid upload path." };
  }
  if (posterPath && !posterPath.startsWith(`${containerId}/`)) {
    return { error: "Invalid poster path." };
  }

  const uploaded = [path, posterPath].filter(Boolean) as string[];

  const { data: file, error: downloadError } = await supabase.storage
    .from(BUCKET)
    .download(path);

  if (downloadError || !file) {
    await removeObjects(uploaded);
    return { error: downloadError?.message ?? "Upload not found." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const imageError = kind === "image" ? await validateImage(buffer) : null;
  const videoError = kind === "video" ? validateVideo(buffer, path) : null;
  const fileError = imageError ?? videoError;

  if (fileError) {
    await removeObjects(uploaded);
    return { error: fileError };
  }

  let poster: string | null = null;
  let posterStoragePath: string | null = null;

  if (kind === "video" && posterPath) {
    const { data: posterFile, error: posterError } = await supabase.storage
      .from(BUCKET)
      .download(posterPath);

    if (posterError || !posterFile) {
      await removeObjects(uploaded);
      return { error: posterError?.message ?? "Poster image not found." };
    }

    const posterBuffer = Buffer.from(await posterFile.arrayBuffer());
    const posterImageError = await validateImage(posterBuffer);
    if (posterImageError) {
      await removeObjects(uploaded);
      return { error: `Poster: ${posterImageError}` };
    }

    poster = supabase.storage.from(BUCKET).getPublicUrl(posterPath).data.publicUrl;
    posterStoragePath = posterPath;
  }

  const src = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const { data: last } = await supabase
    .from("container_media")
    .select("position")
    .eq("container_id", containerId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { count } = await supabase
    .from("container_media")
    .select("id", { count: "exact", head: true })
    .eq("container_id", containerId);

  const { error: insertError } = await supabase.from("container_media").insert({
    container_id: containerId,
    kind,
    src,
    storage_path: path,
    alt: cleanAlt,
    poster,
    poster_path: posterStoragePath,
    position: (last?.position ?? -1) + 1,
    is_cover: (count ?? 0) === 0,
  });

  if (insertError) {
    await removeObjects(uploaded);
    return { error: insertError.message };
  }

  const slug = await getContainerSlug(containerId);
  if (slug) invalidateContainer(slug);

  return { ok: true };
}

export async function setCoverMediaAction(
  mediaId: string,
): Promise<MediaActionState> {
  await requireAdmin("media");

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { data: media, error: findError } = await supabase
    .from("container_media")
    .select("container_id")
    .eq("id", mediaId)
    .maybeSingle();

  if (findError || !media) {
    return { error: findError?.message ?? "Media not found." };
  }

  const { error: clearError } = await supabase
    .from("container_media")
    .update({ is_cover: false })
    .eq("container_id", media.container_id);

  if (clearError) return { error: clearError.message };

  const { error } = await supabase
    .from("container_media")
    .update({ is_cover: true })
    .eq("id", mediaId);

  if (error) return { error: error.message };

  const slug = await getContainerSlug(media.container_id);
  if (slug) invalidateContainer(slug);
  return { ok: true };
}

export async function updateMediaAltAction(
  mediaId: string,
  alt: string,
): Promise<MediaActionState> {
  await requireAdmin("media");

  const cleanAlt = alt.trim();
  if (cleanAlt.length < 3) return { error: "Add meaningful alt text." };
  if (cleanAlt.length > 220) return { error: "Alt text is too long." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { data: media, error: findError } = await supabase
    .from("container_media")
    .select("container_id")
    .eq("id", mediaId)
    .maybeSingle();

  if (findError || !media) return { error: findError?.message ?? "Media not found." };

  const { error } = await supabase
    .from("container_media")
    .update({ alt: cleanAlt })
    .eq("id", mediaId);

  if (error) return { error: error.message };

  const slug = await getContainerSlug(media.container_id);
  if (slug) invalidateContainer(slug);
  return { ok: true };
}

export async function deleteMediaAction(
  mediaId: string,
): Promise<MediaActionState> {
  await requireAdmin("media");

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { data: media, error: findError } = await supabase
    .from("container_media")
    .select("container_id, storage_path, poster_path")
    .eq("id", mediaId)
    .maybeSingle();

  if (findError || !media) return { error: findError?.message ?? "Media not found." };

  const { error } = await supabase
    .from("container_media")
    .delete()
    .eq("id", mediaId);

  if (error) return { error: error.message };

  await removeObjects(
    [media.storage_path, media.poster_path].filter(Boolean) as string[],
  );

  const slug = await getContainerSlug(media.container_id);
  if (slug) invalidateContainer(slug);
  return { ok: true };
}

export async function moveMediaAction(
  mediaId: string,
  direction: "up" | "down",
): Promise<MediaActionState> {
  await requireAdmin("media");

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { data: current, error: findError } = await supabase
    .from("container_media")
    .select("id, container_id, position")
    .eq("id", mediaId)
    .maybeSingle();

  if (findError || !current) {
    return { error: findError?.message ?? "Media not found." };
  }

  let neighborQuery = supabase
    .from("container_media")
    .select("id, position")
    .eq("container_id", current.container_id);

  neighborQuery =
    direction === "up"
      ? neighborQuery
          .lt("position", current.position)
          .order("position", { ascending: false })
      : neighborQuery
          .gt("position", current.position)
          .order("position", { ascending: true });

  const { data: neighbor, error: neighborError } = await neighborQuery
    .limit(1)
    .maybeSingle();

  if (neighborError) return { error: neighborError.message };
  if (!neighbor) return { ok: true };

  const { error: firstError } = await supabase
    .from("container_media")
    .update({ position: neighbor.position })
    .eq("id", current.id);

  if (firstError) return { error: firstError.message };

  const { error: secondError } = await supabase
    .from("container_media")
    .update({ position: current.position })
    .eq("id", neighbor.id);

  if (secondError) return { error: secondError.message };

  const slug = await getContainerSlug(current.container_id);
  if (slug) invalidateContainer(slug);
  return { ok: true };
}
