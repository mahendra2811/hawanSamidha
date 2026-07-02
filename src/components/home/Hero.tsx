import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { HeroBackground } from "@/components/home/HeroBackground";
import { HERO_IMAGES } from "@/config/hero-images";

export async function Hero() {
  const t = await getTranslations("Home");

  return (
    <section className="grad-hero relative isolate overflow-hidden">
      {/* Full-bleed hero photograph(s) — first is the LCP image, painted
          immediately; any additional images become an auto/manual slideshow. */}
      <HeroBackground images={HERO_IMAGES} />
      {/* Warm scrim: keeps the left-side headline legible over the bright image
          on every viewport, while the product (right) stays visible. Stronger on
          mobile (text spans the width) and lighter on desktop (text is one column). */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(253,246,233,0.97)_0%,rgba(253,246,233,0.9)_42%,rgba(253,246,233,0.6)_70%,rgba(253,246,233,0.12)_100%)] lg:bg-[linear-gradient(90deg,rgba(253,246,233,0.92)_0%,rgba(253,246,233,0.7)_38%,rgba(253,246,233,0.15)_62%,rgba(253,246,233,0)_80%)]"
        aria-hidden
      />

      <Container>
        <div className="relative flex min-h-[34rem] items-center py-20 sm:min-h-[38rem] sm:py-28 lg:min-h-[40rem] lg:py-32">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl font-semibold leading-tight text-[#150F0C] sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 text-lg text-[#4a3a2c]">{t("heroSubtitle")}</p>
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
