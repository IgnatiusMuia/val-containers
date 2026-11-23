"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseContainerForm } from "@/lib/validation/container";
import type { ContainerActionState } from "@/lib/actions/container-state";

interface ExistingContainer {
  id: string;
  slug: string;
  published_at: string | null;
  verified_at: string | null;
  verified_by: string | null;
}

function revalidateContainerPaths(slug: string, oldSlug?: string) {
  updateTag("containers");
  updateTag(`container:${slug}`);
  if (oldSlug && oldSlug !== slug) updateTag(`container:${oldSlug}`);

  revalidatePath("/");
  revalidatePath("/containers");
  revalidatePath(`/containers/${slug}`);
  if (oldSlug && oldSlug !== slug) revalidatePath(`/containers/${oldSlug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/admin/containers");
}

export async function saveContainerAction(
  _previousState: ContainerActionState,
  formData: FormData,
): Promise<ContainerActionState> {
  const { user } = await requireAdmin("inventory");

  const parsed = parseContainerForm(formData);

  if (!parsed.success) {
    return {
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";
  const values = parsed.data;

  let existing: ExistingContainer | null = null;

  if (id) {
    const { data, error } = await supabase
      .from("containers")
      .select("id, slug, published_at, verified_at, verified_by")
      .eq("id", id)
      .maybeSingle();

    if (error) return { error: error.message };
    if (!data) return { error: "That listing no longer exists." };
    existing = data as unknown as ExistingContainer;
  }

  const now = new Date().toISOString();
  const publishedAt =
    values.publicationStatus === "published"
      ? (existing?.published_at ?? now)
      : values.publicationStatus === "archived"
        ? (existing?.published_at ?? null)
        : null;

  const payload = {
    slug: values.slug,
    name: values.name,
    short_name: values.shortName,
    type: values.type,
    size: values.size,
    condition: values.condition,
    condition_label: values.conditionLabel || null,
    grade: values.grade || null,
    price: values.price,
    currency: values.currency,
    location: values.location,
    delivery_info: values.deliveryInfo,
    refrigeration_status: values.refrigerationStatus,
    last_inspected_at: values.lastInspectedAt || null,
    verified_at: values.verified
      ? (existing?.verified_at ?? now)
      : null,
    verified_by: values.verified
      ? (existing?.verified_by ?? user.id)
      : null,
    stock: values.stock,
    year: values.year,
    status: values.status,
    publication_status: values.publicationStatus,
    featured: values.featured,
    photos_are_representative: values.photosAreRepresentative,
    description: values.description,
    highlights: values.highlights,
    specs: values.specs,
    condition_notes: values.conditionNotes,
    included: values.included,
    features: values.features,
    best_for: values.bestFor,
    published_at: publishedAt,
  };

  if (id) {
    const { error } = await supabase
      .from("containers")
      .update(payload)
      .eq("id", id);

    if (error) {
      if (error.code === "23505") {
        return {
          error: "That slug is already used by another listing.",
          fieldErrors: { slug: ["Slug must be unique."] },
        };
      }
      return { error: error.message };
    }

    revalidateContainerPaths(values.slug, existing?.slug);
    redirect("/admin/containers?saved=updated");
  }

  const { error } = await supabase.from("containers").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return {
        error: "That slug is already used by another listing.",
        fieldErrors: { slug: ["Slug must be unique."] },
      };
    }
    return { error: error.message };
  }

  revalidateContainerPaths(values.slug);
  redirect("/admin/containers?saved=created");
}

export async function archiveContainerAction(formData: FormData) {
  await requireAdmin("inventory");
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!id) redirect("/admin/containers?error=missing");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/containers?error=config");

  const { error } = await supabase
    .from("containers")
    .update({ publication_status: "archived" })
    .eq("id", id);

  if (error) redirect("/admin/containers?error=archive");

  revalidateContainerPaths(slug);
  redirect("/admin/containers?saved=archived");
}

export async function deleteContainerAction(formData: FormData) {
  await requireAdmin("inventory");
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!id) redirect("/admin/containers?error=missing");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/containers?error=config");

  const { error } = await supabase.from("containers").delete().eq("id", id);
  if (error) redirect("/admin/containers?error=delete");

  revalidateContainerPaths(slug);
  redirect("/admin/containers?saved=deleted");
}

export async function duplicateContainerAction(formData: FormData) {
  await requireAdmin("inventory");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/containers?error=missing");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/containers?error=config");

  const { data, error } = await supabase
    .from("containers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) redirect("/admin/containers?error=duplicate");

  const source = data as Record<string, unknown>;
  const suffix = Date.now().toString(36).slice(-5);
  const rest = { ...source };
  delete rest.id;
  delete rest.reference;
  delete rest.created_at;
  delete rest.updated_at;
  delete rest.published_at;

  const { error: insertError } = await supabase.from("containers").insert({
    ...rest,
    slug: `${String(source.slug)}-copy-${suffix}`,
    name: `${String(source.name)} (copy)`,
    short_name: `${String(source.short_name)} copy`,
    publication_status: "draft",
    featured: false,
    status: "available",
    published_at: null,
  });

  if (insertError) redirect("/admin/containers?error=duplicate");

  updateTag("containers");
  revalidatePath("/admin");
  revalidatePath("/admin/containers");
  redirect("/admin/containers?saved=duplicated");
}
