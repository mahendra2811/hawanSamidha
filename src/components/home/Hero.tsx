import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { getFeaturedProducts } from "@data/products";
import { pick } from "@/lib/i18n";

export async function Hero() {
  const t = await getTranslations("Home");
  const locale = await getLocale();
  const featured = getFeaturedProducts(1)[0];

  return (
    <section className="grad-hero relative overflow-hidden">
      {/* Static gradient glow fallback — paints immediately (LCP-safe). */}
      <div className="grad-glow pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      {/* 3D sparks hydrate after paint, desktop + motion-OK only. */}
      <HeroCanvas />

      <Container>
        <div className="relative grid items-center gap-10 py-20 sm:py-28 lg:grid-cols-2 lg:py-32">
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

          {featured && (
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="grad-glow absolute inset-0 scale-110" aria-hidden />
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-gold/20 shadow-2xl">
                <Image
                  src={featured.heroImage}
                  alt={pick(featured.name, locale)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
