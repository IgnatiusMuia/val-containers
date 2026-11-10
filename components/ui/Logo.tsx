import { cn } from "@/lib/format";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 28 28"
        className={cn("shrink-0", compact ? "h-6 w-6" : "h-7 w-7")}
        aria-hidden="true"
      >
        <rect x="2" y="4" width="4.6" height="20" fill="currentColor" opacity="0.32" />
        <rect x="9" y="4" width="4.6" height="20" fill="#F4511E" />
        <rect x="16" y="4" width="4.6" height="20" fill="currentColor" />
        <rect x="23" y="4" width="3" height="20" fill="currentColor" opacity="0.32" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-extrabold leading-none tracking-[-0.04em]",
            compact ? "text-lg" : "text-[22px]",
          )}
        >
          VAL
        </span>
        <span className="mt-0.5 font-mono text-[8px] uppercase leading-none tracking-[0.34em] opacity-50">
          Containers
        </span>
      </span>
    </span>
  );
}
