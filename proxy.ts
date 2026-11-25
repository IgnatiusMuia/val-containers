import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_IDLE_SECONDS } from "@/lib/auth-constants";
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

function withCookies(redirect: NextResponse, response: NextResponse) {
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
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
    if (needsAdmin) return loginRedirect(request, "config");
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
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

    if (!user) return withCookies(loginRedirect(request), response);

    const { data, error } = await supabase.rpc("touch_admin_session", {
      p_idle_seconds: ADMIN_IDLE_SECONDS,
    });

    if (error) {
      console.error("Could not check admin session:", error.message);
      return withCookies(loginRedirect(request, "config"), response);
    }

    const session = (Array.isArray(data) ? data[0] : data) as
      | { active?: boolean; expired?: boolean }
      | null
      | undefined;

    if (!session?.active) {
      return withCookies(
        loginRedirect(request, session?.expired ? "expired" : "not-admin"),
        response,
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
