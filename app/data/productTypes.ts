// Predefined product type suggestions by sub-category (lowercase keys).
// Vendors can still add new types; those get merged from DB at runtime.
export const PREDEFINED_PRODUCT_TYPES: Record<string, string[]> = {
  "wedge anchor": [
    "M6 Wedge Anchor",
    "M8 Wedge Anchor",
    "M10 Wedge Anchor",
    "M12 Wedge Anchor",
    "SS Wedge Anchor",
    "Zinc Plated Wedge Anchor",
  ],
  studs: [
    "Full Thread Stud",
    "Double End Stud",
    "Tap End Stud",
  ],
  "threaded rods": [
    "B7 Threaded Rod",
    "SS304 Threaded Rod",
    "SS316 Threaded Rod",
    "Zinc Plated Threaded Rod",
  ],
  nuts: [
    "Hex Nut",
    "Nylock Nut",
    "Flange Nut",
    "Coupling Nut",
  ],
  washers: [
    "Plain Washer",
    "Spring Washer",
    "Star Washer",
    "Fender Washer",
  ],
};

export function getPredefinedProductTypes(subCategory: string): string[] {
  const key = subCategory.trim().toLowerCase();
  return PREDEFINED_PRODUCT_TYPES[key] || [];
}
