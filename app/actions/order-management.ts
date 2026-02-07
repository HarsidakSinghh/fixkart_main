"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { sendNotification } from "@/lib/notifications"; // <--- Import Helper

// --- 1. CANCEL ORDER ---
export async function cancelOrderAction(orderId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    // 1. Fetch Order details to find the Vendors involved
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            vendor: { select: { email: true, phone: true, fullName: true } }
          }
        }
      }
    });

    if (!order) return { success: false, error: "Order not found" };

    // 2. Update Status in DB
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" }
    });
    
    // 3. Notify Vendors
    const notifiedVendors = new Set<string>();

    for (const item of order.items) {
      if (item.vendor && item.vendor.email && !notifiedVendors.has(item.vendor.email)) {
        await sendNotification("ORDER_CANCELLED", {
          toEmail: item.vendor.email,
          toPhone: item.vendor.phone,
          name: item.vendor.fullName, // Vendor Name
          orderId: orderId,
          extraMessage: "The customer has cancelled this order."
        });
        notifiedVendors.add(item.vendor.email);
      }
    }
    
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (e) {
    console.error("Cancel Error:", e);
    return { success: false, error: "Failed to cancel order" };
  }
}

// --- 2. RETURN REQUEST ---
export async function submitReturnAction(orderId: string, reason: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    // 1. Fetch Order Items
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { 
          items: { 
             include: { vendor: true } // Need vendor details for notification
          }
        }
    });

    if (!order) return { success: false, error: "Order not found" };

    const notifiedVendors = new Set<string>();

    // 2. Create Refund Request for EACH item
    for (const item of order.items) {
        
        // Avoid duplicate requests
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
                    status: "PENDING"
                }
            });
            
            // Mark Item as Return Requested
            await prisma.orderItem.update({
                where: { id: item.id },
                data: { status: "RETURN_REQUESTED" }
            });

            // Prepare Notification
            if (item.vendor && item.vendor.email) {
                // We send the notification inside the loop or collect unique vendors
                // Here we collect unique vendors to avoid spamming if user bought 10 items from same vendor
                 if(!notifiedVendors.has(item.vendor.email)) {
                    await sendNotification("RETURN_REQUESTED", {
                        toEmail: item.vendor.email,
                        toPhone: item.vendor.phone,
                        name: item.vendor.fullName,
                        orderId: orderId,
                        extraMessage: reason
                    });
                    notifiedVendors.add(item.vendor.email);
                 }
            }
        }
    }

    // 3. Update Main Order Status
    await prisma.order.update({
        where: { id: orderId },
        data: { status: "RETURN_REQUESTED" }
    });
    
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (e) {
    console.error("Return Error:", e);
    return { success: false, error: "Failed to request return" };
  }
}

// --- 3. SUBMIT COMPLAINT (Optional: Add notification if you have an ADMIN email) ---
export async function submitComplaintAction(orderId: string, message: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return { success: false, error: "Order not found" };

    const vendorId = order.items.length > 0 ? order.items[0].vendorId : null;

    await prisma.complaint.create({
      data: {
        orderId: orderId,
        customerId: userId,
        vendorId: vendorId, 
        message: message,
        status: "OPEN"
      }
    });

    // You could add a "COMPLAINT_FILED" notification here to the Admin or Vendor
    
    revalidatePath(`/orders/${orderId}`);
    return { success: true };

  } catch (e) {
    console.error("Complaint Error:", e);
    return { success: false, error: "Failed to submit complaint" };
  }
}