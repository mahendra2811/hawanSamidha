import { defineRouting } from "next-intl/routing";

/**
 * Locale routing. `as-needed` keeps the default locale (English) unprefixed:
 *   /            -> en home
 *   /products    -> en PLP
 *   /p/<slug>    -> en QR short URL  (matches scripts/generate-qr.ts output)
 *   /hi          -> Hindi home
 * Hindi is served under the /hi prefix.
 */
export const routing = defineRouting({
  locales: ["en", "hi"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
