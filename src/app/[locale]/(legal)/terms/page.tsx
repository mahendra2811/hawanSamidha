import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Legal");
  return buildMetadata({ locale, path: "/terms", title: `${t("termsTitle")} · Ammedi` });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  return (
    <Section>
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-text">{t("termsTitle")}</h1>
        <p className="mt-4 rounded border border-border bg-surface px-4 py-3 text-sm text-text-muted">
          {t("placeholderNote")}
        </p>
        <div className="mt-6 space-y-4 leading-relaxed text-text-secondary">
          <p>
            All prices are indicative and confirmed on enquiry. Orders are subject to availability,
            minimum order quantities, and confirmation by Ganga Agro Industries.
          </p>
          <p>
            Product images are representative. Specifications may vary by batch. This is a Phase-0
            enquiry website; no online payments are processed.
          </p>
        </div>
      </Container>
    </Section>
  );
}
