import { env } from "@/lib/env";

/**
 * Typed site config: env override -> sensible default.
 *
 * Contact defaults use the real Ganga Agro / IndiaMART details so Call & WhatsApp
 * work out of the box; everything is still overridable via env. Email enquiry stays
 * OFF until ENQUIRY_TO_EMAIL + RESEND_API_KEY are configured (graceful fallback to
 * WhatsApp / Call in the UI).
 */

const DEFAULTS = {
  name: "Ammedi",
  url: "https://hawanproducts.com",
  defaultLocale: "en",
  // Real contact (CEO message on IndiaMART). Overridable via env.
  phone: "+917790919209",
  whatsapp: "917790919209",
  channels: {
    indiamart: "https://www.indiamart.com/gangaagroindustries/",
    flipkart: "",
    facebook: "",
  },
} as const;

export const site = {
  name: env.siteName || DEFAULTS.name,
  url: env.siteUrl || DEFAULTS.url,
  defaultLocale: env.defaultLocale || DEFAULTS.defaultLocale,

  /** tel: link target, e.g. "+917790919209". Empty => Call button hidden. */
  phone: env.phone || DEFAULTS.phone,
  /** wa.me digits, e.g. "917790919209". Empty => WhatsApp button hidden. */
  whatsapp: env.whatsapp || DEFAULTS.whatsapp,
  /** Email enquiries are OFF until configured. */
  enquiryEmail: env.enquiryEmail,

  channels: {
    indiamart: env.indiamartUrl || DEFAULTS.channels.indiamart,
    flipkart: env.flipkartUrl || DEFAULTS.channels.flipkart,
    facebook: env.facebookUrl || DEFAULTS.channels.facebook,
  },

  analytics: {
    gaId: env.gaId,
    searchConsoleId: env.searchConsoleId,
  },

  // Static brand facts (MEGA_PROMPT §1). Establishment year per owner brief: 2002.
  company: {
    legalName: "Ganga Agro Industries",
    brand: "Ammedi",
    city: "Jodhpur",
    state: "Rajasthan",
    country: "India",
    establishedYear: 2002,
    rating: 4.8,
    reviews: 218,
    yearsOnIndiamart: 9,
  },
} as const;

export type Site = typeof site;
