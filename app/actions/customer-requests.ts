"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { uploadToCloudinary } from "@/lib/cloudinary"; 
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendNotification } from "@/lib/notifications"; 

// --- 1. SUBMIT RETURN REQUEST ---
export async function submitReturnRequest(prevState: any, formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const orderId = formData.get("orderId") as string;
  const reason = formData.get("reason") as string;
  
  // [FIX] Get all files instead of just one
  const files = formData.getAll("proofImages") as File[];
  
  if (!files || files.length === 0 || files[0].size === 0) {
    return { error: "At least one image proof is compulsory." };
  }

  // Limit max files (optional safeguard)
  if (files.length > 5) {
    return { error: "You can upload a maximum of 5 images." };
  }

  const uploadedUrls: string[] = [];

  try {
    // [FIX] Loop through files and upload
    for (const file of files) {
        if (file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await uploadToCloudinary(buffer);
            uploadedUrls.push(uploadResult.secure_url);
        }
    }
    
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { 
          items: {
            include: {
              vendor: { select: { email: true, phone: true, fullName: true, userId: true } }
            }
          } 
        }
    });

    if(!order) return { error: "Order not found" };

    const vendorsToNotify = new Map(); 

    for (const item of order.items) {
        const existing = await prisma.refundRequest.findUnique({
            where: { orderItemId: item.id }
        });

        if (!existing) {
            await prisma.refundRequest.create({
                data: {
                    orderItemId: item.id,
                    vendorId: item.vendorId,
                    customerId: userId,
                    reason: reason,
                    status: "PENDING",
                    proofImages: uploadedUrls // [FIX] Save the array of URLs
                }
            });
            
            await prisma.orderItem.update({
                where: { id: item.id },
                data: { status: "RETURN_REQUESTED" }
            });

            if (item.vendor && item.vendor.email) {
                vendorsToNotify.set(item.vendor.email, item.vendor);
            }
        }
    }

    await prisma.order.update({
        where: { id: orderId },
        data: { status: "RETURN_REQUESTED" }
    });

    for (const [email, vendor] of vendorsToNotify) {
        await sendNotification("RETURN_REQUESTED", {
            toEmail: email,
            toPhone: vendor.phone,
            name: vendor.fullName,
            orderId: orderId,
            extraMessage: reason 
        });
    }

  } catch (error) {
    console.error(error);
    return { error: "Failed to submit return request. Please try again." };
  }

  revalidatePath(`/orders/${orderId}`);
  redirect(`/orders/${orderId}`);
}

// --- 2. SUBMIT COMPLAINT ---
export async function submitComplaint(prevState: any, formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const orderId = formData.get("orderId") as string;
  const message = formData.get("message") as string;
  
  // [FIX] Get all files
  const files = formData.getAll("proofImages") as File[];

  if (!files || files.length === 0 || files[0].size === 0) {
    return { error: "At least one image proof is compulsory." };
  }

  if (files.length > 5) {
    return { error: "You can upload a maximum of 5 images." };
  }

  const uploadedUrls: string[] = [];

  try {
    const order = await prisma.order.findUnique({
       where: { id: orderId },
       include: { 
         items: { select: { vendorId: true } } 
       }
    });

    if (!order) return { error: "Order not found" };

    const vendorId = order.items[0]?.vendorId;

    // [FIX] Loop through files and upload
    for (const file of files) {
        if (file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await uploadToCloudinary(buffer);
            uploadedUrls.push(uploadResult.secure_url);
        }
    }

    await prisma.complaint.create({
      data: {
        orderId: orderId,
        customerId: userId,
        vendorId: vendorId,
        message: message,
        status: "OPEN",
        proofImages: uploadedUrls // [FIX] Save array
      }
    });

  } catch (error) {
    console.error(error);
    return { error: "Failed to submit complaint. Please try again." };
  }

  revalidatePath(`/orders/${orderId}`);
  redirect(`/orders/${orderId}`);
}