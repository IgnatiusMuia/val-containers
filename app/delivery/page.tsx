import type { Metadata } from "next";
import Link from "next/link";
import {
  deliveryDisclaimers,
  deliverySteps,
  siteAccessChecks,
} from "@/data/delivery";
import { site } from "@/data/site";
import {
  contentValue,
  getFaqs,
  getSiteContent,
  getSiteSettings,
} from "@/lib/content";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/home/CtaBand";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { KenyaMap } from "@/components/delivery/KenyaMap";

const title = "Container Delivery in Kenya — Coverage, Cost & Access";
const description =
  "Shipping container delivery across Kenya from our Nairobi yard. See indicative costs for Nairobi, Mombasa, Kisumu, Nakuru, Eldoret and beyond, plus the site access checks that matter.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/delivery" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/delivery",
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

export default async function DeliveryPage() {
  const [content, faqs, settings] = await Promise.all([
    getSiteContent(),
    getFaqs(),
    getSiteSettings(),
  ]);

  const deliveryFaqs = faqs.filter((faq) => faq.category === "delivery");
  const heroEyebrow = contentValue(
    content,
    "delivery.hero.eyebrow",
    "Countrywide · Written quotes",
  );
  const heroTitle = contentValue(
    content,
    "delivery.hero.title",
    "Quoted to the gate. Not to the yard.",
  ).replace(/\.$/, "");
  const heroBody = contentValue(
    content,
    "delivery.hero.body",
    "We deliver from our Nairobi yard across Kenya. You get one written figure for the truck, crane and offload — before the unit moves.",
  );
  const coverageTitle = contentValue(
    content,
    "delivery.coverage.title",
    "Where the truck goes.",
  );
  const coverageBody = contentValue(
    content,
    "delivery.coverage.body",
    "Indicative costs are shown below. The final delivery price is confirmed after the site access check, so the number you sign off covers the truck, crane and offload.",
  );
  const accessTitle = contentValue(
    content,
    "delivery.access.title",
    "Six checks before delivery day.",
  );
  const accessBody = contentValue(
    content,
    "delivery.access.body",
    "A container is a heavy, awkward load. These are the things the driver and crane operator will look at — better to find them now.",
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Delivery", path: "/delivery" },
          ]),
          ...(deliveryFaqs.length > 0 ? [faqSchema(deliveryFaqs)] : []),
        ]}
      />

      <section className="relative overflow-hidden border-b border-bone/10 bg-ink pb-14 pt-6">
        <div className="ribs absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="wrap relative">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Delivery" }]}
          />
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow text-ember">{heroEyebrow}</p>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,6.4vw,5.4rem)] font-bold leading-[0.92] tracking-[-0.05em] text-bone">
                {heroTitle}
                <span className="text-ember">.</span>
              </h1>
              <p className="mt-7 max-w-xl text-[14px] leading-relaxed text-bone/55 sm:text-[15px]">
                {heroBody}
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <QuoteButton size="lg" source="delivery-hero">
                  Get a delivery quote
                </QuoteButton>
                <ButtonLink
                  href="/containers"
                  variant="outline"
                  size="lg"
                >
                  See the fleet
                </ButtonLink>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="grid grid-cols-2 gap-px border border-bone/12 bg-bone/12">
                {[
                  ["Nairobi", "Confirmed on booking"],
                  ["Upcountry", "Confirmed on quote"],
                  ["Crane offload", "Arranged"],
                  ["Quote", "Written"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-ink p-4">
                    <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                      {label}
                    </p>
                    <p className="mt-2 text-[13px] text-bone/80">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-bone/25">
                Nairobi & upcountry · Crane planning
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-bone">
        <div className="wrap py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-ember-deep">How it works</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.02] tracking-[-0.045em] text-ink">
                Four steps. No surprises.
              </h2>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-ink/55">
                Delivery goes wrong when access is assumed. We check the route
                and the offload point before we quote, not when the truck is
                already at your gate.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {deliverySteps.map((step) => (
                <div
                  key={step.number}
                  className="border border-ink/12 bg-bone-2/40 p-5"
                >
                  <p className="font-mono text-[10px] tracking-[0.16em] text-ember-deep">
                    {step.number}
                  </p>
                  <h3 className="mt-3 font-display text-[20px] font-semibold tracking-[-0.025em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-ink/60">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 sm:py-24">
        <div className="wrap">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-ember">Coverage</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.045em] text-bone">
                {coverageTitle}
              </h2>
            </div>
            <p className="max-w-xs text-[12px] leading-relaxed text-bone/40">
              {coverageBody}
            </p>
          </div>
          <KenyaMap whatsappNumber={settings.whatsappNumber} />
        </div>
      </section>

      <section id="access" className="scroll-mt-24 border-b border-ink/10 bg-bone-2">
        <div className="wrap py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-ember-deep">Site access</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.02] tracking-[-0.045em] text-ink">
                {accessTitle}
              </h2>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-ink/55">
                {accessBody}
              </p>
            </div>
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-8">
              {siteAccessChecks.map((check, index) => (
                <div key={check.title} className="border-t border-ink/15 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-ember-deep">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[13px] font-semibold text-ink">
                      {check.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-ink/55">
                    {check.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 border-t border-ink/10 pt-6">
            <ul className="grid gap-2 sm:grid-cols-2">
              {deliveryDisclaimers.map((note) => (
                <li
                  key={note}
                  className="flex gap-2 text-[10.5px] leading-relaxed text-ink/40"
                >
                  <Icon
                    name="check"
                    className="mt-0.5 h-3 w-3 shrink-0 text-ember-deep"
                  />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-bone">
        <div className="wrap py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-ember-deep">Delivery questions</p>
              <h2 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.7rem)] font-bold leading-[1.03] tracking-[-0.04em] text-ink">
                Before you book a truck.
              </h2>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium text-ember-deep"
              >
                Talk to the yard
                <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-ink/10 border-y border-ink/10 lg:col-span-8">
              {deliveryFaqs.map((faq) => (
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
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-medium text-ink">
                  What do you need from me to quote delivery?
                  <Icon
                    name="plus"
                    className="h-4 w-4 shrink-0 text-ink/35 transition-transform group-open:rotate-45"
                  />
                </summary>
                <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink/60">
                  A location pin, a photo of the entrance and a description of
                  the ground where the container will sit. If you have them, add
                  the site contact&rsquo;s number and any gate times or weight
                  limits. We will confirm the truck and crane plan from there.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
