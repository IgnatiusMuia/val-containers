import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import {
  ADMIN_PERMISSIONS,
  permissionLabels,
  type AdminPermission,
} from "@/lib/permissions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  grantTeamAccessAction,
  inviteTeamMemberAction,
  removeTeamMemberAction,
  resendTeamInviteAction,
  sendMemberPasswordResetAction,
  updateTeamMemberAction,
} from "@/lib/actions/team";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const instant = false;

interface TeamRow {
  user_id: string;
  role: "owner" | "admin";
  display_name: string | null;
  active: boolean;
  permissions: AdminPermission[];
  invited_at: string | null;
  accepted_at: string | null;
  last_seen_at: string | null;
  created_at: string;
}

const notices: Record<string, string> = {
  invited: "Invite sent and access added.",
  granted: "Access granted to the existing account.",
  updated: "Team member updated.",
  resent: "Invite resent.",
  removed: "Access removed.",
  "reset-sent": "Password reset email sent.",
};

const errors: Record<string, string> = {
  "invalid-email": "Enter a valid email address.",
  config: "Supabase is not configured for team management.",
  "existing-user":
    "That email already has an account. Use “Grant access to an existing account” instead.",
  "invite-failed":
    "Could not send the invite. Check Supabase Auth SMTP delivery and try again.",
  "allowlist-failed": "The invite was sent but access could not be saved. Try again.",
  "lookup-failed": "Could not look up that account. Try again.",
  "no-user": "No Supabase Auth account uses that email. Send an invite instead.",
  "missing-user": "That team member no longer exists.",
  "last-owner": "The last active owner cannot be removed or demoted.",
  "self-lockout": "You cannot remove or demote your own owner access.",
  "update-failed": "Could not update that team member. Try again.",
  "delete-failed": "Could not remove that team member. Try again.",
  "reset-failed": "Could not send the password reset email.",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PermissionFields({
  selected,
  idPrefix,
}: {
  selected: AdminPermission[];
  idPrefix: string;
}) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {ADMIN_PERMISSIONS.map((permission) => (
        <label
          key={permission}
          className="flex items-center gap-1.5 text-[11px] text-bone/55"
        >
          <input
            type="checkbox"
            name="permissions"
            value={permission}
            defaultChecked={selected.includes(permission)}
            id={`${idPrefix}-${permission}`}
            className="h-3.5 w-3.5 accent-ember"
          />
          {permissionLabels[permission]}
        </label>
      ))}
    </div>
  );
}

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { user: currentUser } = await requireOwner();
  const { saved, error } = await searchParams;

  const admin = createSupabaseAdminClient();

  if (!admin) {
    return (
      <p className="border border-red-500/25 bg-red-500/5 p-5 text-sm text-red-200">
        Supabase is not configured. Add the service role or secret key to manage
        team access.
      </p>
    );
  }

  const [{ data: rows, error: rowsError }, { data: authUsers }] =
    await Promise.all([
      admin
        .from("admin_users")
        .select(
          "user_id, role, display_name, active, permissions, invited_at, accepted_at, last_seen_at, created_at",
        )
        .order("created_at", { ascending: true }),
      admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);

  const emailById = new Map(
    (authUsers?.users ?? []).map((user) => [
      user.id,
      user.email ?? "unknown email",
    ]),
  );

  const team = ((rows ?? []) as unknown as TeamRow[]).sort((a, b) => {
    if (a.role !== b.role) return a.role === "owner" ? -1 : 1;
    return a.created_at.localeCompare(b.created_at);
  });

  const owners = team.filter((member) => member.role === "owner" && member.active);
  const inputClass =
    "h-9 w-full border border-bone/15 bg-coal px-2.5 text-xs text-bone placeholder:text-bone/25 focus:border-ember focus:outline-none";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ember">Owner only</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Team<span className="text-ember">.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone/50">
            Invite staff, assign permissions and revoke access. Settings and team
            management stay with the owner; inventory, media, enquiries and
            content can be delegated.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="border border-bone/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/50 transition-colors hover:border-bone/35 hover:text-bone"
        >
          Back to settings
        </Link>
      </div>

      {saved && notices[saved] ? (
        <p className="mt-6 border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {notices[saved]}
        </p>
      ) : null}
      {error ? (
        <p className="mt-6 border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {errors[error] ?? "That action could not be completed."}
        </p>
      ) : null}
      {rowsError ? (
        <p className="mt-6 border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {rowsError.message}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <form
          action={inviteTeamMemberAction}
          className="border border-bone/12 bg-ink p-5"
        >
          <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
            Invite a new teammate
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-bone/40">
            Sends a Supabase Auth invite email. They set a password, then sign in
            at the admin URL.
          </p>
          <div className="mt-4 grid gap-3">
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className={inputClass}
            />
            <input
              name="displayName"
              placeholder="Display name (optional)"
              className={inputClass}
            />
            <select name="role" defaultValue="admin" className={inputClass}>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
            <div>
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-bone/35">
                Permissions
              </p>
              <PermissionFields selected={[]} idPrefix="invite" />
            </div>
            <button
              type="submit"
              className="h-9 bg-ember px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-ink"
            >
              Send invite
            </button>
          </div>
        </form>

        <form
          action={grantTeamAccessAction}
          className="border border-bone/12 bg-ink p-5"
        >
          <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
            Grant access to an existing account
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-bone/40">
            Use this when the person already signed up or was invited before.
            Find them by the email on their Auth account.
          </p>
          <div className="mt-4 grid gap-3">
            <input
              name="email"
              type="email"
              required
              placeholder="Existing account email"
              className={inputClass}
            />
            <input
              name="displayName"
              placeholder="Display name (optional)"
              className={inputClass}
            />
            <select name="role" defaultValue="admin" className={inputClass}>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
            <div>
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-bone/35">
                Permissions
              </p>
              <PermissionFields selected={[]} idPrefix="grant" />
            </div>
            <button
              type="submit"
              className="h-9 border border-bone/15 px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-bone/60 transition-colors hover:border-bone/35 hover:text-bone"
            >
              Grant access
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
            Team access
          </h2>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/30">
            {team.length} member{team.length === 1 ? "" : "s"} · {owners.length}{" "}
            owner{owners.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-4 grid gap-3">
          {team.map((member) => {
            const isSelf = member.user_id === currentUser.id;
            const email = emailById.get(member.user_id) ?? "unknown email";
            const pending = Boolean(member.invited_at) && !member.last_seen_at;
            return (
              <div
                key={member.user_id}
                className="border border-bone/10 bg-ink p-4"
              >
                <form action={updateTeamMemberAction}>
                  <input type="hidden" name="userId" value={member.user_id} />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 text-sm text-bone">
                        <span className="truncate">
                          {member.display_name || email}
                        </span>
                        {isSelf ? (
                          <span className="bg-ember/15 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-ember">
                            You
                          </span>
                        ) : null}
                        <span
                          className={`border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] ${
                            member.active
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                              : "border-bone/20 bg-bone/5 text-bone/40"
                          }`}
                        >
                          {member.active ? "Active" : "Disabled"}
                        </span>
                        {pending ? (
                          <span className="border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-sky-200">
                            Invited
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 truncate font-mono text-[10px] text-bone/35">
                        {email}
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-bone/25">
                        Added {formatDate(member.created_at)} · Last seen{" "}
                        {formatDate(member.last_seen_at)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        name="role"
                        defaultValue={member.role}
                        className="h-8 border border-bone/15 bg-coal px-2 text-[11px] text-bone focus:border-ember focus:outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                      </select>
                      <label className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-bone/45">
                        <input
                          type="checkbox"
                          name="active"
                          defaultChecked={member.active}
                          className="h-3.5 w-3.5 accent-ember"
                        />
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <input
                        name="displayName"
                        defaultValue={member.display_name ?? ""}
                        placeholder="Display name"
                        className={inputClass}
                      />
                      <div className="mt-2">
                        <PermissionFields
                          selected={member.permissions}
                          idPrefix={`member-${member.user_id}`}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="h-9 border border-bone/15 px-3 font-mono text-[8px] uppercase tracking-[0.12em] text-bone/60 transition-colors hover:border-bone/35 hover:text-bone"
                    >
                      Save changes
                    </button>
                  </div>
                </form>

                <div className="mt-3 flex flex-wrap gap-2 border-t border-bone/8 pt-3">
                  <form action={resendTeamInviteAction}>
                    <input type="hidden" name="userId" value={member.user_id} />
                    <button
                      type="submit"
                      className="h-8 border border-bone/12 px-2.5 font-mono text-[8px] uppercase tracking-[0.1em] text-bone/45 transition-colors hover:border-bone/35 hover:text-bone"
                    >
                      Resend invite
                    </button>
                  </form>
                  <form action={sendMemberPasswordResetAction}>
                    <input type="hidden" name="userId" value={member.user_id} />
                    <button
                      type="submit"
                      className="h-8 border border-bone/12 px-2.5 font-mono text-[8px] uppercase tracking-[0.1em] text-bone/45 transition-colors hover:border-bone/35 hover:text-bone"
                    >
                      Send password reset
                    </button>
                  </form>
                  {!isSelf ? (
                    <form action={removeTeamMemberAction} className="ml-auto">
                      <input type="hidden" name="userId" value={member.user_id} />
                      <ConfirmButton
                        type="submit"
                        message={`Remove access for ${email}?`}
                        className="h-8 border border-red-500/20 px-2.5 font-mono text-[8px] uppercase tracking-[0.1em] text-red-300/60 transition-colors hover:border-red-500/50 hover:text-red-200"
                      >
                        Remove access
                      </ConfirmButton>
                    </form>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
