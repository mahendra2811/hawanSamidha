import { z } from "zod";

// Indian 10-digit mobile (starts 6-9). Email kept regex-based for zod-version safety.
export const MOBILE_RE = /^[6-9]\d{9}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const enquiryItemSchema = z.object({
  slug: z.string().min(1),
  tierId: z.string().min(1),
  name: z.string().min(1),
  tier: z.string().min(1),
  qty: z.number().int().positive(),
});

export const enquirySchema = z.object({
  name: z.string().trim().min(1),
  mobile: z.string().regex(MOBILE_RE),
  email: z
    .string()
    .trim()
    .regex(EMAIL_RE)
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(2000).optional(),
  items: z.array(enquiryItemSchema).default([]),
});

export type EnquiryPayload = z.infer<typeof enquirySchema>;
