"use client";

import { useState } from "react";
import Link from "next/link";
import { cancelOrderAction } from "@/app/actions/order-management"; 
import { AlertTriangle, RotateCcw, MessageSquare, XCircle, Loader2, CheckCircle } from "lucide-react";

interface OrderActionsProps {
  orderId: string;
  status: string;
  isDelivered: boolean;
  canReturn: boolean;
}

export default function OrderActions({ orderId, status, isDelivered, canReturn }: OrderActionsProps) {
  const [loading, setLoading] = useState(false);

  // --- 1. CANCEL HANDLER (Still done directly here) ---
  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;
    
    setLoading(true);
    const res = await cancelOrderAction(orderId);
    setLoading(false);
    
    if (res.success) {
      alert("Order Cancelled Successfully");
    } else {
      alert("Failed: " + res.error);
    }
  };

  // If Cancelled, don't show any actions
  if (status === "CANCELLED") return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-end">
      
      {/* 1. CANCEL BUTTON (Visible if Not Shipped/Delivered/Returned/Return Requested) */}
      {!isDelivered && status !== "SHIPPED" && status !== "RETURN_REQUESTED" && status !== "RETURNED" && (
        <button 
          onClick={handleCancel}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors border border-red-200"
        >
          {loading ? <Loader2 className="animate-spin" size={18}/> : <XCircle size={18} />} 
          Cancel Order
        </button>
      )}

      {/* 2. RETURN BUTTON (Links to dedicated page) */}
      {/* Visible only if Delivered & within valid time & not already returned */}
      {isDelivered && canReturn && status !== "RETURN_REQUESTED" && status !== "RETURNED" && (
        <Link href={`/orders/${orderId}/return`}>
            <button 
            className="flex items-center gap-2 px-6 py-3 bg-orange-50 text-orange-600 rounded-lg font-bold hover:bg-orange-100 transition-colors border border-orange-200"
            >
            <RotateCcw size={18} />
            Return Order
            </button>
        </Link>
      )}

      {/* 3. COMPLAINT BUTTON (Links to dedicated page) */}
      {/* Visible if Delivered */}
      {isDelivered && (
        <Link href={`/orders/${orderId}/complaint`}>
            <button 
            className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition-colors border border-gray-200"
            >
            <MessageSquare size={18} /> 
            Raise Complaint
            </button>
        </Link>
      )}

      {/* 4. RETURN PENDING MESSAGE */}
      {status === "RETURN_REQUESTED" && (
        <div className="flex items-center gap-2 px-6 py-3 bg-yellow-50 text-yellow-800 rounded-lg font-bold border border-yellow-200">
           <Loader2 className="animate-spin" size={18} />
           Return Under Review
        </div>
      )}

      {/* 5. RETURN APPROVED MESSAGE */}
      {status === "RETURNED" && (
        <div className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-lg font-bold border border-green-200">
           <CheckCircle size={18} />
           Return Approved & Processed
        </div>
      )}

    </div>
  );
}