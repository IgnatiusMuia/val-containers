import type { Metadata } from "next";
import Link from "next/link";
import { sizes, sizeFits, sizeDecision } from "@/data/sizes";
import { site } from "@/data/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { currentYear } from "@/lib/time";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { ContainerSilhouette } from "@/components/graphics/ContainerSilhouette";
import { CtaBand } from "@/components/home/CtaBand";
import { QuoteButton } from "@/components/forms/QuoteButton";

const title = "Shipping Container Sizes in Kenya — 20ft vs 40ft vs High Cube";
const description =
  "Compare 20ft, 40ft and 40ft high cube containers: internal dimensions, volume, floor area, pallet capacity and which size fits storage, offices, homes and kiosks.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/size-guide" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/size-guide",
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

const sizeFaqs = [
  {
    question: "How much bigger is a 40ft than a 20ft container?",
    answer:
      "A 40ft container has roughly double the floor area and volume of a 20ft: about 28.3 m² and 67.7 m³ against 13.9 m² and 33.2 m³. The price does not double, which is why 40ft units often look like better value per cubic metre.",
  },
  {
    question: "What is the difference between a 40ft and a 40ft high cube?",
    answer:
      "Both are 12.19 m long, but the high cube is about 30 cm taller: 2.90 m external and 2.70 m internal versus 2.59 m and 2.39 m. The extra headroom matters for container homes, insulated offices and high-volume pallet loads.",
  },
  {
    question: "Can a 20ft container fit a car?",
    answer:
      "A small car can be loaded with care, but most vehicles need a 40ft high cube for comfortable clearance and loading. Measure the vehicle and confirm the door opening before committing.",
  },
];

export default async function SizeGuidePage() {
  const year = await currentYear();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Size guide", path: "/size-guide" },
          ]),
          faqSchema(sizeFaqs),
        ]}
      />

      <section className="relative overflow-hidden border-b border-bone/10 bg-ink pb-14 pt-6">
        <div className="ribs absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="wrap relative">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Size guide" }]}
          />
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow text-ember">
                Size guide · {year}
              </p>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,6.2vw,5.2rem)] font-bold leading-[0.92] tracking-[-0.05em] text-bone">
                Pick the size
                <br />
                before the spec<span className="text-ember">.</span>
              </h1>
              <p className="mt-7 max-w-xl text-[14px] leading-relaxed text-bone/55 sm:text-[15px]">
                Three sizes cover almost every project we sell. The decision is
                usually about the job — not the container. Here is the honest
                comparison, including what each size will not do.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="border border-bone/12">
                {[
                  ["Storage", "20ft or 40ft", "Start with access"],
                  ["Office", "20ft or 40ft", "Split rooms by length"],
                  ["Home", "40ft high cube", "Headroom for insulation"],
                ].map(([job, size, note]) => (
                  <div
                    key={job}
                    className="flex items-center justify-between gap-4 border-b border-bone/10 px-4 py-3 last:border-b-0"
                  >
                    <span className="text-[11px] text-bone/45">{job}</span>
                    <span className="text-[11px] font-medium text-bone">{size}</span>
                    <span className="hidden font-mono text-[8px] uppercase tracking-[0.1em] text-bone/25 sm:block">
                      {note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-bone">
        <div className="wrap py-16 sm:py-24">
          <div className="grid gap-5 lg:grid-cols-3">
            {sizes.map((size, index) => (
              <article
                key={size.id}
                id={size.id}
                className="border border-ink/12 bg-bone-2/40 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/35">
                    0{index + 1}
                  </span>
                  <Icon name="arrow-up-right" className="h-4 w-4 text-ink/30" />
                </div>

                <div className="mt-10 flex h-24 items-end border-b border-ink/10 pb-3">
                  <ContainerSilhouette size={size.id} tone="light" />
                </div>

                <h2 className="mt-6 font-display text-[26px] font-semibold tracking-[-0.03em] text-ink">
                  {size.label}
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
                  {size.detail}
                </p>

                <dl className="mt-6 space-y-2.5 border-t border-ink/10 pt-4">
                  {[
                    ["External length", size.externalLength],
                    ["Internal height", size.internalHeight],
                    ["Volume", size.volume],
                    ["Floor area", size.floorArea],
                    ["Pallets", size.pallets],
                    ["Workstations", size.desks],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-ink/40">
                        {label}
                      </dt>
                      <dd className="text-[11.5px] text-ink/75">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 border-t border-ink/10 pt-4">
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-ink/40">
                    Best for
                  </p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ink/65">
                    {size.bestFor}
                  </p>
                </div>

                <ButtonLink
                  href="/containers"
                  variant="outline-dark"
                  size="sm"
                  className="mt-6 w-full"
                >
                  See units in this size
                </ButtonLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-bone-2">
        <div className="wrap py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-ember-deep">The numbers</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.02] tracking-[-0.045em] text-ink">
                What actually fits.
              </h2>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-ink/55">
                Real-world capacities, not marketing numbers. Pallets assume
                standard 1.2 m × 1.0 m pallets; workstation counts are generous,
                not tight.
              </p>
            </div>
            <div className="overflow-x-auto lg:col-span-8">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-ink/20">
                    <th className="py-3 pr-4 font-mono text-[8.5px] font-normal uppercase tracking-[0.12em] text-ink/45">
                      Fit
                    </th>
                    {sizes.map((size) => (
                      <th
                        key={size.id}
                        className="py-3 pl-4 font-mono text-[8.5px] font-normal uppercase tracking-[0.12em] text-ink/45"
                      >
                        {size.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeFits.map((row) => (
                    <tr key={row.label} className="border-b border-ink/10">
                      <td className="py-3.5 pr-4 text-[12px] text-ink/60">
                        {row.label}
                      </td>
                      {sizes.map((size) => (
                        <td
                          key={size.id}
                          className="py-3.5 pl-4 text-[12.5px] font-medium text-ink/80"
                        >
                          {row.values[size.id]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3.5 pr-4 text-[12px] text-ink/60">
                      Door opening
                    </td>
                    {sizes.map((size) => (
                      <td key={size.id} className="py-3.5 pl-4 text-[11px] text-ink/60">
                        {size.doors}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 sm:py-24">
        <div className="wrap">
          <p className="eyebrow text-ember">Decision table</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.045em] text-bone">
            Start with the need.
          </h2>

          <div className="mt-10 divide-y divide-bone/10 border-y border-bone/10">
            {sizeDecision.map((row, index) => (
              <div
                key={row.need}
                className="grid gap-3 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6"
              >
                <span className="font-mono text-[9px] text-bone/30 sm:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-[14px] font-medium text-bone/85 sm:col-span-4">
                  {row.need}
                </p>
                <p className="font-display text-[18px] font-semibold text-ember sm:col-span-2">
                  {row.size}
                </p>
                <p className="text-[12px] leading-relaxed text-bone/45 sm:col-span-5">
                  {row.reason}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border border-bone/12 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[13px] leading-relaxed text-bone/55">
              Still unsure? Send a photo of the site and a sentence about what
              you need to store or fit inside. We will tell you the size and the
              grade — even if the answer is “you don&rsquo;t need a container.”
            </p>
            <QuoteButton variant="primary" size="sm" source="size-guide">
              Ask us to size it
            </QuoteButton>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-bone">
        <div className="wrap py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-ember-deep">Quick answers</p>
              <h2 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.7rem)] font-bold leading-[1.03] tracking-[-0.04em] text-ink">
                The size questions we get most.
              </h2>
              <Link
                href="/containers"
                className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium text-ember-deep"
              >
                Browse the fleet
                <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-ink/10 border-y border-ink/10 lg:col-span-8">
              {sizeFaqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-medium text-ink">
                    {faq.question}
                    <Icon
                      name="plus"
                      className="h-4 w-4 shrink-0 text-ink/35 transition-transform group-open:rotate-45"
                    />
                  </summary>
                  <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink/60">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
