import { z } from "zod";

export const enquiryInputSchema = z.object({
  name: z.string().trim().min(2, "Add your name.").max(120),
  phone: z.string().trim().min(7, "Add a phone number.").max(40),
  email: z
    .union([z.string().trim().email("Use a valid email."), z.literal("")])
    .optional()
    .default(""),
  company: z.string().trim().max(120).optional().default(""),
  preferredContact: z
    .enum(["whatsapp", "phone", "email"])
    .optional()
    .default("whatsapp"),
  containerId: z.string().trim().max(64).optional().default(""),
  quantity: z.coerce.number().int().min(1).max(1000).optional().default(1),
  conditionPreference: z.string().trim().max(80).optional().default(""),
  deliveryLocation: z.string().trim().max(200).optional().default(""),
  deliveryCounty: z.string().trim().max(80).optional().default(""),
  timeline: z.string().trim().max(120).optional().default(""),
  useCase: z.string().trim().max(200).optional().default(""),
  message: z
    .string()
    .trim()
    .min(5, "Tell us what you need.")
    .max(4000, "Keep the message under 4,000 characters."),
  source: z.string().trim().max(80).optional().default("website"),
  pagePath: z.string().trim().max(300).optional().default(""),
  website: z.string().optional().default(""),
});

export type EnquiryInput = z.infer<typeof enquiryInputSchema>;
