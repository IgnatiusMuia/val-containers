import { getContainers } from "@/lib/containers/repository";
import { deliveryRegions } from "@/data/delivery";
import { site } from "@/data/site";
import { heroMedia } from "@/data/media";
import { formatKES } from "@/lib/format";
import { waLink, waMessages } from "@/lib/whatsapp";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";

export async function HomeHero() {
  const containers = await getContainers();
  const listingCount = containers.length;
  const minPrice = listingCount
    ? Math.min(...containers.map((container) => container.price))
    : 0;
  const latestUpdate = containers.reduce(
    (latest, container) =>
      container.addedAt > latest ? container.addedAt : latest,
    containers[0]?.addedAt ?? "",
  );
  const latestLabel = latestUpdate
    ? new Intl.DateTimeFormat("en-KE", {
        month: "long",
        year: "numeric",
      }).format(new Date(latestUpdate))
    : "—";

  const ledger = [
    ["Listings online", String(listingCount)],
    ["Delivery regions", String(deliveryRegions.length)],
    ["Yard access", "24/7"],
  ] as const;
  return (
    <section className="grain relative isolate flex min-h-[88svh] items-end overflow-hidden bg-ink">
      <HeroBackdrop
        videoSrc={heroMedia.video}
        posterSrc={heroMedia.poster}
        posterAlt={heroMedia.alt}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,11,9,0.94)_0%,rgba(10,11,9,0.72)_48%,rgba(10,11,9,0.28)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/40"
        aria-hidden="true"
      />

      <div className="wrap relative z-10 pb-14 pt-24 sm:pb-20 sm:pt-32">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-ember" aria-hidden="true" />
              <p className="eyebrow text-bone/65">
                Nairobi yard · Countrywide delivery
              </p>
            </div>

            <h1 className="mt-6 font-display text-[clamp(3.1rem,7.4vw,6.6rem)] font-bold leading-[0.9] tracking-[-0.055em] text-bone">
              Every container has
              <br />
              <span className="text-ember">a paper trail.</span>
            </h1>

            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-bone/70 sm:text-base">
              Plain, fabricated and refrigerated containers with published
              prices, condition notes and the documents available for the exact
              unit. Inspect before you pay, or ask for current photos and video.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/containers" size="lg">
                Browse the fleet
              </ButtonLink>
              <QuoteButton variant="outline" size="lg" source="hero">
                Get a free quote
              </QuoteButton>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-bone/55">
              <a
                href={waLink(waMessages.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-bone"
              >
                <Icon name="whatsapp" className="h-4 w-4 text-whatsapp" />
                WhatsApp the yard
              </a>
              <span className="h-3 w-px bg-bone/20" aria-hidden="true" />
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 transition-colors hover:text-bone"
              >
                <Icon name="phone" className="h-4 w-4 text-bone/50" />
                {site.phoneDisplay}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-bone/15 pt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-bone/45 lg:hidden">
              <span>{listingCount} listings</span>
              <span>From {formatKES(minPrice)}</span>
              <span>Open 24/7</span>
            </div>
          </div>

          <div className="hidden lg:col-span-4 lg:block">
            <div className="relative border border-bone/15 bg-ink/75 p-5 backdrop-blur-md">
              <div
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-ember via-ember/60 to-transparent"
                aria-hidden="true"
              />
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow text-bone/50">Yard snapshot</p>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/35">
                  Current listings
                </span>
              </div>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/30">
                Updated {latestLabel}
              </p>

              <dl className="mt-4 divide-y divide-bone/8 border-y border-bone/10">
                {ledger.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <dt className="text-[12px] text-bone/45">{label}</dt>
                    <dd className="font-mono text-[11px] uppercase tracking-[0.08em] text-bone/85">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/35">
                  Stock starts at
                </span>
                <p className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em] text-bone">
                  {formatKES(minPrice)}
                </p>
                <p className="mt-1 text-[11px] text-bone/40">
                  Published, not &ldquo;call for price&rdquo;.
                </p>
              </div>

              <a
                href={waLink(waMessages.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex h-11 items-center justify-center gap-2 bg-whatsapp px-4 text-[12.5px] font-medium text-white transition-opacity hover:opacity-90"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                WhatsApp the yard
              </a>
              <a
                href={site.phoneHref}
                className="mt-2 flex h-10 items-center justify-center gap-2 border border-bone/15 text-[12px] text-bone/65 transition-colors hover:border-bone/40 hover:text-bone"
              >
                <Icon name="phone" className="h-3.5 w-3.5" />
                {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
