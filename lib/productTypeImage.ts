
import { INVENTORY_DATA } from "@/app/data/inventory";
import { normalizeImageSrc } from "@/lib/image";

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findTypeImageByName(name?: string | null): string | null {
  if (!name) return null;
  const target = normalize(name);
  if (!target) return null;

  // First try exact match
  for (const category of INVENTORY_DATA) {
    const matched = category.items.find((item) => normalize(item.name) === target);
    if (matched?.imagePath) {
      return normalizeImageSrc(matched.imagePath);
    }
  }

  // Then try partial match - item name contains search term (more specific)
  for (const category of INVENTORY_DATA) {
    const matched = category.items.find((item) => 
      normalize(item.name).includes(target) && target.length > 2
    );
    if (matched?.imagePath) {
      return normalizeImageSrc(matched.imagePath);
    }
  }

  // Finally try partial match - search term contains item name (broader)
  for (const category of INVENTORY_DATA) {
    const matched = category.items.find((item) => 
      target.includes(normalize(item.name)) && normalize(item.name).length > 2
    );
    if (matched?.imagePath) {
      return normalizeImageSrc(matched.imagePath);
    }
  }

  return null;
}

// Get the category image (first item in category) as ultimate fallback
function getCategoryFallbackImage(subCategory?: string | null): string | null {
  if (!subCategory) return null;
  
  const target = normalize(subCategory);
  
  // Find category by matching the category title
  for (const category of INVENTORY_DATA) {
    if (normalize(category.title).includes(target) || target.includes(normalize(category.title))) {
      // Return first item's image as category fallback
      if (category.items.length > 0 && category.items[0].imagePath) {
        return normalizeImageSrc(category.items[0].imagePath);
      }
    }
  }
  
  return null;
}

export function getProductTypeFallbackImage(params: {
  subSubCategory?: string | null;
  subCategory?: string | null;
  listingTitle?: string | null;
}): string {
  // Try subSubCategory first (most specific)
  const fromSubSubCategory = findTypeImageByName(params.subSubCategory);
  if (fromSubSubCategory) return fromSubSubCategory;

  // Try subCategory
  const fromSubCategory = findTypeImageByName(params.subCategory);
  if (fromSubCategory) return fromSubCategory;

  // Try listingTitle
  const fromListingTitle = findTypeImageByName(params.listingTitle);
  if (fromListingTitle) return fromListingTitle;

  // Try category fallback from subCategory
  const fromCategory = getCategoryFallbackImage(params.subCategory);
  if (fromCategory) return fromCategory;

  return "/fixkart-logo.png";
}

