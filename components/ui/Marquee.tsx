import { cn } from "@/lib/format";

export function Marquee({
  items,
  className,
  tone = "dark",
}: {
  items: readonly string[];
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1}
          >
            {items.map((item) => (
              <div key={`${copy}-${item}`} className="flex items-center">
                <span
                  className={cn(
                    "whitespace-nowrap px-6 font-mono text-[11px] uppercase tracking-[0.18em] sm:px-8",
                    tone === "dark" ? "text-bone/70" : "text-ink/65",
                  )}
                >
                  {item}
                </span>
                <span
                  className={cn(
                    "h-1 w-1 rotate-45",
                    tone === "dark" ? "bg-ember" : "bg-ember",
                  )}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
