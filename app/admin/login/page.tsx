import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "./LoginForm";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink">
      <div className="wrap flex min-h-svh flex-col justify-center py-16">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="inline-flex text-bone">
            <Logo />
          </Link>

          <p className="eyebrow mt-10 text-ember">Yard admin</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Sign in<span className="text-ember">.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-bone/50">
            Manage listings, photos and enquiries. Access is limited to the
            owner allowlist in Supabase.
          </p>

          {error === "not-admin" ? (
            <p className="mt-6 border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              That account is not on the admin allowlist.
            </p>
          ) : null}

          {error === "auth" ? (
            <p className="mt-6 border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              The sign-in link expired or was already used. Request a new one.
            </p>
          ) : null}

          <div className="mt-8">
            <LoginForm configured={isSupabaseConfigured} />
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex font-mono text-[10px] uppercase tracking-[0.18em] text-bone/35 transition-colors hover:text-bone"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
