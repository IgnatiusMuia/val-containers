"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
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

  const siteName = text(formData, "siteName");
  const email = text(formData, "email");
  if (!siteName || !email) {
    redirect("/admin/settings?error=required");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/settings?error=config");

  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: siteName,
      tagline: text(formData, "tagline"),
      description: text(formData, "description"),
      email,
      phone_display: text(formData, "phoneDisplay"),
      phone_href: text(formData, "phoneHref"),
      whatsapp_number: text(formData, "whatsappNumber").replace(/\D/g, ""),
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
    redirect("/admin/settings?error=settings");
  }

  revalidateSettings();
  redirect("/admin/settings?saved=settings");
}

export async function saveAnnouncementAction(formData: FormData) {
  await requireOwner();

  const id = text(formData, "id");
  const message = text(formData, "message");
  if (!message) {
    redirect("/admin/settings?error=message");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/settings?error=config");

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
    redirect("/admin/settings?error=announcement");
  }

  revalidateSettings();
  redirect(`/admin/settings?saved=announcement${id ? `&edit=${id}` : ""}`);
}

export async function deleteAnnouncementAction(formData: FormData) {
  await requireOwner();
  const id = text(formData, "id");
  if (!id) redirect("/admin/settings?error=missing");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/settings?error=config");

  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Could not delete announcement:", error.message);
    redirect("/admin/settings?error=announcement");
  }

  revalidateSettings();
  redirect("/admin/settings?saved=deleted");
}
