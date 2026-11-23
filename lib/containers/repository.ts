import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import {
  containers as staticContainers,
  type Container,
} from "@/data/containers";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { mapContainerRow } from "@/lib/containers/mapper";

const CONTAINER_SELECT = `
  slug,
  name,
  short_name,
  type,
  size,
  condition,
  condition_label,
  grade,
  price,
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
  container_media ( kind, src, alt, poster, position )
`;

export async function getContainers(): Promise<Container[]> {
  "use cache";
  cacheTag("containers");
  cacheLife("hours");

  const supabase = createSupabasePublicClient();
  if (!supabase) return staticContainers;

  try {
    const { data, error } = await supabase
      .from("containers")
      .select(CONTAINER_SELECT)
      .in("status", ["available", "reserved", "sold"])
      .order("published_at", { ascending: false, nullsFirst: false });

    if (error) {
      console.error(`Could not load containers from Supabase: ${error.message}`);
      return staticContainers;
    }

    return (data ?? [])
      .map(mapContainerRow)
      .filter((container): container is Container => container !== null);
  } catch (cause) {
    console.error("Could not load containers from Supabase:", cause);
    return staticContainers;
  }
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

export async function getRelatedContainers(
  container: Container,
  limit = 4,
) {
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
