export const site = {
  name: "Val Containers",
  legalName: "Val Containers",
  tagline:
    "Plain, fabricated and refrigerated containers with clear prices and condition notes, delivered across Kenya.",
  description:
    "Shipping containers for sale in Kenya. Plain, fabricated and refrigerated units with published KES prices, condition notes and countrywide delivery from our Nairobi yard.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://val-containers.vercel.app",
  phoneDisplay: "+254 795 506 397",
  phoneHref: "tel:+254795506397",
  whatsappNumber: "254795506397",
  email: "Vallsia35@gmail.com",
  address: "MVQ6+VHV, Nairobi, Kenya",
  addressLine: "Near NTSA Inspection Centre, Likoni Road",
  city: "Nairobi",
  country: "Kenya",
  mapsUrl: "https://maps.google.com/?q=MVQ6+VHV+Nairobi+Kenya",
  mapsEmbed:
    "https://maps.google.com/maps?q=MVQ6%2BVHV%20Nairobi%20Kenya&z=16&output=embed",
  hours: "Call to confirm current yard hours",
  hoursShort: "Nairobi yard",
  priceRange: "KES 185,000 – 2,450,000",
  foundedNote: "Nairobi yard · Countrywide delivery",
} as const;

export const nav = [
  { href: "/containers", label: "Containers" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/delivery", label: "Delivery" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
] as const;

export const trustPoints = [
  "Published prices",
  "Condition notes",
  "Yard inspection",
  "Delivery planning",
  "Direct WhatsApp line",
  "Written quotes",
] as const;



export const quickActions = [
  {
    label: "WhatsApp",
    detail: "Fastest reply",
    href: "whatsapp",
  },
  {
    label: "Call",
    detail: site.phoneDisplay,
    href: site.phoneHref,
  },
  {
    label: "Directions",
    detail: "Likoni Road yard",
    href: site.mapsUrl,
  },
] as const;

export const footerLinks = {
  fleet: [
    { href: "/containers", label: "All containers" },
    { href: "/containers?type=plain", label: "Plain & dry" },
    { href: "/containers?type=fabricated", label: "Fabricated" },
    { href: "/containers?type=refrigerated", label: "Refrigerated" },
    { href: "/size-guide", label: "Size guide" },
  ],
  explore: [
    { href: "/use-cases", label: "Use cases" },
    { href: "/delivery", label: "Delivery & coverage" },
    { href: "/blog", label: "Buying guides" },
    { href: "/about", label: "About Val" },
  ],
  company: [
    { href: "/contact", label: "Contact" },
    { href: "/contact#quote", label: "Get a quote" },
    { href: "/delivery#access", label: "Site access check" },
  ],
} as const;
