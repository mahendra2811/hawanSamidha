import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Havan & Puja Products`,
    short_name: site.name,
    description: "Wholesale hawan samagri, samidha, puja items, incense & briquettes.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#150F0C",
    theme_color: "#150F0C",
    lang: "en",
    categories: ["shopping", "business"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
