import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProductsExplorer } from "@/components/product/ProductsExplorer";
import { products } from "@data/products";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Products");
  return buildMetadata({
    locale,
    path: "/products",
    title: `${t("title")} · Ammedi`,
    description: t("subtitle"),
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Products");

  return (
    <Section>
      <Container>
        <header className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-text">{t("title")}</h1>
          <p className="mt-2 max-w-2xl text-text-secondary">{t("subtitle")}</p>
        </header>
        <ProductsExplorer products={products} locale={locale} />
      </Container>
    </Section>
  );
}
