export const ADMIN_ACTIVITY_COOKIE = "vc-admin-activity";
export const ADMIN_IDLE_SECONDS = 60 * 60 * 8;

export const adminActivityCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ADMIN_IDLE_SECONDS,
};
