import { site } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { QuoteButton } from "@/components/forms/QuoteButton";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-ember text-ink">
      <div className="ribs-light absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-16 -top-24 select-none font-display text-[340px] font-extrabold leading-none tracking-[-0.06em] text-ink/[0.05]"
        aria-hidden="true"
      >
        VAL
      </div>

      <div className="wrap relative py-20 sm:py-24">
        <p className="eyebrow text-ink/55">Next step</p>
        <div className="mt-6 grid items-end gap-10 lg:grid-cols-12">
          <h2 className="font-display text-[clamp(2.5rem,6vw,5.1rem)] font-bold leading-[0.94] tracking-[-0.05em] lg:col-span-8">
            Tell us what the site needs.
            <br className="hidden sm:block" /> We&rsquo;ll tell you what fits.
          </h2>

          <div className="flex flex-col gap-2.5 lg:col-span-4">
            <QuoteButton variant="dark" size="lg" source="cta-band" className="w-full">
              Get a free quote
            </QuoteButton>
            <ButtonLink
              href="/containers"
              variant="outline-dark"
              size="lg"
              className="w-full"
            >
              Browse the fleet
            </ButtonLink>
            <a
              href={site.phoneHref}
              className="mt-2 inline-flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 transition-colors hover:text-ink"
            >
              <Icon name="phone" className="h-3 w-3" />
              Or call {site.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/20 pt-5 font-mono text-[9px] uppercase tracking-[0.13em] text-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <span>Nairobi yard · Open 24/7</span>
          <span>Countrywide delivery · Written quotes</span>
          <span>Every unit documented</span>
        </div>
      </div>
    </section>
  );
}
