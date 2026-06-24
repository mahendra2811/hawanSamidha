import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getFeaturedProducts } from "@data/products";

export async function FeaturedProducts() {
  const t = await getTranslations("Home");
  const locale = await getLocale();
  const products = getFeaturedProducts(8);

  if (products.length === 0) return null;

  return (
    <Section>
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold text-text">{t("featuredTitle")}</h2>
            <p className="mt-2 text-text-secondary">{t("featuredSubtitle")}</p>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-medium text-gold hover:underline sm:inline-flex"
          >
            {t("heroCtaProducts")} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <ProductGrid products={products} locale={locale} />
      </Container>
    </Section>
  );
}
