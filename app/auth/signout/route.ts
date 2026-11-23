import { NextResponse } from "next/server";
import { ADMIN_ACTIVITY_COOKIE } from "@/lib/auth-constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  const response = NextResponse.redirect(
    new URL("/admin/login", request.url),
    { status: 303 },
  );
  response.cookies.set(ADMIN_ACTIVITY_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
