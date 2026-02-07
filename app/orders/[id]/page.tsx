import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Check, Truck, Package, XCircle, FileText, Download, Clock } from "lucide-react";
import OrderActions from "../../components/OrderActions"; 
import ReturnDocsUploader from "@/components/ReturnDocsUploader"; 

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) return <div>Please sign in.</div>;

  // 1. Fetch Full Order Details
  const order = await prisma.order.findUnique({
    where: { id: id },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order || order.customerId !== userId) {
    return notFound();
  }

  // Parse Address
  let address: any = {};
  try {
    address = JSON.parse(order.address || "{}");
  } catch (e) {
    address = { street: order.address }; 
  }

  // 2. Determine Overall Status
  const isShipped = order.items.some(i => i.status === "SHIPPED" || i.status === "DELIVERED");
  const isDelivered = order.items.every(i => i.status === "DELIVERED") && order.items.length > 0;
  const isCancelled = order.status === "CANCELLED";
  const isReturned = order.items.some(i => i.status === "RETURNED");

  // 3. Return Logic Helper
  const canReturn = isDelivered && !isReturned && order.items.some(item => {
    const dateToCheck = item.deliveryDate || item.product.updatedAt || new Date(); 
    const diffTime = Math.abs(new Date().getTime() - new Date(dateToCheck).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7; 
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
             <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</h1>
             <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt).toDateString()}</p>
          </div>
          <Link href="/orders" className="text-sm font-bold text-[#00529b] hover:underline">
            &larr; Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: ORDER ITEMS & TRACKER */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. STATUS STEPPER */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h3 className="font-bold text-gray-800 mb-6">Order Status</h3>
               {isCancelled ? (
                 <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                   <XCircle /> This order has been cancelled.
                 </div>
               ) : (
                 <div className="relative flex items-center justify-between w-full">
                   {/* Progress Bar Background */}
                   <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0"></div>
                   {/* Active Progress */}
                   <div className={`absolute top-1/2 left-0 h-1 bg-green-500 -z-0 transition-all duration-500 ${
                     isDelivered ? "w-full" : isShipped ? "w-2/3" : "w-1/3"
                   }`}></div>

                   {/* Step 1: Placed */}
                   <div className="relative z-10 bg-white p-1">
                     <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                       <Check size={16} />
                     </div>
                     <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold">Placed</p>
                   </div>

                   {/* Step 2: Shipped */}
                   <div className="relative z-10 bg-white p-1">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isShipped ? "bg-green-500" : "bg-gray-300"}`}>
                       <Truck size={16} />
                     </div>
                     <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500">Shipped</p>
                   </div>

                   {/* Step 3: Delivered */}
                   <div className="relative z-10 bg-white p-1">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isDelivered ? "bg-green-500" : "bg-gray-300"}`}>
                       <Package size={16} />
                     </div>
                     <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500">Delivered</p>
                   </div>
                 </div>
               )}
               <div className="mt-8"></div> 
            </div>

            {/* 2. ITEMS LIST */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700">
                Items in this Order
              </div>
              <div className="p-6 space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.product.image || "/placeholder.png"} 
                        alt="Product" 
                        fill 
                        className="object-contain p-2" 
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 line-clamp-2">{item.product.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                      
                      {/* --- STATUS & UPLOAD SECTION --- */}
                      <div className="flex flex-wrap gap-2 items-center mt-2">
                          {/* Status Badge */}
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                            item.status === "RETURNED" ? "bg-red-100 text-red-700" : 
                            item.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}>
                            {item.status}
                          </span>

                          {/* --- 2. UPLOAD BUTTON (Only if RETURNED) --- */}
                          {item.status === "RETURNED" && (
                             <ReturnDocsUploader 
                                orderItemId={item.id} 
                                // [FIX] Remove extra brackets. The field is already a String[] (Array).
                                existingSlips={item.transportSlipUrl || []} 
                                existingBills={item.billUrl || []}
                             />
                          )}
                      </div>
                    </div>
                    <div className="font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: ADDRESS & SUMMARY */}
          <div className="space-y-6">
            
            {/* Shipping Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Shipping Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="font-bold text-sm text-gray-900">{address.name}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {address.street}, {address.city}, {address.state} - {address.postalCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={18} />
                  <p className="text-sm text-gray-600">{address.phone}</p>
                </div>
              </div>
            </div>

            {/* DOCUMENTS SECTION */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                <FileText size={18}/> Documents
              </h3>
              <div className="space-y-3">
                
                {/* 1. PURCHASE ORDER LINK */}
                {/* @ts-ignore - Assuming customerPoUrl exists on Order in your schema */}
                {order.customerPoUrl ? (
                    <a 
                        // @ts-ignore
                        href={order.customerPoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                    >
                        <div className="flex items-center gap-2">
                            <FileText size={18}/>
                            <span className="text-sm font-semibold">Purchase Order</span>
                        </div>
                        <Download size={16}/>
                    </a>
                ) : (
                    <div className="p-3 bg-gray-50 text-gray-400 rounded-lg text-sm flex items-center gap-2">
                        <Clock size={18}/> 
                        <span>PO Processing...</span>
                    </div>
                )}

                {/* 2. TAX INVOICE LINK */}
                {/* @ts-ignore - Assuming invoiceUrl exists on Order in your schema */}
                {order.invoiceUrl ? (
                    <a 
                        // @ts-ignore
                        href={order.invoiceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                    >
                        <div className="flex items-center gap-2">
                            <FileText size={18}/>
                            <span className="text-sm font-semibold">Tax Invoice</span>
                        </div>
                        <Download size={16}/>
                    </a>
                ) : (
                    <div className="p-3 bg-gray-50 text-gray-400 rounded-lg text-sm flex items-center gap-2">
                          <Clock size={18}/> 
                          <span>Invoice Pending Delivery</span>
                    </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="mt-8">
           <OrderActions 
             orderId={order.id} 
             status={isReturned ? "RETURNED" : order.status} 
             isDelivered={isDelivered}
             canReturn={canReturn}
           />
        </div>

      </div>
    </div>
  );
}