"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/config";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const env = getSupabaseEnv();
  if (!env) return null;

  browserClient = createBrowserClient(env.url, env.anonKey);
  return browserClient;
}
