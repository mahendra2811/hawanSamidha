import { getTranslations } from "next-intl/server";
import { Star, ShieldCheck, CalendarClock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

export async function TrustStrip() {
  const t = await getTranslations("Trust");

  const items = [
    {
      Icon: CalendarClock,
      value: `${site.company.yearsOnIndiamart}+`,
      label: t("yearsLabel"),
    },
    {
      Icon: Star,
      value: `${site.company.rating}★`,
      label: t("ratingLabel", { reviews: site.company.reviews }),
    },
    {
      Icon: ShieldCheck,
      value: "TrustSEAL",
      label: t("sealLabel"),
    },
  ];

  return (
    <section aria-label={t("title")} className="border-y border-border bg-surface">
      <Container>
        <ul className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-3">
          {items.map(({ Icon, value, label }, i) => (
            <li key={i} className="flex items-center justify-center gap-3 text-center sm:justify-start">
              <Icon size={28} className="shrink-0 text-gold" aria-hidden />
              <span>
                <span className="block font-display text-xl font-semibold text-text">{value}</span>
                <span className="block text-sm text-text-muted">{label}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
