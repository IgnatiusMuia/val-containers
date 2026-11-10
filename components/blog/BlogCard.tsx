import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import { formatDate } from "@/lib/format";
import { Icon } from "@/components/ui/Icons";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col border border-bone/12 bg-coal transition-colors duration-300 hover:border-bone/30"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink">
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ember">
            {post.category}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-bone/30">
            {post.readMinutes} min read
          </span>
        </div>
        <h3 className="mt-3 font-display text-[21px] font-semibold leading-[1.1] tracking-[-0.025em] text-bone">
          {post.title}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-[12px] leading-relaxed text-bone/45">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-bone/10 pt-4">
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-bone/30">
            {formatDate(post.date)}
          </span>
          <Icon
            name="arrow-up-right"
            className="h-3.5 w-3.5 text-bone/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember"
          />
        </div>
      </div>
    </Link>
  );
}
