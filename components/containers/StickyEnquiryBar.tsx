"use client";

import { formatKES } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icons";
import { QuoteButton } from "@/components/forms/QuoteButton";

export function StickyEnquiryBar({
  name,
  price,
  whatsappMessage,
  source,
}: {
  name: string;
  price: number;
  whatsappMessage: string;
  source: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-bone/12 bg-ink/95 backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-2.5 px-3 pb-safe pt-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] text-bone/45">{name}</p>
          <p className="font-display text-[19px] font-semibold leading-tight tracking-[-0.02em] text-bone">
            {formatKES(price)}
          </p>
        </div>
        <a
          href={waLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp about ${name}`}
          className="flex h-11 items-center gap-1.5 bg-whatsapp px-3 text-[11.5px] font-medium text-white"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          WhatsApp
        </a>
        <QuoteButton
          size="sm"
          source={source}
          icon={false}
          className="h-11 px-3"
        >
          Quote
        </QuoteButton>
      </div>
    </div>
  );
}
