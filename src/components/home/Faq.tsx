import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import type { Faq } from "@data/faqs.schema";
import { pick } from "@/lib/i18n";

/**
 * Shared FAQ block: localized accordion + FAQPage JSON-LD.
 * Used on the home page, PDP, and blog posts.
 */
export function FaqBlock({
  faqs,
  locale,
  title,
}: {
  faqs: Faq[];
  locale: string;
  title: string;
}) {
  if (faqs.length === 0) return null;
  const items = faqs.map((f) => ({
    id: f.id,
    question: pick(f.question, locale),
    answer: pick(f.answer, locale),
  }));

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl font-semibold text-text">{title}</h2>
      <Accordion items={items} />
      <JsonLd data={faqJsonLd(items)} />
    </div>
  );
}
