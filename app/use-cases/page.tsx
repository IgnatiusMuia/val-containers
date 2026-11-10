import type { Metadata } from "next";
import Image from "next/image";
import { useCases } from "@/data/use-cases";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaBand } from "@/components/home/CtaBand";
import { UseCaseCard } from "@/components/use-cases/UseCaseCard";

const title = "Container Use Cases in Kenya — Storage, Offices, Homes & Kiosks";
const description =
  "See how Kenyan businesses and families use shipping containers: secure storage, site offices, container homes, retail kiosks, cold storage and event pop-ups.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/use-cases" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/use-cases",
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

export default function UseCasesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Use cases", path: "/use-cases" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            url: `${site.url}/use-cases`,
            hasPart: useCases.map((useCase) => ({
              "@type": "WebPage",
              name: useCase.title,
              url: `${site.url}/use-cases/${useCase.slug}`,
            })),
          },
        ]}
      />

      <section className="relative overflow-hidden border-b border-bone/10 bg-ink pb-14 pt-6">
        <div className="ribs absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="wrap relative">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Use cases" }]}
          />
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow text-ember">Built around the job</p>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,6.4vw,5.4rem)] font-bold leading-[0.92] tracking-[-0.05em] text-bone">
                The job decides
                <br />
                the box<span className="text-ember">.</span>
              </h1>
              <p className="mt-7 max-w-xl text-[14px] leading-relaxed text-bone/55 sm:text-[15px]">
                A container is only useful when it fits the work. Start with what
                you need it to do — store, sell, sleep, serve or keep cold — and
                we will match the unit, fit-out and delivery to it.
              </p>
            </div>
            <div className="hidden grid-cols-2 gap-2 lg:col-span-4 sm:grid">
              <div className="relative aspect-[3/4] overflow-hidden border border-bone/10">
                <Image
                  src={useCases[1].image.src}
                  alt={useCases[1].image.alt}
                  fill
                  sizes="15vw"
                  className="object-cover"
                />
              </div>
              <div className="relative mt-6 aspect-[3/4] overflow-hidden border border-bone/10">
                <Image
                  src={useCases[5].image.src}
                  alt={useCases[5].image.alt}
                  fill
                  sizes="15vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink pb-20 pt-10 sm:pb-24">
        <div className="wrap">
          <div className="mb-7 flex items-end justify-between gap-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/35">
              Six ways people use our containers
            </p>
            <p className="text-[11px] text-bone/30">Prices from, ex-yard Nairobi</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <UseCaseCard key={useCase.slug} useCase={useCase} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
