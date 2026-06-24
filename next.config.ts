import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";

// next-intl: points at src/i18n/request.ts by default (src dir).
const withNextIntl = createNextIntlPlugin();

// Serwist PWA. NOTE: @serwist/next is webpack-only — the production build runs
// with `next build --webpack` (see package.json). The SW is disabled in dev so
// `next dev` can keep using Turbopack.
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
});

const nextConfig: NextConfig = {
  images: {
    // All product imagery is served locally from /public/products/<slug>/.
    formats: ["image/avif", "image/webp"],
    // 1200x1200 PDP, 800x800 cards, 1920x1080 hero fallback — generous sizes.
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384, 512, 800, 1200],
  },
  // Phase 2 (Postgres) note: product/info pages move to ISR; nothing here blocks that.
};

export default withSerwist(withNextIntl(nextConfig));
