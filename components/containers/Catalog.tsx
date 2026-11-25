"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  type Container,
  type ContainerCondition,
  type ContainerSize,
  type ContainerType,
} from "@/data/containers";
import { cn, formatCompactKES, formatKES } from "@/lib/format";
import { waLink, waMessages } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icons";
import { ContainerCard } from "./ContainerCard";
import { QuoteButton } from "@/components/forms/QuoteButton";

type TypeFilter = "all" | ContainerType;
type SizeFilter = "all" | ContainerSize;
type ConditionFilter = "all" | ContainerCondition;
type Sort = "newest" | "price-asc" | "price-desc" | "largest";

const PRICE_MIN = 150_000;
const PRICE_MAX = 2_500_000;

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "plain", label: "Plain / dry" },
  { value: "fabricated", label: "Fabricated" },
  { value: "refrigerated", label: "Refrigerated" },
];

const sizeOptions: { value: SizeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "20ft", label: "20ft" },
  { value: "40ft", label: "40ft" },
  { value: "40ft-hc", label: "40ft HC" },
];

const conditionOptions: { value: ConditionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
];

const sortOptions: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "largest", label: "Largest first" },
];

const sizeRank: Record<ContainerSize, number> = {
  "20ft": 1,
  "40ft": 2,
  "40ft-hc": 3,
};

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border px-2.5 py-1.5 text-[11.5px] transition-colors",
        active
          ? "border-ember bg-ember text-ink"
          : "border-bone/15 text-bone/55 hover:border-bone/35 hover:text-bone",
      )}
    >
      {children}
    </button>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
        {title}
      </p>
      {children}
    </div>
  );
}

function CatalogUI({
  initialType,
  containers,
  whatsappNumber,
}: {
  initialType: TypeFilter;
  containers: Container[];
  whatsappNumber?: string;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>(initialType);
  const [size, setSize] = useState<SizeFilter>("all");
  const [condition, setCondition] = useState<ConditionFilter>("all");
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sort, setSort] = useState<Sort>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasFilters =
    Boolean(query) ||
    type !== "all" ||
    size !== "all" ||
    condition !== "all" ||
    maxPrice < PRICE_MAX;

  const reset = () => {
    setQuery("");
    setType("all");
    setSize("all");
    setCondition("all");
    setMaxPrice(PRICE_MAX);
    setSort("newest");
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const matches = containers.filter((container) => {
      const haystack = [
        container.name,
        container.shortName,
        container.typeLabel,
        container.sizeLabel,
        container.description,
        container.bestFor.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!needle || haystack.includes(needle)) &&
        (type === "all" || container.type === type) &&
        (size === "all" || container.size === size) &&
        (condition === "all" || container.condition === condition) &&
        container.price <= maxPrice
      );
    });

    return matches.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "largest") {
        return (
          sizeRank[b.size] - sizeRank[a.size] || b.price - a.price
        );
      }
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
  }, [containers, query, type, size, condition, maxPrice, sort]);

  const progress = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const activeCount = [
    type !== "all",
    size !== "all",
    condition !== "all",
    maxPrice < PRICE_MAX,
    Boolean(query),
  ].filter(Boolean).length;

  return (
    <section className="bg-ink pb-24">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setFiltersOpen((current) => !current)}
                aria-expanded={filtersOpen}
                className="inline-flex h-10 items-center gap-2 border border-bone/20 px-3.5 text-[12px] text-bone/75 transition-colors hover:border-bone/45 hover:text-bone"
              >
                <Icon name="sliders" className="h-4 w-4" />
                Filters
                {activeCount > 0 ? (
                  <span className="grid h-4 min-w-4 place-items-center bg-ember px-1 font-mono text-[9px] text-ink">
                    {activeCount}
                  </span>
                ) : null}
              </button>
              <p className="text-[11px] text-bone/40" aria-live="polite">
                {filtered.length} of {containers.length} units
              </p>
            </div>

            <div
              className={cn(
                "lg:sticky lg:top-24",
                filtersOpen ? "block" : "hidden lg:block",
              )}
            >
              <div className="border border-bone/12 bg-coal">
                <div className="flex items-center justify-between gap-3 border-b border-bone/10 px-4 py-3">
                  <span className="eyebrow text-bone/45">Filter the fleet</span>
                  {hasFilters ? (
                    <button
                      type="button"
                      onClick={reset}
                      className="text-[10.5px] text-ember transition-colors hover:text-bone"
                    >
                      Clear all
                    </button>
                  ) : null}
                </div>

                <div className="space-y-5 p-4">
                  <FilterGroup title="Search">
                    <div className="relative">
                      <Icon
                        name="search"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone/30"
                      />
                      <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search stock…"
                        aria-label="Search containers"
                        className="h-10 w-full border border-bone/15 bg-ink pl-9 pr-3 text-[13px] text-bone placeholder:text-bone/30 focus:border-ember focus:outline-none"
                      />
                    </div>
                  </FilterGroup>

                  <FilterGroup title="Type">
                    <div className="flex flex-wrap gap-1.5">
                      {typeOptions.map((option) => (
                        <Chip
                          key={option.value}
                          active={type === option.value}
                          onClick={() => setType(option.value)}
                        >
                          {option.label}
                        </Chip>
                      ))}
                    </div>
                  </FilterGroup>

                  <FilterGroup title="Size">
                    <div className="flex flex-wrap gap-1.5">
                      {sizeOptions.map((option) => (
                        <Chip
                          key={option.value}
                          active={size === option.value}
                          onClick={() => setSize(option.value)}
                        >
                          {option.label}
                        </Chip>
                      ))}
                    </div>
                  </FilterGroup>

                  <FilterGroup title="Condition">
                    <div className="flex flex-wrap gap-1.5">
                      {conditionOptions.map((option) => (
                        <Chip
                          key={option.value}
                          active={condition === option.value}
                          onClick={() => setCondition(option.value)}
                        >
                          {option.label}
                        </Chip>
                      ))}
                    </div>
                  </FilterGroup>

                  <FilterGroup title="Budget">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[12px] text-bone/50">
                        Up to
                      </span>
                      <span className="font-display text-[17px] font-semibold text-bone">
                        {maxPrice >= PRICE_MAX
                          ? "Any budget"
                          : formatCompactKES(maxPrice)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={25000}
                      value={maxPrice}
                      onChange={(event) =>
                        setMaxPrice(Number(event.target.value))
                      }
                      aria-label="Maximum budget in Kenyan shillings"
                      className="range-ember mt-3 w-full"
                      style={{
                        background: `linear-gradient(to right, var(--color-ember) ${progress}%, rgba(239,233,222,0.15) ${progress}%)`,
                      }}
                    />
                    <div className="mt-2 flex justify-between font-mono text-[9px] tracking-[0.08em] text-bone/30">
                      <span>{formatKES(PRICE_MIN)}</span>
                      <span>{formatKES(PRICE_MAX)}</span>
                    </div>
                  </FilterGroup>
                </div>

                <div className="border-t border-bone/10 p-4">
                  <QuoteButton
                    variant="outline"
                    size="sm"
                    source="catalog-sidebar"
                    className="w-full"
                  >
                    Not sure? Ask us
                  </QuoteButton>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="mb-5 hidden items-center justify-between gap-3 lg:flex">
              <p className="text-[12px] text-bone/45" aria-live="polite">
                Showing <span className="text-bone">{filtered.length}</span> of{" "}
                {containers.length} units
              </p>
              <div className="relative">
                <label htmlFor="catalog-sort" className="sr-only">
                  Sort containers
                </label>
                <select
                  id="catalog-sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as Sort)}
                  className="h-10 appearance-none border border-bone/15 bg-ink pl-3 pr-9 text-[12px] text-bone/65 focus:border-ember focus:outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-bone/35"
                />
              </div>
            </div>

            <div className="mb-4 lg:hidden">
              <div className="relative">
                <label htmlFor="catalog-sort-mobile" className="sr-only">
                  Sort containers
                </label>
                <select
                  id="catalog-sort-mobile"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as Sort)}
                  className="h-10 w-full appearance-none border border-bone/15 bg-ink pl-3 pr-9 text-[12px] text-bone/65 focus:border-ember focus:outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-bone/35"
                />
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {filtered.map((container) => (
                  <ContainerCard
                    key={container.slug}
                    container={container}
                    imageSizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center border border-bone/12 bg-coal px-6 py-16 text-center">
                <span className="grid h-12 w-12 place-items-center border border-bone/15 text-bone/40">
                  <Icon name="search" className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em] text-bone">
                  No units match that combination.
                </h2>
                <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-bone/45">
                  Loosen a filter or tell us what you need. We fabricate to
                  order and may have a unit landing soon.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={reset}
                    className="h-10 border border-bone/25 px-4 text-[12.5px] text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
                  >
                    Reset filters
                  </button>
                  <a
                    href={waLink(waMessages.fabrication, whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 bg-whatsapp px-4 text-[12.5px] font-medium text-ink transition-opacity hover:opacity-90"
                  >
                    <Icon name="whatsapp" className="h-4 w-4" />
                    Ask the yard
                  </a>
                </div>
              </div>
            )}

            <p className="mt-8 text-[11px] leading-relaxed text-bone/30">
              All prices are in Kenyan shillings, ex-yard Nairobi. Delivery,
              crane offload and fabrication options are quoted separately and
              confirmed in writing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Catalog({
  containers,
  whatsappNumber,
}: {
  containers: Container[];
  whatsappNumber?: string;
}) {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const initialType: TypeFilter =
    typeParam === "plain" ||
    typeParam === "fabricated" ||
    typeParam === "refrigerated"
      ? typeParam
      : "all";

  return (
    <CatalogUI
      key={`${initialType}-${searchParams.toString()}`}
      initialType={initialType}
      containers={containers}
      whatsappNumber={whatsappNumber}
    />
  );
}
