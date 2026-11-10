import { site } from "@/data/site";
import type { Container } from "@/data/containers";
import type { Faq } from "@/data/faqs";
import type { BlogPost } from "@/data/blog";

const businessId = `${site.url}/#business`;

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": businessId,
    name: site.name,
    description: site.description,
    slogan: site.tagline,
    url: site.url,
    telephone: site.phoneDisplay,
    email: site.email,
    image: `${site.url}/opengraph-image`,
    priceRange: site.priceRange,
    currenciesAccepted: "KES",
    paymentAccepted: "M-Pesa, Bank transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.addressLine,
      addressLocality: site.city,
      addressCountry: "KE",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: {
      "@type": "Country",
      name: "Kenya",
    },
    hasMap: site.mapsUrl,
    knowsAbout: [
      "shipping containers",
      "container offices",
      "container homes",
      "refrigerated containers",
      "container fabrication",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: { "@id": businessId },
  };
}

export function productSchema(container: Container) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: container.name,
    description: container.description,
    image: container.images.map((image) => image.src),
    sku: `VC-${container.slug.toUpperCase()}`,
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
      priceCurrency: "KES",
      price: container.price,
      availability: "https://schema.org/InStock",
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
    image: [post.image.src],
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
