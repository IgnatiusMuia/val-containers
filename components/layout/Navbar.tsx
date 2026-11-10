"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav, site } from "@/data/site";
import { cn } from "@/lib/format";
import { waMessages, waLink } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { QuoteButton } from "@/components/forms/QuoteButton";

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => node.offsetParent !== null);

      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div className="hidden border-b border-bone/10 bg-ink lg:block">
        <div className="wrap flex h-9 items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/45">
          <p className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-whatsapp" />
            </span>
            Open 24/7 · Nairobi yard
          </p>
          <div className="flex items-center gap-5">
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-bone"
            >
              <Icon name="pin" className="h-3 w-3" />
              {site.addressLine}
            </a>
            <span className="h-3 w-px bg-bone/15" aria-hidden="true" />
            <a
              href={site.phoneHref}
              className="flex items-center gap-1.5 transition-colors hover:text-bone"
            >
              <Icon name="phone" className="h-3 w-3" />
              {site.phoneDisplay}
            </a>
            <span className="hidden h-3 w-px bg-bone/15 xl:block" aria-hidden="true" />
            <a
              href={`mailto:${site.email}`}
              className="hidden items-center gap-1.5 transition-colors hover:text-bone xl:flex"
            >
              <Icon name="mail" className="h-3 w-3" />
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors duration-300",
          scrolled
            ? "border-bone/12 bg-ink/90 backdrop-blur-xl"
            : "border-bone/10 bg-ink",
        )}
      >
        <div className="wrap flex h-[70px] items-center justify-between gap-4">
          <Link
            href="/"
            className="shrink-0 text-bone transition-opacity hover:opacity-80"
            aria-label="Val Containers home"
          >
            <Logo />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 lg:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative py-2 text-[13px] font-medium tracking-[-0.01em] transition-colors",
                  isActive(item.href)
                    ? "text-bone"
                    : "text-bone/60 hover:text-bone",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px bg-ember transition-all duration-300",
                    isActive(item.href)
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-60",
                  )}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={site.phoneHref}
              className="hidden items-center gap-2 pr-2 font-mono text-[11px] tracking-[0.06em] text-bone/60 transition-colors hover:text-bone xl:flex"
            >
              <Icon name="phone" className="h-3.5 w-3.5" />
              {site.phoneDisplay}
            </a>
            <div className="hidden sm:block">
              <QuoteButton
                source="navbar"
                size="sm"
                className="h-10 px-4"
              >
                Get a quote
              </QuoteButton>
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid h-10 w-10 place-items-center border border-bone/20 text-bone transition-colors hover:border-bone/50 lg:hidden"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[90] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              ref={panelRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={reduce ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? undefined : { x: "100%" }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="absolute inset-y-0 right-0 flex w-[min(92vw,390px)] flex-col border-l border-bone/12 bg-coal"
            >
              <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-bone/10 px-5">
                <Logo compact className="text-bone" />
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center border border-bone/15 text-bone/60 transition-colors hover:border-bone/40 hover:text-bone"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <nav aria-label="Mobile">
                  <ul className="divide-y divide-bone/8">
                    {nav.map((item, index) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="group flex items-baseline justify-between gap-4 py-4"
                        >
                          <span
                            className={cn(
                              "font-display text-[26px] font-semibold tracking-[-0.03em] transition-colors",
                              isActive(item.href)
                                ? "text-ember"
                                : "text-bone/85 group-hover:text-bone",
                            )}
                          >
                            {item.label}
                          </span>
                          <span className="font-mono text-[10px] tracking-[0.16em] text-bone/30">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-6">
                  <QuoteButton
                    source="mobile-menu"
                    size="lg"
                    className="w-full"
                    onOpen={() => setMenuOpen(false)}
                  >
                    Get a free quote
                  </QuoteButton>
                </div>

                <div className="mt-6 border border-bone/12">
                  <a
                    href={waLink(waMessages.general)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 border-b border-bone/10 px-4 py-3.5 transition-colors hover:bg-ink/60"
                  >
                    <Icon name="whatsapp" className="h-4 w-4 text-whatsapp" />
                    <span className="flex-1">
                      <span className="block text-[13px] text-bone/85">WhatsApp</span>
                      <span className="block text-[10px] text-bone/40">
                        Fastest reply, 24/7
                      </span>
                    </span>
                    <Icon
                      name="arrow-up-right"
                      className="h-3.5 w-3.5 text-bone/30"
                    />
                  </a>
                  <a
                    href={site.phoneHref}
                    className="flex items-center gap-3 border-b border-bone/10 px-4 py-3.5 transition-colors hover:bg-ink/60"
                  >
                    <Icon name="phone" className="h-4 w-4 text-ember" />
                    <span className="flex-1">
                      <span className="block text-[13px] text-bone/85">Call the yard</span>
                      <span className="block text-[10px] text-bone/40">
                        {site.phoneDisplay}
                      </span>
                    </span>
                    <Icon
                      name="arrow-up-right"
                      className="h-3.5 w-3.5 text-bone/30"
                    />
                  </a>
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-ink/60"
                  >
                    <Icon name="pin" className="h-4 w-4 text-bone/70" />
                    <span className="flex-1">
                      <span className="block text-[13px] text-bone/85">
                        Directions
                      </span>
                      <span className="block text-[10px] text-bone/40">
                        {site.addressLine}
                      </span>
                    </span>
                    <Icon
                      name="arrow-up-right"
                      className="h-3.5 w-3.5 text-bone/30"
                    />
                  </a>
                </div>

                <p className="mt-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-bone/30">
                  {site.hours} · {site.address}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
