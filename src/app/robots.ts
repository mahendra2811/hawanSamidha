import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // QR info pages and the enquiry/checkout flow must not be indexed.
      disallow: ["/p/", "/api/", "/checkout"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
