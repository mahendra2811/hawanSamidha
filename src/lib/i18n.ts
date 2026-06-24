import type { Localized } from "@data/products.schema";
import type { Locale } from "@/i18n/routing";

/** Pick the string for the active locale from a bilingual `{ en, hi }` value. */
export function pick(value: Localized, locale: Locale | string): string {
  return locale === "hi" ? value.hi : value.en;
}
