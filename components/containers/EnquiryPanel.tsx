import type { Container } from "@/data/containers";
import { formatKES } from "@/lib/format";
import { containerEnquiry, waLink } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icons";
import { QuoteButton } from "@/components/forms/QuoteButton";

export function EnquiryPanel({ container }: { container: Container }) {
  const message = containerEnquiry({
    name: container.name,
    sizeLabel: container.sizeLabel,
    conditionLabel: container.conditionLabel,
    priceLabel: formatKES(container.price),
  });

  const quickSpecs = [
    ["External", container.specs.external],
    ["Internal", container.specs.internal],
    ["Payload", container.specs.payload],
    ["Volume", container.specs.volume],
  ] as const;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="bg-bone/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/65">
          {container.typeLabel}
        </span>
        <span
          className={
            container.condition === "new"
              ? "bg-ember px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink"
              : "bg-bone/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink"
          }
        >
          {container.conditionLabel}
        </span>
        <span className="border border-bone/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/50">
          Grade {container.grade}
        </span>
      </div>

      <h1 className="mt-4 font-display text-[clamp(2rem,3.6vw,2.8rem)] font-bold leading-[1.02] tracking-[-0.045em] text-bone">
        {container.name}
      </h1>

      <div className="mt-5 flex items-end justify-between gap-4 border-y border-bone/12 py-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/35">
            Yard price
          </p>
          <p className="mt-1 font-display text-[34px] font-semibold leading-none tracking-[-0.03em] text-bone">
            {formatKES(container.price)}
          </p>
          <p className="mt-1.5 text-[10.5px] text-bone/35">
            Ex-yard Nairobi · Delivery quoted separately
          </p>
        </div>
        <span className="flex items-center gap-1.5 pb-1 font-mono text-[9px] uppercase tracking-[0.1em] text-bone/40">
          <span className="h-1.5 w-1.5 rounded-full bg-bone/30" />
          Availability on request
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 bg-whatsapp text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          Ask about this unit on WhatsApp
        </a>
        <QuoteButton
          variant="outline"
          size="md"
          source={`detail-${container.slug}`}
          className="w-full"
        >
          Request a delivered quote
        </QuoteButton>
        <a
          href="tel:+254795506397"
          className="flex h-10 items-center justify-center gap-2 text-[12px] text-bone/50 transition-colors hover:text-bone"
        >
          <Icon name="phone" className="h-3.5 w-3.5" />
          Or call the yard now
        </a>
      </div>

      <div className="mt-5 border border-bone/12">
        <dl className="grid grid-cols-2">
          {quickSpecs.map(([label, value], index) => (
            <div
              key={label}
              className={
                index % 2 === 0
                  ? "border-b border-r border-bone/10 p-3"
                  : "border-b border-bone/10 p-3"
              }
            >
              <dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-bone/30">
                {label}
              </dt>
              <dd className="mt-1 text-[11.5px] leading-snug text-bone/75">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex items-center justify-between gap-3 p-3">
          <span className="flex items-center gap-2 text-[10.5px] text-bone/40">
            <Icon name="shield" className="h-3.5 w-3.5 text-ember" />
            Condition notes available
          </span>
          <a
            href="/delivery"
            className="text-[10.5px] text-bone/50 underline decoration-bone/20 underline-offset-4 transition-colors hover:text-bone"
          >
            Delivery
          </a>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <p className="flex items-center gap-2 text-[11px] text-bone/40">
          <Icon name="clock" className="h-3.5 w-3.5 text-bone/30" />
          Yard open 24/7 · Inspect before you pay
        </p>
        <p className="flex items-center gap-2 text-[11px] text-bone/40">
          <Icon name="truck" className="h-3.5 w-3.5 text-bone/30" />
          Countrywide delivery · quoted to your gate
        </p>
      </div>
    </div>
  );
}
