export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string;
  addressLine: string;
  address: string;
  city: string;
  mapsUrl: string;
  mapsEmbed: string;
  hours: string;
  hoursShort: string;
}

export interface Announcement {
  id: string;
  message: string;
  linkLabel: string | null;
  linkHref: string | null;
}
