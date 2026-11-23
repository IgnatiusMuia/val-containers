import type { Metadata } from "next";
import { connection } from "next/server";
import { saveContainerAction } from "@/lib/actions/containers";
import { ContainerForm, type ContainerFormValues } from "../ContainerForm";

export const instant = false;

export const metadata: Metadata = {
  title: "New listing",
  robots: { index: false, follow: false },
};

export default async function NewContainerPage() {
  await connection();

  const initial: ContainerFormValues = {
    slug: "",
    name: "",
    shortName: "",
    type: "plain",
    size: "20ft",
    condition: "used",
    conditionLabel: "",
    grade: "",
    price: 0,
    stock: 0,
    year: new Date().getFullYear(),
    status: "draft",
    featured: false,
    photosAreRepresentative: false,
    description: "",
    highlights: [],
    conditionNotes: [],
    included: [],
    features: [],
    bestFor: [],
    specs: {
      external: "",
      internal: "",
      tare: "",
      payload: "",
      door: "",
      volume: "",
      floor: "",
      flooring: "",
      ventilation: "",
      extra: [],
    },
  };

  return (
    <div>
      <p className="eyebrow text-ember">Inventory</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-bone">
        New listing<span className="text-ember">.</span>
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/50">
        Save as a draft first. Publish when the price, condition notes and
        media are ready.
      </p>

      <div className="mt-8 max-w-4xl">
        <ContainerForm
          action={saveContainerAction}
          initial={initial}
          submitLabel="Create listing"
        />
      </div>
    </div>
  );
}
