import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/format";
import { Icon } from "./Icons";

type Variant = "primary" | "dark" | "outline" | "outline-dark" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-[2px] border font-medium tracking-[-0.01em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "border-ember bg-ember text-ink hover:border-ember-deep hover:bg-ember-deep",
  dark: "border-ink bg-ink text-bone hover:border-steel hover:bg-steel",
  outline:
    "border-bone/30 bg-transparent text-bone hover:border-bone hover:bg-bone hover:text-ink",
  "outline-dark":
    "border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-bone",
  ghost: "border-transparent bg-transparent text-ink/70 hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[13px]",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-[15px]",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: boolean;
  external?: boolean;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  icon = true,
  external,
}: ButtonLinkProps) {
  const isExternal =
    external ||
    href.startsWith("http") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:");

  const content = (
    <>
      <span>{children}</span>
      {icon ? (
        <Icon
          name={href.startsWith("tel:") ? "phone" : "arrow-up-right"}
          className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        />
      ) : null}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={buttonStyles({ variant, size, className })}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={buttonStyles({ variant, size, className })}>
      {content}
    </Link>
  );
}

export function ArrowLink({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: ReactNode;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href.startsWith("http") || href.startsWith("tel:");
  const classes = cn(
    "group/link inline-flex items-center gap-2 font-medium text-ink transition-colors hover:text-ember-deep",
    className,
  );

  if (isExternal) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
        <Icon
          name="arrow-up-right"
          className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
        />
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      <Icon
        name="arrow-right"
        className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
      />
    </Link>
  );
}
