import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/config";

let publicClient: ReturnType<typeof createClient> | null = null;

export function createSupabasePublicClient() {
  if (publicClient) return publicClient;

  const env = getSupabaseEnv();
  if (!env) return null;

  publicClient = createClient(env.url, env.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return publicClient;
}
