import { site } from "@/data/site";
import { containerImageUrls, type Container } from "@/data/containers";
import { availabilitySchema } from "@/lib/containers/availability";
import type { Faq } from "@/data/faqs";
import type { BlogPost } from "@/data/blog";
import type { SiteSettings } from "@/lib/site-settings";

const businessId = `${site.url}/#business`;

const fallbackSettings: SiteSettings = {
  siteName: site.name,
  tagline: site.tagline,
  description: site.description,
  email: site.email,
  phoneDisplay: site.phoneDisplay,
  phoneHref: site.phoneHref,
  whatsappNumber: site.whatsappNumber,
  addressLine: site.addressLine,
  address: site.address,
  city: site.city,
  mapsUrl: site.mapsUrl,
  mapsEmbed: site.mapsEmbed,
  hours: site.hours,
  hoursShort: site.hoursShort,
};

function absoluteMediaUrl(src: string) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  return `${site.url}${src.startsWith("/") ? src : `/${src}`}`;
}

export function localBusinessSchema(
  settings: SiteSettings = fallbackSettings,
  priceRange: string = site.priceRange,
) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": businessId,
    name: settings.siteName,
    description: settings.description,
    slogan: settings.tagline,
    url: site.url,
    telephone: settings.phoneHref.replace(/^tel:/, ""),
    email: settings.email,
    image: `${site.url}/opengraph-image`,
    priceRange,
    currenciesAccepted: "KES",
    paymentAccepted: "M-Pesa, Bank transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressLine,
      addressLocality: settings.city,
      addressCountry: "KE",
    },
    areaServed: {
      "@type": "Country",
      name: "Kenya",
    },
    hasMap: settings.mapsUrl,
    knowsAbout: [
      "shipping containers",
      "container offices",
      "container homes",
      "refrigerated containers",
      "container fabrication",
    ],
  };
}

export function websiteSchema(settings: SiteSettings = fallbackSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: site.url,
    description: settings.description,
    publisher: { "@id": businessId },
  };
}

export function productSchema(container: Container) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: container.name,
    description: container.description,
    image: containerImageUrls(container).map(absoluteMediaUrl).filter(Boolean),
    sku: container.reference ?? `VC-${container.slug.toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: site.name,
    },
    category:
      container.type === "plain"
        ? "Shipping containers"
        : container.type === "fabricated"
          ? "Fabricated containers"
          : "Refrigerated containers",
    offers: {
      "@type": "Offer",
      url: `${site.url}/containers/${container.slug}`,
      priceCurrency: container.currency ?? "KES",
      price: container.price,
      availability: availabilitySchema(container),
      itemCondition:
        container.condition === "new"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
      seller: {
        "@id": businessId,
      },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Size", value: container.sizeLabel },
      { "@type": "PropertyValue", name: "Condition", value: container.conditionLabel },
      { "@type": "PropertyValue", name: "External dimensions", value: container.specs.external },
      { "@type": "PropertyValue", name: "Payload", value: container.specs.payload },
    ],
  };
}

export function faqSchema(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function articleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [absoluteMediaUrl(post.image.src)].filter(Boolean),
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/blog/${post.slug}`,
    },
  };
}
