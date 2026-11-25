"use client";

import { useState } from "react";
import { deliveryRegions } from "@/data/delivery";
import { cn, formatKES } from "@/lib/format";
import { waLink, waMessages } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icons";
import { QuoteButton } from "@/components/forms/QuoteButton";

const KENYA_PATH =
  "M430.6 382.7 L464.7 430.1 L424.4 453.0 L410.2 477.0 L388.7 481.2 L380.5 521.7 L362.1 544.9 L350.9 583.1 L327.7 602.1 L245.2 544.7 L241.3 511.3 L32.9 394.2 L23.2 387.9 L22.6 327.0 L39.1 303.7 L67.4 265.7 L88.3 223.8 L63.0 157.8 L56.3 129.0 L29.0 89.1 L64.4 54.8 L103.3 16.9 L133.2 26.5 L133.2 58.8 L152.8 77.7 L192.8 77.7 L265.6 126.5 L283.7 127.1 L297.2 125.5 L309.9 132.1 L348.2 136.7 L365.2 112.7 L417.7 88.7 L440.9 108.1 L480.2 108.1 L429.9 173.3 L430.6 382.7 Z";

const project = (lon: number, lat: number) => ({
  x: (lon - 33.5) * 57.471264367816076,
  y: (5.8 - lat) * 57.471264367816076,
});

export function KenyaMap({
  whatsappNumber,
}: {
  whatsappNumber?: string;
}) {
  const [activeId, setActiveId] = useState(deliveryRegions[0].id);
  const active =
    deliveryRegions.find((region) => region.id === activeId) ??
    deliveryRegions[0];

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="relative border border-bone/12 bg-ink p-3 sm:p-5">
          <div className="flex items-center justify-between border-b border-bone/10 px-1 pb-3">
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-bone/35">
              Delivery coverage
            </p>
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ember">
              From Nairobi yard
            </p>
          </div>
          <svg
            viewBox="0 0 500 621"
            className="mt-2 w-full"
            role="img"
            aria-label="Map of Kenya showing delivery regions"
          >
            <path
              d={KENYA_PATH}
              fill="rgba(239,233,222,0.055)"
              stroke="rgba(239,233,222,0.28)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d={KENYA_PATH}
              fill="none"
              stroke="rgba(244,81,30,0.16)"
              strokeWidth="8"
              strokeLinejoin="round"
            />
            {deliveryRegions.map((region) => {
              const point = project(region.lon, region.lat);
              const isActive = region.id === active.id;
              return (
                <g
                  key={region.id}
                  onClick={() => setActiveId(region.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveId(region.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Show delivery details for ${region.name}`}
                  className="cursor-pointer focus:outline-none"
                >
                  {isActive ? (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="13"
                      fill="none"
                      stroke="var(--color-ember)"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  ) : null}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 5 : 3.5}
                    fill={isActive ? "var(--color-ember)" : "rgba(239,233,222,0.55)"}
                    className="transition-all"
                  />
                  {region.id === "nairobi" ? (
                    <text
                      x={point.x + 10}
                      y={point.y + 4}
                      fill="rgba(239,233,222,0.6)"
                      fontSize="8"
                      fontFamily="var(--font-mono), monospace"
                    >
                      YARD
                    </text>
                  ) : null}
                  {isActive && region.id !== "nairobi" ? (
                    <text
                      x={point.x + 10}
                      y={point.y + 4}
                      fill="rgba(239,233,222,0.8)"
                      fontSize="8"
                      fontFamily="var(--font-mono), monospace"
                    >
                      {region.name.toUpperCase()}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
          <p className="mt-1 text-center font-mono text-[8px] uppercase tracking-[0.12em] text-bone/25">
            Tap a marker to see the route
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {deliveryRegions.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => setActiveId(region.id)}
              aria-pressed={region.id === active.id}
              className={cn(
                "border px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.08em] transition-colors",
                region.id === active.id
                  ? "border-ember bg-ember text-ink"
                  : "border-bone/15 text-bone/45 hover:border-bone/40 hover:text-bone",
              )}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="border border-bone/12 bg-coal p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-bone/10 pb-4">
            <div>
              <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ember">
                Selected route
              </p>
              <h3 className="mt-2 font-display text-[26px] font-semibold leading-tight tracking-[-0.03em] text-bone">
                {active.name}
              </h3>
            </div>
            <Icon name="truck" className="h-5 w-5 text-bone/30" />
          </div>

          <p className="mt-4 text-[12px] leading-relaxed text-bone/50">
            {active.towns}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-px border border-bone/10 bg-bone/10">
            <div className="bg-coal p-3">
              <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                Transit
              </dt>
              <dd className="mt-1.5 text-[12px] text-bone/75">
                {active.timeline}
              </dd>
            </div>
            <div className="bg-coal p-3">
              <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                20ft from
              </dt>
              <dd className="mt-1.5 text-[12px] text-bone/75">
                {active.from20 === null ? "Per trip" : formatKES(active.from20)}
              </dd>
            </div>
            <div className="bg-coal p-3">
              <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-bone/30">
                40ft HC from
              </dt>
              <dd className="mt-1.5 text-[12px] text-bone/75">
                {active.from40hc === null
                  ? "Per trip"
                  : formatKES(active.from40hc)}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-[11.5px] leading-relaxed text-bone/45">
            {active.note}
          </p>

          <div className="mt-5 flex flex-col gap-2">
            <a
              href={waLink(
                `${waMessages.delivery} My site is in ${active.name}.`,
                whatsappNumber,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 bg-whatsapp text-[12px] font-medium text-ink transition-opacity hover:opacity-90"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              WhatsApp a delivery quote
            </a>
            <QuoteButton
              variant="outline"
              size="sm"
              source={`delivery-map-${active.id}`}
              className="w-full"
            >
              Use the quote form
            </QuoteButton>
          </div>
        </div>
        <p className="mt-3 font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-bone/25">
          Indicative from-prices. Final quote depends on site access and offload.
        </p>
      </div>
    </div>
  );
}
