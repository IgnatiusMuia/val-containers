"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function revalidateContent() {
  updateTag("site-content");
  updateTag("faqs");
  updateTag("gallery");
  updateTag("announcements");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/delivery");
  revalidatePath("/admin/content");
}

export async function saveContentDraftAction(formData: FormData) {
  const { user } = await requireAdmin("content");
  const key = text(formData, "key");
  const value = text(formData, "value");
  if (!key) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase.from("site_content_drafts").upsert({
    key,
    value,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Could not save content draft:", error.message);
    return;
  }

  updateTag("site-content");
  revalidatePath("/admin/content");
}

export async function publishContentAction(formData: FormData) {
  const { user } = await requireAdmin("content");
  const key = text(formData, "key");
  const value = text(formData, "value");
  if (!key) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from("site_content")
    .update({
      value,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("key", key);

  if (error) {
    console.error("Could not publish content:", error.message);
    return;
  }

  await supabase.from("site_content_drafts").delete().eq("key", key);
  revalidateContent();
}

export async function discardContentDraftAction(formData: FormData) {
  await requireAdmin("content");
  const key = text(formData, "key");
  if (!key) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  await supabase.from("site_content_drafts").delete().eq("key", key);
  updateTag("site-content");
  revalidatePath("/admin/content");
}

export async function saveFaqAction(formData: FormData) {
  await requireAdmin("content");
  const id = text(formData, "id");
  const question = text(formData, "question");
  const answer = text(formData, "answer");
  const category = text(formData, "category") || "general";
  const position = Number(text(formData, "position") || "0");
  const active = formData.get("active") === "on";

  if (!question || !answer) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const payload = {
    question,
    answer,
    category,
    position: Number.isFinite(position) ? position : 0,
    active,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("faqs").update(payload).eq("id", id)
    : await supabase.from("faqs").insert(payload);

  if (error) {
    console.error("Could not save FAQ:", error.message);
    return;
  }

  revalidateContent();
}

export async function deleteFaqAction(formData: FormData) {
  await requireAdmin("content");
  const id = text(formData, "id");
  if (!id) return;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  await supabase.from("faqs").delete().eq("id", id);
  revalidateContent();
}

export async function saveGalleryItemAction(formData: FormData) {
  await requireAdmin("content");
  const id = text(formData, "id");
  const title = text(formData, "title");
  const caption = text(formData, "caption");
  const src = text(formData, "src");
  const alt = text(formData, "alt");
  const position = Number(text(formData, "position") || "0");
  const publicationStatus = text(formData, "publicationStatus") || "draft";

  if (!title || !src || !alt) return;
  if (!/^https?:\/\//i.test(src) && !src.startsWith("/")) return;
  if (!["draft", "published", "archived"].includes(publicationStatus)) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const payload = {
    title,
    caption,
    src,
    alt,
    position: Number.isFinite(position) ? position : 0,
    publication_status: publicationStatus,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("gallery_items").update(payload).eq("id", id)
    : await supabase.from("gallery_items").insert(payload);

  if (error) {
    console.error("Could not save gallery item:", error.message);
    return;
  }

  revalidateContent();
}

export async function deleteGalleryItemAction(formData: FormData) {
  await requireAdmin("content");
  const id = text(formData, "id");
  if (!id) return;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  await supabase.from("gallery_items").delete().eq("id", id);
  revalidateContent();
}
