import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_ACTIVITY_COOKIE,
  ADMIN_IDLE_SECONDS,
  adminActivityCookieOptions,
} from "@/lib/auth-constants";
import { getSupabaseEnv } from "@/lib/supabase/config";

const publicAdminRoutes = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

function loginRedirect(request: NextRequest, error?: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = error ? `?error=${error}` : "";
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicAdminRoute = publicAdminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const needsAdmin = isAdminRoute && !isPublicAdminRoute;
  const env = getSupabaseEnv();

  if (!env) {
    if (needsAdmin) return loginRedirect(request);
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  if (needsAdmin) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return loginRedirect(request);

    const lastActivity = Number(
      request.cookies.get(ADMIN_ACTIVITY_COOKIE)?.value ?? 0,
    );
    if (lastActivity && Date.now() - lastActivity > ADMIN_IDLE_SECONDS * 1000) {
      return loginRedirect(request, "expired");
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("active", true)
      .maybeSingle();

    if (!adminUser) return loginRedirect(request, "not-admin");

    response.cookies.set(
      ADMIN_ACTIVITY_COOKIE,
      String(Date.now()),
      adminActivityCookieOptions,
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
