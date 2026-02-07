"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Define Types
type CartItem = {
  productId: string;
  vendorId: string;
  quantity: number;
  price: number;
};

type Address = {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
};

export async function placeOrder(userId: string, cartItems: CartItem[], totalAmount: number, address: Address) {
  try {
    // 1. Validate Address
    if (!address) {
      throw new Error("Delivery address is missing.");
    }

    console.log("📦 Processing Order for:", address.name);

    // 2. Start Transaction (Create Order + Deduct Stock)
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Create the Order
      const newOrder = await tx.order.create({
        data: {
          customerId: userId,
          customerName: address.name,
          totalAmount: totalAmount, // Matches your Schema
          status: "PENDING",
          
          // --- FIX: Add the required Address field ---
          address: JSON.stringify(address), 
          
          // Link Items
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              vendorId: item.vendorId, 
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      // B. DEDUCT STOCK IMMEDIATELY (Real-time)
      for (const item of cartItems) {
        // Check if product exists and has stock
        const product = await tx.product.findUnique({ where: { id: item.productId } });

        if (!product || product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for: ${product?.name || "Unknown Item"}`);
        }

        // Decrement Quantity
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: item.quantity } // Stock goes DOWN
          }
        });
      }

      return newOrder;
    });

    console.log("✅ Order Placed:", result.id);

    // 3. Refresh UI
    revalidatePath("/vendor/inventory");
    revalidatePath("/vendor/orders");
    revalidatePath("/orders");
    
    return { success: true, orderId: result.id };

  } catch (error) {
    console.error("❌ Order Failed:", error);
    return { success: false, error: (error as Error).message || "Order failed" };
  }
}