export function formatKES(value: number) {
  return `KES ${value.toLocaleString("en-KE")}`;
}

export function formatCompactKES(value: number) {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `KES ${millions.toFixed(millions % 1 === 0 ? 0 : 1)}M`;
  }
  return `KES ${Math.round(value / 1_000)}K`;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 210));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
