import { cn } from "@/lib/format";
import type { SizeGuide } from "@/data/sizes";

export function ContainerSilhouette({
  size,
  tone = "dark",
  className,
}: {
  size: SizeGuide["id"];
  tone?: "dark" | "light";
  className?: string;
}) {
  const isForty = size !== "20ft";
  const isHighCube = size === "40ft-hc";
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "flex w-full items-end",
        isForty ? "justify-start" : "justify-center",
        className,
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "relative border-y-2",
          isDark ? "border-bone/40" : "border-ink/45",
          isForty ? "w-full" : "w-[49%]",
          isHighCube ? "h-[66px]" : "h-[52px]",
        )}
      >
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-[2px]",
            isDark ? "bg-bone/30" : "bg-ink/30",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-[7px] left-[5px] right-[17%]",
            isDark ? "ribs" : "ribs-light",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-[13%] w-px",
            isDark ? "bg-bone/40" : "bg-ink/35",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-[7px] right-[3px] w-[8%] border-x",
            isDark ? "border-bone/30" : "border-ink/25",
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 h-1 w-full",
            isDark ? "bg-bone/20" : "bg-ink/20",
          )}
        />
        {isHighCube ? (
          <span
            className={cn(
              "absolute -right-0.5 -top-4 font-mono text-[8px] uppercase tracking-[0.1em]",
              isDark ? "text-bone/35" : "text-ink/35",
            )}
          >
            HC
          </span>
        ) : null}
      </div>
    </div>
  );
}
