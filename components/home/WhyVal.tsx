import { stats } from "@/data/site";
import { waLink, waMessages } from "@/lib/whatsapp";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const comparison = [
  {
    label: "Price",
    val: "Published on every unit",
    other: "Call for price",
  },
  {
    label: "Condition",
    val: "Photos + written report",
    other: "Sold as seen",
  },
  {
    label: "CSC & serial",
    val: "Verified and shared",
    other: "Sometimes",
  },
  {
    label: "Delivery",
    val: "Written, access-checked",
    other: "Extra at the gate",
  },
  {
    label: "Fabrication",
    val: "One in-house team",
    other: "Outsourced",
  },
  {
    label: "After-sale",
    val: "Direct line to the yard",
    other: "Good luck",
  },
] as const;

export function WhyVal() {
  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-steel py-20 sm:py-28">
      <div className="ribs absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal>
          <SectionHeading
            index="03"
            label="Why Val"
            title={
              <>
                The details other
                <br className="hidden sm:block" /> yards skip.
              </>
            }
            description="A container is a simple product. The difference is what comes with it: documentation, honest grading and a delivery plan that survives the gate."
          />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-px border border-bone/12 bg-bone/12">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-steel p-5">
                  <p className="font-display text-[38px] font-semibold leading-none tracking-[-0.04em] text-bone">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-bone/40">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-l-2 border-ember bg-ink/40 px-5 py-5">
              <p className="font-display text-[17px] font-medium leading-relaxed tracking-[-0.015em] text-bone/85">
                &ldquo;If a unit is not right for the job, we will say so before
                you pay.&rdquo;
              </p>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-bone/35">
                The yard rule
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={waLink(waMessages.viewing)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[13px] font-medium text-bone transition-colors hover:text-ember"
              >
                Book a yard visit
                <Icon
                  name="arrow-up-right"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <span className="h-3 w-px bg-bone/20" aria-hidden="true" />
              <span className="text-[12px] text-bone/40">
                Open 24 hours · Likoni Road
              </span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden border border-bone/12">
              <div className="grid grid-cols-[1.25fr_1fr_0.9fr] gap-2 border-b border-bone/12 bg-ink/50 px-4 py-3 font-mono text-[8.5px] uppercase tracking-[0.12em] text-bone/35 sm:text-[9px]">
                <span>What matters</span>
                <span className="text-ember">Val</span>
                <span>Typical yard</span>
              </div>
              {comparison.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1.25fr_1fr_0.9fr] items-start gap-2 border-b border-bone/8 px-4 py-3.5 last:border-0"
                >
                  <span className="text-[12px] font-medium text-bone/80 sm:text-[12.5px]">
                    {row.label}
                  </span>
                  <span className="flex items-start gap-1.5 text-[10.5px] leading-snug text-bone/70 sm:text-[11.5px]">
                    <Icon
                      name="check"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember"
                    />
                    {row.val}
                  </span>
                  <span className="text-[10.5px] leading-snug text-bone/35 sm:text-[11.5px]">
                    {row.other}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-bone/30">
              &ldquo;Typical yard&rdquo; describes the market pattern we see,
              not any one business.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
