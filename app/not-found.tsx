import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[72svh] items-center overflow-hidden bg-ink pb-16 pt-28">
      <div className="ribs absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="wrap relative">
        <p className="eyebrow text-ember">404 · Unit not found</p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.055em] text-bone">
          This box
          <br />
          isn&rsquo;t here<span className="text-ember">.</span>
        </h1>
        <p className="mt-6 max-w-md text-[14px] leading-relaxed text-bone/50">
          The page moved, sold, or never existed. The fleet is still in the
          yard — start there, or tell us what you need and we will point you to
          the right unit.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/containers" size="lg">
            Browse the fleet
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline" size="lg">
            Contact the yard
          </ButtonLink>
        </div>
        <div className="mt-10 flex flex-wrap gap-5 border-t border-bone/10 pt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/35">
          <Link href="/" className="inline-flex items-center gap-2 transition-colors hover:text-bone">
            <Icon name="home" className="h-3.5 w-3.5" />
            Home
          </Link>
          <Link href="/size-guide" className="transition-colors hover:text-bone">
            Size guide
          </Link>
          <Link href="/delivery" className="transition-colors hover:text-bone">
            Delivery
          </Link>
          <Link href="/blog" className="transition-colors hover:text-bone">
            Buying guides
          </Link>
        </div>
      </div>
    </section>
  );
}
