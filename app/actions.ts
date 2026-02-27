"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { uploadToCloudinary } from "@/lib/cloudinary"; 
import { normalizeImageSrc } from "@/lib/image";
import { getPredefinedProductTypes } from "@/app/data/productTypes";
import { INVENTORY_DATA } from "@/app/data/inventory";

// --- ADD PRODUCT ---
export async function addProduct(formData: FormData) {
  // 1. SECURITY CHECK: Ensure user is logged in
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized: You must login to post.");
  }

  // 2. Get Form Data
  const name = formData.get("name") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const quantity = parseInt(formData.get("quantity") as string) || 10;
  
  const category = formData.get("category") as string;
  const subCategory = formData.get("subCategory") as string;
  const subSubCategory = formData.get("subSubCategory") as string;
  const sku = formData.get("sku") as string;
  const size = formData.get("size") as string; 

  // 3. IMAGE UPLOAD LOGIC
  const file = formData.get("imageFile") as File;
  let finalImagePath = (formData.get("imageUrl") as string) || "";

  if (file && file.size > 0) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await uploadToCloudinary(buffer);
      finalImagePath = result.secure_url; 
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw new Error("Failed to upload image");
    }
  }

  // 4. Validate
  if (!name || !category || !subCategory || !price) {
    throw new Error("Missing required fields");
  }

  if (!finalImagePath) {
    finalImagePath = resolveDefaultTypeImage(category, subCategory);
  }

  const normalizedImagePath = normalizeImageSrc(finalImagePath);

  // 5. Save to Database with OWNER ID (vendorId)
  await prisma.product.create({
    data: {
      vendorId: userId, // <--- CRITICAL: Links product to the user
      name,
      title,
      description: description || "",
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category,
      subCategory,
      subSubCategory: subSubCategory || "", 
      image: normalizedImagePath,      
      imagePath: normalizedImagePath, 
      price,
      quantity,
      sku: sku || undefined,
      brand: "Generic",
      specs: { size: size || sku || "Standard" },
      isPublished: false,
    },
  });

  revalidatePath("/");
  return { success: true };
}

// --- DELETE PRODUCT (SECURED) ---
export async function deleteProduct(productId: string) {
  // 1. SECURITY CHECK
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    // 2. FETCH PRODUCT TO CHECK OWNERSHIP
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // 3. OWNERSHIP VERIFICATION
    if (product.vendorId !== userId) {
      return { success: false, error: "Forbidden: You can only delete items you created." };
    }

    // 4. DELETE
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "Failed to delete" };
  }
}

// (Get suggestions remains public)
export async function getExistingSubSubCategories(subCategory: string) {
  if (!subCategory) return [];
  try {
    const results = await prisma.product.findMany({
      where: {
        subCategory: { equals: subCategory, mode: "insensitive" },
        subSubCategory: { not: "" },
      },
      select: { subSubCategory: true },
      distinct: ["subSubCategory"],
    });
    return results.map((r) => r.subSubCategory).filter((val): val is string => !!val);
  } catch (error) {
    return [];
  }
}

export async function getProductTypeSuggestions(subCategory: string) {
  if (!subCategory) return [];

  const predefined = getPredefinedProductTypes(subCategory);
  const fromDb = await getExistingSubSubCategories(subCategory);

  return Array.from(
    new Set(
      [...predefined, ...fromDb]
        .map((val) => val.trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));
}

type InventoryItem = {
  name: string;
  imagePath: string;
  categoryId?: string;
  quantity?: number;
};

type InventoryCategory = {
  title: string;
  slug: string;
  parentCategory?: string;
  items: InventoryItem[];
};

const toSlugKey = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const internetFallbackImage = (label: string) =>
  `https://placehold.co/400x400/f3f4f6/00529b.png?text=${encodeURIComponent(label)}&font=roboto`;

async function searchInternetImage(query: string): Promise<string | null> {
  try {
    // Wikimedia is stable for direct image URLs and does not require API keys.
    const url =
      "https://en.wikipedia.org/w/api.php" +
      `?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}` +
      "&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=800&format=json&origin=*";

    const response = await fetch(url, {
      method: "GET",
      cache: "force-cache",
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!response.ok) return null;

    const payload = (await response.json()) as {
      query?: { pages?: Record<string, { thumbnail?: { source?: string } }> };
    };

    const pages = payload.query?.pages;
    if (!pages) return null;

    for (const page of Object.values(pages)) {
      const candidate = page.thumbnail?.source;
      if (candidate && candidate.startsWith("http")) {
        return candidate;
      }
    }
  } catch {
    // Keep UI responsive even if internet lookup fails.
  }

  return null;
}

async function resolveTypeImageWithCache(typeName: string, categoryName: string): Promise<string> {
  const key = `${toSlugKey(categoryName)}:${toSlugKey(typeName)}`;

  try {
    const cached = await prisma.productTypeImageCache.findUnique({ where: { key } });
    if (cached?.imageUrl) return cached.imageUrl;
  } catch {
    // Cache lookup failure should never block page rendering.
  }

  const searchQuery = `${typeName} industrial ${categoryName}`;
  const foundImage = await searchInternetImage(searchQuery);
  const resolved = foundImage || internetFallbackImage(typeName);

  try {
    await prisma.productTypeImageCache.upsert({
      where: { key },
      update: {
        imageUrl: resolved,
        source: foundImage ? "wikimedia" : "fallback",
      },
      create: {
        key,
        imageUrl: resolved,
        source: foundImage ? "wikimedia" : "fallback",
      },
    });
  } catch {
    // No-op: still return resolved URL even if cache write fails.
  }

  return resolved;
}

function resolveDefaultTypeImage(category: string, subCategory: string): string {
  const categoryKey = toSlugKey(category || "");
  const subCategoryKey = (subCategory || "").trim().toLowerCase();

  const matchedCategory = INVENTORY_DATA.find(
    (cat) => cat.slug === categoryKey || toSlugKey(cat.title) === categoryKey
  );
  if (!matchedCategory) return "";

  const matchedItem = matchedCategory.items.find(
    (item) => item.name.trim().toLowerCase() === subCategoryKey
  );
  return matchedItem?.imagePath || "";
}

// Returns predefined + vendor-added product types for customer home page.
export async function getMergedInventoryData(): Promise<InventoryCategory[]> {
  const merged: InventoryCategory[] = INVENTORY_DATA.map((category) => ({
    ...category,
    items: [...category.items],
  }));

  const categoryBySlug = new Map(merged.map((category) => [category.slug, category]));
  const categoryByTitleSlug = new Map(merged.map((category) => [toSlugKey(category.title), category]));

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      status: { in: ["APPROVED", "Approved", "approved"] },
    },
    select: {
      category: true,
      subCategory: true,
      subSubCategory: true,
      image: true,
      imagePath: true,
    },
    orderBy: { createdAt: "desc" },
  });

  for (const product of products) {
    const categoryKey = toSlugKey(product.category || "");
    const targetCategory = categoryBySlug.get(categoryKey) || categoryByTitleSlug.get(categoryKey);
    if (!targetCategory) continue;

    const typeCandidates = [
      (product.subSubCategory || "").trim(),
      (product.subCategory || "").trim(),
    ]
      .filter(Boolean)
      .filter((val, idx, arr) => arr.findIndex((x) => x.toLowerCase() === val.toLowerCase()) === idx);

    if (typeCandidates.length === 0) continue;

    for (const newTypeName of typeCandidates) {
      const normalizedType = newTypeName.toLowerCase();
      const categoryTitle = targetCategory.title.trim().toLowerCase();
      const categorySlug = targetCategory.slug.trim().toLowerCase();
      if (normalizedType === categoryTitle || normalizedType === categorySlug) continue;

      const alreadyExists = targetCategory.items.some(
        (item) => item.name.trim().toLowerCase() === normalizedType
      );
      if (alreadyExists) continue;

      const normalizedVendorImage = normalizeImageSrc(product.image || product.imagePath);
      const resolvedTypeImage =
        normalizedVendorImage !== "/fixkart-logo.png"
          ? normalizedVendorImage
          : await resolveTypeImageWithCache(newTypeName, targetCategory.title);

      targetCategory.items.push({
        name: newTypeName,
        imagePath: resolvedTypeImage,
      });
    }
  }

  return merged;
}
