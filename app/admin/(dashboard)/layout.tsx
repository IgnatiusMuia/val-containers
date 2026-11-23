import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  const { user, role } = await requireAdmin();

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink">
      <header className="sticky top-0 z-10 border-b border-bone/10 bg-ink/95 backdrop-blur-xl">
        <div className="wrap flex h-16 items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-bone">
              <Logo compact />
            </Link>
            <span className="hidden h-5 w-px bg-bone/15 sm:block" aria-hidden="true" />
            <nav className="hidden items-center gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/40 sm:flex">
              <Link href="/admin" className="transition-colors hover:text-bone">
                Overview
              </Link>
              <Link
                href="/admin/containers"
                className="transition-colors hover:text-bone"
              >
                Listings
              </Link>
              <Link
                href="/admin/leads"
                className="transition-colors hover:text-bone"
              >
                Enquiries
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-bone/70">{user.email}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-bone/35">
                {role}
              </p>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="border border-bone/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/55 transition-colors hover:border-bone/35 hover:text-bone"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="wrap py-8 sm:py-10">{children}</div>
    </div>
  );
}
