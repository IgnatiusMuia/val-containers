"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import sharp from "sharp";
import { consumeAuthAttempt, rateLimitMessage } from "@/lib/auth-rate-limit";
import { getSiteSettings } from "@/lib/content";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { enquiryInputSchema } from "@/lib/validation/enquiry";
import { normalizePhone } from "@/lib/validation/phone";
import { waLink } from "@/lib/whatsapp";

export interface EnquiryActionState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  ok?: boolean;
  reference?: string;
  whatsappUrl?: string;
}

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const IMAGE_FORMATS = new Set(["jpeg", "png", "webp"]);

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function uploadPhoto(
  admin: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  enquiryId: string,
  file: File,
) {
  if (file.size === 0) return null;
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error("Photo is larger than 8 MB.");
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Use a JPEG, PNG or WebP photo.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const metadata = await sharp(buffer).metadata();
  if (!metadata.format || !IMAGE_FORMATS.has(metadata.format)) {
    throw new Error("That file is not a readable image.");
  }

  const extension =
    metadata.format === "jpeg" ? "jpg" : (metadata.format ?? "jpg");
  const path = `${enquiryId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await admin.storage
    .from("enquiry-media")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { error: attachmentError } = await admin
    .from("enquiry_attachments")
    .insert({
      enquiry_id: enquiryId,
      storage_path: path,
      file_name: file.name.slice(0, 180),
      mime_type: file.type,
      file_size: file.size,
    });

  if (attachmentError) {
    await admin.storage.from("enquiry-media").remove([path]);
    throw new Error(attachmentError.message);
  }

  return path;
}

export async function submitEnquiryAction(
  _previousState: EnquiryActionState,
  formData: FormData,
): Promise<EnquiryActionState> {
  const parsed = enquiryInputSchema.safeParse({
    name: readString(formData, "name"),
    phone: readString(formData, "phone"),
    email: readString(formData, "email"),
    company: readString(formData, "company"),
    preferredContact: readString(formData, "preferredContact"),
    containerId: readString(formData, "containerId"),
    quantity: readString(formData, "quantity") || "1",
    conditionPreference: readString(formData, "conditionPreference"),
    deliveryLocation: readString(formData, "deliveryLocation"),
    deliveryCounty: readString(formData, "deliveryCounty"),
    timeline: readString(formData, "timeline"),
    useCase: readString(formData, "useCase"),
    message: readString(formData, "message"),
    source: readString(formData, "source") || "website",
    pagePath: readString(formData, "pagePath"),
    website: readString(formData, "website"),
  });

  if (!parsed.success) {
    return {
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const values = parsed.data;
  const settings = await getSiteSettings();

  if (values.website) {
    return {
      ok: true,
      reference: "VC-E-PENDING",
      whatsappUrl: waLink(
        "Hi Val Containers, I have just submitted an enquiry through your website.",
        settings.whatsappNumber,
      ),
    };
  }

  const phoneDigits = normalizePhone(values.phone).replace(/\D/g, "");
  if (phoneDigits.length < 9) {
    return {
      error: "Add a valid phone number with a country code if possible.",
      fieldErrors: { phone: ["Add a valid phone number."] },
    };
  }

  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  const limit = await consumeAuthAttempt({
    key: `enquiry:${ip}`,
    limit: 5,
    windowSeconds: 60 * 60,
    blockSeconds: 60 * 60,
  });
  if (!limit.allowed) {
    return { error: rateLimitMessage(limit.retryAfter) };
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { error: "Enquiries are not configured yet. Please use WhatsApp." };
  }

  let snapshot: {
    id: string;
    name: string;
    slug: string;
    reference: string;
    type: string;
    size: string;
    condition_label: string | null;
  } | null = null;

  if (values.containerId) {
    const { data } = await admin
      .from("containers")
      .select("id, name, slug, reference, type, size, condition_label")
      .eq("id", values.containerId)
      .eq("publication_status", "published")
      .in("status", ["available", "reserved", "inspection"])
      .maybeSingle();
    snapshot = data ?? null;
  }

  const userAgent = requestHeaders.get("user-agent")?.slice(0, 300) ?? null;
  const source = values.source.slice(0, 80) || "website";
  const pagePath = values.pagePath.slice(0, 300) || null;

  const { data: enquiry, error } = await admin
    .from("enquiries")
    .insert({
      customer_name: values.name,
      phone: values.phone,
      email: values.email || null,
      company: values.company || null,
      preferred_contact: values.preferredContact,
      container_id: snapshot?.id ?? null,
      container_name: snapshot?.name ?? null,
      container_slug: snapshot?.slug ?? null,
      container_reference: snapshot?.reference ?? null,
      container_type: snapshot?.type ?? null,
      container_size: snapshot?.size ?? null,
      condition_preference:
        values.conditionPreference || snapshot?.condition_label || null,
      quantity: values.quantity,
      delivery_location: values.deliveryLocation || null,
      delivery_county: values.deliveryCounty || null,
      timeline: values.timeline || null,
      use_case: values.useCase || null,
      message: values.message,
      source,
      page_path: pagePath,
      user_agent: userAgent,
      status: "new",
      metadata: {
        form_version: "enquiry-v1",
      },
    })
    .select("id, reference")
    .single();

  if (error || !enquiry) {
    console.error("Could not save enquiry:", error?.message);
    return {
      error:
        "We could not save the enquiry. Please try again or message us on WhatsApp.",
    };
  }

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      await uploadPhoto(admin, enquiry.id, photo);
    } catch (cause) {
      console.error(
        "Enquiry saved but photo upload failed:",
        cause instanceof Error ? cause.message : cause,
      );
    }
  }

  const lines = [
    `Hi Val Containers, I submitted an enquiry (${enquiry.reference}).`,
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    values.email ? `Email: ${values.email}` : "",
    snapshot ? `Container: ${snapshot.name} (${snapshot.reference})` : "",
    values.quantity > 1 ? `Quantity: ${values.quantity}` : "",
    values.deliveryLocation
      ? `Delivery: ${values.deliveryLocation}${values.deliveryCounty ? `, ${values.deliveryCounty}` : ""}`
      : "",
    values.timeline ? `Timeline: ${values.timeline}` : "",
    values.useCase ? `Use: ${values.useCase}` : "",
    "",
    values.message,
  ].filter((line) => line !== "");

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");

  return {
    ok: true,
    reference: enquiry.reference,
    whatsappUrl: waLink(lines.join("\n"), settings.whatsappNumber),
  };
}
