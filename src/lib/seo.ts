import type { Metadata } from "next";
import { site } from "@/config/site";
import type { Product } from "@data/products.schema";
import { pick } from "@/lib/i18n";

const DEFAULTS = {
  en: {
    title: "Ammedi — Wholesale Havan, Samidha & Puja Products | Ganga Agro",
    description:
      "Manufacturer of hawan samagri, mango-wood samidha, pooja items, incense, sandalwood & biomass briquettes. Wholesale supply from Jodhpur, India since 2002.",
  },
  hi: {
    title: "अम्मेदी — थोक हवन, समिधा व पूजा उत्पाद | गंगा एग्रो",
    description:
      "हवन सामग्री, आम की लकड़ी समिधा, पूजा सामग्री, अगरबत्ती, चंदन व बायोमास ब्रिकेट्स के निर्माता। 2002 से जोधपुर से थोक आपूर्ति।",
  },
};

/** Locale-aware path (en is unprefixed, hi is /hi). */
export function localizedPath(locale: string, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === "hi" ? `/hi${clean}` : clean || "/";
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  images,
  noindex,
}: {
  locale: string;
  path: string;
  title?: string;
  description?: string;
  images?: string[];
  noindex?: boolean;
}): Metadata {
  const d = DEFAULTS[locale === "hi" ? "hi" : "en"];
  const t = title ?? d.title;
  const desc = description ?? d.description;
  const ogImages = (images && images.length ? images : ["/og/default.png"]).map((url) => ({ url }));

  return {
    metadataBase: new URL(site.url),
    title: t,
    description: desc,
    alternates: {
      canonical: localizedPath(locale, path),
      languages: {
        en: localizedPath("en", path),
        hi: localizedPath("hi", path),
      },
    },
    openGraph: {
      title: t,
      description: desc,
      url: localizedPath(locale, path),
      siteName: site.name,
      locale: locale === "hi" ? "hi_IN" : "en_IN",
      type: "website",
      images: ogImages,
    },
    twitter: { card: "summary_large_image", title: t, description: desc, images },
    icons: {
      icon: "/icons/icon-192.png",
      apple: "/icons/apple-touch-icon.png",
    },
    robots: noindex ? { index: false, follow: false } : undefined,
    ...(site.analytics.searchConsoleId
      ? { verification: { google: site.analytics.searchConsoleId } }
      : {}),
  };
}

// ───────────────────────── JSON-LD builders ─────────────────────────

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.company.legalName,
    alternateName: site.company.brand,
    url: site.url,
    foundingDate: String(site.company.establishedYear),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.company.city,
      addressRegion: site.company.state,
      addressCountry: "IN",
    },
    ...(site.phone ? { telephone: site.phone } : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.company.rating,
      reviewCount: site.company.reviews,
    },
  };
}

export function productJsonLd(product: Product, locale: string, absoluteUrl: string) {
  const priced = product.priceTiers.find((t) => typeof t.price === "number");
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pick(product.name, locale),
    description: pick(product.shortDescription, locale),
    image: product.images.map((i) => new URL(i, site.url).toString()),
    brand: { "@type": "Brand", name: product.brand },
    ...(product.hsnCode ? { sku: product.hsnCode } : {}),
    offers: {
      "@type": "Offer",
      url: absoluteUrl,
      priceCurrency: "INR",
      ...(priced ? { price: priced.price } : {}),
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: site.company.legalName },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    publisher: { "@type": "Organization", name: site.company.legalName },
  };
}
