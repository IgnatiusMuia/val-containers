export const ADMIN_PERMISSIONS = [
  "inventory",
  "media",
  "enquiries",
  "content",
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export const permissionLabels: Record<AdminPermission, string> = {
  inventory: "Inventory",
  media: "Media",
  enquiries: "Enquiries",
  content: "Content",
};
