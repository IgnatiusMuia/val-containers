import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUseCase, useCases } from "@/data/use-cases";
import { getContainer } from "@/lib/containers/repository";
import { site } from "@/data/site";
import { formatKES } from "@/lib/format";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { SmartImage } from "@/components/ui/SmartImage";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { ContainerCard } from "@/components/containers/ContainerCard";
import { CtaBand } from "@/components/home/CtaBand";

export const instant = false;

export function generateStaticParams() {
  return useCases.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/use-cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) return { title: "Use case not found" };

  const title = `${useCase.shortTitle} Containers in Kenya`;
  const description = useCase.summary;

  return {
    title,
    description,
    alternates: { canonical: `/use-cases/${useCase.slug}` },
    openGraph: {
      type: "website",
      locale: "en_KE",
      url: `/use-cases/${useCase.slug}`,
      siteName: site.name,
      title: `${title} — Val Containers`,
      description,
      images: [
        { url: useCase.image.src, width: 1600, height: 1200, alt: useCase.image.alt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Val Containers`,
      description,
      images: [useCase.image.src],
    },
  };
}

export default async function UseCasePage({
  params,
}: PageProps<"/use-cases/[slug]">) {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();

  const recommended = (
    await Promise.all(useCase.related.map((containerSlug) => getContainer(containerSlug)))
  ).filter((container): container is NonNullable<typeof container> => Boolean(container));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Use cases", path: "/use-cases" },
            { name: useCase.shortTitle, path: `/use-cases/${useCase.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: useCase.shortTitle,
            description: useCase.summary,
            provider: { "@id": `${site.url}/#business` },
            areaServed: { "@type": "Country", name: "Kenya" },
            offers: {
              "@type": "Offer",
              priceCurrency: "KES",
              price: useCase.fromPrice,
              description: "Yard price from, before delivery",
            },
          },
        ]}
      />

      <section className="relative overflow-hidden border-b border-bone/10 bg-ink pb-14 pt-6">
        <div className="ribs absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="wrap relative">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Use cases", href: "/use-cases" },
              { name: useCase.shortTitle },
            ]}
          />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-ember">{useCase.eyebrow}</p>
              <h1 className="mt-5 font-display text-[clamp(2.5rem,5.4vw,4.8rem)] font-bold leading-[0.94] tracking-[-0.05em] text-bone">
                {useCase.title}
              </h1>
              <p className="mt-6 max-w-xl text-[14px] leading-relaxed text-bone/55 sm:text-[15px]">
                {useCase.intro}
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <QuoteButton size="lg" source={`use-case-${useCase.slug}`}>
                  Get a free quote
                </QuoteButton>
                <Link
                  href="/containers"
                  className="inline-flex h-14 items-center justify-center gap-2 border border-bone/25 px-6 text-[14px] text-bone/75 transition-colors hover:border-bone hover:text-bone"
                >
                  Browse units
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden border border-bone/12">
                <SmartImage
                  src={useCase.image.src}
                  alt={useCase.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  wrapperClassName="absolute inset-0"
                  className="object-cover"
                  loading="eager"
                  fetchPriority="high"
                  fallbackLabel="Use case photo coming soon"
                />
              </div>
              <dl className="mt-2 grid grid-cols-3 gap-px border border-bone/10 bg-bone/10">
                <div className="bg-ink p-3">
                  <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                    From
                  </dt>
                  <dd className="mt-1.5 font-display text-[15px] font-semibold text-bone">
                    {formatKES(useCase.fromPrice)}
                  </dd>
                </div>
                <div className="bg-ink p-3">
                  <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                    Sizes
                  </dt>
                  <dd className="mt-1.5 text-[11px] text-bone/70">
                    {useCase.sizes.join(" · ")}
                  </dd>
                </div>
                <div className="bg-ink p-3">
                  <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                    Lead time
                  </dt>
                  <dd className="mt-1.5 text-[10.5px] leading-tight text-bone/70">
                    {useCase.timeline.split(" for ")[0]}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-bone">
        <div className="wrap py-16 sm:py-24">
          <p className="eyebrow text-ember-deep">What it solves</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.045em] text-ink">
            Practical from day one.
          </h2>

          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {useCase.features.map((feature, index) => (
              <div
                key={feature.title}
                className="border-t border-ink/15 pt-5"
              >
                <p className="font-mono text-[9px] tracking-[0.14em] text-ember-deep">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-[21px] font-semibold leading-tight tracking-[-0.02em] text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink/60">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-8 border-t border-ink/10 pt-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-ember-deep">Before you commit</p>
              <h2 className="mt-4 font-display text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.04] tracking-[-0.04em] text-ink">
                Three things to get right.
              </h2>
              <p className="mt-4 text-[13px] leading-relaxed text-ink/55">
                None of these are reasons to avoid a container. They are the
                details that separate a smooth project from an expensive lesson.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
              {useCase.considerations.map((item) => (
                <div
                  key={item.title}
                  className="border border-ink/12 bg-bone-2/40 p-4"
                >
                  <Icon
                    name="check"
                    className="h-4 w-4 text-ember-deep"
                  />
                  <h3 className="mt-4 text-[13px] font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-ink/55">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 sm:py-20">
        <div className="wrap">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-ember">Recommended units</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.045em] text-bone">
                Boxes that do this well.
              </h2>
            </div>
            <ButtonLink
              href="/containers"
              variant="outline"
              size="sm"
              className="hidden shrink-0 sm:inline-flex"
            >
              All containers
            </ButtonLink>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.slice(0, 3).map((container) => (
              <ContainerCard
                key={container.slug}
                container={container}
                imageSizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>

          <ButtonLink
            href="/containers"
            variant="outline"
            size="md"
            className="mt-6 w-full sm:hidden"
          >
            All containers
          </ButtonLink>

          <div className="mt-10 flex flex-col gap-2 border-t border-bone/10 pt-5 text-[11px] text-bone/35 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/use-cases"
              className="transition-colors hover:text-bone/70"
            >
              ← All use cases
            </Link>
            <p>Not sure which fits? Send the job details — we&rsquo;ll size it.</p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
