"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { AdminPermission } from "@/lib/permissions";
import { cn } from "@/lib/format";
import { Icon, type IconName } from "@/components/ui/Icons";

interface AdminShellProps {
  email: string;
  displayName: string | null;
  role: "owner" | "admin";
  permissions: AdminPermission[];
  children: ReactNode;
}

const navItems: {
  href: string;
  label: string;
  icon: IconName;
  permission?: AdminPermission;
  ownerOnly?: boolean;
}[] = [
  { href: "/admin", label: "Overview", icon: "home" },
  {
    href: "/admin/containers",
    label: "Inventory",
    icon: "boxes",
    permission: "inventory",
  },
  {
    href: "/admin/enquiries",
    label: "Enquiries",
    icon: "mail",
    permission: "enquiries",
  },
  {
    href: "/admin/media",
    label: "Media",
    icon: "file",
    permission: "media",
  },
  {
    href: "/admin/content",
    label: "Content",
    icon: "desk",
    permission: "content",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: "sliders",
    ownerOnly: true,
  },
  {
    href: "/admin/settings/team",
    label: "Team",
    icon: "shield",
    ownerOnly: true,
  },
];

export function AdminShell({
  email,
  displayName,
  role,
  permissions,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const allowed = navItems.filter((item) => {
    if (item.ownerOnly) return role === "owner";
    if (!item.permission) return true;
    return role === "owner" || permissions.includes(item.permission);
  });

  const isActive = (href: string) =>
    href === "/admin" || href === "/admin/settings"
      ? pathname === href
      : pathname.startsWith(href);

  const sidebar = (
    <div className="flex h-full flex-col bg-coal">
      <div className="flex h-16 items-center justify-between border-b border-bone/10 px-5">
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className="font-display text-lg font-bold tracking-[-0.03em] text-bone"
        >
          VAL<span className="text-ember">.</span>
          <span className="ml-2 font-mono text-[9px] font-normal uppercase tracking-[0.18em] text-bone/35">
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="grid h-8 w-8 place-items-center text-bone/50 lg:hidden"
          aria-label="Close menu"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-2 font-mono text-[8px] uppercase tracking-[0.18em] text-bone/25">
          Yard operations
        </p>
        <ul className="mt-3 space-y-1">
          {allowed.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 border-l-2 px-3 py-2.5 text-[13px] transition-colors",
                  isActive(item.href)
                    ? "border-ember bg-bone/5 text-bone"
                    : "border-transparent text-bone/50 hover:bg-bone/5 hover:text-bone",
                )}
              >
                <Icon
                  name={item.icon}
                  className={cn(
                    "h-4 w-4",
                    isActive(item.href) ? "text-ember" : "text-bone/30",
                  )}
                />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-bone/10 pt-5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 text-[11px] text-bone/35 transition-colors hover:text-bone"
          >
            <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
            View public site
          </Link>
        </div>
      </nav>

      <div className="border-t border-bone/10 p-4">
        <p className="truncate text-[12px] text-bone/70">
          {displayName || email}
        </p>
        <p className="mt-0.5 truncate font-mono text-[8px] uppercase tracking-[0.16em] text-bone/30">
          {role} · {email}
        </p>
        <form action="/auth/signout" method="post" className="mt-3">
          <button
            type="submit"
            className="w-full border border-bone/15 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-bone/50 transition-colors hover:border-bone/35 hover:text-bone"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex bg-ink">
      <aside className="hidden w-60 shrink-0 border-r border-bone/10 lg:block">
        {sidebar}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />
          <aside className="relative h-full w-[78%] max-w-72 border-r border-bone/10 shadow-2xl">
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-bone/10 bg-ink px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center border border-bone/15 text-bone/60 lg:hidden"
              aria-label="Open menu"
            >
              <Icon name="menu" className="h-4 w-4" />
            </button>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-bone/30">
              Val Containers · Yard admin
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-bone/30 sm:inline">
              {role}
            </span>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 border border-bone/15 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/45 transition-colors hover:border-bone/35 hover:text-bone"
            >
              Site
              <Icon name="arrow-up-right" className="h-3 w-3" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
