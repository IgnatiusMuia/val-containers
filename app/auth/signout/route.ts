import { NextResponse, type NextRequest } from "next/server";
import {
  createRouteHandlerSupabaseClient,
  redirectWithCookies,
} from "@/lib/supabase/route";

export async function POST(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);
  const client = createRouteHandlerSupabaseClient(request);

  if (!client) {
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  await client.supabase.auth.signOut();

  return redirectWithCookies(
    NextResponse.redirect(loginUrl, { status: 303 }),
    client.response,
  );
}
