import type { CartLine } from "@/store/cart";
import { pick } from "@/lib/i18n";

/** Prefilled WhatsApp/email body for a whole-cart enquiry. */
export function buildCartEnquiry(lines: CartLine[], locale: string): string {
  if (lines.length === 0) return "Hi, I'd like a wholesale quote.";
  const items = lines
    .map((l) => `• ${pick(l.name, locale)} — ${pick(l.tierLabel, locale)} × ${l.qty}`)
    .join("\n");
  return `Hi, I'd like a wholesale quote for:\n${items}`;
}

/** Prefilled body for a single-product enquiry. */
export function buildProductEnquiry(
  name: string,
  tierLabel: string,
  qty: number,
  locale: string,
): string {
  return locale === "hi"
    ? `नमस्ते, मुझे इस उत्पाद के लिए थोक मूल्य चाहिए: ${name} — ${tierLabel} × ${qty}`
    : `Hi, I'd like a wholesale quote for: ${name} — ${tierLabel} × ${qty}`;
}
