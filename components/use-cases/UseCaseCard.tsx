import Image from "next/image";
import Link from "next/link";
import type { UseCase } from "@/data/use-cases";
import { formatCompactKES } from "@/lib/format";
import { Icon } from "@/components/ui/Icons";

export function UseCaseCard({ useCase }: { useCase: UseCase }) {
  return (
    <Link
      href={`/use-cases/${useCase.slug}`}
      className="group block border border-bone/12 bg-coal transition-colors duration-300 hover:border-bone/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        <Image
          src={useCase.image.src}
          alt={useCase.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 bg-ink/80 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-bone/60 backdrop-blur-sm">
          {useCase.eyebrow}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-bone/35">
            From {formatCompactKES(useCase.fromPrice)}
          </span>
          <Icon
            name="arrow-up-right"
            className="h-4 w-4 text-bone/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember"
          />
        </div>
        <h3 className="mt-3 font-display text-[22px] font-semibold leading-[1.08] tracking-[-0.025em] text-bone">
          {useCase.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-bone/50">
          {useCase.summary}
        </p>
      </div>
    </Link>
  );
}
