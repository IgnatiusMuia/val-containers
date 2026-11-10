"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/format";
import type { Faq } from "@/data/faqs";
import { Icon } from "./Icons";

export function Accordion({
  items,
  tone = "dark",
  defaultOpen = 0,
  className,
}: {
  items: readonly Faq[];
  tone?: "dark" | "light";
  defaultOpen?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const reduce = useReducedMotion();
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "divide-y",
        isDark ? "divide-bone/12" : "divide-ink/12",
        className,
      )}
    >
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className={cn(
                  "flex w-full items-start justify-between gap-6 py-5 text-left transition-colors sm:py-6",
                  isDark ? "hover:text-ember" : "hover:text-ember-deep",
                )}
              >
                <span className="flex gap-4">
                  <span
                    className={cn(
                      "mt-0.5 font-mono text-[10px] tracking-[0.16em]",
                      isDark ? "text-bone/35" : "text-ink/35",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-display text-[17px] font-semibold leading-snug tracking-[-0.02em] sm:text-lg",
                    )}
                  >
                    {item.question}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-0.5 grid h-6 w-6 shrink-0 place-items-center border",
                    isDark ? "border-bone/20" : "border-ink/20",
                  )}
                  aria-hidden="true"
                >
                  <Icon
                    name={isOpen ? "minus" : "plus"}
                    className="h-3.5 w-3.5"
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              <motion.div
                key={isOpen ? "open" : "closed"}
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.35, ease: "easeInOut" }
                }
                className="overflow-hidden"
              >
                <p
                  className={cn(
                    "max-w-3xl pb-6 pl-9 text-[14.5px] leading-relaxed sm:text-[15px]",
                    isDark ? "text-bone/65" : "text-ink/65",
                  )}
                >
                  {item.answer}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
