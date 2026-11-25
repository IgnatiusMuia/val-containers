import { NextResponse, type NextRequest } from "next/server";
import { safeAdminNext } from "@/lib/site-url";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  createRouteHandlerSupabaseClient,
  redirectWithCookies,
} from "@/lib/supabase/route";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeAdminNext(
    requestUrl.searchParams.get("next"),
    requestUrl.origin,
  );

  const loginRedirect = (error: string) =>
    NextResponse.redirect(
      new URL(`/admin/login?error=${error}`, requestUrl.origin),
    );

  if (!code) return loginRedirect("auth");

  const client = createRouteHandlerSupabaseClient(request);
  if (!client) return loginRedirect("config");

  const { data, error } = await client.supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return redirectWithCookies(loginRedirect("auth"), client.response);
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return redirectWithCookies(loginRedirect("config"), client.response);
  }

  const now = new Date().toISOString();
  const { data: account } = await admin
    .from("admin_users")
    .select("active, accepted_at")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!account?.active) {
    await client.supabase.auth.signOut();
    return redirectWithCookies(loginRedirect("not-admin"), client.response);
  }

  await admin
    .from("admin_users")
    .update({
      last_seen_at: now,
      ...(account.accepted_at ? {} : { accepted_at: now }),
    })
    .eq("user_id", data.user.id);

  return redirectWithCookies(
    NextResponse.redirect(new URL(next, requestUrl.origin)),
    client.response,
  );
}
