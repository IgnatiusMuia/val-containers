import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { saveContainerAction } from "@/lib/actions/containers";
import { ContainerForm, type ContainerFormValues } from "../ContainerForm";

export const instant = false;

const blank: ContainerFormValues = {
  slug: "",
  name: "",
  shortName: "",
  type: "plain",
  size: "20ft",
  condition: "used",
  conditionLabel: "Used · WWT",
  grade: "",
  price: 0,
  currency: "KES",
  location: "Nairobi yard",
  deliveryInfo:
    "Delivery and offload are quoted after the site access check.",
  refrigerationStatus: "not_applicable",
  lastInspectedAt: "",
  verified: false,
  stock: 1,
  year: new Date().getFullYear(),
  status: "available",
  publicationStatus: "draft",
  featured: false,
  photosAreRepresentative: true,
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

export default async function NewContainerPage() {
  await requireAdmin("inventory");

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/containers"
          className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35 transition-colors hover:text-bone"
        >
          ← Inventory
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-bone">
          New listing<span className="text-ember">.</span>
        </h1>
        <p className="mt-2 text-sm text-bone/45">
          Save as a draft, add photos, then publish when the unit is verified.
        </p>
      </div>
      <ContainerForm
        action={saveContainerAction}
        initial={blank}
        submitLabel="Save listing"
      />
    </div>
  );
}
