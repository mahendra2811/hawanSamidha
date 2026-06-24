import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CheckoutClient } from "@/components/cart/CheckoutClient";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Checkout");
  return buildMetadata({
    locale,
    path: "/checkout",
    title: `${t("title")} · Ammedi`,
    description: t("subtitle"),
    noindex: true,
  });
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Checkout");

  return (
    <Section>
      <Container>
        <header className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-text">{t("title")}</h1>
          <p className="mt-2 text-text-secondary">{t("subtitle")}</p>
        </header>
        <CheckoutClient />
      </Container>
    </Section>
  );
}
