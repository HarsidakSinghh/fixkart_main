import { INVENTORY_DATA } from "@/app/data/inventory";
import { normalizeImageSrc } from "@/lib/image";

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findTypeImageByName(name?: string | null): string | null {
  if (!name) return null;
  const target = normalize(name);
  if (!target) return null;

  for (const category of INVENTORY_DATA) {
    const matched = category.items.find((item) => normalize(item.name) === target);
    if (matched?.imagePath) {
      return normalizeImageSrc(matched.imagePath);
    }
  }

  return null;
}

export function getProductTypeFallbackImage(params: {
  subSubCategory?: string | null;
  subCategory?: string | null;
  listingTitle?: string | null;
}): string {
  const fromSubSubCategory = findTypeImageByName(params.subSubCategory);
  if (fromSubSubCategory) return fromSubSubCategory;

  const fromSubCategory = findTypeImageByName(params.subCategory);
  if (fromSubCategory) return fromSubCategory;

  const fromListingTitle = findTypeImageByName(params.listingTitle);
  if (fromListingTitle) return fromListingTitle;

  return "/fixkart-logo.png";
}
