import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { site } from "@/data/site";
import type { Announcement, SiteSettings } from "@/lib/site-settings";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export type { SiteSettings, Announcement } from "@/lib/site-settings";

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  src: string;
  alt: string;
}

export interface PublicFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const defaultSiteSettings: SiteSettings = {
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
  hours: "Call to confirm current yard hours",
  hoursShort: "Nairobi yard",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag("site-settings");
  cacheLife("hours");

  const supabase = createSupabasePublicClient();
  if (!supabase) return defaultSiteSettings;

  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "site_name, tagline, description, email, phone_display, phone_href, whatsapp_number, address_line, address, city, maps_url, maps_embed, hours, hours_short",
    )
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return defaultSiteSettings;

  const row = data as unknown as {
    site_name: string;
    tagline: string;
    description: string;
    email: string;
    phone_display: string;
    phone_href: string;
    whatsapp_number: string;
    address_line: string;
    address: string;
    city: string;
    maps_url: string;
    maps_embed: string;
    hours: string;
    hours_short: string;
  };

  return {
    siteName: row.site_name || site.name,
    tagline: row.tagline || site.tagline,
    description: row.description || site.description,
    email: row.email || site.email,
    phoneDisplay: row.phone_display || site.phoneDisplay,
    phoneHref: row.phone_href || site.phoneHref,
    whatsappNumber: row.whatsapp_number || site.whatsappNumber,
    addressLine: row.address_line || site.addressLine,
    address: row.address || site.address,
    city: row.city || site.city,
    mapsUrl: row.maps_url || site.mapsUrl,
    mapsEmbed: row.maps_embed || site.mapsEmbed,
    hours: row.hours || "Call to confirm current yard hours",
    hoursShort: row.hours_short || "Nairobi yard",
  };
}

export async function getSiteContent(): Promise<Record<string, string>> {
  "use cache";
  cacheTag("site-content");
  cacheLife("hours");

  const supabase = createSupabasePublicClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("site_content")
    .select("key, value");

  if (error) return {};
  const rows = (data ?? []) as unknown as { key: string; value: string }[];
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export async function getFaqs(): Promise<PublicFaq[]> {
  "use cache";
  cacheTag("faqs");
  cacheLife("hours");

  const supabase = createSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, category")
    .eq("active", true)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return [];
  return data ?? [];
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  "use cache";
  cacheTag("gallery");
  cacheLife("hours");

  const supabase = createSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gallery_items")
    .select("id, title, caption, src, alt")
    .eq("publication_status", "published")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function getActiveAnnouncement(): Promise<Announcement | null> {
  "use cache";
  cacheTag("announcements");
  cacheLife("minutes");

  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("announcements")
    .select("id, message, link_label, link_href")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as unknown as {
    id: string;
    message: string;
    link_label: string | null;
    link_href: string | null;
  };

  return {
    id: row.id,
    message: row.message,
    linkLabel: row.link_label,
    linkHref: row.link_href,
  };
}

export function contentValue(
  content: Record<string, string>,
  key: string,
  fallback: string,
) {
  return content[key]?.trim() || fallback;
}
