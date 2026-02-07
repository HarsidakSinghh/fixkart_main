"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { uploadToCloudinary } from "@/lib/cloudinary"; 
import { revalidatePath } from "next/cache";

// [FIX] Define a strict type for the state
export type ReturnDocsState = {
  error?: string;
  success?: boolean;
};

// [FIX] Apply the type to prevState and the return Promise
export async function uploadReturnDocuments(
  prevState: ReturnDocsState, 
  formData: FormData
): Promise<ReturnDocsState> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const orderItemId = formData.get("orderItemId") as string;
  const slipFiles = formData.getAll("transportSlips") as File[];
  const billFiles = formData.getAll("returnBills") as File[];

  if (slipFiles.length === 0 && billFiles.length === 0) {
    return { error: "Please upload at least one document." };
  }

  try {
    const slipUrls: string[] = [];
    const billUrls: string[] = [];

    // 1. Upload Transport Slips
    for (const file of slipFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const res = await uploadToCloudinary(buffer);
        slipUrls.push(res.secure_url);
      }
    }

    // 2. Upload Return Bills
    for (const file of billFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const res = await uploadToCloudinary(buffer);
        billUrls.push(res.secure_url);
      }
    }

    // 3. Update Database
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        transportSlipUrl: slipUrls,
        billUrl: billUrls
      }
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return { error: "Failed to upload documents." };
  }

  revalidatePath("/orders");
  return { success: true };
}