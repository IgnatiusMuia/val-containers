import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  blogPosts,
  getPost,
  relatedPosts,
} from "@/data/blog";
import { site } from "@/data/site";
import { formatDate } from "@/lib/format";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { BlogCard } from "@/components/blog/BlogCard";
import { CtaBand } from "@/components/home/CtaBand";

export const instant = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Guide not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      locale: "en_KE",
      url: `/blog/${post.slug}`,
      siteName: site.name,
      title: `${post.title} — Val Containers`,
      description: post.description,
      publishedTime: post.date,
      images: [{ url: post.image.src, width: 1600, height: 1200, alt: post.image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — Val Containers`,
      description: post.description,
      images: [post.image.src],
    },
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = relatedPosts(post.slug, 3);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleSchema(post),
        ]}
      />

      <article>
        <header className="relative overflow-hidden border-b border-bone/10 bg-ink pb-10 pt-6">
          <div className="ribs absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="wrap relative">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Blog", href: "/blog" },
                { name: post.category },
              ]}
            />
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-ember px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink">
                  {post.category}
                </span>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-bone/35">
                  {formatDate(post.date)} · {post.readMinutes} min read
                </span>
              </div>
              <h1 className="mt-5 font-display text-[clamp(2.2rem,5.2vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.05em] text-bone">
                {post.title}
              </h1>
              <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-bone/50">
                {post.excerpt}
              </p>
            </div>
          </div>
        </header>

        <div className="bg-ink">
          <div className="wrap pb-10">
            <div className="relative aspect-[16/10] overflow-hidden border border-bone/12 sm:aspect-[21/9]">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                sizes="100vw"
                className="object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>

        <div className="bg-bone">
          <div className="wrap py-14 sm:py-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                <ArticleBody blocks={post.content} />

                <div className="mt-12 flex flex-col gap-4 border-t border-ink/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.13em] text-ink/40">
                      Written by
                    </p>
                    <p className="mt-1.5 font-display text-[18px] font-semibold tracking-[-0.02em] text-ink">
                      Val Containers · Nairobi yard
                    </p>
                  </div>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-[11.5px] font-medium text-ember-deep"
                  >
                    <Icon name="chevron-left" className="h-3.5 w-3.5" />
                    All buying notes
                  </Link>
                </div>
              </div>

              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <div className="border border-bone/0 bg-ink p-5 text-bone sm:p-6">
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ember">
                      Skip the reading
                    </p>
                    <h2 className="mt-3 font-display text-[24px] font-semibold leading-[1.08] tracking-[-0.03em]">
                      See the actual unit and the price.
                    </h2>
                    <p className="mt-3 text-[12px] leading-relaxed text-bone/50">
                      Every container in the fleet has photos, a grade and a
                      published yard price. Delivery is quoted in writing.
                    </p>
                    <ButtonLink
                      href="/containers"
                      variant="primary"
                      size="sm"
                      className="mt-5 w-full"
                    >
                      Browse the fleet
                    </ButtonLink>
                    <QuoteButton
                      variant="outline"
                      size="sm"
                      source={`blog-${post.slug}`}
                      className="mt-2 w-full"
                    >
                      Get a quote
                    </QuoteButton>
                  </div>

                  <div className="mt-5 border border-ink/12 bg-bone-2/40 p-5">
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink/45">
                      Related notes
                    </p>
                    <ul className="mt-3 divide-y divide-ink/10">
                      {related.map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={`/blog/${item.slug}`}
                            className="group flex items-start justify-between gap-3 py-3"
                          >
                            <span className="text-[12px] leading-snug text-ink/70 transition-colors group-hover:text-ink">
                              {item.title}
                            </span>
                            <Icon
                              name="arrow-up-right"
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/25"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <section className="bg-ink py-14 sm:py-20">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-ember">Keep reading</p>
                <h2 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold leading-[1.03] tracking-[-0.04em] text-bone">
                  More from the yard.
                </h2>
              </div>
              <ButtonLink
                href="/blog"
                variant="outline"
                size="sm"
                className="hidden shrink-0 sm:inline-flex"
              >
                All guides
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      </article>

      <CtaBand />
    </>
  );
}
