import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ChannelsSection } from "@/components/home/ChannelsSection";
import { FaqBlock } from "@/components/home/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/seo";
import { getFaqsForScope } from "@data/faqs";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const faqs = getFaqsForScope("global");

  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedProducts />
      <ChannelsSection />
      <Section>
        <Container className="max-w-3xl">
          <FaqBlock faqs={faqs} locale={locale} title={t("faqTitle")} />
        </Container>
      </Section>
      <JsonLd data={organizationJsonLd()} />
    </>
  );
}
