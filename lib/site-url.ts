const fallbackUrl =
  process.env.NODE_ENV === "production"
    ? "https://val-containers.vercel.app"
    : "http://localhost:3000";

export function canonicalSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // Fall through to the environment default.
    }
  }
  return fallbackUrl;
}

export function safeAdminNext(rawNext: string | null, origin: string) {
  if (!rawNext || !rawNext.startsWith("/") || rawNext.startsWith("//")) {
    return "/admin";
  }
  if (rawNext.includes("\\") || /[\u0000-\u001f]/.test(rawNext)) {
    return "/admin";
  }

  try {
    const url = new URL(rawNext, origin);
    if (url.origin !== origin) return "/admin";
    if (!url.pathname.startsWith("/admin")) return "/admin";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/admin";
  }
}
