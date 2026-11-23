import { site } from "@/data/site";

export function waLink(message: string, phone: string = site.whatsappNumber) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const waMessages = {
  general:
    "Hi Val Containers, I'd like to ask about a shipping container. Could you share availability and pricing?",
  quote:
    "Hi Val Containers, I'd like a free quote. I'm looking for help choosing the right container.",
  viewing:
    "Hi Val Containers, I'd like to arrange to view a container at your Nairobi yard. When can I visit?",
  delivery:
    "Hi Val Containers, I'd like a delivery quote. Please let me know what details you need about my site.",
  fabrication:
    "Hi Val Containers, I'm interested in a fabricated container. Please share the process, lead time and pricing.",
} as const;

export function containerEnquiry(input: {
  name: string;
  sizeLabel: string;
  conditionLabel: string;
  priceLabel: string;
}) {
  return `Hi Val Containers, I'm interested in the ${input.name} (${input.sizeLabel}, ${input.conditionLabel}) listed at ${input.priceLabel}. Is it still available?`;
}

export function quoteMessage(input: {
  useCase?: string;
  type?: string;
  size?: string;
  condition?: string;
  timeline?: string;
  location?: string;
  name?: string;
  phone?: string;
  notes?: string;
}) {
  const lines = [
    "Hi Val Containers, I'd like a free quote.",
    input.useCase ? `Use: ${input.useCase}` : "",
    input.type ? `Container type: ${input.type}` : "",
    input.size ? `Size: ${input.size}` : "",
    input.condition ? `Condition: ${input.condition}` : "",
    input.timeline ? `Timeline: ${input.timeline}` : "",
    input.location ? `Delivery location: ${input.location}` : "",
    input.name ? `Name: ${input.name}` : "",
    input.phone ? `Phone: ${input.phone}` : "",
    input.notes ? `Notes: ${input.notes}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

export function contactMessage(input: {
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  message: string;
}) {
  return [
    `Hi Val Containers, my name is ${input.name}.`,
    `Phone: ${input.phone}`,
    input.email ? `Email: ${input.email}` : "",
    input.interest ? `Interested in: ${input.interest}` : "",
    "",
    input.message,
  ]
    .filter((line) => line !== "")
    .join("\n");
}
