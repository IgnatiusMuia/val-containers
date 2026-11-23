import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { containers } from "../data/containers";

function loadEnvFile(file: string) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local first.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const rows = containers.map((container) => ({
    slug: container.slug,
    name: container.name,
    short_name: container.shortName,
    type: container.type,
    size: container.size,
    condition: container.condition,
    condition_label: container.conditionLabel,
    grade: container.grade,
    price: container.price,
    description: container.description,
    highlights: container.highlights,
    specs: container.specs,
    condition_notes: container.conditionReport,
    included: container.included,
    features: container.features,
    best_for: container.bestFor,
    photos_are_representative: container.photosAreRepresentative ?? false,
    featured: container.featured,
    status: "available",
    stock: container.stock,
    year: container.year,
    published_at: new Date(container.addedAt).toISOString(),
  }));

  const { data: existing, error: existingError } = await supabase
    .from("containers")
    .select("id, slug");

  if (existingError) {
    console.error("Could not load existing containers:", existingError.message);
    process.exitCode = 1;
    return;
  }

  const idBySlug = new Map((existing ?? []).map((row) => [row.slug, row.id]));
  const missing = rows.filter((row) => !idBySlug.has(row.slug));

  if (missing.length > 0) {
    const { data: saved, error: insertError } = await supabase
      .from("containers")
      .insert(missing)
      .select("id, slug");

    if (insertError) {
      console.error("Could not seed containers:", insertError.message);
      process.exitCode = 1;
      return;
    }

    for (const row of saved ?? []) idBySlug.set(row.slug, row.id);
  }

  let mediaCount = 0;
  let mediaSkipped = 0;

  for (const container of containers) {
    const containerId = idBySlug.get(container.slug);
    if (!containerId) {
      console.error(`Missing database id for ${container.slug}`);
      process.exitCode = 1;
      continue;
    }

    const { count, error: countError } = await supabase
      .from("container_media")
      .select("id", { count: "exact", head: true })
      .eq("container_id", containerId);

    if (countError) {
      console.error(
        `Could not check media for ${container.slug}:`,
        countError.message,
      );
      process.exitCode = 1;
      continue;
    }

    if ((count ?? 0) > 0) {
      mediaSkipped += 1;
      continue;
    }

    const media = container.media.map((item, index) => ({
      container_id: containerId,
      kind: item.kind,
      src: item.src,
      alt: item.alt,
      poster: item.kind === "video" ? item.poster : null,
      position: index,
    }));

    if (media.length === 0) continue;

    const { error: mediaError } = await supabase
      .from("container_media")
      .insert(media);

    if (mediaError) {
      console.error(
        `Could not seed media for ${container.slug}:`,
        mediaError.message,
      );
      process.exitCode = 1;
      continue;
    }

    mediaCount += media.length;
  }

  console.log(
    `Created ${missing.length} new container(s); left ${rows.length - missing.length} existing listing(s) untouched.`,
  );
  console.log(
    `Added ${mediaCount} media row(s); skipped ${mediaSkipped} container(s) that already had media.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
