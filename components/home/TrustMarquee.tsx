import { trustPoints } from "@/data/site";
import { Marquee } from "@/components/ui/Marquee";

export function TrustMarquee() {
  return (
    <div className="ribs border-y border-bone/10 bg-coal py-3.5">
      <div className="flex items-stretch">
        <div className="hidden shrink-0 items-center gap-3 border-r border-bone/10 px-5 sm:flex lg:px-8">
          <span className="h-1.5 w-1.5 bg-ember" aria-hidden="true" />
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-bone/40">
            The Val standard
          </span>
        </div>
        <Marquee items={trustPoints} className="flex-1" />
      </div>
    </div>
  );
}
