import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminContainer } from "@/lib/containers/admin";
import { saveContainerAction } from "@/lib/actions/containers";
import { ContainerForm, type ContainerFormValues } from "../ContainerForm";
import { MediaManager } from "./MediaManager";

export const instant = false;

export const metadata: Metadata = {
  title: "Edit listing",
  robots: { index: false, follow: false },
};

export default async function EditContainerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const container = await getAdminContainer(id);

  if (!container) notFound();

  const initial: ContainerFormValues = {
    id: container.id,
    slug: container.slug,
    name: container.name,
    shortName: container.short_name,
    type: container.type,
    size: container.size,
    condition: container.condition,
    conditionLabel: container.condition_label ?? "",
    grade: container.grade ?? "",
    price: container.price,
    stock: container.stock,
    year: container.year ?? 2026,
    status: container.status,
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-ember">Inventory</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
            Edit listing<span className="text-ember">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/50">
            {container.name}
          </p>
        </div>
        <Link
          href={`/containers/${container.slug}`}
          className="border border-bone/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/55 transition-colors hover:border-bone/35 hover:text-bone"
        >
          View public page ↗
        </Link>
      </div>

      <div className="mt-8 max-w-4xl">
        <ContainerForm
          action={saveContainerAction}
          initial={initial}
          submitLabel="Save listing"
        />
        <MediaManager containerId={container.id} media={container.container_media} />
      </div>
    </div>
  );
}
