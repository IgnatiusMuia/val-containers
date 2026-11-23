import type { Metadata } from "next";
import type { ReactNode } from "react";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

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
  const { user, account } = await requireAdmin();

  return (
    <AdminShell
      email={user.email ?? "admin"}
      displayName={account.displayName}
      role={account.role}
      permissions={account.permissions}
    >
      {children}
    </AdminShell>
  );
}
