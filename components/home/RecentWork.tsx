import { contentValue, getGalleryItems, getSiteContent } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";

export async function YardGallery() {
  const [items, content] = await Promise.all([
    getGalleryItems(),
    getSiteContent(),
  ]);
  if (items.length === 0) return null;

  const label = contentValue(content, "home.gallery.eyebrow", "From the yard");
  const heading = contentValue(
    content,
    "home.gallery.title",
    "Yard examples, not stock photos.",
  );
  const description = contentValue(
    content,
    "home.gallery.body",
    "A look at units and fit-outs from the yard. Ask for current photos and the inspection sheet for the exact container you are considering.",
  );

  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-ink py-20 sm:py-28">
      <div className="ribs absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal>
          <SectionHeading
            index="05"
            label={label}
            title={heading}
            description={description}
            action={
              <ButtonLink href="/containers" variant="outline" size="md">
                See current listings
              </ButtonLink>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.slice(0, 4).map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <figure className="group border border-bone/12 bg-coal">
                <SmartImage
                  src={item.src}
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
                    {item.caption ? (
                      <p className="mt-1.5 text-[11.5px] leading-relaxed text-bone/45">
                        {item.caption}
                      </p>
                    ) : null}
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
