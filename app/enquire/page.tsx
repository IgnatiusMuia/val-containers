import type { Metadata } from "next";
import Link from "next/link";
import { getContainers } from "@/lib/containers/repository";
import { getSiteSettings } from "@/lib/content";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icons";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const instant = false;

const title = "Request a Container Quote";
const description =
  "Send an enquiry to the Val Containers yard in Nairobi. Choose a container, share delivery details and continue on WhatsApp with a reference number.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/enquire" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/enquire",
    siteName: site.name,
    title: `${title} — ${site.name}`,
    description,
  },
};

export default async function EnquirePage({
  searchParams,
}: {
  searchParams: Promise<{ container?: string; source?: string }>;
}) {
  const { container: containerSlug, source } = await searchParams;
  const [containers, settings] = await Promise.all([
    getContainers(),
    getSiteSettings(),
  ]);

  const selected = containerSlug
    ? containers.find((item) => item.slug === containerSlug)
    : null;

  const options = containers
    .filter((item): item is typeof item & { id: string } => Boolean(item.id))
    .map((item) => ({
      id: item.id,
      label: `${item.shortName} · ${item.sizeLabel}`,
      reference: item.reference ?? "",
    }));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Enquire", path: "/enquire" },
        ])}
      />

      <section className="relative overflow-hidden border-b border-bone/10 bg-ink pb-12 pt-6">
        <div className="ribs absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="wrap relative">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Enquire" }]}
          />
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow text-ember">Saved first · WhatsApp next</p>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,6.2vw,5.2rem)] font-bold leading-[0.92] tracking-[-0.05em] text-bone">
                Tell us what
                <br />
                the site needs<span className="text-ember">.</span>
              </h1>
              <p className="mt-7 max-w-xl text-[14px] leading-relaxed text-bone/55 sm:text-[15px]">
                Every enquiry gets a reference number before WhatsApp opens, so
                the yard can find your details even if the chat is buried.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="grid gap-px border border-bone/12 bg-bone/12">
                <a
                  href={settings.phoneHref}
                  className="flex items-center gap-3 bg-ink px-4 py-3.5 text-[12px] text-bone/70 transition-colors hover:bg-coal"
                >
                  <Icon name="phone" className="h-4 w-4 text-ember" />
                  {settings.phoneDisplay}
                </a>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 bg-ink px-4 py-3.5 text-[12px] text-bone/70 transition-colors hover:bg-coal"
                >
                  <Icon name="mail" className="h-4 w-4 text-ember" />
                  {settings.email}
                </a>
                <div className="flex items-center gap-3 bg-ink px-4 py-3.5 text-[12px] text-bone/70">
                  <Icon name="clock" className="h-4 w-4 text-ember" />
                  {settings.hours}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone">
        <div className="wrap py-14 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <EnquiryForm
                containers={options}
                defaultContainerId={selected?.id ?? ""}
                source={source || "enquire-page"}
                pagePath={selected ? `/containers/${selected.slug}` : "/enquire"}
              />
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-ink/12 bg-bone-2/40 p-5">
                <p className="eyebrow text-ember-deep">What happens next</p>
                <ol className="mt-5 space-y-4">
                  {[
                    "Your enquiry is saved with a reference number.",
                    "WhatsApp opens with the details and reference filled in.",
                    "The yard checks availability, access and delivery.",
                    "You receive a written quote before paying.",
                  ].map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="font-mono text-[10px] text-ember-deep">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[12.5px] leading-relaxed text-ink/65">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-4 border border-ink/12 bg-ink p-5 text-bone">
                <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-bone/35">
                  Prefer to talk?
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-bone/55">
                  Call or WhatsApp the yard directly. If you already have a
                  reference, quote it so the conversation stays linked.
                </p>
                <a
                  href={settings.phoneHref}
                  className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium text-ember"
                >
                  <Icon name="phone" className="h-3.5 w-3.5" />
                  {settings.phoneDisplay}
                </a>
              </div>

              {selected ? (
                <div className="mt-4 border border-ink/12 p-4">
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink/40">
                    Enquiring about
                  </p>
                  <p className="mt-2 font-display text-[18px] font-semibold tracking-[-0.02em] text-ink">
                    {selected.name}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-ink/40">
                    {selected.reference}
                  </p>
                  <Link
                    href={`/containers/${selected.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-ember-deep"
                  >
                    Back to listing
                    <Icon name="arrow-up-right" className="h-3 w-3" />
                  </Link>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
