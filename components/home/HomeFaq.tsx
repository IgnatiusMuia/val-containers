import {
  contentValue,
  getSiteContent,
  getSiteSettings,
  type PublicFaq,
} from "@/lib/content";
import { waLink, waMessages } from "@/lib/whatsapp";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icons";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function HomeFaq({ faqs }: { faqs: PublicFaq[] }) {
  if (faqs.length === 0) return null;

  const [content, settings] = await Promise.all([
    getSiteContent(),
    getSiteSettings(),
  ]);
  const label = contentValue(content, "home.faq.eyebrow", "FAQ");
  const heading = contentValue(content, "home.faq.title", "Questions, answered.");
  const description = contentValue(
    content,
    "home.faq.body",
    "The things buyers ask before they send money. If yours is not here, WhatsApp us — a person at the yard will reply.",
  );

  const items = faqs.map(({ question, answer }) => ({ question, answer }));

  return (
    <section id="faq" className="bg-bone py-20 text-ink sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <Reveal>
            <SectionHeading
              tone="light"
              index="06"
              label={label}
              title={heading}
              description={description}
            />

            <div className="mt-8 border border-ink/12 bg-bone-2/40 p-5">
              <p className="font-display text-[18px] font-semibold tracking-[-0.02em]">
                Still unsure?
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink/55">
                Send a photo of the site, your timeline and what you need to
                store or build. We will tell you what fits and what it costs to
                get it there.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={waLink(waMessages.general, settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center gap-2 bg-whatsapp text-[12.5px] font-medium text-ink transition-opacity hover:opacity-90"
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  WhatsApp the yard
                </a>
                <QuoteButton
                  variant="outline-dark"
                  size="sm"
                  source="home-faq"
                  className="w-full"
                >
                  Get a free quote
                </QuoteButton>
              </div>
              <a
                href={settings.phoneHref}
                className="mt-4 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/45 transition-colors hover:text-ink"
              >
                <Icon name="phone" className="h-3 w-3" />
                Or call {settings.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.08}>
            <Accordion items={items} tone="light" defaultOpen={0} />
            <p className="mt-6 border-t border-ink/10 pt-5 text-[11px] leading-relaxed text-ink/40">
              Prices are in Kenyan shillings and exclude delivery unless
              stated. Delivery figures depend on site access and are confirmed
              in writing before dispatch.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
