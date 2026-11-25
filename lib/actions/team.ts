"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { ADMIN_PERMISSIONS, type AdminPermission } from "@/lib/permissions";
import { canonicalSiteUrl } from "@/lib/site-url";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const TEAM_PATH = "/admin/settings/team";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function fail(code: string): never {
  redirect(`${TEAM_PATH}?error=${code}`);
}

function done(code: string): never {
  revalidatePath(TEAM_PATH);
  redirect(`${TEAM_PATH}?saved=${code}`);
}

function readPermissions(formData: FormData): AdminPermission[] {
  const selected = new Set(formData.getAll("permissions").map(String));
  return ADMIN_PERMISSIONS.filter((permission) => selected.has(permission));
}

function readRole(formData: FormData): "owner" | "admin" {
  return text(formData, "role") === "owner" ? "owner" : "admin";
}

function isEmail(value: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

async function findUserByEmail(
  admin: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  email: string,
) {
  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) return { user: null, error: error.message };
  const user = data.users.find(
    (candidate) => candidate.email?.toLowerCase() === email,
  );
  return { user: user ?? null, error: null };
}

async function ownerCount(excludeUserId?: string) {
  const admin = createSupabaseAdminClient();
  if (!admin) return 0;
  const { count } = await admin
    .from("admin_users")
    .select("user_id", { count: "exact", head: true })
    .eq("role", "owner")
    .eq("active", true)
    .neq("user_id", excludeUserId ?? "00000000-0000-0000-0000-000000000000");
  return count ?? 0;
}

export async function inviteTeamMemberAction(formData: FormData) {
  await requireOwner();

  const email = text(formData, "email").toLowerCase();
  const displayName = text(formData, "displayName") || null;
  const role = readRole(formData);
  const permissions = role === "owner" ? [...ADMIN_PERMISSIONS] : readPermissions(formData);

  if (!isEmail(email)) fail("invalid-email");

  const admin = createSupabaseAdminClient();
  if (!admin) fail("config");

  const origin = canonicalSiteUrl();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/admin/reset-password`,
    data: displayName ? { display_name: displayName } : undefined,
  });

  if (error || !data.user) {
    console.error("Could not invite team member:", error?.message);
    fail(
      error?.message.toLowerCase().includes("already")
        ? "existing-user"
        : "invite-failed",
    );
  }

  const now = new Date().toISOString();
  const { error: allowlistError } = await admin.from("admin_users").upsert(
    {
      user_id: data.user.id,
      role,
      display_name: displayName,
      permissions,
      active: true,
      invited_at: now,
    },
    { onConflict: "user_id" },
  );

  if (allowlistError) {
    console.error("Could not allowlist invited member:", allowlistError.message);
    fail("allowlist-failed");
  }

  done("invited");
}

export async function grantTeamAccessAction(formData: FormData) {
  const { user: actor } = await requireOwner();

  const email = text(formData, "email").toLowerCase();
  const displayName = text(formData, "displayName") || null;
  const role = readRole(formData);
  const permissions = role === "owner" ? [...ADMIN_PERMISSIONS] : readPermissions(formData);

  if (!isEmail(email)) fail("invalid-email");

  const admin = createSupabaseAdminClient();
  if (!admin) fail("config");

  const { user: target, error } = await findUserByEmail(admin, email);
  if (error) {
    console.error("Could not look up team member:", error);
    fail("lookup-failed");
  }
  if (!target) fail("no-user");

  const { data: existing, error: existingError } = await admin
    .from("admin_users")
    .select("role, active")
    .eq("user_id", target.id)
    .maybeSingle();

  if (existingError) fail("lookup-failed");
  if (target.id === actor.id && role !== "owner") {
    fail("self-lockout");
  }
  const demotingOwner =
    existing?.role === "owner" && existing.active && role !== "owner";
  if (demotingOwner && (await ownerCount(target.id)) === 0) {
    fail("last-owner");
  }

  const { error: allowlistError } = await admin.from("admin_users").upsert(
    {
      user_id: target.id,
      role,
      display_name: displayName,
      permissions,
      active: true,
      invited_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (allowlistError) {
    console.error("Could not grant access:", allowlistError.message);
    fail("allowlist-failed");
  }

  done("granted");
}

export async function updateTeamMemberAction(formData: FormData) {
  const { user: actor } = await requireOwner();

  const userId = text(formData, "userId");
  const displayName = text(formData, "displayName") || null;
  const role = readRole(formData);
  const active = formData.get("active") === "on";
  const permissions = role === "owner" ? [...ADMIN_PERMISSIONS] : readPermissions(formData);

  if (!userId) fail("missing-user");

  const admin = createSupabaseAdminClient();
  if (!admin) fail("config");

  const { data: target, error } = await admin
    .from("admin_users")
    .select("user_id, role, active")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !target) fail("missing-user");

  if (userId === actor.id && (!active || role !== "owner")) {
    fail("self-lockout");
  }

  const removingOwner = target.role === "owner" && (role !== "owner" || !active);
  if (removingOwner && (await ownerCount(userId)) === 0) {
    fail("last-owner");
  }

  const { error: updateError } = await admin
    .from("admin_users")
    .update({
      role,
      display_name: displayName,
      permissions,
      active,
    })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Could not update team member:", updateError.message);
    fail("update-failed");
  }

  done("updated");
}

export async function resendTeamInviteAction(formData: FormData) {
  await requireOwner();

  const userId = text(formData, "userId");
  if (!userId) fail("missing-user");

  const admin = createSupabaseAdminClient();
  if (!admin) fail("config");

  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user?.email) fail("missing-user");

  const origin = canonicalSiteUrl();
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    data.user.email,
    {
      redirectTo: `${origin}/auth/callback?next=/admin/reset-password`,
    },
  );

  if (inviteError) {
    console.error("Could not resend invite:", inviteError.message);
    fail("invite-failed");
  }

  await admin
    .from("admin_users")
    .update({ invited_at: new Date().toISOString() })
    .eq("user_id", userId);

  done("resent");
}

export async function removeTeamMemberAction(formData: FormData) {
  const { user: actor } = await requireOwner();

  const userId = text(formData, "userId");
  if (!userId) fail("missing-user");
  if (userId === actor.id) fail("self-lockout");

  const admin = createSupabaseAdminClient();
  if (!admin) fail("config");

  const { data: target } = await admin
    .from("admin_users")
    .select("role, active")
    .eq("user_id", userId)
    .maybeSingle();

  if (!target) fail("missing-user");

  if (target.role === "owner" && target.active && (await ownerCount(userId)) === 0) {
    fail("last-owner");
  }

  const { error } = await admin
    .from("admin_users")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Could not remove team member:", error.message);
    fail("delete-failed");
  }

  done("removed");
}

export async function sendMemberPasswordResetAction(formData: FormData) {
  await requireOwner();

  const userId = text(formData, "userId");
  if (!userId) fail("missing-user");

  const admin = createSupabaseAdminClient();
  if (!admin) fail("config");

  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user?.email) fail("missing-user");

  const supabase = await createSupabaseServerClient();
  if (!supabase) fail("config");

  const origin = canonicalSiteUrl();
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    data.user.email,
    {
      redirectTo: `${origin}/auth/callback?next=/admin/reset-password`,
    },
  );

  if (resetError) {
    console.error("Could not send password reset:", resetError.message);
    fail("reset-failed");
  }

  done("reset-sent");
}
