"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseContainerForm } from "@/lib/validation/container";
import type { ContainerActionState } from "@/lib/actions/container-state";

const publicStatuses = new Set(["available", "reserved", "sold"]);

function revalidateContainerPaths(slug: string, oldSlug?: string) {
  updateTag("containers");
  updateTag(`container:${slug}`);
  if (oldSlug && oldSlug !== slug) updateTag(`container:${oldSlug}`);

  revalidatePath("/");
  revalidatePath("/containers");
  revalidatePath(`/containers/${slug}`);
  if (oldSlug && oldSlug !== slug) revalidatePath(`/containers/${oldSlug}`);
  revalidatePath("/sitemap.xml");
}

export async function saveContainerAction(
  _previousState: ContainerActionState,
  formData: FormData,
): Promise<ContainerActionState> {
  await requireAdmin();

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

  let existing: {
    id: string;
    slug: string;
    published_at: string | null;
  } | null = null;

  if (id) {
    const { data, error } = await supabase
      .from("containers")
      .select("id, slug, published_at")
      .eq("id", id)
      .maybeSingle();

    if (error) return { error: error.message };
    if (!data) return { error: "That listing no longer exists." };
    existing = data;
  }

  const isPublic = publicStatuses.has(values.status);
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
    stock: values.stock,
    year: values.year,
    status: values.status,
    featured: values.featured,
    photos_are_representative: values.photosAreRepresentative,
    description: values.description,
    highlights: values.highlights,
    specs: values.specs,
    condition_notes: values.conditionNotes,
    included: values.included,
    features: values.features,
    best_for: values.bestFor,
    published_at: isPublic
      ? (existing?.published_at ?? new Date().toISOString())
      : null,
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
