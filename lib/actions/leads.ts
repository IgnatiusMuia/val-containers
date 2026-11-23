"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  leadInputSchema,
  leadStatuses,
  normalizePhone,
  type LeadStatus,
} from "@/lib/validation/lead";

export type LeadActionResult = {
  ok?: boolean;
  error?: string;
};

export async function saveLeadAction(
  input: unknown,
): Promise<LeadActionResult> {
  const parsed = leadInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid lead details." };

  const values = parsed.data;
  if (values.website) return { ok: true };

  if (values.name.trim().length < 2) {
    return { ok: false, error: "Add your name." };
  }

  const digits = normalizePhone(values.phone).replace(/\D/g, "");
  if (digits.length < 9) {
    return { ok: false, error: "Add a valid phone number." };
  }

  if (JSON.stringify(values.metadata).length > 4000) {
    return { ok: false, error: "Lead details are too long." };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, error: "Lead saving is not configured." };
  }

  let containerId: string | null = null;
  if (values.containerSlug) {
    const { data } = await supabase
      .from("containers")
      .select("id")
      .eq("slug", values.containerSlug)
      .maybeSingle();
    containerId = data?.id ?? null;
  }

  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 300) ?? null;

  const { error } = await supabase.from("leads").insert({
    name: values.name,
    phone: values.phone,
    email: values.email || null,
    message: values.message || null,
    interest: values.interest || null,
    container_id: containerId,
    source: values.source || "site",
    page_path: values.pagePath || null,
    status: "new",
    metadata: {
      ...values.metadata,
      container_slug: values.containerSlug || null,
      user_agent: userAgent,
    },
  });

  if (error) {
    return { ok: false, error: "Could not save the enquiry." };
  }

  return { ok: true };
}

export async function updateLeadStatusAction(
  leadId: string,
  status: LeadStatus,
): Promise<LeadActionResult> {
  await requireAdmin();

  if (!leadStatuses.includes(status)) {
    return { ok: false, error: "Invalid lead status." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured." };

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}
