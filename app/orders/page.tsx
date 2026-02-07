import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-xl font-bold mb-4">Please sign in to view your orders.</h1>
        <Link href="/" className="text-[#00529b] underline">Go Home</Link>
      </div>
    );
  }

  // 1. UPDATE QUERY: Fetch items AND their product details (to get the image)
  const orders = await prisma.order.findMany({
    where: { customerId: userId },
    include: { 
      items: {
        include: {
          product: true // <--- Now we have access to product.image
        }
      } 
    }, 
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Package className="text-[#00529b]" /> My Orders
        </h1>

        <div className="space-y-4">
          {orders.map((order) => {
            // Get the first product image as the preview
            const firstItem = order.items[0];
            const previewImage = firstItem?.product?.image || "https://placehold.co/100?text=No+Image";

            return (
              <Link 
                href={`/orders/${order.id}`} 
                key={order.id} 
                className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-4 md:p-6"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  
                  {/* --- NEW: PRODUCT THUMBNAIL --- */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                    <Image 
                      src={previewImage}
                      alt="Order Preview"
                      fill
                      className="object-contain p-2"
                    />
                    {order.items.length > 1 && (
                      <div className="absolute bottom-0 right-0 bg-gray-900/80 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md font-bold">
                        +{order.items.length - 1} more
                      </div>
                    )}
                  </div>

                  {/* Middle: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs text-gray-500 hidden md:inline">#{order.id.slice(-8).toUpperCase()}</span>
                      <span className="text-sm font-bold text-gray-900 truncate">
                        {firstItem?.product.name || "Unknown Product"}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-1">
                       Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      Total: <span className="font-bold">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                    </p>
                  </div>

                  {/* Right: Status */}
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide ${
                      order.status === "APPROVED" || order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.status}
                    </div>
                    <ChevronRight className="text-gray-300 hidden md:block" />
                  </div>

                </div>
              </Link>
            );
          })}

          {orders.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500">No orders found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}