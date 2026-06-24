import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getAllSlugs } from "@data/products";
import { getAllPostSlugs } from "@data/posts";
import { localizedPath } from "@/lib/seo";

/** All indexable routes for en + hi. Excludes /p/<slug> (noindex) and /checkout. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/products", "/about", "/blog", "/install", "/privacy", "/terms"];
  const productPaths = getAllSlugs().map((s) => `/products/${s}`);
  const postPaths = getAllPostSlugs().map((s) => `/blog/${s}`);
  const all = [...staticPaths, ...productPaths, ...postPaths];

  return all.map((p) => ({
    url: new URL(localizedPath("en", p), site.url).toString(),
    alternates: {
      languages: {
        en: new URL(localizedPath("en", p), site.url).toString(),
        hi: new URL(localizedPath("hi", p), site.url).toString(),
      },
    },
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
