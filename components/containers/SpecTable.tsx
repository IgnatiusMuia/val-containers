import type { Container } from "@/data/containers";

export function SpecTable({ container }: { container: Container }) {
  const { specs } = container;

  const rows: Array<[string, string]> = [
    ["External dimensions", specs.external],
    ["Internal dimensions", specs.internal],
    ["Door opening", specs.door],
    ["Tare weight", specs.tare],
    ["Max payload", specs.payload],
    ["Cubic capacity", specs.volume],
    ["Floor area", specs.floor],
    ["Flooring", specs.flooring],
    ["Ventilation", specs.ventilation],
  ];

  return (
    <div>
      <dl className="grid gap-x-10 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-start justify-between gap-5 border-b border-ink/10 py-3.5"
          >
            <dt className="shrink-0 font-mono text-[9px] uppercase tracking-[0.11em] text-muted-dark">
              {label}
            </dt>
            <dd className="max-w-[62%] text-right text-[12.5px] leading-snug text-ink/80">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {specs.extra.length > 0 ? (
        <div className="mt-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ember-deep">
            Fabrication & equipment
          </p>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            {specs.extra.map((item) => (
              <div key={item.label} className="border border-ink/10 bg-bone p-3">
                <dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-muted-dark">
                  {item.label}
                </dt>
                <dd className="mt-1 text-[12px] leading-snug text-ink/80">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <p className="mt-5 text-[10.5px] leading-relaxed text-ink/40">
        Dimensions are nominal ISO measurements and can vary slightly by
        manufacturer. We confirm the exact unit measurements at inspection and
        put them in writing on the quote.
      </p>
    </div>
  );
}
