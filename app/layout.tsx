import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

import { site } from "@/data/site";
import { getActiveAnnouncement, getSiteSettings } from "@/lib/content";
import { getContainerStats } from "@/lib/containers/repository";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { MobileDock } from "@/components/layout/MobileDock";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const defaultTitle = `${settings.siteName} — Shipping Containers for Sale in Kenya`;

  return {
    metadataBase: new URL(site.url),
    title: {
      default: defaultTitle,
      template: `%s — ${settings.siteName}`,
    },
    description: settings.description,
    applicationName: settings.siteName,
    authors: [{ name: settings.siteName, url: site.url }],
    creator: settings.siteName,
    publisher: settings.siteName,
    category: "business",
    keywords: [
      "shipping containers for sale in Kenya",
      "containers for sale Nairobi",
      "20ft container price Kenya",
      "40ft container price Kenya",
      "refrigerated container Kenya",
      "site office container",
      "container homes Kenya",
      "fabricated containers",
      "used shipping containers Kenya",
    ],
    openGraph: {
      type: "website",
      locale: "en_KE",
      url: "/",
      siteName: settings.siteName,
      title: defaultTitle,
      description: settings.description,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: settings.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0B09",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, announcement, stats] = await Promise.all([
    getSiteSettings(),
    getActiveAnnouncement(),
    getContainerStats(),
  ]);
  const priceRange =
    stats.total > 0
      ? `KES ${stats.minPrice.toLocaleString("en-KE")} – ${stats.maxPrice.toLocaleString("en-KE")}`
      : undefined;

  return (
    <html
      lang="en-KE"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="flex min-h-svh flex-col bg-ink text-bone antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ember focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>

        {announcement ? <AnnouncementBar announcement={announcement} /> : null}
        <Navbar settings={settings} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
        <div className="h-20 md:hidden" aria-hidden="true" />
        <MobileDock settings={settings} />
        <WhatsAppFAB whatsappNumber={settings.whatsappNumber} />

        <JsonLd
          data={[
            localBusinessSchema(settings, priceRange),
            websiteSchema(settings),
          ]}
        />
      </body>
    </html>
  );
}
