import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Gallery } from "@/components/product/Gallery";
import { ProductBuyBox } from "@/components/product/ProductBuyBox";
import { IngredientList } from "@/components/product/IngredientList";
import { SpecList } from "@/components/product/SpecList";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FaqBlock } from "@/components/home/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProductBySlug, getAllSlugs, getRelatedProducts } from "@data/products";
import { faqs } from "@data/faqs";
import { pick } from "@/lib/i18n";
import { categoryLabel } from "@/lib/categories";
import { site } from "@/config/site";
import {
  buildMetadata,
  localizedPath,
  productJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const title = product.seo ? pick(product.seo.title, locale) : pick(product.name, locale);
  const description = product.seo
    ? pick(product.seo.description, locale)
    : pick(product.shortDescription, locale);
  return buildMetadata({
    locale,
    path: `/products/${slug}`,
    title,
    description,
    images: [product.heroImage],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("Product");
  const name = pick(product.name, locale);
  const related = getRelatedProducts(product, 4);

  const productFaqs = faqs.filter(
    (f) => f.scope === slug || f.scope === product.category || f.scope === "global",
  );

  const absUrl = new URL(localizedPath(locale, `/products/${slug}`), site.url).toString();
  const breadcrumb = [
    { name: t("breadcrumbHome"), url: new URL(localizedPath(locale, "/"), site.url).toString() },
    {
      name: t("breadcrumbProducts"),
      url: new URL(localizedPath(locale, "/products"), site.url).toString(),
    },
    { name, url: absUrl },
  ];

  return (
    <Section>
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-gold">
                {t("breadcrumbHome")}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/products" className="hover:text-gold">
                {t("breadcrumbProducts")}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-text-secondary">{name}</li>
          </ol>
        </nav>

        <article className="grid gap-10 lg:grid-cols-2">
          <Gallery images={product.images.length ? product.images : [product.heroImage]} alt={name} />

          <div>
            <p className="text-sm uppercase tracking-wide text-text-muted">
              {categoryLabel(product.category, locale)}
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-text sm:text-4xl">
              {name}
            </h1>
            <p className="mt-4 text-text-secondary">{pick(product.shortDescription, locale)}</p>

            <div className="mt-6">
              <ProductBuyBox product={product} />
            </div>
          </div>
        </article>

        {/* Long description */}
        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-text">{t("description")}</h2>
          <p className="mt-3 leading-relaxed text-text-secondary">
            {pick(product.longDescription, locale)}
          </p>
        </section>

        {/* Ingredients */}
        {product.ingredients.length > 0 && (
          <section className="mt-10 max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-text">{t("ingredients")}</h2>
            <p className="mb-4 mt-1 text-sm text-text-muted">{t("ingredientsIntro")}</p>
            <IngredientList ingredients={product.ingredients} locale={locale} />
          </section>
        )}

        {/* Specifications + HSN */}
        {product.specifications.length > 0 && (
          <section className="mt-10 max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-text">{t("specifications")}</h2>
            <div className="mt-4">
              <SpecList specs={product.specifications} locale={locale} />
            </div>
            {product.hsnCode && (
              <p className="mt-3 text-sm text-text-muted">
                {t("hsn")}: <span className="text-text">{product.hsnCode}</span>
              </p>
            )}
          </section>
        )}

        {/* FAQ */}
        {productFaqs.length > 0 && (
          <section className="mt-12 max-w-3xl">
            <FaqBlock faqs={productFaqs} locale={locale} title={t("faqTitle")} />
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-display text-2xl font-semibold text-text">{t("relatedTitle")}</h2>
            <ProductGrid products={related} locale={locale} />
          </section>
        )}
      </Container>

      <JsonLd data={productJsonLd(product, locale, absUrl)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />
      {productFaqs.length > 0 && (
        <JsonLd
          data={faqJsonLd(
            productFaqs.map((f) => ({
              question: pick(f.question, locale),
              answer: pick(f.answer, locale),
            })),
          )}
        />
      )}
    </Section>
  );
}
