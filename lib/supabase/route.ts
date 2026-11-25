import "server-only";

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/config";

export function createRouteHandlerSupabaseClient(request: NextRequest) {
  const env = getSupabaseEnv();
  if (!env) return null;

  const response = NextResponse.next();
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
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  return { supabase, response };
}

export function redirectWithCookies(
  destination: NextResponse,
  source: NextResponse,
) {
  source.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
  return destination;
}
