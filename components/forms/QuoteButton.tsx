"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icons";
import { buttonStyles } from "@/components/ui/Button";
import { cn } from "@/lib/format";

export function QuoteButton({
  children = "Get a quote",
  variant = "primary",
  size = "md",
  className,
  source = "cta",
  icon = true,
  container,
  onOpen,
}: {
  children?: React.ReactNode;
  variant?: "primary" | "dark" | "outline" | "outline-dark" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  source?: string;
  icon?: boolean;
  container?: string;
  onOpen?: () => void;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        onOpen?.();
        const params = new URLSearchParams({ source });
        if (container) params.set("container", container);
        router.push(`/enquire?${params.toString()}`);
      }}
      className={cn(buttonStyles({ variant, size, className }))}
    >
      <span>{children}</span>
      {icon ? (
        <Icon
          name="arrow-up-right"
          className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        />
      ) : null}
    </button>
  );
}
