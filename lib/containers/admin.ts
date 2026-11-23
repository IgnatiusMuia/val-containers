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

export interface AdminMediaRecord {
  id: string;
  kind: "image" | "video";
  src: string;
  storage_path: string | null;
  alt: string;
  poster: string | null;
  poster_path: string | null;
  position: number;
}

export interface AdminContainerRecord {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  type: ContainerType;
  size: ContainerSize;
  condition: ContainerCondition;
  condition_label: string | null;
  grade: string | null;
  price: number;
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
  slug: string;
  name: string;
  short_name: string;
  status: AdminContainerStatus;
  price: number;
  stock: number;
  featured: boolean;
  updated_at: string;
}

const ADMIN_CONTAINER_SELECT = `
  id,
  slug,
  name,
  short_name,
  type,
  size,
  condition,
  condition_label,
  grade,
  price,
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
  container_media ( id, kind, src, storage_path, alt, poster, poster_path, position )
`;

export async function getAdminContainers() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("containers")
    .select("id, slug, name, short_name, status, price, stock, featured, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminContainerSummary[];
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
  return (data as AdminContainerRecord | null) ?? null;
}
