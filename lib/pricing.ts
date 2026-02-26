type RawSpecs = Record<string, unknown> | null | undefined;

const COMMISSION_KEY_PATTERN = /(commi|margin|markup)/i;

function parsePercent(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const match = value.match(/-?\d+(\.\d+)?/);
    if (!match) return null;
    const parsed = Number.parseFloat(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function getCommissionPercent(specs: RawSpecs): number {
  if (!specs || typeof specs !== "object") return 0;

  for (const [key, value] of Object.entries(specs)) {
    if (!COMMISSION_KEY_PATTERN.test(key)) continue;
    const percent = parsePercent(value);
    if (percent !== null) return percent;
  }

  return 0;
}

export function getFinalCustomerPrice(basePrice: number, specs: RawSpecs): number {
  const safeBasePrice = Number.isFinite(basePrice) ? Math.max(0, basePrice) : 0;
  const commissionPercent = Math.max(0, getCommissionPercent(specs));
  const finalPrice = safeBasePrice + (safeBasePrice * commissionPercent) / 100;
  return Math.round(finalPrice * 100) / 100;
}

export function stripCommissionSpecs(specs: RawSpecs): Record<string, string> {
  if (!specs || typeof specs !== "object") return {};

  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(specs)) {
    if (COMMISSION_KEY_PATTERN.test(key)) continue;
    if (value == null) continue;
    cleaned[key] = String(value);
  }
  return cleaned;
}
