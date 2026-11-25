import { waLink, waMessages } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icons";

export function WhatsAppFAB({
  whatsappNumber,
}: {
  whatsappNumber?: string;
}) {
  return (
    <a
      href={waLink(waMessages.general, whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Val Containers on WhatsApp"
      className="wa-pulse group fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-ink shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-105 md:flex"
    >
      <Icon name="whatsapp" className="relative h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap border border-bone/12 bg-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-bone/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
