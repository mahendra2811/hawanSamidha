import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { HeroBackground } from "@/components/home/HeroBackground";
import { HERO_SLIDES } from "@/config/hero-images";

export async function Hero() {
  const t = await getTranslations("Home");

  return (
    <section className="grad-hero relative isolate overflow-hidden">
      {/* Full-bleed hero photograph(s) — slide 0 is the LCP image, painted
          immediately; any additional slides become an auto/manual carousel. */}
      <HeroBackground slides={HERO_SLIDES} />
      {/* Scrim: keeps the left-side headline legible over the photo while the
          product (right) stays visible. Theme-aware via CSS custom property
          (see globals.css) — no JS needed, flips instantly with the theme. */}
      <div className="grad-hero-scrim pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <Container>
        <div className="relative flex min-h-[34rem] items-center py-20 sm:min-h-[38rem] sm:py-28 lg:min-h-[40rem] lg:py-32">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl font-semibold leading-tight text-text sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 text-lg text-text-secondary">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className={buttonClasses("primary", "lg")}>
                {t("heroCtaProducts")}
              </Link>
              <Link href="/checkout" className={buttonClasses("outline", "lg")}>
                {t("heroCtaEnquiry")}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
