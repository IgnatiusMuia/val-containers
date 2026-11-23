import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ResetPasswordForm } from "../forgot-password/ForgotPasswordForm";

export const instant = false;

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink">
      <div className="wrap flex min-h-svh flex-col justify-center py-16">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="inline-flex text-bone">
            <Logo />
          </Link>
          <p className="eyebrow mt-10 text-ember">Yard admin</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            New password<span className="text-ember">.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-bone/50">
            Choose a password with at least 8 characters. You will be signed in
            when it is saved.
          </p>
          <div className="mt-8">
            <ResetPasswordForm />
          </div>
          <Link
            href="/admin/forgot-password"
            className="mt-6 inline-flex text-[11px] text-bone/40 transition-colors hover:text-bone"
          >
            Request a new link
          </Link>
        </div>
      </div>
    </div>
  );
}
