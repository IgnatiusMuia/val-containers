import Link from "next/link";
import { Icon } from "./Icons";
import { cn } from "@/lib/format";

export function Breadcrumbs({
  items,
  tone = "dark",
}: {
  items: { name: string; href?: string }[];
  tone?: "dark" | "light";
}) {
  const isDark = tone === "dark";
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em]",
          isDark ? "text-bone/45" : "text-ink/45",
        )}
      >
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex items-center gap-2">
            {index > 0 ? (
              <Icon name="chevron-right" className="h-3 w-3" />
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "transition-colors",
                  isDark ? "hover:text-bone" : "hover:text-ink",
                )}
              >
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className={isDark ? "text-bone/75" : "text-ink/75"}>
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
