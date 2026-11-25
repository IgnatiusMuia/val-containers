import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/site";
import { getContainerStats } from "@/lib/containers/repository";
import {
  contentValue,
  getSiteContent,
  getSiteSettings,
} from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { CtaBand } from "@/components/home/CtaBand";

const title = "About — Nairobi Container Yard";
const description =
  "Val Containers sells new, used, fabricated and refrigerated shipping containers from Nairobi. Published prices, condition notes and countrywide delivery.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/about",
    siteName: site.name,
    title: `${title} — ${site.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — ${site.name}`,
    description,
  },
};

const principles = [
  {
    title: "Published prices",
    body: "The number on the listing is the starting number in the conversation. If the price changes, the listing changes.",
  },
  {
    title: "Clear listings",
    body: "Every container has a grade, photos and condition notes. Ask for the serial, CSC plate and current inspection sheet for the exact unit.",
  },
  {
    title: "Inspection first",
    body: "Call ahead to confirm yard access. Inspect the exact unit or ask for a video walkaround before you pay.",
  },
  {
    title: "One written quote",
    body: "Truck, crane and offload in one figure. If access changes the job, we tell you before dispatch.",
  },
];

const process = [
  ["01", "Tell us the job", "A sentence about what you need to store, sell, sleep in or keep cold."],
  ["02", "Shortlist and inspect", "We send current photos and invite you to the yard — or walk you through it on video."],
  ["03", "Agree the number", "Unit, delivery and offload in writing. Deposit reserves the container."],
  ["04", "Deliver and place", "The driver calls ahead. The crane sets it down. You inspect before signing."],
];

export default async function AboutPage() {
  const [stats, settings, content] = await Promise.all([
    getContainerStats(),
    getSiteSettings(),
    getSiteContent(),
  ]);

  const heroEyebrow = contentValue(
    content,
    "about.hero.eyebrow",
    "Val Containers · Nairobi",
  );
  const heroTitle = contentValue(
    content,
    "about.hero.title",
    "The yard is the showroom.",
  ).replace(/\.$/, "");
  const heroBody = contentValue(
    content,
    "about.hero.body",
    "We are a Nairobi container yard that sells the way we would want to buy: clear prices, honest listings and a person who answers the phone. No imported mystique, no surprise invoices.",
  );
  const storyTitle = contentValue(
    content,
    "about.story.title",
    "Containers are simple. Buying one shouldn’t be.",
  );
  const storyBody1 = contentValue(
    content,
    "about.story.body_1",
    "Most container listings in Kenya tell you a size, a price and very little else. Photos are recycled, grades are vague, and the delivery number arrives after you have committed. Buyers are left to inspect a unit they cannot see, from a seller they have never met.",
  );
  const storyBody2 = contentValue(
    content,
    "about.story.body_2",
    "Val runs the other way. We photograph the yard examples, state the grade and write the condition notes down. For the exact unit, we share current photos and serial details before payment. The yard is open for inspection because the best way to buy steel is to stand next to it.",
  );
  const storyBody3 = contentValue(
    content,
    "about.story.body_3",
    "We are not the cheapest yard in Nairobi. We are the one that tells you what you are buying, what it will take to deliver it and what to check before you sign.",
  );
  const ruleText = contentValue(
    content,
    "about.rule.text",
    "Ask for current photos, the serial and the inspection sheet for the exact unit before you pay.",
  );
  const ruleNote = contentValue(content, "about.rule.note", "The yard rule");

  const aboutStats = [
    [String(stats.total), "Listings online"],
    [String(stats.units), "Units in stock"],
    [String(stats.available), "Available now"],
    [String(stats.refrigerated), "Refrigerated"],
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <section className="relative overflow-hidden border-b border-bone/10 bg-ink pb-14 pt-6">
        <div className="ribs absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="wrap relative">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "About" }]}
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
            </div>
            <div className="lg:col-span-4">
              <div className="grid grid-cols-2 gap-px border border-bone/12 bg-bone/12">
                {aboutStats.map(([value, label]) => (
                  <div key={label} className="bg-ink p-4">
                    <p className="font-display text-[30px] font-semibold leading-none text-bone">
                      {value}
                    </p>
                    <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.1em] text-bone/30">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-bone">
        <div className="wrap py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow text-ember-deep">Why we exist</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.045em] text-ink">
                {storyTitle}
              </h2>
              <div className="mt-6 space-y-4 text-[14px] leading-relaxed text-ink/65">
                <p>{storyBody1}</p>
                <p>{storyBody2}</p>
                <p>{storyBody3}</p>
              </div>

              <div className="mt-8 border-l-2 border-ember pl-5">
                <p className="font-display text-[20px] font-medium leading-snug tracking-[-0.02em] text-ink">
                  {ruleText}
                </p>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40">
                  {ruleNote}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden border border-ink/12">
                <Image
                  src="/media/images/yard/kiosk-two-storey.jpg"
                  alt="Two-storey container office structure at the Nairobi yard"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 border border-ink/12 bg-bone-2/40 p-4">
                <p className="text-[11px] leading-relaxed text-ink/55">
                  {settings.hours}
                  <br />
                  {settings.addressLine}
                </p>
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-ember-deep"
                >
                  Directions
                  <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-bone-2">
        <div className="wrap py-16 sm:py-20">
          <p className="eyebrow text-ember-deep">What we hold to</p>
          <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle, index) => (
              <div key={principle.title} className="border-t border-ink/20 pt-5">
                <p className="font-mono text-[9px] tracking-[0.14em] text-ember-deep">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-display text-[20px] font-semibold tracking-[-0.025em] text-ink">
                  {principle.title}
                </h2>
                <p className="mt-2 text-[12px] leading-relaxed text-ink/55">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 sm:py-24">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-ember">How we work</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.02] tracking-[-0.045em] text-bone">
                Four steps to a placed container.
              </h2>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-bone/45">
                Whether you are buying a storage box or a finished office, the
                path is the same: see it, agree it, document it, deliver it.
              </p>
              <ButtonLink
                href="/contact"
                variant="outline"
                size="sm"
                className="mt-6"
              >
                Talk to the yard
              </ButtonLink>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {process.map(([number, heading, body]) => (
                <div key={number} className="border border-bone/12 p-5">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-ember">
                    {number}
                  </p>
                  <h3 className="mt-3 font-display text-[20px] font-semibold tracking-[-0.025em] text-bone">
                    {heading}
                  </h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-bone/45">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
