import Link from "next/link";
import type { UseCase } from "@/data/use-cases";
import { cn, formatCompactKES } from "@/lib/format";
import { Icon } from "@/components/ui/Icons";
import { SmartImage } from "@/components/ui/SmartImage";

const aspects = [
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[4/5]",
  "aspect-[16/11]",
] as const;

export function UseCaseCard({
  useCase,
  index = 0,
}: {
  useCase: UseCase;
  index?: number;
}) {
  return (
    <Link
      href={`/use-cases/${useCase.slug}`}
      className="group relative block overflow-hidden border border-bone/12 bg-coal"
    >
      <SmartImage
        src={useCase.image.src}
        alt={useCase.image.alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        wrapperClassName={cn("w-full", aspects[index % aspects.length])}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        fallbackLabel="Use case photo coming soon"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/5 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="translate-y-0 opacity-100 transition-all duration-500 ease-out sm:translate-y-3 sm:opacity-80 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.13em] text-bone/50">
            <span>{useCase.eyebrow}</span>
            <span>From {formatCompactKES(useCase.fromPrice)}</span>
          </div>
          <h3 className="mt-2 font-display text-[24px] font-semibold leading-[1.05] tracking-[-0.03em] text-bone">
            {useCase.shortTitle}
          </h3>
          <p className="mt-2 line-clamp-2 max-w-md text-[12px] leading-relaxed text-bone/55">
            {useCase.summary}
          </p>
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-bone/15 pt-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-bone/40">
              {useCase.sizes.join(" · ")}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-bone/75 transition-colors group-hover:text-ember">
              Explore
              <Icon
                name="arrow-up-right"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
