"use client";

import { usePathname } from "next/navigation";
import { site } from "@/data/site";
import { waLink, waMessages } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icons";

export function MobileDock() {
  const pathname = usePathname();

  if (
    pathname === "/contact" ||
    /^\/containers\/[^/]+$/.test(pathname)
  ) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-bone/12 bg-ink/95 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-3 px-2 pb-safe pt-1.5">
        <a
          href={waLink(waMessages.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-2 text-[9px] font-mono uppercase tracking-[0.14em] text-bone/55 transition-colors hover:text-bone"
        >
          <Icon name="whatsapp" className="h-5 w-5 text-whatsapp" />
          WhatsApp
        </a>
        <a
          href={site.phoneHref}
          className="flex flex-col items-center gap-1 border-x border-bone/10 py-2 text-[9px] font-mono uppercase tracking-[0.14em] text-bone/55 transition-colors hover:text-bone"
        >
          <Icon name="phone" className="h-5 w-5 text-ember" />
          Call 24/7
        </a>
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-2 text-[9px] font-mono uppercase tracking-[0.14em] text-bone/55 transition-colors hover:text-bone"
        >
          <Icon name="pin" className="h-5 w-5 text-bone/75" />
          Directions
        </a>
      </div>
    </div>
  );
}
