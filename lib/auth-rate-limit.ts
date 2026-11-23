import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function requestFingerprint(identifier: string) {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for") ?? "";
  const ip =
    forwarded.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  const hash = createHash("sha256")
    .update(`${identifier.trim().toLowerCase()}|${ip}`)
    .digest("hex")
    .slice(0, 40);
  return hash;
}

export async function consumeAuthAttempt(input: {
  key: string;
  limit?: number;
  windowSeconds?: number;
  blockSeconds?: number;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { allowed: false, retryAfter: 60 };

  const { data, error } = await supabase.rpc("consume_auth_attempt", {
    p_key: input.key,
    p_limit: input.limit ?? 6,
    p_window_seconds: input.windowSeconds ?? 15 * 60,
    p_block_seconds: input.blockSeconds ?? 15 * 60,
  });

  if (error) {
    console.error("Could not check auth rate limit:", error.message);
    return { allowed: false, retryAfter: 60 };
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    allowed: Boolean(row?.allowed),
    retryAfter: Number(row?.retry_after ?? 60),
  };
}

export function rateLimitMessage(retryAfter: number) {
  const minutes = Math.max(1, Math.ceil(retryAfter / 60));
  return `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}
