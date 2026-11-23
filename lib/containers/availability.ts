import type { Container } from "@/data/containers";

export function availabilityLabel(container: Container) {
  if (container.status === "inspection") return "Inspection only";
  if (!container.verifiedAt) return "Availability on request";
  if (container.stock <= 0) return "Sold out";
  if (container.status === "available") return "Available";
  if (container.status === "reserved") return "Reserved";
  return "Availability on request";
}

export function availabilitySchema(container: Container) {
  if (!container.verifiedAt) return "https://schema.org/LimitedAvailability";
  if (container.stock <= 0) return "https://schema.org/SoldOut";
  if (container.status === "available") return "https://schema.org/InStock";
  if (container.status === "sold") return "https://schema.org/SoldOut";
  return "https://schema.org/LimitedAvailability";
}
