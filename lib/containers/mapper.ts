import { z } from "zod";
import {
  conditionLabels,
  sizeLabels,
  typeLabels,
  type Container,
  type ContainerMedia,
} from "@/data/containers";

const specsSchema = z.object({
  external: z.string().default(""),
  internal: z.string().default(""),
  tare: z.string().default(""),
  payload: z.string().default(""),
  door: z.string().default(""),
  volume: z.string().default(""),
  floor: z.string().default(""),
  flooring: z.string().default(""),
  ventilation: z.string().default(""),
  extra: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .default([]),
});

const mediaSchema = z.object({
  kind: z.enum(["image", "video"]),
  src: z.string().min(1),
  alt: z.string().min(1),
  poster: z.string().nullable().optional(),
  position: z.number().int().default(0),
});

const containerRowSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  short_name: z.string().min(1),
  type: z.enum(["plain", "fabricated", "refrigerated"]),
  size: z.enum(["20ft", "40ft", "40ft-hc"]),
  condition: z.enum(["new", "used"]),
  condition_label: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
  price: z.number().int().nonnegative(),
  description: z.string().default(""),
  highlights: z.array(z.string()).default([]),
  specs: specsSchema,
  condition_notes: z.array(z.string()).default([]),
  included: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  best_for: z.array(z.string()).default([]),
  photos_are_representative: z.boolean().default(false),
  featured: z.boolean().default(false),
  stock: z.number().int().nonnegative().default(0),
  year: z.number().int().nullable().optional(),
  status: z.enum(["available", "reserved", "sold"]).default("available"),
  published_at: z.string().nullable().optional(),
  updated_at: z.string(),
  container_media: z.array(mediaSchema).default([]),
});

export type ContainerRow = z.infer<typeof containerRowSchema>;

export function mapContainerRow(row: unknown): Container | null {
  const parsed = containerRowSchema.safeParse(row);
  if (!parsed.success) return null;

  const data = parsed.data;
  const media: ContainerMedia[] = [...data.container_media]
    .sort((a, b) => a.position - b.position)
    .map((item) =>
      item.kind === "video"
        ? {
            kind: "video" as const,
            src: item.src,
            alt: item.alt,
            poster: item.poster || "/media/images/photo-coming-soon.jpg",
          }
        : {
            kind: "image" as const,
            src: item.src,
            alt: item.alt,
          },
    );

  if (media.length === 0) {
    media.push({
      kind: "image",
      src: "/media/images/photo-coming-soon.jpg",
      alt: `Photo coming soon for ${data.short_name}`,
    });
  }

  const addedAt = data.published_at ?? data.updated_at;
  const parsedYear = new Date(addedAt).getFullYear();

  return {
    slug: data.slug,
    name: data.name,
    shortName: data.short_name,
    type: data.type,
    typeLabel: typeLabels[data.type],
    size: data.size,
    sizeLabel: sizeLabels[data.size],
    condition: data.condition,
    conditionLabel:
      data.condition_label ?? conditionLabels[data.condition],
    grade: data.grade || "—",
    price: data.price,
    media,
    photosAreRepresentative: data.photos_are_representative,
    description: data.description,
    highlights: data.highlights,
    specs: data.specs,
    conditionReport: data.condition_notes,
    included: data.included,
    features: data.features,
    bestFor: data.best_for,
    featured: data.featured,
    addedAt,
    stock: data.stock,
    year: data.year ?? (Number.isNaN(parsedYear) ? 2026 : parsedYear),
    status: data.status,
  };
}
