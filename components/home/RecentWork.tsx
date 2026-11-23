import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";

const work = [
  {
    title: "Retail kiosks",
    caption: "Red kiosk units lined up in the yard.",
    image: "/media/images/yard/kiosk-row-red.jpg",
    alt: "Red container retail kiosks with white roller shutters",
  },
  {
    title: "Site offices",
    caption: "Finished office interior with glazing and a timber floor.",
    image: "/media/images/interiors/office-interior.jpg",
    alt: "Finished container office interior with glass doors and timber floor",
  },
  {
    title: "Container homes",
    caption: "Clad container home with a timber veranda.",
    image: "/media/images/homes/container-home-exterior.jpg",
    alt: "Container home exterior with a timber veranda",
  },
  {
    title: "Yard stock",
    caption: "High cube containers stacked and ready for inspection.",
    image: "/media/images/yard/container-stack-high-cube.jpg",
    alt: "High cube containers stacked in the yard",
  },
] as const;

export function RecentWork() {
  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-ink py-20 sm:py-28">
      <div className="ribs absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal>
          <SectionHeading
            index="05"
            label="Recent work"
            title={
              <>
                Yard work,
                <br className="hidden sm:block" /> not stock photos.
              </>
            }
            description="A look at recent units we have handled. Ask for current photos and the inspection sheet for the exact container you are considering."
            action={
              <ButtonLink href="/containers" variant="outline" size="md">
                See current listings
              </ButtonLink>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {work.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <figure className="group border border-bone/12 bg-coal">
                <SmartImage
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  wrapperClassName="aspect-[16/10]"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <figcaption className="flex items-start justify-between gap-4 border-t border-bone/10 p-5">
                  <div>
                    <p className="font-display text-[19px] font-semibold tracking-[-0.025em] text-bone">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-bone/45">
                      {item.caption}
                    </p>
                  </div>
                  <Icon
                    name="boxes"
                    className="mt-1 h-4 w-4 shrink-0 text-ember"
                  />
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
