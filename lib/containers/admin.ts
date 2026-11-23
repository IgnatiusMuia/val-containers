import "server-only";

import type {
  ContainerCondition,
  ContainerSize,
  ContainerSpecs,
  ContainerType,
} from "@/data/containers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { containerStatuses } from "@/lib/validation/container";

export type AdminContainerStatus = (typeof containerStatuses)[number];
export type AdminPublicationStatus = "draft" | "published" | "archived";

export interface AdminMediaRecord {
  id: string;
  kind: "image" | "video";
  src: string;
  storage_path: string | null;
  alt: string;
  poster: string | null;
  poster_path: string | null;
  position: number;
  is_cover: boolean;
}

export interface AdminContainerRecord {
  id: string;
  reference: string;
  slug: string;
  name: string;
  short_name: string;
  type: ContainerType;
  size: ContainerSize;
  condition: ContainerCondition;
  condition_label: string | null;
  grade: string | null;
  price: number;
  currency: string;
  location: string;
  delivery_info: string;
  refrigeration_status: string;
  last_inspected_at: string | null;
  verified_at: string | null;
  publication_status: AdminPublicationStatus;
  stock: number;
  year: number | null;
  status: AdminContainerStatus;
  featured: boolean;
  photos_are_representative: boolean;
  description: string;
  highlights: string[];
  specs: ContainerSpecs;
  condition_notes: string[];
  included: string[];
  features: string[];
  best_for: string[];
  published_at: string | null;
  updated_at: string;
  created_at: string;
  container_media: AdminMediaRecord[];
}

export interface AdminContainerSummary {
  id: string;
  reference: string;
  slug: string;
  name: string;
  short_name: string;
  status: AdminContainerStatus;
  publication_status: AdminPublicationStatus;
  price: number;
  stock: number;
  featured: boolean;
  updated_at: string;
}

const ADMIN_CONTAINER_SELECT = `
  id,
  reference,
  slug,
  name,
  short_name,
  type,
  size,
  condition,
  condition_label,
  grade,
  price,
  currency,
  location,
  delivery_info,
  refrigeration_status,
  last_inspected_at,
  verified_at,
  publication_status,
  stock,
  year,
  status,
  featured,
  photos_are_representative,
  description,
  highlights,
  specs,
  condition_notes,
  included,
  features,
  best_for,
  published_at,
  updated_at,
  created_at,
  container_media ( id, kind, src, storage_path, alt, poster, poster_path, position, is_cover )
`;

export interface AdminLibraryMedia {
  id: string;
  kind: "image" | "video";
  src: string;
  alt: string;
  poster: string | null;
  position: number;
  is_cover: boolean;
  storage_path: string | null;
  container_id: string;
  containers: { name: string; reference: string } | null;
}

export async function getAdminContainers() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("containers")
    .select(
      "id, reference, slug, name, short_name, status, publication_status, price, stock, featured, updated_at",
    )
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AdminContainerSummary[];
}

export async function getAdminContainer(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("containers")
    .select(ADMIN_CONTAINER_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  const record = (data as unknown as AdminContainerRecord | null) ?? null;
  if (record) {
    record.container_media.sort(
      (a, b) =>
        Number(b.is_cover) - Number(a.is_cover) || a.position - b.position,
    );
  }
  return record;
}

export async function getAdminMedia() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("container_media")
    .select(
      "id, kind, src, alt, poster, position, is_cover, storage_path, container_id, containers ( name, reference )",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AdminLibraryMedia[];
}
