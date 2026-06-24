import faqsJson from "./faqs.json";
import { faqsSchema, type Faq } from "./faqs.schema";

export const faqs: Faq[] = faqsSchema.parse(faqsJson);

/**
 * FAQs for a given scope. "global" FAQs are always included; passing a category
 * key or product slug adds the FAQs scoped to it.
 */
export function getFaqsForScope(scope?: string): Faq[] {
  const global = faqs.filter((f) => f.scope === "global");
  if (!scope || scope === "global") return global;
  const scoped = faqs.filter((f) => f.scope === scope);
  return [...scoped, ...global];
}
