import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAdminContainer } from "@/lib/containers/admin";
import { saveContainerAction } from "@/lib/actions/containers";
import { ContainerForm, type ContainerFormValues } from "../ContainerForm";
import { MediaManager } from "./MediaManager";

export const instant = false;

function dateInput(value: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

export default async function EditContainerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { account } = await requireAdmin("inventory");
  const canManageMedia =
    account.role === "owner" || account.permissions.includes("media");
  const { id } = await params;
  const container = await getAdminContainer(id);
  if (!container) notFound();

  const initial: ContainerFormValues = {
    id: container.id,
    reference: container.reference,
    slug: container.slug,
    name: container.name,
    shortName: container.short_name,
    type: container.type,
    size: container.size,
    condition: container.condition,
    conditionLabel: container.condition_label ?? "",
    grade: container.grade ?? "",
    price: container.price,
    currency: container.currency,
    location: container.location,
    deliveryInfo: container.delivery_info,
    refrigerationStatus: container.refrigeration_status as ContainerFormValues["refrigerationStatus"],
    lastInspectedAt: dateInput(container.last_inspected_at),
    verified: Boolean(container.verified_at),
    stock: container.stock,
    year: container.year ?? new Date().getFullYear(),
    status: container.status,
    publicationStatus: container.publication_status,
    featured: container.featured,
    photosAreRepresentative: container.photos_are_representative,
    description: container.description,
    highlights: container.highlights,
    conditionNotes: container.condition_notes,
    included: container.included,
    features: container.features,
    bestFor: container.best_for,
    specs: container.specs,
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/containers"
            className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35 transition-colors hover:text-bone"
          >
            ← Inventory
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-bone">
            Edit listing<span className="text-ember">.</span>
          </h1>
          <p className="mt-2 font-mono text-[10px] text-bone/35">
            {container.reference}
          </p>
        </div>
        <Link
          href={`/containers/${container.slug}`}
          target="_blank"
          className="border border-bone/15 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-bone/45 transition-colors hover:border-bone/35 hover:text-bone"
        >
          View public page ↗
        </Link>
      </div>
      <ContainerForm
        action={saveContainerAction}
        initial={initial}
        submitLabel="Save changes"
      />
      {canManageMedia ? (
        <MediaManager
          containerId={container.id}
          media={container.container_media}
        />
      ) : (
        <p className="mt-8 border border-bone/12 p-4 text-sm text-bone/55">
          Photos and videos are managed by a team member with media permission.
        </p>
      )}
    </div>
  );
}
