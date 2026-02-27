export function normalizeImageSrc(src: string | null | undefined): string {
  if (!src) return "/fixkart-logo.png";

  const normalized = src.trim().replace(/\\/g, "/");
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  if (normalized.startsWith("/")) {
    return normalized;
  }
  return `/${normalized}`;
}
