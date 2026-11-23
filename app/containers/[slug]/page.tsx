import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { primaryImage } from "@/data/containers";
import {
  getContainer,
  getContainerSlugs,
  getRelatedContainers,
} from "@/lib/containers/repository";
import { getSiteSettings } from "@/lib/content";
import { site } from "@/data/site";
import { formatDate, formatKES } from "@/lib/format";
import { containerEnquiry } from "@/lib/whatsapp";
import { breadcrumbSchema, productSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/Button";
import { ContainerCard } from "@/components/containers/ContainerCard";
import { EnquiryPanel } from "@/components/containers/EnquiryPanel";
import { MediaGallery } from "@/components/containers/MediaGallery";
import { SpecTable } from "@/components/containers/SpecTable";
import { StickyEnquiryBar } from "@/components/containers/StickyEnquiryBar";

export const instant = false;

export async function generateStaticParams() {
  const slugs = await getContainerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/containers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const container = await getContainer(slug);
  if (!container) return { title: "Container not found" };

  const title = `${container.shortName} — ${formatKES(container.price)}`;
  const description = `${container.conditionLabel} ${container.sizeLabel} ${container.typeLabel.toLowerCase()} container for sale in Kenya at ${formatKES(container.price)}. Inspect in Nairobi, delivery countrywide.`;
  const image = primaryImage(container);

  return {
    title,
    description,
    alternates: { canonical: `/containers/${container.slug}` },
    openGraph: {
      type: "website",
      locale: "en_KE",
      url: `/containers/${container.slug}`,
      siteName: site.name,
      title: `${title} — Val Containers`,
      description,
      images: [{ url: image.src, width: 1600, height: 1200, alt: image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Val Containers`,
      description,
      images: [image.src],
    },
  };
}

export default async function ContainerPage({
  params,
}: PageProps<"/containers/[slug]">) {
  const { slug } = await params;
  const container = await getContainer(slug);
  if (!container) notFound();

  const usesPlaceholder = container.media.every(
    (item) => item.kind === "image" && item.src.includes("photo-coming-soon"),
  );
  const [related, settings] = await Promise.all([
    getRelatedContainers(container, 6),
    getSiteSettings(),
  ]);
  const message = containerEnquiry({
    name: container.name,
    sizeLabel: container.sizeLabel,
    conditionLabel: container.conditionLabel,
    priceLabel: formatKES(container.price),
  });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Containers", path: "/containers" },
            {
              name: container.shortName,
              path: `/containers/${container.slug}`,
            },
          ]),
          productSchema(container),
        ]}
      />

      <section className="relative overflow-hidden border-b border-bone/10 bg-ink pb-12 pt-6">
        <div className="ribs absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="wrap relative">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Containers", href: "/containers" },
              { name: container.shortName },
            ]}
          />

          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <MediaGallery
                media={container.media}
                name={container.shortName}
                representative={container.photosAreRepresentative}
              />

              {container.photosAreRepresentative || usesPlaceholder ? (
                <p className="mt-2 text-[10.5px] leading-relaxed text-bone/35">
                  Photos and condition notes are examples. Ask for current
                  photos and the inspection sheet for this exact unit before you
                  pay.
                </p>
              ) : null}

              <div className="mt-5 grid grid-cols-3 gap-px border border-bone/10 bg-bone/10">
                {[
                  { icon: "shield" as const, label: "Inspect before you pay" },
                  { icon: "file" as const, label: "Condition notes available" },
                  { icon: "truck" as const, label: "Delivery arranged" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 bg-ink px-3 py-3"
                  >
                    <Icon
                      name={item.icon}
                      className="h-4 w-4 shrink-0 text-ember"
                    />
                    <span className="text-[10px] leading-tight text-bone/45">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <EnquiryPanel container={container} settings={settings} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-bone">
        <div className="wrap py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="eyebrow text-ember-deep">The honest version</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.045em] text-ink">
                What you&rsquo;re actually buying.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/65">
                {container.description}
              </p>

              <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {container.highlights.map((highlight, index) => (
                  <li
                    key={highlight}
                    className="flex gap-3 border-t border-ink/10 pt-3.5"
                  >
                    <span className="pt-0.5 font-mono text-[9px] text-ember-deep">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[12.5px] leading-relaxed text-ink/75">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-ink/10 pt-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-dark">
                  Best for
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {container.bestFor.map((item) => (
                    <span
                      key={item}
                      className="border border-ink/15 bg-bone-2/50 px-2.5 py-1.5 text-[11px] text-ink/65"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-1.5">
                {container.features.map((feature) => (
                  <span
                    key={feature}
                    className="flex items-center gap-1.5 border border-ink/10 px-2.5 py-1.5 text-[10.5px] text-ink/55"
                  >
                    <Icon
                      name="check"
                      className="h-3 w-3 text-ember-deep"
                    />
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5">
              <div className="relative overflow-hidden bg-ink p-5 text-bone sm:p-6">
                <div className="h-0.5 w-12 bg-ember" />
                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/40">
                    {container.photosAreRepresentative
                      ? "Condition notes · yard example"
                      : usesPlaceholder
                        ? "Condition notes · example"
                        : "Condition notes"}
                  </p>
                  <span className="border border-ember/40 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ember">
                    Grade {container.grade}
                  </span>
                </div>
                <ol className="mt-5 space-y-3.5">
                  {container.conditionReport.map((line, index) => (
                    <li key={line} className="flex gap-3">
                      <span className="pt-px font-mono text-[9px] text-ember">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[12px] leading-relaxed text-bone/60">
                        {line}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 border-t border-bone/10 pt-4 text-[10px] leading-relaxed text-bone/30">
                  Condition notes are based on the last yard check. Ask for the
                  current inspection sheet and photos of the exact unit before
                  paying. Availability is confirmed on enquiry.
                </p>
              </div>

              <div className="border border-ink/12 bg-bone-2/40 p-5 sm:p-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-dark">
                  Included with this unit
                </p>
                <ul className="mt-4 space-y-2.5">
                  {container.included.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-[12px] leading-relaxed text-ink/70"
                    >
                      <Icon
                        name="check"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember-deep"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-ink/10 pt-3 text-[10px] leading-relaxed text-ink/40">
                  Documents are confirmed against the exact unit before payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone-2">
        <div className="wrap py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="eyebrow text-ember-deep">Specification</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.045em] text-ink">
                Typical specification.
              </h2>
              <p className="mt-3 max-w-xl text-[12px] leading-relaxed text-ink/45">
                Standard figures for this container type. Confirm exact
                dimensions, fit-out and serial details on inspection.
              </p>
              <div className="mt-8">
                <SpecTable container={container} />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-ink p-6 text-bone sm:p-7">
                <div className="flex items-center gap-2">
                  <Icon name="truck" className="h-4 w-4 text-ember" />
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/40">
                    Delivery
                  </p>
                </div>
                <h3 className="mt-4 font-display text-[26px] font-semibold leading-[1.05] tracking-[-0.03em]">
                  Quoted to the gate.
                </h3>
                <p className="mt-3 text-[12.5px] leading-relaxed text-bone/55">
                  Give us the site location, access and offload method. You get
                  one written number covering trucking, offload and any escort —
                  or an itemised breakdown if you prefer.
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-bone/10 pt-4">
                  {[
                    "Nairobi metro — timing confirmed on booking",
                    "Countrywide — timing confirmed on quote",
                    "Offload arranged if you have no forklift",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-[11.5px] text-bone/60"
                    >
                      <Icon
                        name="check"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href="/delivery"
                  variant="outline"
                  size="sm"
                  className="mt-5 w-full"
                >
                  Delivery details
                </ButtonLink>
              </div>

              <div className="mt-4 border border-ink/12 bg-bone p-5">
                <p className="flex items-center gap-2 text-[11px] text-ink/55">
                  <Icon name="pin" className="h-3.5 w-3.5 text-ember-deep" />
                  Inspect at {settings.addressLine}
                </p>
                <a
                  href={settings.phoneHref}
                  className="mt-3 flex items-center gap-2 text-[11px] text-ink/55 transition-colors hover:text-ink"
                >
                  <Icon name="phone" className="h-3.5 w-3.5 text-ember-deep" />
                  {settings.phoneDisplay}
                </a>
                <p className="mt-3 border-t border-ink/10 pt-3 text-[10.5px] leading-relaxed text-ink/40">
                  {settings.hours}. Come with your driver or mechanic — we would
                  rather you check the unit properly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 sm:py-20">
        <div className="wrap">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-ember">Close alternatives</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.045em] text-bone">
                Same job. Different box.
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

          <div className="no-scrollbar mt-8 flex snap-x gap-4 overflow-x-auto pb-4 sm:gap-5">
            {related.map((item) => (
              <div
                key={item.slug}
                className="w-[268px] shrink-0 snap-start sm:w-[312px]"
              >
                <ContainerCard
                  container={item}
                  imageSizes="(min-width: 640px) 312px, 268px"
                />
              </div>
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
              href="/containers"
              className="transition-colors hover:text-bone/70"
            >
              ← Back to the full fleet
            </Link>
            <p>
              {formatKES(container.price)} · Ex-yard Nairobi · Listed{" "}
              {formatDate(container.addedAt)}
            </p>
          </div>
        </div>
      </section>

      <StickyEnquiryBar
        name={container.shortName}
        price={container.price}
        whatsappMessage={message}
        source={`sticky-${container.slug}`}
      />
    </>
  );
}
