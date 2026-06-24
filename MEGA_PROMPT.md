# MEGA PROMPT — Build the Ganga Agro / Ammedi Havan Products Website (production-ready, one shot)

> Paste this entire file into Claude CLI from the empty repo root. Build the complete app
> exactly to this spec. Do not ask clarifying questions for anything already specified here —
> use the stated defaults and labeled placeholders. Where I will supply real data locally,
> generate a valid, schema-correct placeholder so the app builds and runs immediately.

---

## 0. MISSION & HOW TO WORK

You are the lead engineer. Build a **premium, mobile-first, ecommerce-style** website for
**Ganga Agro Industries** (house brand **"Ammedi"**) selling havan/puja products in wholesale tiers.

**Phase 0 = frontend only, NO real backend.** "Add to cart" works; checkout is an **enquiry**,
not a payment. Build so Phase 2 (Postgres backend) can be added without rework.

Work in this order, committing logically:
1. Scaffold (Next.js + TS + Tailwind v4 + tooling)
2. Config + env + i18n
3. Data layer (schema → loader → seed JSON)
4. Theme tokens (Agni Gold) + UI primitives
5. Layout (header/nav/footer/locale switcher/cart button)
6. Cart store + side drawer
7. Pages: home → PLP → PDP → `/p/[slug]` → checkout → about → blog → install → legal
8. Enquiry (form + Resend route + WhatsApp/Call)
9. SEO (metadata, sitemap, robots, JSON-LD, FAQ)
10. PWA (manifest + Serwist) + QR script
11. Quality pass against the Acceptance Criteria (§19)

After building, run `npm run build` and fix every type error and build failure before finishing.

---

## 1. PRODUCT & BUSINESS CONTEXT

- **Firm:** Ganga Agro Industries — Jodhpur, Rajasthan. Est. 2002, proprietorship, manufacturer.
- **House brand:** "Ammedi" (printed where products are not white-labelled for an agent).
- **Audience:** wholesale buyers, mostly on **mobile**, India. Hindu religious / puja products.
- **Sales model:** one product, sold in **bulk tiers** (e.g. 1 quintal / 100-pack / 500-pack / 1000-pack, 25 kg bag).
- **Range:** hawan samagri, havan samidha (mango wood), pooja items (sapt mrittika, puja kapda,
  bhasmi, moli/janeu), incense & dhoop, sandalwood powder, biomass/sawdust briquettes.
- **HSN:** 4401, 4403, 9403. **Channels:** IndiaMART, Flipkart, Facebook.
- **Trust signals:** 9 yrs on IndiaMART, 4.8★ (218 ratings), TrustSEAL — surface on home trust strip.
- **White-label note:** agents rebrand the physical product, so we can't put our name on it —
  but a **QR code** on the package links to our info page (`/p/[slug]`) that shows ingredients
  + our channels. This is the core distribution mechanic.

---

## 2. TECH STACK (use latest stable; pin in package.json)

- **Next.js (App Router)** + **React 19** + **TypeScript (strict)**
- **Tailwind CSS v4** (tokens via `@theme` in `globals.css`)
- **next-intl** — Hindi + English, `[locale]` routing, **default English**
- **Zustand** + `persist` — cart, survives reload (localStorage)
- **React Hook Form** + **Zod** — enquiry form + all data validation
- **Framer Motion** — hover / scroll / transition polish
- **three** + **@react-three/fiber** + **@react-three/drei** — 3D hero (dynamic `ssr:false` + fallback)
- **Serwist** — PWA / installable app
- **Resend** — enquiry email (env-gated; swappable to Web3Forms)
- **qrcode** — build-time QR generation
- **@next/third-parties** — GA4 (env-gated)
- **@next/mdx** (or Contentlayer) — blog
- **Package manager: npm.** **Deploy target: Vercel.**
- Hand-rolled UI primitives — **no component library**.

Scripts in `package.json`: `dev`, `build`, `start`, `lint`, `typecheck`, `generate:qr`.

---

## 3. NON-NEGOTIABLE PRINCIPLES

1. **Fast first** — mobile LCP is the top metric. 3D and heavy bits never block first paint.
2. **Mobile-first** then desktop; both polished.
3. **Maximum reusable components.** No copy-paste UI.
4. **Data-driven:** adding a product = editing `data/products.json` only. Never hardcode product data in components.
5. **Bilingual everywhere:** every user-facing string is `{ en, hi }` or comes from `messages/*.json`.
6. **Env-gated integrations, OFF by default:** if an env var is missing, the feature does not render/run. Never crash on a missing optional env.
7. **Accessibility floor:** semantic landmarks, visible focus, keyboard operable, `prefers-reduced-motion` respected, alt text on images.
8. **No dead ends:** every interactive control does exactly what its label says.

---

## 4. FOLDER STRUCTURE (create exactly this)

```
data/
  products.json          # THE registry (edit to add products)
  products.schema.ts     # Zod schema + types (canonical — see §8)
  products.ts            # validated loader + helpers
  faqs.json              # FAQ registry
  faqs.schema.ts         # Zod schema for FAQs
  faqs.ts                # validated loader
messages/
  en.json
  hi.json
public/
  products/<slug>/...    # images (placeholders for now)
  qr/                    # generated QR codes
  icons/                 # PWA icons
  og/                    # social images
scripts/
  generate-qr.ts
src/
  app/
    [locale]/
      layout.tsx
      page.tsx                 # Home
      products/
        page.tsx               # PLP
        [slug]/page.tsx        # PDP
      p/
        [slug]/page.tsx        # QR info page (short URL, noindex)
      checkout/page.tsx        # enquiry form
      about/page.tsx
      blog/
        page.tsx
        [slug]/page.tsx
      install/page.tsx
      (legal)/
        privacy/page.tsx
        terms/page.tsx
    api/
      enquiry/route.ts         # Resend handler
    manifest.ts
    sitemap.ts
    robots.ts
    globals.css
  components/
    ui/          # Button, Input, Textarea, Select, Drawer, Accordion, Badge, QtyStepper, Skeleton, Container, Section
    layout/      # Header, Nav, Footer, LocaleSwitcher, CartButton, MobileMenu
    product/     # ProductCard, ProductGrid, Gallery, PriceTierSelector, IngredientList, ProductFaq
    cart/        # CartDrawer, CartItem, CartSummary, EnquiryActions
    three/       # HeroCanvas, Particles (all dynamic ssr:false + fallback)
    home/        # Hero, FeaturedProducts, TrustStrip, ChannelsSection, Faq
    channels/    # ChannelLinks
    pwa/         # InstallButton, InstallInstructions
    seo/         # JsonLd
  store/
    cart.ts      # Zustand + persist
  lib/
    env.ts       # validated env reads, defaults baked in
    format.ts    # INR currency + Indian number grouping, quantity formatting
    seo.ts       # metadata + JSON-LD builders
    i18n.ts      # locale helpers
  config/
    site.ts      # name, links, contact, channels — env override + defaults
  i18n/
    routing.ts
    request.ts
  middleware.ts  # next-intl locale routing
.env.example
next.config.ts
tsconfig.json (strict)
```

---

## 5. ENVIRONMENT VARIABLES — `.env.example` (everything optional; app runs with none set)

```
# Site
NEXT_PUBLIC_SITE_NAME="Ammedi"
NEXT_PUBLIC_SITE_URL="https://hawanproducts.com"
NEXT_PUBLIC_DEFAULT_LOCALE="en"

# Contact / enquiry (WhatsApp + Call + Email)
NEXT_PUBLIC_PHONE=""              # tel: link, e.g. +91XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP=""           # digits only, e.g. 91XXXXXXXXXX (for wa.me)
ENQUIRY_TO_EMAIL=""               # where enquiry emails are sent
RESEND_API_KEY=""                 # if empty, /api/enquiry returns a graceful "email disabled" response

# Channels (also overridable in config/site.ts)
NEXT_PUBLIC_INDIAMART_URL=""
NEXT_PUBLIC_FLIPKART_URL=""
NEXT_PUBLIC_FACEBOOK_URL=""

# Analytics (render only if set)
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_SEARCH_CONSOLE_ID=""

# Phase 2 (dormant — do not use yet)
DATABASE_URL=""
SENTRY_DSN=""
```

`lib/env.ts` reads these with safe defaults; never throw on a missing optional value.
`config/site.ts` exposes a typed `site` object: name, url, defaultLocale, phone, whatsapp,
enquiryEmail, and `channels: { indiamart, flipkart, facebook }`, each falling back to a default
then overridden by env. Components read from `site`, never from `process.env` directly.

---

## 6. DATA LAYER — CANONICAL SCHEMA (use verbatim)

`data/products.schema.ts`:

```ts
import { z } from "zod";

export const localizedSchema = z.object({
  en: z.string().min(1),
  hi: z.string().min(1),
});
export type Localized = z.infer<typeof localizedSchema>;

export const categorySchema = z.enum([
  "hawan-samagri",
  "havan-samidha",
  "pooja-items",
  "incense-dhoop",
  "sandalwood",
  "briquettes",
]);
export type Category = z.infer<typeof categorySchema>;

export const priceTierSchema = z.object({
  id: z.string().min(1),
  label: localizedSchema,        // "1 Quintal", "100 Pack"
  packaging: localizedSchema,    // "25 Kg Bag", "Carton of 100"
  unit: z.enum(["kg", "quintal", "pack", "carton", "piece", "bag"]),
  quantity: z.number().positive(),
  minOrderQty: z.number().int().positive().default(1),
  priceOnEnquiry: z.boolean().default(true),
  price: z.number().nonnegative().optional(),   // INR; supplied in local data
  inStock: z.boolean().default(true),
});
export type PriceTier = z.infer<typeof priceTierSchema>;

export const ingredientSchema = z.object({
  name: localizedSchema,
  note: localizedSchema.optional(),
});
export type Ingredient = z.infer<typeof ingredientSchema>;

export const productSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: localizedSchema,
  category: categorySchema,
  brand: z.string().default("Ammedi"),
  shortDescription: localizedSchema,
  longDescription: localizedSchema,
  heroImage: z.string().min(1),          // /products/<slug>/hero.webp
  images: z.array(z.string().min(1)).default([]),
  ingredients: z.array(ingredientSchema).default([]),
  priceTiers: z.array(priceTierSchema).min(1),
  hsnCode: z.string().optional(),
  featured: z.boolean().default(false),
  badges: z.array(localizedSchema).default([]),
  seo: z.object({ title: localizedSchema, description: localizedSchema }).optional(),
});
export type Product = z.infer<typeof productSchema>;

export const productsSchema = z.array(productSchema);
```

`data/products.ts` — load `products.json`, parse with `productsSchema` (throw at build on invalid),
export: `products`, `getProductBySlug(slug)`, `getFeaturedProducts()`, `getProductsByCategory(cat)`,
`getAllSlugs()`, `getAllCategories()`.

`data/products.json` — seed with **2 placeholder products** that fully satisfy the schema (bilingual,
multiple tiers, ingredients, `priceOnEnquiry: true`, slug-based placeholder image paths). I will
replace this file with the real scraped IndiaMART data locally. Example seed entry shape:

```json
{
  "slug": "ammedi-hawan-samagri",
  "name": { "en": "Ammedi Hawan Samagri", "hi": "अम्मेदी हवन सामग्री" },
  "category": "hawan-samagri",
  "brand": "Ammedi",
  "shortDescription": { "en": "Premium hawan samagri for daily puja and yagna.", "hi": "दैनिक पूजा और यज्ञ हेतु प्रीमियम हवन सामग्री।" },
  "longDescription": { "en": "PLACEHOLDER — full description supplied locally.", "hi": "प्लेसहोल्डर — पूरा विवरण स्थानीय रूप से दिया जाएगा।" },
  "heroImage": "/products/ammedi-hawan-samagri/hero.webp",
  "images": ["/products/ammedi-hawan-samagri/1.webp", "/products/ammedi-hawan-samagri/2.webp"],
  "ingredients": [
    { "name": { "en": "Guggal", "hi": "गुग्गल" } },
    { "name": { "en": "Jau (Barley)", "hi": "जौ" } },
    { "name": { "en": "Til (Sesame)", "hi": "तिल" } }
  ],
  "priceTiers": [
    { "id": "100pack", "label": { "en": "100 Pack", "hi": "100 पैक" }, "packaging": { "en": "Carton of 100", "hi": "100 का कार्टन" }, "unit": "pack", "quantity": 100, "minOrderQty": 1, "priceOnEnquiry": true, "inStock": true },
    { "id": "1quintal", "label": { "en": "1 Quintal", "hi": "1 क्विंटल" }, "packaging": { "en": "25 Kg Bag x 4", "hi": "25 किग्रा बैग x 4" }, "unit": "quintal", "quantity": 1, "minOrderQty": 1, "priceOnEnquiry": true, "inStock": true }
  ],
  "hsnCode": "4401",
  "featured": true,
  "badges": [{ "en": "Best Seller", "hi": "बेस्ट सेलर" }]
}
```

**FAQ data:** `data/faqs.schema.ts` (Zod: `{ id, question: Localized, answer: Localized, scope?: "global" | category | slug }`),
`data/faqs.json` (2–3 placeholders), `data/faqs.ts` loader + `getFaqsForScope(scope)`. Render as an
accordion and emit `FAQPage` JSON-LD wherever shown.

---

## 7. THEME — "AGNI GOLD" (Tailwind v4, `globals.css`, use these tokens)

Dark premium base, **gradient-forward** (linear, radial glow behind products, conic for mandala/diya).
Spend boldness on the hero; keep everything else disciplined.

```css
@import "tailwindcss";

@theme {
  --color-base: #150F0C;        /* ember black page bg */
  --color-surface: #211813;     /* cards */
  --color-elevated: #2C211A;    /* raised / drawer */
  --color-ember: #7A1F1F;
  --color-saffron: #FF8C32;
  --color-gold: #F5C84C;
  --color-gold-soft: #E9C46A;
  --color-text: #F7ECDD;
  --color-text-secondary: #C9B8A4;
  --color-text-muted: #8A7A68;
  --color-border: rgba(245, 200, 76, 0.12);
  --color-success: #4FA46A;
  --color-danger: #D9534F;

  --font-display: "Fraunces", Georgia, serif;     /* characterful, used with restraint */
  --font-body: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-hi: "Mukta", "Noto Sans Devanagari", sans-serif; /* Devanagari */

  --radius: 14px;
}

:root {
  --grad-gold: linear-gradient(135deg, var(--color-saffron), var(--color-gold));
  --grad-hero: linear-gradient(160deg, #150F0C 0%, #3A1410 45%, #7A1F1F 75%, #FF8C32 100%);
  --grad-glow: radial-gradient(circle at center, rgba(245,200,76,0.35), transparent 70%);
  --grad-conic: conic-gradient(from 0deg, #7A1F1F, #FF8C32, #F5C84C, #7A1F1F);
}

html { background: var(--color-base); color: var(--color-text); }
body { font-family: var(--font-body); }
:lang(hi) { font-family: var(--font-hi); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

Load fonts via `next/font` (Fraunces, Plus Jakarta Sans, Mukta). Provide reusable gradient
utility classes (`.grad-gold`, `.grad-glow`, `.grad-conic`) and a primary `Button` whose default
variant uses `--grad-gold` with ember-dark text. Buttons, badges, dividers, and section accents
all derive from these tokens — never hardcode hex in components.

---

## 8. RENDERING STRATEGY (apply per page)

- **SSG everywhere.** Data is JSON known at build. No SSR/ISR in Phase 0.
- PDP `products/[slug]`, info `p/[slug]`, and blog `[slug]` use `generateStaticParams`.
- Interactive parts are **client islands**: 3D canvas, cart drawer, qty/tier selector, enquiry form,
  locale switcher, install button, accordions.
- `/api/enquiry/route.ts` is the only server-executed code.
- Use `next/image` for all images; never raw `<img>`. (Don't use `output: "export"` — keep image optimization.)
- Phase 2 note in code comments: product/info pages will move to ISR when Postgres lands.

---

## 9. HERO (the signature element)

`components/three/HeroCanvas.tsx` — animated **shader-gradient + drifting particle sparks**
(react-three-fiber), Agni-Gold colored, slow drift (diya/ember feel). The product image layers
on top with a `--grad-glow` halo behind it. **Dynamic import with `ssr:false`** and a **static
gradient image fallback** that renders on mobile first paint and when `prefers-reduced-motion` is set.
Hero must never delay LCP — the headline + CTA are server-rendered text; the canvas hydrates after.

Use a placeholder headline now (e.g. EN: "Sacred essentials, crafted for every ritual" / HI:
"हर अनुष्ठान के लिए, श्रद्धा से तैयार") — clearly replaceable from `messages/*.json`.

---

## 10. PAGES (semantic HTML + content)

Global rules: one `<h1>` per page; `<header><nav><main><footer>` landmarks; `<button>` for actions,
`<Link>` for navigation; images via `next/image` with alt from product name.

- **Home `/`** — `<header>` sticky nav; `<main>`: Hero (`<h1>`), FeaturedProducts (`<section><h2>`,
  card grid), TrustStrip (9 yrs / 4.8★ / TrustSEAL), **ChannelsSection** (IndiaMART/Flipkart/Facebook/website),
  a global **FAQ accordion** (+ FAQPage JSON-LD). **No blog on home.** `<footer>` with nav + channels.
- **PLP `/products`** — `<h1>` "Products"; category filter (client, no reload); `<ul>` of `<li><article>`
  ProductCard (image `<figure>`, `<h2>`, lowest-tier label, "View" link, Add-to-Cart `<button>`).
- **PDP `/products/[slug]`** — `<article>` with `<h1>` name; `<figure>` Gallery; `<section>`s:
  long description, **PriceTierSelector** (tiers as buttons) + **QtyStepper**, **Add to Cart** `<button>`
  (NO Buy Now), **IngredientList** (`<h2>` + `<ul>`/`<dl>`), HSN line, **EnquiryActions** (WhatsApp/Call/Email),
  product-scoped **FAQ accordion**. Emit `Product` + `BreadcrumbList` + `FAQPage` JSON-LD. Indexed.
- **QR info `/p/[slug]`** — SHORT URL, **`noindex`**, excluded from sitemap. Order: product name + image →
  **ingredients FIRST (primary focus)** → **ChannelLinks** → soft wholesale-enquiry CTA (WhatsApp/Call).
  Brand-neutral-friendly (no agent branding). No `Product` JSON-LD here.
- **Checkout `/checkout`** — static shell + client enquiry form (see §12). Shows cart summary.
- **About `/about`** — company story, trust signals, channels.
- **Blog `/blog` + `/blog/[slug]`** — MDX, SEO-focused, FAQ accordion allowed; `Article` JSON-LD on posts.
- **Install `/install`** — explains the PWA + `InstallButton` (+ iOS Safari instructions fallback).
- **Legal** — `/privacy`, `/terms` (placeholder copy, clearly marked).

---

## 11. CART (Zustand + persist)

`store/cart.ts`: items keyed by `productSlug + tierId`, each with qty; actions add/remove/updateQty/clear;
selectors for line items, total quantity, and (if all tiers have price) subtotal — else show "Price on enquiry".
Persist to localStorage. **CartButton** in header shows live count. **CartDrawer** = right **side drawer**
(focus-trapped, ESC to close, accessible), lists CartItem rows with QtyStepper, CartSummary, and a
"Proceed to enquiry" link to `/checkout`. Add-to-Cart opens the drawer.

---

## 12. ENQUIRY (no payment) — form + Resend + WhatsApp/Call

Form (React Hook Form + Zod): **name (required), mobile (required, Indian 10-digit validation),
email (optional)**, optional message; cart contents attached automatically.
On submit → `POST /api/enquiry`.

`app/api/enquiry/route.ts`:
- If `RESEND_API_KEY` and `ENQUIRY_TO_EMAIL` are set → send a clean email (customer details + itemized
  cart with tiers/qty) via Resend; return success.
- If not set → return `{ ok: false, reason: "email-disabled" }` gracefully (no crash); UI then tells the
  user to use WhatsApp/Call instead.

**EnquiryActions** component (PDP, `/p/[slug]`, checkout): three buttons —
- **WhatsApp** → `https://wa.me/<NEXT_PUBLIC_WHATSAPP>?text=<prefilled enquiry incl. product/cart>`
- **Call** → `tel:<NEXT_PUBLIC_PHONE>`
- **Email** → submit form / `mailto:` fallback
Each button renders only if its env value exists.

---

## 13. SEO

- Metadata API + `generateMetadata` per page/product (title, description, canonical, OG, alternates for en/hi).
- `app/sitemap.ts` — all indexable routes incl. PDPs & blog; **exclude `/p/[slug]`**.
- `app/robots.ts` — allow all except `/p/`.
- `seo/JsonLd` component injects: `Product` + `BreadcrumbList` (PDP), `FAQPage` (anywhere FAQ shows),
  `Article` (blog), `Organization` (root).
- Search Console verification meta + GA4 render only when their env vars are set.

---

## 14. PWA

`app/manifest.ts` (name from `site`, Agni-Gold theme color `#150F0C`, icons from `/public/icons`),
Serwist service worker (offline shell + cache static assets/images), `pwa/InstallButton` captures
`beforeinstallprompt` and shows a custom install button; iOS shows manual "Add to Home Screen" instructions.

---

## 15. QR GENERATION

`scripts/generate-qr.ts` (run via `npm run generate:qr`): for every slug from `getAllSlugs()`, generate a
QR (SVG + PNG) encoding `${NEXT_PUBLIC_SITE_URL}/p/${slug}` into `/public/qr/<slug>.{svg,png}`.
High error-correction, generous quiet zone, print-ready.

---

## 16. PLACEHOLDER ASSETS (exact sizes; I'll replace locally)

- PDP hero/gallery: **1200×1200** (square)
- Product card: **800×800**
- Hero background fallback: **1920×1080**
- OG image: **1200×630**
- Blog cover: **1200×675**
- Favicon / PWA icon: **512×512** (+ 192×192)
Generate neutral Agni-Gold-tinted placeholders at these sizes; reference them via the slug paths in JSON.

---

## 17. QUALITY FLOOR (accessibility + performance)

- Responsive 320px → desktop; no horizontal scroll on mobile.
- Visible keyboard focus on every interactive element; drawer & accordions fully keyboard operable.
- `prefers-reduced-motion` disables 3D drift, particles, and non-essential transitions.
- Alt text on all images; color contrast AA against the dark base.
- 3D and below-the-fold images lazy-loaded; fonts via `next/font` (no layout shift).
- Lighthouse target on mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

---

## 18. FORMATTING & LOCALE

`lib/format.ts`: INR currency with **Indian grouping** (lakh/crore) via
`Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })`;
helpers for tier/quantity display. Default locale **English**; Hindi available via the LocaleSwitcher.
Round every displayed number.

---

## 19. ACCEPTANCE CRITERIA (must all pass before done)

- [ ] `npm run build` and `npm run typecheck` pass with zero errors.
- [ ] App runs with **no env vars set** (all integrations gracefully off; WhatsApp/Call/Email buttons hidden when their env is absent).
- [ ] Adding a product = editing `data/products.json` only; invalid JSON fails the build with a clear Zod error.
- [ ] Home shows hero (with mobile static fallback), featured products, trust strip, channels, FAQ — **no blog**.
- [ ] PDP: tiers + qty + Add-to-Cart (no Buy Now) + ingredients + HSN + WhatsApp/Call/Email + FAQ; correct JSON-LD; indexed.
- [ ] `/p/[slug]`: ingredients first, then channels, then enquiry CTA; `noindex`; not in sitemap.
- [ ] Cart persists across reload; side drawer is accessible; checkout enquiry validates name+mobile, email optional.
- [ ] `/api/enquiry` sends via Resend when configured, returns graceful disabled response otherwise.
- [ ] EN/HI switch works site-wide; default English; Devanagari font applied for HI.
- [ ] PWA installable; `/install` works; manifest + service worker present.
- [ ] `npm run generate:qr` outputs `/public/qr/<slug>.svg|png` pointing at `/p/<slug>`.
- [ ] sitemap.ts, robots.ts, metadata, and all JSON-LD present and valid.
- [ ] `prefers-reduced-motion` respected; keyboard nav works throughout.

---

## 20. BUILD & DEPLOY

Target **Vercel**, **npm**. Standard Next.js build (image optimization on). Provide a short `README.md`
documenting: env vars, how to add a product, how to regenerate QR codes, and how to deploy to Vercel.

---

## 21. PLUGGING IN REAL DATA LATER (note for me, the owner)

I will locally: replace `data/products.json` with the scraped IndiaMART data (same schema), add real
images under `public/products/<slug>/`, fill `data/faqs.json`, set env vars (phone, WhatsApp, enquiry
email, Resend key, channel URLs, GA), and replace placeholder headlines in `messages/*.json`. Build the
app so all of this is a drop-in with **no code changes required**.

— END OF MEGA PROMPT —
