import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPostBySlug, getAllPostSlugs } from "@data/posts";
import { pick } from "@/lib/i18n";
import { buildMetadata, localizedPath, articleJsonLd } from "@/lib/seo";
import { site } from "@/config/site";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title: `${pick(post.title, locale)} · Ammedi`,
    description: pick(post.excerpt, locale),
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations("Blog");
  const title = pick(post.title, locale);
  const url = new URL(localizedPath(locale, `/blog/${slug}`), site.url).toString();

  return (
    <Section>
      <Container className="max-w-2xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-gold"
        >
          <ArrowLeft size={16} aria-hidden /> {t("backToBlog")}
        </Link>

        <article className="mt-6">
          <time className="text-xs uppercase tracking-wide text-text-muted" dateTime={post.date}>
            {new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
              dateStyle: "medium",
            }).format(new Date(post.date))}
          </time>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-text">
            {title}
          </h1>

          <div className="mt-8 space-y-5">
            {post.body.map((block, i) =>
              block.type === "h2" ? (
                <h2 key={i} className="font-display text-2xl font-semibold text-text">
                  {pick(block.text, locale)}
                </h2>
              ) : (
                <p key={i} className="leading-relaxed text-text-secondary">
                  {pick(block.text, locale)}
                </p>
              ),
            )}
          </div>
        </article>
      </Container>

      <JsonLd
        data={articleJsonLd({
          title,
          description: pick(post.excerpt, locale),
          url,
          datePublished: post.date,
        })}
      />
    </Section>
  );
}
