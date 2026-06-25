/**
 * Centralized, crash-safe environment reads.
 *
 * Rules (MEGA_PROMPT §3.6):
 * - Every value is optional. The app must run with NO env vars set.
 * - Missing optional value => the feature does not render / run.
 * - Components NEVER read process.env directly — they read `site` (config/site.ts),
 *   which layers these values over sensible defaults.
 *
 * NEXT_PUBLIC_* values are inlined at build time, so referencing them as static
 * member expressions (below) is required for them to reach client components.
 */

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

export const env = {
  // Site
  siteName: clean(process.env.NEXT_PUBLIC_SITE_NAME),
  siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL),
  defaultLocale: clean(process.env.NEXT_PUBLIC_DEFAULT_LOCALE),

  // Contact / enquiry
  phone: clean(process.env.NEXT_PUBLIC_PHONE),
  whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP),
  enquiryEmail: clean(process.env.ENQUIRY_TO_EMAIL),
  resendApiKey: clean(process.env.RESEND_API_KEY),
  // Web3Forms is submitted from the browser (free plan blocks server IPs), so
  // the key is NEXT_PUBLIC. It is a public submission key by design.
  web3formsKey: clean(process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY),

  // Channels
  indiamartUrl: clean(process.env.NEXT_PUBLIC_INDIAMART_URL),
  flipkartUrl: clean(process.env.NEXT_PUBLIC_FLIPKART_URL),
  facebookUrl: clean(process.env.NEXT_PUBLIC_FACEBOOK_URL),

  // Analytics (render only when set)
  gaId: clean(process.env.NEXT_PUBLIC_GA_ID),
  searchConsoleId: clean(process.env.NEXT_PUBLIC_SEARCH_CONSOLE_ID),
} as const;

/** True when a value is present and usable. */
export function isSet(value: string | undefined): value is string {
  return clean(value).length > 0;
}
