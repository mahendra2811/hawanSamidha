import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { posts } from "@data/posts";
import { pick } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Blog");
  return buildMetadata({ locale, path: "/blog", title: `${t("title")} · Ammedi`, description: t("subtitle") });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Blog");

  return (
    <Section>
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl font-semibold text-text">{t("title")}</h1>
        <p className="mt-2 text-text-secondary">{t("subtitle")}</p>

        {posts.length === 0 ? (
          <p className="mt-10 text-text-muted">{t("empty")}</p>
        ) : (
          <ul className="mt-10 space-y-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-gold/30">
                  <time className="text-xs uppercase tracking-wide text-text-muted" dateTime={post.date}>
                    {new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
                      dateStyle: "medium",
                    }).format(new Date(post.date))}
                  </time>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-text">
                    <Link href={`/blog/${post.slug}`} className="hover:text-gold">
                      {pick(post.title, locale)}
                    </Link>
                  </h2>
                  <p className="mt-2 text-text-secondary">{pick(post.excerpt, locale)}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold hover:underline"
                  >
                    {t("readMore")} <ArrowRight size={16} aria-hidden />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
