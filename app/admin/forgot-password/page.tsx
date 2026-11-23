import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const instant = false;

export const metadata: Metadata = {
  title: "Reset admin password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink">
      <div className="wrap flex min-h-svh flex-col justify-center py-16">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="inline-flex text-bone">
            <Logo />
          </Link>
          <p className="eyebrow mt-10 text-ember">Yard admin</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Reset password<span className="text-ember">.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-bone/50">
            Enter the admin email. If the account exists, Supabase will send a
            secure reset link.
          </p>
          <div className="mt-8">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
