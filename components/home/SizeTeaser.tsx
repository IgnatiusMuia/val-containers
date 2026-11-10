import Link from "next/link";
import { sizes } from "@/data/sizes";
import { ButtonLink } from "@/components/ui/Button";
import { ContainerSilhouette } from "@/components/graphics/ContainerSilhouette";
import { Icon } from "@/components/ui/Icons";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SizeTeaser() {
  return (
    <section className="relative bg-bone py-20 text-ink sm:py-28">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            tone="light"
            index="04"
            label="Size guide"
            title={
              <>
                Three sizes.
                <br className="hidden sm:block" /> One right answer.
              </>
            }
            description="Most buyers choose between a 20ft, a 40ft and a 40ft high cube. Here is how they actually compare on the ground."
            action={
              <ButtonLink
                href="/size-guide"
                variant="outline-dark"
                size="md"
              >
                Compare all sizes
              </ButtonLink>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {sizes.map((size, index) => (
            <Reveal key={size.id} delay={index * 0.07} className="h-full">
              <Link
                href="/size-guide"
                className="group flex h-full flex-col border border-ink/12 bg-bone-2/50 p-6 transition-colors duration-300 hover:bg-[#f5f1e8]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/35">
                    0{index + 1}
                  </span>
                  <Icon
                    name="arrow-up-right"
                    className="h-4 w-4 text-ink/35 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                  />
                </div>

                <div className="mt-10 flex h-24 items-end border-b border-ink/10 pb-3">
                  <ContainerSilhouette size={size.id} tone="light" />
                </div>

                <h3 className="mt-6 font-display text-[24px] font-semibold tracking-[-0.03em]">
                  {size.label}
                </h3>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40">
                  {size.volume} · {size.floorArea} · {size.internalHeight}{" "}
                  internal
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/60">
                  {size.bestFor}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
                  <span className="text-[11px] text-ink/45">
                    {size.pallets}
                  </span>
                  <span className="text-[11.5px] font-medium text-ink/70 group-hover:text-ember-deep">
                    See the fit
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border border-ink/12 bg-bone p-5 sm:flex-row sm:items-center">
          <p className="max-w-xl text-[13px] leading-relaxed text-ink/60">
            <strong className="font-semibold text-ink">Not sure?</strong> Send a
            photo of the site or a rough sketch and we will tell you what fits —
            including what not to buy.
          </p>
          <QuoteButton variant="dark" size="sm" source="size-teaser">
            Ask us to size it
          </QuoteButton>
        </div>
      </div>
    </section>
  );
}
