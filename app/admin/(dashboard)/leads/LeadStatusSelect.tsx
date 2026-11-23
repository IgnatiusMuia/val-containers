"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatusAction } from "@/lib/actions/leads";
import type { LeadStatus } from "@/lib/validation/lead";

const statuses: LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
  "archived",
];

export function LeadStatusSelect({
  leadId,
  status,
}: {
  leadId: string;
  status: LeadStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(next: LeadStatus) {
    setBusy(true);
    setError(null);
    const result = await updateLeadStatusAction(leadId, next);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <select
        value={status}
        disabled={busy}
        onChange={(event) => void onChange(event.target.value as LeadStatus)}
        className="h-8 border border-bone/15 bg-coal px-2 font-mono text-[9px] uppercase tracking-[0.14em] text-bone/60 focus:border-ember focus:outline-none disabled:opacity-50"
      >
        {statuses.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-[10px] text-red-300">{error}</p> : null}
    </div>
  );
}
