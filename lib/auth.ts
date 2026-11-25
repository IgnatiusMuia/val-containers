import "server-only";

import { redirect } from "next/navigation";
import { ADMIN_IDLE_SECONDS } from "@/lib/auth-constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminPermission } from "@/lib/permissions";

export interface AdminAccount {
  userId: string;
  role: "owner" | "admin";
  displayName: string | null;
  active: boolean;
  permissions: AdminPermission[];
}

interface AdminSessionRow {
  active: boolean;
  expired: boolean;
  role: string | null;
  display_name: string | null;
  permissions: string[] | null;
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

async function getAdminSession() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { user: null, account: null, expired: false, configError: true };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, account: null, expired: false, configError: false };
  }

  const { data, error } = await supabase.rpc("touch_admin_session", {
    p_idle_seconds: ADMIN_IDLE_SECONDS,
  });

  if (error) {
    console.error("Could not check admin session:", error.message);
    return { user, account: null, expired: false, configError: true };
  }

  const row = (Array.isArray(data) ? data[0] : data) as
    | AdminSessionRow
    | null
    | undefined;

  if (!row || !row.active) {
    return {
      user,
      account: null,
      expired: Boolean(row?.expired),
      configError: false,
    };
  }

  const account: AdminAccount = {
    userId: user.id,
    role: row.role === "owner" ? "owner" : "admin",
    displayName: row.display_name ?? null,
    active: true,
    permissions: (row.permissions ?? []) as AdminPermission[],
  };

  return { user, account, expired: false, configError: false };
}

export async function requireAdmin(permission?: AdminPermission) {
  const session = await getAdminSession();

  if (session.configError) {
    redirect("/admin/login?error=config");
  }

  if (!session.user) {
    redirect("/admin/login");
  }

  if (!session.account) {
    redirect(
      session.expired ? "/admin/login?error=expired" : "/admin/login?error=not-admin",
    );
  }

  if (
    permission &&
    session.account.role !== "owner" &&
    !session.account.permissions.includes(permission)
  ) {
    redirect("/admin?error=forbidden");
  }

  return { user: session.user, account: session.account, ...session.account };
}

export async function requireOwner() {
  const context = await requireAdmin();
  if (context.account.role !== "owner") {
    redirect("/admin?error=owner-only");
  }
  return context;
}
