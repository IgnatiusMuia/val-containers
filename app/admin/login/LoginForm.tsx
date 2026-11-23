"use client";

import Link from "next/link";
import { useActionState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import {
  loginAction,
  magicLinkAction,
  type AuthActionState,
} from "@/lib/actions/auth";

const inputClass =
  "h-12 w-full border border-bone/15 bg-coal px-3 text-sm text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none";

const initialState: AuthActionState = {};

export function LoginForm({ configured }: { configured: boolean }) {
  const [loginState, login, loginPending] = useActionState(
    loginAction,
    initialState,
  );
  const [magicState, magic, magicPending] = useActionState(
    magicLinkAction,
    initialState,
  );

  if (!configured) {
    return (
      <div className="border border-ember/25 bg-ember/5 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember">
          Setup required
        </p>
        <p className="mt-3 text-sm leading-relaxed text-bone/60">
          Add{" "}
          <code className="font-mono text-bone/80">
            NEXT_PUBLIC_SUPABASE_URL
          </code>
          ,{" "}
          <code className="font-mono text-bone/80">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          (or{" "}
          <code className="font-mono text-bone/80">
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
          </code>
          ) and{" "}
          <code className="font-mono text-bone/80">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          (or{" "}
          <code className="font-mono text-bone/80">SUPABASE_SECRET_KEY</code>)
          {" "}
          to the environment, then run the migration in{" "}
          <code className="font-mono text-bone/80">supabase/migrations</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <form action={login} className="space-y-4">
        <div>
          <label
            htmlFor="admin-email"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-bone/45"
          >
            Email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <label
              htmlFor="admin-password"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/45"
            >
              Password
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-[11px] text-bone/40 transition-colors hover:text-bone"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </div>

        {loginState.error ? (
          <p
            role="alert"
            className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          >
            {loginState.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loginPending}
          className={buttonStyles({ className: "w-full" })}
        >
          {loginPending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-bone/10" />
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-bone/30">
          or
        </span>
        <span className="h-px flex-1 bg-bone/10" />
      </div>

      <form action={magic} className="space-y-3">
        <label
          htmlFor="magic-email"
          className="block font-mono text-[10px] uppercase tracking-[0.18em] text-bone/45"
        >
          Email sign-in link
        </label>
        <input
          id="magic-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Use the same admin email"
          className={inputClass}
        />
        {magicState.error ? (
          <p
            role="alert"
            className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          >
            {magicState.error}
          </p>
        ) : null}
        {magicState.message ? (
          <p className="border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {magicState.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={magicPending}
          className={buttonStyles({
            variant: "outline",
            className: "w-full",
          })}
        >
          {magicPending ? "Sending…" : "Email me a sign-in link"}
        </button>
      </form>
    </div>
  );
}
