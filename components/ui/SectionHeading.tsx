import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function SectionHeading({
  label,
  title,
  description,
  tone = "dark",
  align = "left",
  action,
  index,
}: {
  label: string;
  title: ReactNode;
  description?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  action?: ReactNode;
  index?: string;
}) {
  const isDark = tone === "dark";
  return (
    <div
      className={cn(
        "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between",
        align === "center" && "lg:flex-col lg:items-center lg:text-center",
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "text-center")}>
        <div
          className={cn(
            "mb-5 flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          {index ? (
            <span
              className={cn(
                "font-mono text-[11px] tracking-[0.18em]",
                isDark ? "text-ember" : "text-ember-deep",
              )}
            >
              {index}
            </span>
          ) : null}
          <span
            className={cn(
              "h-px w-8",
              isDark ? "bg-bone/25" : "bg-ink/25",
            )}
            aria-hidden="true"
          />
          <span
            className={cn(
              "eyebrow",
              isDark ? "text-bone/60" : "text-ink/60",
            )}
          >
            {label}
          </span>
        </div>
        <h2
          className={cn(
            "font-display text-[clamp(2.2rem,5vw,4.2rem)] font-bold leading-[0.98] tracking-[-0.045em]",
            isDark ? "text-bone" : "text-ink",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-6 max-w-xl text-[15px] leading-relaxed sm:text-base",
              align === "center" && "mx-auto",
              isDark ? "text-bone/65" : "text-ink/65",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
