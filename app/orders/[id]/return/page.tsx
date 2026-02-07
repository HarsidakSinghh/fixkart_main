import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ReturnForm from "./ReturnForm"; // <--- Import the new component

export default async function ReturnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } }
  });

  if (!order || order.customerId !== userId) {
    return <div className="p-10 text-center">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-sm border p-6">
        <Link href={`/orders/${id}`} className="flex items-center text-sm text-gray-500 mb-6 hover:text-blue-600">
          <ChevronLeft size={16} /> Back to Order
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Return</h1>
        <p className="text-gray-500 text-sm mb-6">Order #{order.id.slice(-8).toUpperCase()}</p>

        {/* ITEMS PREVIEW (Kept in Server Component) */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Returning Items:</p>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-12 h-12 bg-white rounded border flex-shrink-0">
                   {item.product.image && (
                     <Image 
                       src={item.product.image} 
                       alt={item.product.name} 
                       fill 
                       className="object-contain p-1" 
                     />
                   )}
                </div>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* [FIX] Use the Client Component here */}
        <ReturnForm orderId={order.id} />
        
      </div>
    </div>
  );
}