"use client";

import { Accordion, type AccordionItem } from "@/components/ui/Accordion";

/** Renders a localized FAQ accordion. JSON-LD is emitted separately by the page. */
export function ProductFaq({ items }: { items: AccordionItem[] }) {
  if (items.length === 0) return null;
  return <Accordion items={items} />;
}
