import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { InstallButton } from "@/components/pwa/InstallButton";
import { InstallInstructions } from "@/components/pwa/InstallInstructions";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Install");
  return buildMetadata({ locale, path: "/install", title: `${t("title")} · Ammedi`, description: t("subtitle") });
}

export default async function InstallPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Install");

  return (
    <Section>
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-text">{t("title")}</h1>
        <p className="mt-3 text-lg text-text-secondary">{t("subtitle")}</p>
        <div className="mt-8">
          <InstallButton />
        </div>
        <div className="mt-8">
          <InstallInstructions />
        </div>
      </Container>
    </Section>
  );
}
