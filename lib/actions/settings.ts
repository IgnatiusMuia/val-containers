"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function revalidateSettings() {
  updateTag("site-settings");
  updateTag("announcements");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/delivery");
  revalidatePath("/enquire");
  revalidatePath("/containers");
  revalidatePath("/admin/settings");
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireOwner();

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: text(formData, "siteName"),
      tagline: text(formData, "tagline"),
      description: text(formData, "description"),
      email: text(formData, "email"),
      phone_display: text(formData, "phoneDisplay"),
      phone_href: text(formData, "phoneHref"),
      whatsapp_number: text(formData, "whatsappNumber"),
      address_line: text(formData, "addressLine"),
      address: text(formData, "address"),
      city: text(formData, "city"),
      maps_url: text(formData, "mapsUrl"),
      maps_embed: text(formData, "mapsEmbed"),
      hours: text(formData, "hours"),
      hours_short: text(formData, "hoursShort"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    console.error("Could not update site settings:", error.message);
    return;
  }

  revalidateSettings();
}

export async function saveAnnouncementAction(formData: FormData) {
  await requireOwner();

  const id = text(formData, "id");
  const message = text(formData, "message");
  if (!message) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const payload = {
    message,
    link_label: text(formData, "linkLabel") || null,
    link_href: text(formData, "linkHref") || null,
    active: formData.get("active") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("announcements").update(payload).eq("id", id)
    : await supabase.from("announcements").insert(payload);

  if (error) {
    console.error("Could not save announcement:", error.message);
    return;
  }

  revalidateSettings();
}

export async function deleteAnnouncementAction(formData: FormData) {
  await requireOwner();
  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  await supabase.from("announcements").delete().eq("id", id);
  revalidateSettings();
}
