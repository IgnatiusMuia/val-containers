"use server";

import { redirect } from "next/navigation";
import {
  consumeAuthAttempt,
  rateLimitMessage,
  requestFingerprint,
  resetAuthAttempt,
} from "@/lib/auth-rate-limit";
import { canonicalSiteUrl } from "@/lib/site-url";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthActionState {
  error?: string;
  message?: string;
}

function readEmail(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readEmail(formData.get("email"));
  const password =
    typeof formData.get("password") === "string"
      ? String(formData.get("password"))
      : "";

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Admin sign-in is not configured yet." };
  }

  const fingerprint = await requestFingerprint(email);
  const rateLimitKey = `password:${fingerprint}`;
  const limit = await consumeAuthAttempt({ key: rateLimitKey });
  if (!limit.allowed) {
    return { error: rateLimitMessage(limit.retryAfter) };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Email or password is incorrect." };
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "Admin sign-in is not configured yet." };
  }

  const { data: account } = await admin
    .from("admin_users")
    .select("user_id, active, accepted_at")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!account?.active) {
    await supabase.auth.signOut();
    return { error: "Email or password is incorrect." };
  }

  const now = new Date().toISOString();
  await admin
    .from("admin_users")
    .update({
      last_seen_at: now,
      ...(account.accepted_at ? {} : { accepted_at: now }),
    })
    .eq("user_id", data.user.id);

  await resetAuthAttempt(rateLimitKey);

  redirect("/admin");
}

export async function magicLinkAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readEmail(formData.get("email"));
  if (!email) return { error: "Enter your email address first." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Admin sign-in is not configured yet." };

  const fingerprint = await requestFingerprint(email);
  const limit = await consumeAuthAttempt({
    key: `magic:${fingerprint}`,
    limit: 4,
    windowSeconds: 20 * 60,
    blockSeconds: 20 * 60,
  });
  if (!limit.allowed) {
    return { error: rateLimitMessage(limit.retryAfter) };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${canonicalSiteUrl()}/auth/callback?next=/admin`,
    },
  });

  if (error) {
    console.error("Could not send admin magic link:", error.message);
  }

  return {
    message:
      "If that email has admin access, a sign-in link is on its way. Check spam too.",
  };
}

export async function forgotPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readEmail(formData.get("email"));
  if (!email) return { error: "Enter your email address." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Admin sign-in is not configured yet." };

  const fingerprint = await requestFingerprint(email);
  const limit = await consumeAuthAttempt({
    key: `reset:${fingerprint}`,
    limit: 4,
    windowSeconds: 20 * 60,
    blockSeconds: 20 * 60,
  });
  if (!limit.allowed) {
    return { error: rateLimitMessage(limit.retryAfter) };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${canonicalSiteUrl()}/auth/callback?next=/admin/reset-password`,
  });

  if (error) {
    console.error("Could not send password reset:", error.message);
  }

  return {
    message:
      "If that email has admin access, a password reset link is on its way. Check spam too.",
  };
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password =
    typeof formData.get("password") === "string"
      ? String(formData.get("password"))
      : "";
  const confirm =
    typeof formData.get("confirmPassword") === "string"
      ? String(formData.get("confirmPassword"))
      : "";

  if (password.length < 8) {
    return { error: "Use at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "The passwords do not match." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Admin sign-in is not configured yet." };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "That reset link has expired. Request a new one." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "Could not update the password. Request a new link." };
  }

  redirect("/admin?reset=1");
}
