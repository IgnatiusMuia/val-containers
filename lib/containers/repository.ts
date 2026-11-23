import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { Container } from "@/data/containers";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { mapContainerRow } from "@/lib/containers/mapper";

const CONTAINER_SELECT = `
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
  verified_at,
  publication_status,
  description,
  highlights,
  specs,
  condition_notes,
  included,
  features,
  best_for,
  photos_are_representative,
  featured,
  stock,
  year,
  status,
  published_at,
  updated_at,
  container_media ( kind, src, alt, poster, position, is_cover )
`;

export interface ContainerStats {
  total: number;
  available: number;
  reserved: number;
  units: number;
  plain: number;
  fabricated: number;
  refrigerated: number;
  featured: number;
  minPrice: number;
  maxPrice: number;
  latestUpdate: string;
}

export async function getContainers(): Promise<Container[]> {
  "use cache";
  cacheTag("containers");
  cacheLife("hours");

  const supabase = createSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("containers")
    .select(CONTAINER_SELECT)
    .eq("publication_status", "published")
    .in("status", ["available", "reserved", "inspection"])
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error(`Could not load containers from Supabase: ${error.message}`);
    return [];
  }

  return (data ?? [])
    .map(mapContainerRow)
    .filter((container): container is Container => container !== null);
}

export async function getContainerStats(): Promise<ContainerStats> {
  const containers = await getContainers();

  return {
    total: containers.length,
    available: containers.filter((item) => item.status === "available").length,
    reserved: containers.filter((item) => item.status === "reserved").length,
    units: containers.reduce((sum, item) => sum + item.stock, 0),
    plain: containers.filter((item) => item.type === "plain").length,
    fabricated: containers.filter((item) => item.type === "fabricated").length,
    refrigerated: containers.filter((item) => item.type === "refrigerated")
      .length,
    featured: containers.filter((item) => item.featured).length,
    minPrice: containers.length
      ? Math.min(...containers.map((item) => item.price))
      : 0,
    maxPrice: containers.length
      ? Math.max(...containers.map((item) => item.price))
      : 0,
    latestUpdate: containers.reduce(
      (latest, item) => (item.addedAt > latest ? item.addedAt : latest),
      containers[0]?.addedAt ?? "",
    ),
  };
}

export async function getContainer(slug: string) {
  const all = await getContainers();
  return all.find((container) => container.slug === slug);
}

export async function getFeaturedContainers() {
  const all = await getContainers();
  return all.filter((container) => container.featured);
}

export async function getContainerSlugs() {
  const all = await getContainers();
  return all.map((container) => container.slug);
}

export async function getRelatedContainers(container: Container, limit = 4) {
  const all = await getContainers();

  return all
    .filter((item) => item.slug !== container.slug)
    .map((item) => {
      let score = 0;
      if (item.type === container.type) score += 3;
      if (item.size === container.size) score += 2;
      if (item.condition === container.condition) score += 1;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || b.item.price - a.item.price)
    .slice(0, limit)
    .map((entry) => entry.item);
}
