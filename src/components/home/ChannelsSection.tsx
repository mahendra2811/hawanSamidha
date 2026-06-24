import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ChannelLinks } from "@/components/channels/ChannelLinks";

export async function ChannelsSection() {
  const t = await getTranslations("Home");

  return (
    <Section className="bg-surface">
      <Container>
        <div className="mb-8 max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-text">{t("channelsTitle")}</h2>
          <p className="mt-2 text-text-secondary">{t("channelsSubtitle")}</p>
        </div>
        <ChannelLinks />
      </Container>
    </Section>
  );
}
