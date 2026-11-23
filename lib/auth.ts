import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACTIVITY_COOKIE, ADMIN_IDLE_SECONDS } from "@/lib/auth-constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminPermission } from "@/lib/permissions";

export interface AdminAccount {
  userId: string;
  role: "owner" | "admin";
  displayName: string | null;
  active: boolean;
  permissions: AdminPermission[];
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getAdminAccount(userId: string): Promise<AdminAccount | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("admin_users")
    .select("role, display_name, active, permissions")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data || !data.active) return null;

  return {
    userId,
    role: data.role === "owner" ? "owner" : "admin",
    displayName: data.display_name ?? null,
    active: data.active,
    permissions: (data.permissions ?? []) as AdminPermission[],
  };
}

export async function requireAdmin(permission?: AdminPermission) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const cookieStore = await cookies();
  const activity = Number(cookieStore.get(ADMIN_ACTIVITY_COOKIE)?.value ?? 0);
  // The proxy sets this cookie on the response. A missing cookie means this is
  // the first admin request after sign-in, so only reject an expired one.
  if (activity && Date.now() - activity > ADMIN_IDLE_SECONDS * 1000) {
    redirect("/admin/login?error=expired");
  }

  const account = await getAdminAccount(user.id);
  if (!account) {
    redirect("/admin/login?error=not-admin");
  }

  if (
    permission &&
    account.role !== "owner" &&
    !account.permissions.includes(permission)
  ) {
    redirect("/admin?error=forbidden");
  }

  return { user, account, ...account };
}

export async function requireOwner() {
  const context = await requireAdmin();
  if (context.account.role !== "owner") {
    redirect("/admin?error=owner-only");
  }
  return context;
}
