import {
  getContainers,
  getFeaturedContainers,
} from "@/lib/containers/repository";
import { waLink, waMessages } from "@/lib/whatsapp";
import { ButtonLink } from "@/components/ui/Button";
import { ContainerCard } from "@/components/containers/ContainerCard";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const spans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
] as const;

export async function FeaturedFleet() {
  const [containers, featuredContainers] = await Promise.all([
    getContainers(),
    getFeaturedContainers(),
  ]);

  return (
    <section className="relative bg-ink py-20 sm:py-28">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            index="01"
            label="The fleet"
            title={
              <>
                Stock you can inspect,
                <br className="hidden sm:block" /> price and take home.
              </>
            }
            description="A working selection from the yard. Every listing has a published price and condition notes. Ask for current photos, the serial and the inspection sheet for the exact unit before you pay."
            action={
              <ButtonLink href="/containers" variant="outline" size="md">
                View all {containers.length} containers
              </ButtonLink>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          {featuredContainers.map((container, index) => (
            <Reveal
              key={container.slug}
              delay={index * 0.06}
              className={spans[index]}
            >
              <ContainerCard
                container={container}
                wide={index === 0 || index === 3}
                className="h-full"
                imageSizes="(min-width: 1024px) 55vw, 100vw"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-bone/10 pt-5 sm:flex-row sm:items-center">
          <p className="max-w-xl text-[12px] leading-relaxed text-bone/40">
            Availability changes. If a unit is sold, we will show you the
            closest alternative rather than quietly swapping it.
          </p>
          <a
            href={waLink(waMessages.fabrication)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[12.5px] font-medium text-bone/70 transition-colors hover:text-ember"
          >
            Need something fabricated?
            <Icon
              name="arrow-up-right"
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
