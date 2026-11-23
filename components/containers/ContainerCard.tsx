import Link from "next/link";
import { primaryImage, type Container } from "@/data/containers";
import { cn, formatKES } from "@/lib/format";
import { availabilityLabel } from "@/lib/containers/availability";
import { Icon } from "@/components/ui/Icons";
import { SmartImage } from "@/components/ui/SmartImage";

export function ContainerCard({
  container,
  className,
  wide = false,
  imageSizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  container: Container;
  className?: string;
  wide?: boolean;
  imageSizes?: string;
}) {
  const image = primaryImage(container);
  const hasVideo = container.media.some((item) => item.kind === "video");

  return (
    <Link
      href={`/containers/${container.slug}`}
      className={cn(
        "group flex flex-col border border-bone/10 bg-coal transition-colors duration-300 hover:border-ember/50",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <SmartImage
          src={image.src}
          alt={image.alt}
          fill
          sizes={imageSizes}
          wrapperClassName={wide ? "aspect-[16/10]" : "aspect-[4/3]"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          fallbackLabel="Container photo coming soon"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="bg-ink/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/80 backdrop-blur-sm">
            {container.typeLabel}
          </span>
          <span
            className={cn(
              "px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em]",
              container.condition === "new"
                ? "bg-ember text-ink"
                : "bg-bone/90 text-ink",
            )}
          >
            {container.conditionLabel}
          </span>
          {hasVideo ? (
            <span className="inline-flex items-center gap-1 bg-ink/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/80 backdrop-blur-sm">
              <Icon name="play" className="h-2.5 w-2.5 text-ember" />
              Video
            </span>
          ) : null}
          {container.photosAreRepresentative ? (
            <span className="bg-ink/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/60 backdrop-blur-sm">
              Yard example
            </span>
          ) : null}
        </div>
        <span className="absolute bottom-3 right-3 bg-ink/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/60 backdrop-blur-sm">
          {availabilityLabel(container)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-4 font-mono text-[9.5px] uppercase tracking-[0.13em] text-bone/40">
          <span>
            {container.sizeLabel} · {container.grade}
          </span>
          <span>{container.year}</span>
        </div>
        <h3 className="mt-2 font-display text-[19px] font-semibold leading-snug tracking-[-0.025em] text-bone">
          {container.shortName}
        </h3>
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-bone/45">
          {container.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-bone/8 pt-4">
          <div>
            <span className="block font-mono text-[8.5px] uppercase tracking-[0.14em] text-bone/35">
              Yard price
            </span>
            <span className="mt-0.5 block font-display text-[20px] font-semibold tracking-[-0.02em] text-bone">
              {formatKES(container.price)}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 pb-1 text-[11.5px] font-medium text-ember">
            View unit
            <Icon
              name="arrow-up-right"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
