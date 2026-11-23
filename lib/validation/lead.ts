import { z } from "zod";

export const leadStatuses = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
  "archived",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export const leadInputSchema = z.object({
  name: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().optional().default(""),
  email: z.string().trim().email().optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().default(""),
  interest: z.string().trim().max(120).optional().default(""),
  source: z.string().trim().max(80).optional().default("site"),
  pagePath: z.string().trim().max(300).optional().default(""),
  containerSlug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]*$/)
    .optional()
    .default(""),
  website: z.string().optional().default(""),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}
