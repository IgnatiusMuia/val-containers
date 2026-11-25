import type { Metadata } from "next";
import { Suspense } from "react";
import { getContainers } from "@/lib/containers/repository";
import { getSiteSettings } from "@/lib/content";
import { currentMonthYear } from "@/lib/time";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Catalog } from "@/components/containers/Catalog";

const title = "Shipping Containers for Sale in Kenya — Prices & Stock";
const description =
  "Browse shipping container listings for sale in Kenya. Plain, fabricated and refrigerated units with published KES prices, condition notes and countrywide delivery from Nairobi.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/containers" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/containers",
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

function catalogCounts(containers: Awaited<ReturnType<typeof getContainers>>) {
  return [
    {
      label: "Plain / dry",
      value: containers.filter((c) => c.type === "plain").length,
    },
    {
      label: "Fabricated",
      value: containers.filter((c) => c.type === "fabricated").length,
    },
    {
      label: "Refrigerated",
      value: containers.filter((c) => c.type === "refrigerated").length,
    },
  ];
}

function itemListSchema(containers: Awaited<ReturnType<typeof getContainers>>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shipping containers for sale in Kenya",
    numberOfItems: containers.length,
    itemListElement: containers.map((container, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.url}/containers/${container.slug}`,
      name: container.name,
    })),
  };
}

function CatalogFallback() {
  return (
    <section className="bg-ink pb-24">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="hidden lg:col-span-3 lg:block">
            <div className="skeleton h-[610px] border border-bone/10" />
          </div>
          <div className="lg:col-span-9">
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="skeleton aspect-[4/3] border border-bone/10"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function ContainersPage() {
  const [containers, settings, fleetLabel] = await Promise.all([
    getContainers(),
    getSiteSettings(),
    currentMonthYear(),
  ]);
  const counts = catalogCounts(containers);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Containers", path: "/containers" },
          ]),
          itemListSchema(containers),
        ]}
      />

      <section className="relative overflow-hidden border-b border-bone/10 bg-ink pb-12 pt-6">
        <div className="ribs absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="wrap relative">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Containers" }]}
          />
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow text-ember">
                The fleet · {fleetLabel}
              </p>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,6.4vw,5.4rem)] font-bold leading-[0.92] tracking-[-0.05em] text-bone">
                See the unit.
                <br />
                See the price.
                <br />
                <span className="text-ember">Book the truck.</span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-2">
              <p className="max-w-sm text-[13.5px] leading-relaxed text-bone/55">
                {containers.length} container listings, from a used 20ft storage
                box to a finished container home. Filter by what the job
                actually needs. Confirm current availability and photos before
                paying.
              </p>
              <dl className="mt-6 grid grid-cols-3 gap-px border border-bone/12 bg-bone/12">
                {counts.map((count) => (
                  <div key={count.label} className="bg-ink p-3">
                    <dd className="font-display text-[26px] font-semibold leading-none text-bone">
                      {count.value}
                    </dd>
                    <dt className="mt-2 font-mono text-[8px] uppercase leading-tight tracking-[0.1em] text-bone/35">
                      {count.label}
                    </dt>
                  </div>
                ))}
              </dl>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-bone/30">
                Prices and availability change · Confirm before paying
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-8">
        <Suspense fallback={<CatalogFallback />}>
          <Catalog
            containers={containers}
            whatsappNumber={settings.whatsappNumber}
          />
        </Suspense>
      </div>
    </>
  );
}
