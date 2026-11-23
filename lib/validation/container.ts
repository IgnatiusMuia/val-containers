import { z } from "zod";

export const containerStatuses = [
  "draft",
  "available",
  "reserved",
  "sold",
  "archived",
] as const;

export const containerTypes = ["plain", "fabricated", "refrigerated"] as const;
export const containerSizes = ["20ft", "40ft", "40ft-hc"] as const;
export const containerConditions = ["new", "used"] as const;

export const containerFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
  name: z.string().trim().min(1, "Name is required."),
  shortName: z.string().trim().min(1, "Short name is required."),
  type: z.enum(containerTypes),
  size: z.enum(containerSizes),
  condition: z.enum(containerConditions),
  conditionLabel: z.string().trim().optional(),
  grade: z.string().trim().optional(),
  price: z.coerce.number().int().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
  year: z.coerce.number().int().min(1990).max(2100),
  status: z.enum(containerStatuses),
  featured: z.boolean(),
  photosAreRepresentative: z.boolean(),
  description: z.string().trim().min(1, "Description is required."),
  highlights: z.array(z.string()),
  conditionNotes: z.array(z.string()),
  included: z.array(z.string()),
  features: z.array(z.string()),
  bestFor: z.array(z.string()),
  specs: z.object({
    external: z.string().trim(),
    internal: z.string().trim(),
    tare: z.string().trim(),
    payload: z.string().trim(),
    door: z.string().trim(),
    volume: z.string().trim(),
    floor: z.string().trim(),
    flooring: z.string().trim(),
    ventilation: z.string().trim(),
    extra: z.array(z.object({ label: z.string(), value: z.string() })),
  }),
});

export type ContainerFormInput = z.infer<typeof containerFormSchema>;

export function readString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function readLines(value: FormDataEntryValue | null) {
  return readString(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function readExtraSpecs(value: FormDataEntryValue | null) {
  return readLines(value).map((line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return { label: line, value: "" };
    return {
      label: line.slice(0, separator).trim(),
      value: line.slice(separator + 1).trim(),
    };
  });
}

export function parseContainerForm(formData: FormData) {
  return containerFormSchema.safeParse({
    slug: readString(formData.get("slug")),
    name: readString(formData.get("name")),
    shortName: readString(formData.get("shortName")),
    type: readString(formData.get("type")),
    size: readString(formData.get("size")),
    condition: readString(formData.get("condition")),
    conditionLabel: readString(formData.get("conditionLabel")) || undefined,
    grade: readString(formData.get("grade")) || undefined,
    price: readString(formData.get("price")),
    stock: readString(formData.get("stock")),
    year: readString(formData.get("year")),
    status: readString(formData.get("status")),
    featured: formData.get("featured") === "on",
    photosAreRepresentative:
      formData.get("photosAreRepresentative") === "on",
    description: readString(formData.get("description")),
    highlights: readLines(formData.get("highlights")),
    conditionNotes: readLines(formData.get("conditionNotes")),
    included: readLines(formData.get("included")),
    features: readLines(formData.get("features")),
    bestFor: readLines(formData.get("bestFor")),
    specs: {
      external: readString(formData.get("external")),
      internal: readString(formData.get("internal")),
      tare: readString(formData.get("tare")),
      payload: readString(formData.get("payload")),
      door: readString(formData.get("door")),
      volume: readString(formData.get("volume")),
      floor: readString(formData.get("floor")),
      flooring: readString(formData.get("flooring")),
      ventilation: readString(formData.get("ventilation")),
      extra: readExtraSpecs(formData.get("extraSpecs")),
    },
  });
}
