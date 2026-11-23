import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(file: string) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const email = process.argv[2]?.trim();
const role = process.argv[3]?.trim() || "owner";

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local first.",
  );
  process.exit(1);
}

if (!email) {
  console.error("Usage: npm run admin:invite -- owner@example.com [owner|admin]");
  process.exit(1);
}

if (role !== "owner" && role !== "admin") {
  console.error("Role must be owner or admin.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserIdByEmail(target: string) {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw error;
    const user = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === target.toLowerCase(),
    );
    if (user) return user.id;
    if (data.users.length < 1000) return null;
  }
  return null;
}

async function main() {
  let userId = await findUserIdByEmail(email);

  if (!userId) {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/admin`,
    });

    if (error) {
      throw new Error(
        `${error.message}\nCreate the user in Supabase Authentication → Users, then rerun this script.`,
      );
    }

    userId = data.user?.id ?? null;
  }

  if (!userId) {
    throw new Error("Could not resolve the auth user id.");
  }

  const { error } = await supabase
    .from("admin_users")
    .upsert({ user_id: userId, role }, { onConflict: "user_id" });

  if (error) throw error;

  console.log(`Admin allowlist updated: ${email} (${role}).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
