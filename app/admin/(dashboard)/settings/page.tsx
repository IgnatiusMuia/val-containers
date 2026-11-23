import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  deleteAnnouncementAction,
  saveAnnouncementAction,
  updateSiteSettingsAction,
} from "@/lib/actions/settings";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const instant = false;

interface SettingsRow {
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
}

interface AnnouncementRow {
  id: string;
  message: string;
  link_label: string | null;
  link_href: string | null;
  active: boolean;
}

const inputClass =
  "h-10 w-full border border-bone/15 bg-coal px-3 text-sm text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none";
const labelClass =
  "mb-1 block font-mono text-[8px] uppercase tracking-[0.12em] text-bone/35";

export default async function AdminSettingsPage() {
  await requireOwner();

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const [{ data: settingsData }, { data: announcementsData }] =
    await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("announcements")
        .select("id, message, link_label, link_href, active")
        .order("created_at", { ascending: false }),
    ]);

  const settings = settingsData as unknown as SettingsRow | null;
  const announcements = (announcementsData ?? []) as unknown as AnnouncementRow[];
  const current = announcements[0] ?? null;

  if (!settings) {
    return (
      <p className="border border-red-500/25 bg-red-500/5 p-5 text-sm text-red-200">
        Settings row not found. Apply the admin CMS migration.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ember">Owner only</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Settings<span className="text-ember">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/50">
            Contact details, hours, location and the site announcement. Only the
            owner can change these.
          </p>
        </div>
        <Link
          href="/admin/settings/team"
          className="border border-bone/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/50 transition-colors hover:border-bone/35 hover:text-bone"
        >
          Team access
        </Link>
      </div>

      <form
        action={updateSiteSettingsAction}
        className="mt-8 border border-bone/12 bg-ink p-5"
      >
        <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
          Business details
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            ["siteName", "Site name", settings.site_name],
            ["tagline", "Tagline", settings.tagline],
            ["email", "Email", settings.email],
            ["phoneDisplay", "Phone display", settings.phone_display],
            ["phoneHref", "Phone link", settings.phone_href],
            ["whatsappNumber", "WhatsApp number", settings.whatsapp_number],
            ["addressLine", "Address line", settings.address_line],
            ["address", "Address / plus code", settings.address],
            ["city", "City", settings.city],
            ["hours", "Hours", settings.hours],
            ["hoursShort", "Hours short", settings.hours_short],
            ["mapsUrl", "Maps link", settings.maps_url],
          ].map(([name, label, value]) => (
            <div key={name}>
              <label className={labelClass} htmlFor={`settings-${name}`}>
                {label}
              </label>
              <input
                id={`settings-${name}`}
                name={name}
                defaultValue={value}
                className={inputClass}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="settings-description">
              Description
            </label>
            <textarea
              id="settings-description"
              name="description"
              defaultValue={settings.description}
              rows={3}
              className="w-full border border-bone/15 bg-coal px-3 py-2 text-sm leading-relaxed text-bone focus:border-ember focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="settings-mapsEmbed">
              Maps embed URL
            </label>
            <input
              id="settings-mapsEmbed"
              name="mapsEmbed"
              defaultValue={settings.maps_embed}
              className={inputClass}
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 h-10 bg-ember px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-ink"
        >
          Save settings
        </button>
      </form>

      <form
        action={saveAnnouncementAction}
        className="mt-6 border border-bone/12 bg-ink p-5"
      >
        {current ? <input type="hidden" name="id" value={current.id} /> : null}
        <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
          Site announcement
        </h2>
        <div className="mt-4 grid gap-3">
          <textarea
            name="message"
            defaultValue={current?.message ?? ""}
            rows={2}
            placeholder="Short message shown above the site"
            className="w-full border border-bone/15 bg-coal px-3 py-2 text-sm text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="linkLabel"
              defaultValue={current?.link_label ?? ""}
              placeholder="Link label (optional)"
              className={inputClass}
            />
            <input
              name="linkHref"
              defaultValue={current?.link_href ?? ""}
              placeholder="/containers or https://…"
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-[11px] text-bone/55">
            <input
              type="checkbox"
              name="active"
              defaultChecked={current?.active ?? false}
              className="h-4 w-4 accent-ember"
            />
            Show this announcement
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="h-9 bg-ember px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-ink"
          >
            Save announcement
          </button>
          {current ? (
            <ConfirmButton
              type="submit"
              formAction={deleteAnnouncementAction}
              message="Delete this announcement?"
              className="h-9 border border-red-500/20 px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-red-300/60 hover:text-red-200"
            >
              Delete
            </ConfirmButton>
          ) : null}
        </div>
      </form>
    </div>
  );
}
