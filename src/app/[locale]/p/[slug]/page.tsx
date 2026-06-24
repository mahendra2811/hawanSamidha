import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { IngredientList } from "@/components/product/IngredientList";
import { SpecList } from "@/components/product/SpecList";
import { ChannelLinks } from "@/components/channels/ChannelLinks";
import { EnquiryActions } from "@/components/cart/EnquiryActions";
import { getProductBySlug, getAllSlugs } from "@data/products";
import { pick } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { buildProductEnquiry } from "@/lib/enquiry";

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
  // noindex + excluded from sitemap — must not compete with the PDP.
  return buildMetadata({
    locale,
    path: `/p/${slug}`,
    title: pick(product.name, locale),
    description: pick(product.shortDescription, locale),
    images: [product.heroImage],
    noindex: true,
  });
}

export default async function QrInfoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("Qr");
  const name = pick(product.name, locale);
  const message = buildProductEnquiry(name, pick(product.priceTiers[0].label, locale), 1, locale);

  return (
    <Section>
      <Container className="max-w-2xl">
        {/* Product header */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative aspect-square w-44 overflow-hidden rounded-2xl border border-border bg-surface">
            <Image src={product.heroImage} alt={name} fill sizes="176px" className="object-cover" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-text">{name}</h1>
        </div>

        {/* Ingredients FIRST (primary focus) — fall back to key specs. */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold text-gold">
            {t("ingredientsTitle")}
          </h2>
          {product.ingredients.length > 0 ? (
            <IngredientList ingredients={product.ingredients} locale={locale} />
          ) : (
            <SpecList specs={product.specifications.slice(0, 8)} locale={locale} />
          )}
        </section>

        {/* Channels */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold text-text">{t("channelsTitle")}</h2>
          <ChannelLinks />
        </section>

        {/* Soft wholesale enquiry CTA */}
        <section className="mt-10 rounded-2xl border border-border bg-surface p-6 text-center">
          <h2 className="font-display text-xl font-semibold text-text">{t("enquiryTitle")}</h2>
          <p className="mb-4 mt-1 text-sm text-text-secondary">{t("enquiryBody")}</p>
          <div className="flex justify-center">
            <EnquiryActions message={message} />
          </div>
        </section>
      </Container>
    </Section>
  );
}
