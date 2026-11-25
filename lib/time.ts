import "server-only";

export async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function currentMonthYear() {
  "use cache";
  return new Intl.DateTimeFormat("en-KE", {
    month: "long",
    year: "numeric",
  }).format(new Date());
}
