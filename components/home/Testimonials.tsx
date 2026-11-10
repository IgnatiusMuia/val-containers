"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { testimonials } from "@/data/testimonials";
import { trustLogos } from "@/data/site";
import { cn } from "@/lib/format";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [paused, reduce]);

  const active = testimonials[index];

  const move = (direction: number) => {
    setIndex(
      (current) =>
        (current + direction + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="relative bg-ink py-20 sm:py-28">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            index="05"
            label="Proof"
            title={
              <>
                Bought, delivered,
                <br className="hidden sm:block" /> in use.
              </>
            }
            description="Five recent buyers, five different jobs. The common thread is documentation and a delivery that happened when we said it would."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <div
            className="lg:col-span-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <div className="relative min-h-[355px] overflow-hidden border border-bone/12 bg-coal p-6 sm:min-h-[340px] sm:p-9">
              <div
                className="absolute right-6 top-4 font-display text-[92px] font-bold leading-none text-bone/[0.04]"
                aria-hidden="true"
              >
                &rdquo;
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.name}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-1 text-ember">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Icon
                          key={star}
                          name="star"
                          className={cn(
                            "h-3.5 w-3.5",
                            star < active.rating
                              ? "text-ember"
                              : "text-bone/15",
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/30">
                      Verified delivery · {active.location}
                    </span>
                  </div>

                  <blockquote className="mt-6 font-display text-[clamp(1.35rem,2.7vw,2rem)] font-medium leading-[1.28] tracking-[-0.03em] text-bone/90">
                    &ldquo;{active.quote}&rdquo;
                  </blockquote>

                  <div className="mt-8 flex items-center gap-4 border-t border-bone/10 pt-5">
                    <Image
                      src={active.image}
                      alt={`Portrait of ${active.name}`}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover grayscale-[25%]"
                    />
                    <div>
                      <p className="text-[13.5px] font-semibold text-bone">
                        {active.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-bone/35">
                        {active.location} · {active.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {testimonials.map((testimonial, dot) => (
                  <button
                    key={testimonial.name}
                    type="button"
                    onClick={() => setIndex(dot)}
                    aria-label={`Show testimonial from ${testimonial.name}`}
                    aria-current={dot === index ? "true" : undefined}
                    className={cn(
                      "h-1.5 transition-all duration-300",
                      dot === index
                        ? "w-7 bg-ember"
                        : "w-1.5 bg-bone/20 hover:bg-bone/40",
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Previous testimonial"
                  className="grid h-9 w-9 place-items-center border border-bone/15 text-bone/60 transition-colors hover:border-bone/40 hover:text-bone"
                >
                  <Icon name="chevron-left" className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-mono text-[9px] tracking-[0.12em] text-bone/30">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(testimonials.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Next testimonial"
                  className="grid h-9 w-9 place-items-center border border-bone/15 text-bone/60 transition-colors hover:border-bone/40 hover:text-bone"
                >
                  <Icon name="chevron-right" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="flex h-full flex-col border border-bone/12 bg-ink p-6">
              <div>
                <p className="eyebrow text-bone/35">Rated by buyers</p>
                <p className="mt-3 font-display text-[68px] font-bold leading-none tracking-[-0.05em] text-bone">
                  5.0
                </p>
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Icon
                      key={star}
                      name="star"
                      className="h-3.5 w-3.5 text-ember"
                    />
                  ))}
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-bone/40">
                  From five recent deliveries across Nairobi, Coast, Rift Valley
                  and Nyanza.
                </p>
              </div>

              <div className="mt-8 border-t border-bone/10 pt-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/30">
                  Recent routes
                </p>
                <ul className="mt-3 space-y-2">
                  {testimonials.slice(0, 3).map((testimonial) => (
                    <li
                      key={testimonial.name}
                      className="flex items-center justify-between gap-3 text-[11.5px] text-bone/55"
                    >
                      <span>{testimonial.location}</span>
                      <span className="text-right text-[10px] text-bone/30">
                        {testimonial.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-8">
                <a
                  href="#faq"
                  className="group inline-flex items-center gap-2 text-[12px] font-medium text-bone/70 transition-colors hover:text-ember"
                >
                  Read the buying questions
                  <Icon
                    name="arrow-right"
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-bone/10 pt-8">
          <p className="eyebrow text-bone/30">Teams we have delivered for</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-4">
            {trustLogos.map((logo) => (
              <span
                key={logo.name}
                className={cn("text-[14px] text-bone/30", logo.style)}
              >
                {logo.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
