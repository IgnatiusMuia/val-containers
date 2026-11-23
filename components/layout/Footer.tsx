import Link from "next/link";
import { footerLinks } from "@/data/site";
import type { SiteSettings } from "@/lib/site-settings";
import { Icon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { waLink, waMessages } from "@/lib/whatsapp";

const columns = [
  { title: "The fleet", links: footerLinks.fleet },
  { title: "Explore", links: footerLinks.explore },
  { title: "Company", links: footerLinks.company },
] as const;

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = 2026;

  return (
    <footer className="border-t border-bone/12 bg-ink">
      <div className="wrap pb-28 pt-16 sm:pb-24 sm:pt-20 md:pb-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link
              href="/"
              aria-label="Val Containers home"
              className="inline-flex text-bone transition-opacity hover:opacity-80"
            >
              <Logo />
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-bone/55">
              {settings.tagline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/40">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" />
                {settings.hours}
              </span>
              <span className="h-3 w-px bg-bone/15" aria-hidden="true" />
              <span>Nairobi yard</span>
              <span className="h-3 w-px bg-bone/15" aria-hidden="true" />
              <span>Countrywide delivery</span>
            </div>

            <div className="mt-8">
              <p className="eyebrow text-bone/35">Talk to the yard</p>
              <a
                href={settings.phoneHref}
                className="mt-3 inline-flex items-center gap-3 font-display text-[26px] font-semibold tracking-[-0.03em] text-bone transition-colors hover:text-ember sm:text-[30px]"
              >
                <Icon name="phone" className="h-5 w-5 text-ember" />
                {settings.phoneDisplay}
              </a>
              <a
                href={waLink(waMessages.general, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-3 text-[13px] text-bone/55 transition-colors hover:text-bone"
              >
                <Icon name="whatsapp" className="h-4 w-4 text-whatsapp" />
                WhatsApp the yard
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="mt-2 flex items-center gap-3 text-[13px] text-bone/55 transition-colors hover:text-bone"
              >
                <Icon name="mail" className="h-4 w-4 text-bone/45" />
                {settings.email}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="eyebrow text-bone/35">{column.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-bone/55 transition-colors hover:text-ember"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h3 className="eyebrow text-bone/35">Find the yard</h3>
            <address className="mt-4 not-italic">
              <p className="text-[13px] leading-relaxed text-bone/55">
                {settings.addressLine}
                <br />
                {settings.address}
              </p>
            </address>
            <div className="mt-4 overflow-hidden border border-bone/12">
              <iframe
                src={settings.mapsEmbed}
                title="Map showing Val Containers yard in Nairobi"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-40 w-full grayscale-[65%] contrast-[1.05]"
              />
            </div>
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 inline-flex items-center gap-2 text-[12px] font-medium text-bone/70 transition-colors hover:text-bone"
            >
              Get directions
              <Icon
                name="arrow-up-right"
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-bone/10 pt-6 font-mono text-[10px] uppercase tracking-[0.1em] text-bone/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Val Containers. All rights reserved.</p>
          <p>Prices in KES, ex-yard Nairobi. Subject to availability.</p>
          <a href="/sitemap.xml" className="transition-colors hover:text-bone/70">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}
