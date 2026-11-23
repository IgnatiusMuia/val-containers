import { NextResponse } from "next/server";
import {
  ADMIN_ACTIVITY_COOKIE,
  adminActivityCookieOptions,
} from "@/lib/auth-constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const rawNext = requestUrl.searchParams.get("next") ?? "/admin";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/admin";

  if (code) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const user = data.user;
        const admin = createSupabaseAdminClient();
        let activeAccount = false;

        if (user && admin) {
          const now = new Date().toISOString();
          const { data: account } = await admin
            .from("admin_users")
            .select("active, accepted_at")
            .eq("user_id", user.id)
            .maybeSingle();

          activeAccount = Boolean(account?.active);

          if (account?.active) {
            await admin
              .from("admin_users")
              .update({
                last_seen_at: now,
                ...(account.accepted_at ? {} : { accepted_at: now }),
              })
              .eq("user_id", user.id);
          }
        }

        const destination = NextResponse.redirect(
          new URL(next, requestUrl.origin),
        );

        if (activeAccount) {
          destination.cookies.set(
            ADMIN_ACTIVITY_COOKIE,
            String(Date.now()),
            adminActivityCookieOptions,
          );
        }

        return destination;
      }
    }
  }

  return NextResponse.redirect(
    new URL("/admin/login?error=auth", requestUrl.origin),
  );
}
