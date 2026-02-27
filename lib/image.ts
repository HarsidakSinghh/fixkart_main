export function normalizeImageSrc(src: string | null | undefined): string {
  if (!src) return "/fixkart-logo.png";

  const normalized = src.trim().replace(/\\/g, "/");
  const lower = normalized.toLowerCase();
  if (
    lower === "/fastening/anchor.webp" ||
    lower.endsWith("/fastening/anchor.webp") ||
    lower === "fastening/anchor.webp"
  ) {
    // Stable fallback for legacy wedge-anchor references.
    return "/wedge-anchor.webp";
  }
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  if (normalized.startsWith("/")) {
    return normalized;
  }
  return `/${normalized}`;
}
