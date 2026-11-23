import type { Metadata } from "next";
import { faqSchema } from "@/lib/schema";
import { getFaqs, getSiteSettings } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/home/CtaBand";
import { FeaturedFleet } from "@/components/home/FeaturedFleet";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeHero } from "@/components/home/HomeHero";
import { YardGallery } from "@/components/home/RecentWork";
import { SizeTeaser } from "@/components/home/SizeTeaser";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { UseCaseGrid } from "@/components/home/UseCaseGrid";
import { WhyVal } from "@/components/home/WhyVal";

const title = "Shipping Containers for Sale in Kenya";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title,
    description: settings.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_KE",
      url: "/",
      siteName: settings.siteName,
      title: `${title} — ${settings.siteName}`,
      description: settings.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${settings.siteName}`,
      description: settings.description,
    },
  };
}

export default async function HomePage() {
  const faqs = await getFaqs();
  const faqItems = faqs.map(({ question, answer }) => ({ question, answer }));

  return (
    <>
      <JsonLd data={faqSchema(faqItems)} />
      <HomeHero />
      <TrustMarquee />
      <FeaturedFleet />
      <UseCaseGrid />
      <WhyVal />
      <SizeTeaser />
      <YardGallery />
      <HomeFaq faqs={faqs} />
      <CtaBand />
    </>
  );
}
