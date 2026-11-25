"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enquiryStatuses, type EnquiryStatus } from "@/lib/enquiry-status";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateEnquiryStatusAction(formData: FormData) {
  const { user } = await requireAdmin("enquiries");
  const id = text(formData, "id");
  const status = text(formData, "status") as EnquiryStatus;

  if (!id || !enquiryStatuses.includes(status)) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from("enquiries")
    .update({
      status,
      ...(status === "converted" || status === "closed"
        ? { closed_at: new Date().toISOString() }
        : { closed_at: null }),
    })
    .eq("id", id);

  if (error) {
    console.error("Could not update enquiry status:", error.message);
    redirect(`/admin/enquiries/${id}?error=status`);
  }

  await supabase.from("enquiry_activity").insert({
    enquiry_id: id,
    actor_id: user.id,
    action: "status_changed",
    detail: { status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}

export async function addEnquiryNoteAction(formData: FormData) {
  const { user } = await requireAdmin("enquiries");
  const id = text(formData, "id");
  const body = text(formData, "body");

  if (!id || body.length < 2) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase.from("enquiry_notes").insert({
    enquiry_id: id,
    author_id: user.id,
    body: body.slice(0, 4000),
  });

  if (error) {
    console.error("Could not add enquiry note:", error.message);
    redirect(`/admin/enquiries/${id}?error=note`);
  }

  await supabase.from("enquiry_activity").insert({
    enquiry_id: id,
    actor_id: user.id,
    action: "note_added",
    detail: {},
  });

  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath("/admin/enquiries");
}

export async function addEnquiryQuotationAction(formData: FormData) {
  const { user } = await requireAdmin("enquiries");
  const id = text(formData, "id");
  const amount = Number(text(formData, "amount"));
  const currency = text(formData, "currency") || "KES";
  const validUntil = text(formData, "validUntil");
  const notes = text(formData, "notes");
  const deliveryIncluded = formData.get("deliveryIncluded") === "on";

  if (!id || !Number.isFinite(amount) || amount < 0) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase.from("enquiry_quotations").insert({
    enquiry_id: id,
    amount,
    currency,
    delivery_included: deliveryIncluded,
    valid_until: validUntil || null,
    notes: notes || null,
    created_by: user.id,
  });

  if (error) {
    console.error("Could not add quotation:", error.message);
    redirect(`/admin/enquiries/${id}?error=quotation`);
  }

  await supabase
    .from("enquiries")
    .update({
      quotation_total: amount,
      status: "quotation_discussed",
    })
    .eq("id", id);

  await supabase.from("enquiry_activity").insert({
    enquiry_id: id,
    actor_id: user.id,
    action: "quotation_added",
    detail: { amount, currency },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}

export async function assignEnquiryAction(formData: FormData) {
  const { user } = await requireAdmin("enquiries");
  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from("enquiries")
    .update({ assigned_to: user.id })
    .eq("id", id);

  if (error) {
    redirect(`/admin/enquiries/${id}?error=assign`);
  }

  await supabase.from("enquiry_activity").insert({
    enquiry_id: id,
    actor_id: user.id,
    action: "assigned",
    detail: { assigned_to: user.id },
  });

  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath("/admin/enquiries");
}

export async function updateFollowUpAction(formData: FormData) {
  const { user } = await requireAdmin("enquiries");
  const id = text(formData, "id");
  const followUpAt = text(formData, "followUpAt");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from("enquiries")
    .update({ follow_up_at: followUpAt || null })
    .eq("id", id);

  if (error) {
    redirect(`/admin/enquiries/${id}?error=follow-up`);
  }

  await supabase.from("enquiry_activity").insert({
    enquiry_id: id,
    actor_id: user.id,
    action: "follow_up_set",
    detail: { follow_up_at: followUpAt || null },
  });

  revalidatePath(`/admin/enquiries/${id}`);
}
