import type { Metadata } from "next";
import { site } from "@/data/site";
import { contentValue, getSiteContent, getSiteSettings } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icons";
import { ContactForm } from "@/components/forms/ContactForm";
import { QuoteButton } from "@/components/forms/QuoteButton";

const title = "Contact — Nairobi Container Yard";
const description =
  "Talk to the Val Containers yard in Nairobi. Call, WhatsApp, get a quote, or visit near the NTSA Inspection Centre on Likoni Road.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/contact",
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

const visitChecks = [
  "The location pin or a driver who knows the yard",
  "A torch for inspecting the floor and roof seams",
  "Your site access details if you want a delivery quote",
  "A deposit only after you have seen the exact unit",
];

export default async function ContactPage() {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
  ]);
  const heroBody = contentValue(
    content,
    "contact.hero.body",
    "Call, WhatsApp or send the form below. A real person at the yard will answer — not a call centre. If you are nearby, come and inspect the unit yourself.",
  );
  const formIntro = contentValue(
    content,
    "contact.form.intro",
    "The form saves your enquiry and opens WhatsApp with your details filled in. You will receive a reference so the yard can find your request.",
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-bone/10 bg-ink pb-12 pt-6">
        <div className="ribs absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="wrap relative">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Contact" }]}
          />
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow text-ember">Nairobi yard</p>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,6.2vw,5.2rem)] font-bold leading-[0.92] tracking-[-0.05em] text-bone">
                Talk to
                <br />
                the yard<span className="text-ember">.</span>
              </h1>
              <p className="mt-7 max-w-xl text-[14px] leading-relaxed text-bone/55 sm:text-[15px]">
                {heroBody}
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="grid gap-px border border-bone/12 bg-bone/12">
                <a
                  href={settings.phoneHref}
                  className="group flex items-center justify-between gap-4 bg-ink px-4 py-3.5 transition-colors hover:bg-coal"
                >
                  <span className="flex items-center gap-3">
                    <Icon name="phone" className="h-4 w-4 text-ember" />
                    <span className="text-[12px] text-bone/70">
                      {settings.phoneDisplay}
                    </span>
                  </span>
                  <Icon
                    name="arrow-up-right"
                    className="h-3.5 w-3.5 text-bone/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
                <a
                  href={`mailto:${settings.email}`}
                  className="group flex items-center justify-between gap-4 bg-ink px-4 py-3.5 transition-colors hover:bg-coal"
                >
                  <span className="flex items-center gap-3">
                    <Icon name="mail" className="h-4 w-4 text-ember" />
                    <span className="text-[12px] text-bone/70">{settings.email}</span>
                  </span>
                  <Icon
                    name="arrow-up-right"
                    className="h-3.5 w-3.5 text-bone/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
                <div className="flex items-center gap-3 bg-ink px-4 py-3.5">
                  <Icon name="clock" className="h-4 w-4 text-ember" />
                  <span className="text-[12px] text-bone/70">
                    {settings.hours}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="quote" className="scroll-mt-24 bg-bone">
        <div className="wrap py-14 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow text-ember-deep">Send a message</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.045em] text-ink">
                Tell us what you need.
              </h2>
              <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-ink/55">
                {formIntro}
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
              <div className="mt-6 border-t border-ink/10 pt-5">
                <p className="text-[11px] text-ink/45">
                  Prefer a structured quote with size and delivery details?
                </p>
                <QuoteButton
                  variant="outline-dark"
                  size="sm"
                  source="contact-page"
                  className="mt-3"
                >
                  Open the quote form
                </QuoteButton>
              </div>
            </div>

            <div className="lg:col-span-5">
              <p className="eyebrow text-ember-deep">Find the yard</p>
              <h2 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.7rem)] font-bold leading-[1.03] tracking-[-0.04em] text-ink">
                Come and kick the tyres.
              </h2>
              <p className="mt-4 text-[13px] leading-relaxed text-ink/60">
                {settings.addressLine}, {settings.address}.
              </p>
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium text-ember-deep"
              >
                Get directions
                <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
              </a>

              <div className="mt-6 overflow-hidden border border-ink/12">
                <iframe
                  src={settings.mapsEmbed}
                  title="Map showing Val Containers yard in Nairobi"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-56 w-full grayscale-[55%] contrast-[1.05]"
                />
              </div>

              <div className="mt-6 border border-ink/12 bg-bone-2/40 p-5">
                <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink/45">
                  Bring with you
                </p>
                <ul className="mt-4 space-y-2.5">
                  {visitChecks.map((check) => (
                    <li
                      key={check}
                      className="flex gap-2.5 text-[12px] leading-relaxed text-ink/65"
                    >
                      <Icon
                        name="check"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember-deep"
                      />
                      {check}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 border border-ink/12 bg-ink p-5 text-bone">
                <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-bone/35">
                  Site access check
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-bone/55">
                  Buying for a plot outside Nairobi? Send a location pin, a photo
                  of the entrance and the ground where the container will sit.
                  We will confirm access before you commit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
