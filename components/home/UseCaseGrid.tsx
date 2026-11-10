import Link from "next/link";
import { useCases } from "@/data/use-cases";
import { formatKES } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";

export function UseCaseGrid() {
  return (
    <section className="relative overflow-hidden bg-bone py-20 text-ink sm:py-28">
      <div className="ribs-light absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal>
          <SectionHeading
            tone="light"
            index="02"
            label="Use cases"
            title={
              <>
                Built around the job,
                <br className="hidden sm:block" /> not the box.
              </>
            }
            description="Storage, offices, homes, kiosks, cold chains and events. The right container depends on what happens after it lands."
            action={
              <ButtonLink
                href="/use-cases"
                variant="outline-dark"
                size="md"
              >
                All use cases
              </ButtonLink>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, index) => (
            <Reveal
              key={useCase.slug}
              delay={(index % 3) * 0.06}
              className="h-full"
            >
              <Link
                href={`/use-cases/${useCase.slug}`}
                className="group flex h-full flex-col border border-ink/12 bg-bone transition-colors duration-300 hover:border-ink/35 hover:bg-[#f5f1e8]"
              >
                <SmartImage
                  src={useCase.image.src}
                  alt={useCase.image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  tone="light"
                  wrapperClassName="aspect-[4/3]"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.13em] text-ink/40">
                    <span>{useCase.eyebrow}</span>
                    <span>From {formatKES(useCase.fromPrice)}</span>
                  </div>
                  <h3 className="mt-2.5 font-display text-[21px] font-semibold leading-snug tracking-[-0.03em] text-ink">
                    {useCase.shortTitle}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-ink/55">
                    {useCase.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/35">
                      {useCase.sizes.join(" · ")}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-ink/70 transition-colors group-hover:text-ember-deep">
                      Explore
                      <Icon
                        name="arrow-up-right"
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
