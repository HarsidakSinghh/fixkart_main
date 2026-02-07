"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { uploadToCloudinary } from "@/lib/cloudinary"; 

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
      image: finalImagePath,      
      imagePath: finalImagePath, 
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
      where: { subCategory: subCategory, subSubCategory: { not: "" } },
      select: { subSubCategory: true },
      distinct: ["subSubCategory"],
    });
    return results.map((r) => r.subSubCategory).filter((val): val is string => !!val);
  } catch (error) {
    return [];
  }
}