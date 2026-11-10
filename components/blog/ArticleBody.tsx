import type { BlogBlock } from "@/data/blog";

function renderList(items: string[], ordered: boolean) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={
        ordered
          ? "my-5 list-decimal space-y-2 pl-5 text-[14px] leading-relaxed text-ink/70 marker:font-mono marker:text-[11px] marker:text-ember-deep"
          : "my-5 space-y-2 pl-5 [list-style-type:square] text-[14px] leading-relaxed text-ink/70 marker:text-ember-deep"
      }
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </Tag>
  );
}

export function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div>
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return (
            <p
              key={index}
              className="mb-5 text-[14.5px] leading-[1.85] text-ink/70"
            >
              {block.text}
            </p>
          );
        }

        if (block.type === "h2") {
          return (
            <h2
              key={index}
              className="mb-4 mt-11 font-display text-[clamp(1.55rem,2.8vw,2.15rem)] font-bold leading-[1.08] tracking-[-0.035em] text-ink"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "h3") {
          return (
            <h3
              key={index}
              className="mb-3 mt-8 font-display text-[20px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "ul" || block.type === "ol") {
          return <div key={index}>{renderList(block.items, block.type === "ol")}</div>;
        }

        if (block.type === "table") {
          return (
            <div key={index} className="my-7 overflow-x-auto border border-ink/12">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="bg-bone-2/60">
                    {block.head.map((cell) => (
                      <th
                        key={cell}
                        className="border-b border-ink/15 px-3 py-3 font-mono text-[8.5px] font-normal uppercase tracking-[0.1em] text-ink/50"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr key={row.join("-")} className="border-b border-ink/10 last:border-b-0">
                      {row.map((cell) => (
                        <td
                          key={cell}
                          className="px-3 py-3 text-[12px] leading-snug text-ink/70"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "callout") {
          return (
            <aside
              key={index}
              className="my-7 border-l-2 border-ember bg-bone-2/60 p-5"
            >
              <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ember-deep">
                {block.title}
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/75">
                {block.text}
              </p>
            </aside>
          );
        }

        return (
          <figure key={index} className="my-9 border-y border-ink/12 py-6">
            <blockquote className="font-display text-[clamp(1.25rem,2.4vw,1.7rem)] font-medium leading-[1.35] tracking-[-0.02em] text-ink">
              &ldquo;{block.text}&rdquo;
            </blockquote>
            {block.cite ? (
              <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40">
                {block.cite}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
