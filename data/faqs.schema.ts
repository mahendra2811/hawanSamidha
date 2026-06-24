import { z } from "zod";
import { localizedSchema } from "./products.schema";

/**
 * FAQ scope:
 *  - "global"        shown site-wide (home, etc.)
 *  - <category key>  shown on products in that category
 *  - <product slug>  shown only on that product
 */
export const faqSchema = z.object({
  id: z.string().min(1),
  question: localizedSchema,
  answer: localizedSchema,
  scope: z.string().default("global"),
});
export type Faq = z.infer<typeof faqSchema>;

export const faqsSchema = z.array(faqSchema);
