"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { buttonStyles } from "@/components/ui/Button";

const inputClass =
  "h-12 w-full border border-bone/15 bg-coal px-3 text-sm text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"password" | "magic" | null>(null);

  async function signInWithPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    setPending("password");
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setPending(null);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function sendMagicLink() {
    setError(null);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (!email) {
      setError("Enter your email address first.");
      return;
    }

    setPending("magic");
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });
    setPending(null);

    if (authError) {
      setError(authError.message);
      return;
    }

    setMessage("Check your inbox for the sign-in link.");
  }

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
          and{" "}
          <code className="font-mono text-bone/80">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          to the environment, then run the migration in{" "}
          <code className="font-mono text-bone/80">supabase/migrations</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <form onSubmit={signInWithPassword} className="space-y-4">
        <div>
          <label
            htmlFor="admin-email"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-bone/45"
          >
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-bone/45"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
        </div>

        {error ? (
          <p className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending !== null}
          className={buttonStyles({ className: "w-full" })}
        >
          {pending === "password" ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-bone/10" />
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-bone/30">
          or
        </span>
        <span className="h-px flex-1 bg-bone/10" />
      </div>

      <button
        type="button"
        onClick={sendMagicLink}
        disabled={pending !== null}
        className={buttonStyles({
          variant: "outline",
          className: "w-full",
        })}
      >
        {pending === "magic" ? "Sending…" : "Email me a sign-in link"}
      </button>
    </div>
  );
}
