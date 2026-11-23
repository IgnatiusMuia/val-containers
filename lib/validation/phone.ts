export function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}
