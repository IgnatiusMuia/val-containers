import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts, featuredPost } from "@/data/blog";
import { site } from "@/data/site";
import { formatDate } from "@/lib/format";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icons";
import { BlogCard } from "@/components/blog/BlogCard";
import { CtaBand } from "@/components/home/CtaBand";

const title = "Container Buying Guides & Notes from the Yard";
const description =
  "Practical guides to shipping container prices, delivery, fabrication and container homes in Kenya — written from the yard, not a content farm.";

const latestGuideDate = blogPosts[0]?.date ?? "2026-01-01";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/blog",
    siteName: site.name,
    title: `${title} — Val Containers`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — Val Containers`,
    description,
  },
};

export default function BlogPage() {
  const rest = blogPosts.filter((post) => post.slug !== featuredPost.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      <section className="relative overflow-hidden border-b border-bone/10 bg-ink pb-12 pt-6">
        <div className="ribs absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="wrap relative">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Blog" }]}
          />
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow text-ember">The buying notes</p>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,6.2vw,5.2rem)] font-bold leading-[0.92] tracking-[-0.05em] text-bone">
                What we learn
                <br />
                at the gate<span className="text-ember">.</span>
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="max-w-sm text-[13px] leading-relaxed text-bone/50">
                Prices, delivery, fabrication and the mistakes we see. Written
                by the people who load the containers — updated as the market
                moves.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink pb-20 pt-10">
        <div className="wrap">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group grid overflow-hidden border border-bone/12 bg-coal transition-colors hover:border-bone/30 lg:grid-cols-12"
          >
            <div className="relative aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[420px]">
              <Image
                src={featuredPost.image.src}
                alt={featuredPost.image.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col p-6 sm:p-8 lg:col-span-5 lg:justify-center">
              <div className="flex items-center gap-3">
                <span className="bg-ember px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink">
                  Featured guide
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-bone/30">
                  {featuredPost.readMinutes} min read
                </span>
              </div>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3vw,2.5rem)] font-bold leading-[1.03] tracking-[-0.035em] text-bone">
                {featuredPost.title}
              </h2>
              <p className="mt-4 text-[13px] leading-relaxed text-bone/50">
                {featuredPost.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-bone/10 pt-4">
                <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-bone/30">
                  {featuredPost.category} · {formatDate(featuredPost.date)}
                </span>
                <Icon
                  name="arrow-up-right"
                  className="h-4 w-4 text-bone/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </Link>

          <div className="mt-8 flex items-end justify-between gap-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/35">
              More from the yard
            </p>
            <p className="text-[11px] text-bone/25">
              {blogPosts.length} guides · Updated{" "}
              {new Intl.DateTimeFormat("en-KE", {
                month: "long",
                year: "numeric",
              }).format(new Date(latestGuideDate))}
            </p>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
