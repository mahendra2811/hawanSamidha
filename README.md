# Ammedi — Ganga Agro Havan & Puja Products

A premium, mobile-first, bilingual (English + हिन्दी) wholesale storefront for **Ganga Agro
Industries** (house brand **Ammedi**), Jodhpur. **Phase 0 = frontend only**: "Add to cart" works,
but checkout is a wholesale **enquiry** (name + mobile required, email optional) — no payments.

Built so a Phase 2 backend (Postgres + ISR) can be added without rework.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · next-intl (en/hi) ·
Zustand (persisted cart) · React Hook Form + Zod · Framer Motion · three / react-three-fiber (3D
hero) · Serwist (PWA) · Resend (enquiry email, env-gated) · qrcode. Deploy target: **Vercel**.

## Getting started

```bash
npm install
npm run build:products   # generate data/products.json + copy images from ../extracted
npm run dev              # http://localhost:3000
```

The app runs with **no environment variables set** — every integration is off until configured.

### Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | `build:products` then `next build --webpack` (Serwist needs webpack) |
| `npm run start` | Serve the production build |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |
| `npm run build:products` | Transform `../extracted/gangaagro_catalog.json` → `data/products.json` + images |
| `npm run generate:qr` | Generate `/public/qr/<slug>.{svg,png}` pointing at `/p/<slug>` |

> **Build note:** the production build runs with `--webpack` because `@serwist/next` (PWA) does not
> support Turbopack at build time. Dev uses Turbopack (the service worker is disabled in dev).

## Environment variables (all optional)

Copy `.env.example` → `.env.local`. Missing values simply disable their feature.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_NAME` / `NEXT_PUBLIC_SITE_URL` | Brand name / canonical URL |
| `NEXT_PUBLIC_PHONE` / `NEXT_PUBLIC_WHATSAPP` | Call / WhatsApp buttons (default to the real Ganga Agro number) |
| `WEB3FORMS_ACCESS_KEY` | Email enquiries via [Web3Forms](https://web3forms.com) (active; off until set) — no domain setup needed |
| `ENQUIRY_TO_EMAIL` / `RESEND_API_KEY` / `RESEND_FROM` | Resend (alternative, commented out in `api/enquiry/route.ts`) |
| `NEXT_PUBLIC_INDIAMART_URL` / `_FLIPKART_URL` / `_FACEBOOK_URL` | Channel links |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_SEARCH_CONSOLE_ID` | Analytics / verification (render only when set) |
| `DATABASE_URL` / `SENTRY_DSN` | Dormant — Phase 2 |

Contact + channel defaults live in `src/config/site.ts`; env always overrides.

## Adding or editing products

Products are **data-driven** — no code changes needed.

- **From the scraped catalogue:** re-run the scraper in `../extracted/`, then `npm run build:products`.
- **By hand:** edit `data/products.json` (validated by `data/products.schema.ts` — an invalid entry
  fails the build with a clear Zod error). Add images under `public/products/<slug>/` and reference
  them in `heroImage` / `images`.

Every user-facing string is bilingual `{ en, hi }`. Categories live in the schema enum +
`src/lib/categories.ts`. FAQs are in `data/faqs.json`; blog posts in `data/posts.ts`.

## QR codes

Each product has a QR-info page at the short URL `/p/<slug>` (noindex, ingredients-first, brand-neutral,
channel links). Run `npm run generate:qr` to produce print-ready codes in `/public/qr/`.

## Placeholder art

`npx tsx scripts/generate-placeholders.ts` regenerates the Agni-Gold PWA icons (`/public/icons`) and
OG image (`/public/og/default.png`). Replace with final brand art when ready.

## Deploy to Vercel

1. Push to a Git repo and import it in Vercel.
2. Set the **Build Command** to `npm run build` (keeps the `--webpack` Serwist step) and add any env
   vars you want enabled.
3. Deploy. All product/info pages are statically generated; only `/api/enquiry` runs server-side.

## Project layout

```
data/        products.json + schema + loader, faqs, posts   (the registry)
messages/    en.json, hi.json                                (UI strings)
public/      products/<slug>/  qr/  icons/  og/  sw.js
scripts/     build-products.ts, generate-qr.ts, generate-placeholders.ts
src/app/[locale]/   home, products, products/[slug], p/[slug], checkout, about, blog, install, (legal)
src/app/api/enquiry/route.ts   manifest.ts  sitemap.ts  robots.ts  sw.ts  globals.css
src/components/     ui/ layout/ product/ cart/ three/ home/ channels/ pwa/ seo/
src/store/   cart.ts (persisted), ui.ts        src/lib/  env, seo, format, i18n, …
src/config/site.ts   src/i18n/ (routing, request, navigation)   src/proxy.ts (locale middleware)
```
