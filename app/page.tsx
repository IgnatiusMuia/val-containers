import type { Metadata } from "next";
import { faqs } from "@/data/faqs";
import { site } from "@/data/site";
import { faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/home/CtaBand";
import { FeaturedFleet } from "@/components/home/FeaturedFleet";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeHero } from "@/components/home/HomeHero";
import { RecentWork } from "@/components/home/RecentWork";
import { SizeTeaser } from "@/components/home/SizeTeaser";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { UseCaseGrid } from "@/components/home/UseCaseGrid";
import { WhyVal } from "@/components/home/WhyVal";

const title = "Shipping Containers for Sale in Kenya";

export const metadata: Metadata = {
  title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/",
    siteName: site.name,
    title: `${title} — Val Containers`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — Val Containers`,
    description: site.description,
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <HomeHero />
      <TrustMarquee />
      <FeaturedFleet />
      <UseCaseGrid />
      <WhyVal />
      <SizeTeaser />
      <RecentWork />
      <HomeFaq />
      <CtaBand />
    </>
  );
}
