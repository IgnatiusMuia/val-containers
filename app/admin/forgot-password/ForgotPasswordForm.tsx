"use client";

import Link from "next/link";
import { useActionState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import {
  forgotPasswordAction,
  resetPasswordAction,
  type AuthActionState,
} from "@/lib/actions/auth";

const inputClass =
  "h-12 w-full border border-bone/15 bg-coal px-3 text-sm text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none";

const initialState: AuthActionState = {};

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    forgotPasswordAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <label
          htmlFor="forgot-email"
          className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-bone/45"
        >
          Admin email
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>
      {state.error ? (
        <p className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p className="border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={buttonStyles({ className: "w-full" })}
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
      <Link
        href="/admin/login"
        className="block text-center text-[11px] text-bone/40 transition-colors hover:text-bone"
      >
        Back to sign in
      </Link>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <label
          htmlFor="new-password"
          className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-bone/45"
        >
          New password
        </label>
        <input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="confirm-password"
          className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-bone/45"
        >
          Confirm password
        </label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>
      {state.error ? (
        <p className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={buttonStyles({ className: "w-full" })}
      >
        {pending ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
