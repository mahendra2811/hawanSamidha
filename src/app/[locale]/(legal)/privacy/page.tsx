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
  return buildMetadata({ locale, path: "/privacy", title: `${t("privacyTitle")} · Ammedi` });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  return (
    <Section>
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-text">{t("privacyTitle")}</h1>
        <p className="mt-4 rounded border border-border bg-surface px-4 py-3 text-sm text-text-muted">
          {t("placeholderNote")}
        </p>
        <div className="mt-6 space-y-4 leading-relaxed text-text-secondary">
          <p>
            We respect your privacy. Enquiry details you share (name, mobile, email, message) are
            used only to respond to your wholesale enquiry and are never sold.
          </p>
          <p>
            This site stores your cart locally in your browser. We do not run advertising trackers.
            Analytics, if enabled, are aggregate and anonymous.
          </p>
        </div>
      </Container>
    </Section>
  );
}
