import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ChannelLinks } from "@/components/channels/ChannelLinks";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("About");
  return buildMetadata({ locale, path: "/about", title: `${t("title")} · Ammedi`, description: t("lead") });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <>
      <Section>
        <Container className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold text-text">{t("title")}</h1>
          <p className="mt-3 text-lg text-text-secondary">{t("lead")}</p>
          <h2 className="mt-10 font-display text-2xl font-semibold text-text">{t("storyTitle")}</h2>
          <p className="mt-3 leading-relaxed text-text-secondary">{t("story")}</p>
        </Container>
      </Section>

      <TrustStrip />

      <Section>
        <Container className="max-w-3xl">
          <h2 className="mb-6 font-display text-2xl font-semibold text-text">{t("channelsTitle")}</h2>
          <ChannelLinks />
        </Container>
      </Section>
    </>
  );
}
