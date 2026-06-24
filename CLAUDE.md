# Ganga Agro / Ammedi — Havan Products Website

## What we're building
A premium, mobile-first, ecommerce-style website for **Ganga Agro Industries** (brand **"Ammedi"**),
selling havan/puja products to the wholesale market in bulk tiers.

**Phase 0 = frontend only, no real backend.** "Add to cart" works, but checkout is an
**enquiry form, not payment**: the customer submits name + mobile (required) and email (optional);
that fires an email to the merchant, who confirms the order by phone. Build everything so Phase 2
(real backend) can be added without rework.

## Priorities (in order)
1. Fast (mobile LCP first — most customers are on mobile)
2. Premium visuals (gradients + 3D)
3. Mobile-first, then desktop
4. Maximum reusable components
5. Everything data-driven and env-configurable

## Tech stack
- Next.js (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 (theme tokens in `globals.css` via `@theme`)
- Zustand + persist (cart survives reload)
- React Hook Form + Zod (enquiry form)
- Framer Motion (hover / scroll / transition polish)
- three + @react-three/fiber + @react-three/drei (3D, always dynamic `ssr:false` + image fallback)
- next-intl (Hindi + English, `[locale]` routing)
- Serwist (PWA / installable app)
- Resend (enquiry email — env-gated, swappable to Web3Forms)
- Hand-rolled UI primitives (no component library)

## Rendering strategy
- **SSG for every page** (data is a JSON file known at build time).
- Interactive bits are **client islands**: 3D canvas, cart drawer, qty/tier selector, enquiry form, locale switcher, PWA install button.
- PDP and QR pages use `generateStaticParams` (one static file per product).
- Only `/api/enquiry/route.ts` runs server-side (Resend call).
- No SSR/ISR in Phase 0. Phase 2 (Postgres) → product/info pages move to ISR.

## Data model — single source of truth
- All products live in `data/products.json`, validated by Zod (`data/products.schema.ts`).
- **Adding a product = edit JSON only. No code change.**
- Every user-facing string is bilingual: `{ en, hi }`.
- Each product has `priceTiers[]` (e.g. 1 quintal / 100-pack / 500-pack / 1000-pack) and an `ingredients[]` list.
- Phase 0 is enquiry-driven: `priceOnEnquiry: true` by default, `price` optional.

## Pages
- `/` Home — 3D hero, featured products, **channel links** (IndiaMART / Flipkart / Facebook / website), trust strip (9 yrs, 4.8★, TrustSEAL)
- `/products` — PLP (all products)
- `/products/[slug]` — PDP (per product: gallery, tiers, ingredients, add-to-cart, buy-now)
- `/p/[slug]` — **QR info page**, SHORT URL, `noindex` + excluded from sitemap. Printed as QR on white-labelled product. Shows: product + **ingredients first**, then channel links, then soft wholesale-enquiry CTA. (Agents rebrand the physical product, so this carries no agent branding — only ingredients + our channels.)
- `/checkout` — enquiry form (name + mobile required, email optional) → emails merchant
- `/about`, `/blog`, `/blog/[slug]` (MDX), `/install` (PWA), legal pages

## Theme — "Agni Gold"
Dark premium, gradient-forward (not flat colors). Use linear, radial (glow behind product),
and conic (mandala/diya) gradients.
- base ember black `#150F0C`, surface `#211813`, elevated `#2C211A`
- ember `#7A1F1F`, saffron `#FF8C32`, gold `#F5C84C`, gold-soft `#E9C46A`
- text `#F7ECDD` / secondary `#C9B8A4` / muted `#8A7A68`
- faint gold borders `rgba(245,200,76,0.12)`
- **Hero:** shader-gradient + drifting particle sparks (react-three-fiber), product image layered on top, **static image fallback on mobile first paint**.

## Config & integrations — env-gated, off by default
- `config/site.ts` holds site name, links, contact, channel URLs — env overrides + sensible defaults.
- Read all toggles via `lib/env.ts`. If env value is missing, the feature does NOT render/run.
- `.env`: `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`,
  `NEXT_PUBLIC_SEARCH_CONSOLE_ID`, `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`,
  and dormant `DATABASE_URL`, `SENTRY_DSN` (Phase 2).
- GA4 via `@next/third-parties/google` (renders only if `NEXT_PUBLIC_GA_ID` set).

## SEO
- Metadata API + `generateMetadata` per product.
- `sitemap.ts`, `robots.ts`.
- JSON-LD `Product` + `BreadcrumbList` on PDP (NOT on `/p/[slug]`).
- `/p/[slug]` is `noindex` and excluded from sitemap (don't split ranking with the PDP).

## QR codes
Build script `scripts/generate-qr.ts` (uses `qrcode`) outputs one code per slug into
`/public/qr`, each pointing at `https://<site>/p/<slug>`.

## Folder structure
```
data/                products.json, products.schema.ts, products.ts
messages/            en.json, hi.json
public/products/     product images (slug-based)
public/qr/           generated QR codes
scripts/             generate-qr.ts
src/app/[locale]/    page.tsx (home), products/, p/, checkout/, about/, blog/, install/, (legal)/
src/app/api/enquiry/route.ts
src/app/manifest.ts, sitemap.ts, robots.ts, globals.css
src/components/      ui/ layout/ product/ cart/ three/ home/ channels/ pwa/ seo/
src/store/cart.ts    Zustand + persist
src/lib/             env.ts, format.ts, seo.ts
src/config/site.ts
src/i18n/            routing.ts, request.ts
src/middleware.ts    next-intl locale routing
```

## Semantic HTML rules
- One `<h1>` per page; landmarks `<header><nav><main><footer>` on every page.
- PDP wrapped in `<article>`, one `<section>` per block; gallery in `<figure>`.
- `<button>` for actions (cart, qty, checkout submit); `<Link>` only for navigation.
- Inject JSON-LD via a reusable `seo/JsonLd` component.

## Brand facts (reference)
Ganga Agro Industries, Jodhpur, Rajasthan. Est. 2002, proprietorship, manufacturer.
House brand "Ammedi". Range: hawan samagri, havan samidha (mango wood), pooja items
(sapt mrittika, puja kapda, bhasmi, moli/janeu), incense & dhoop, sandalwood powder,
biomass/sawdust briquettes. HSN: 4401, 4403, 9403. Channels: IndiaMART, Flipkart, Facebook.
Trust: 9 yrs on IndiaMART, 4.8★ (218 ratings), TrustSEAL.
