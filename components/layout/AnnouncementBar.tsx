import Link from "next/link";
import type { Announcement } from "@/lib/site-settings";
import { Icon } from "@/components/ui/Icons";

export function AnnouncementBar({ announcement }: { announcement: Announcement }) {
  const content = (
    <>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
      <span className="flex-1 text-center sm:text-left">{announcement.message}</span>
      {announcement.linkLabel ? (
        <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ember">
          {announcement.linkLabel}
          <Icon name="arrow-up-right" className="h-3 w-3" />
        </span>
      ) : null}
    </>
  );

  const className =
    "flex items-center gap-3 bg-coal px-4 py-2 text-[11px] leading-snug text-bone/70 transition-colors hover:text-bone";

  if (announcement.linkHref) {
    const href = announcement.linkHref;
    if (href.startsWith("/") && !href.startsWith("//")) {
      return (
        <Link href={href} className={className}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
