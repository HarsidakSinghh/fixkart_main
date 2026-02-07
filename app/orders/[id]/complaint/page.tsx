import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeft, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import ComplaintForm from "./ComplaintForm"; // <--- Import the new component

export default async function ComplaintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();

  // 1. Fetch Order
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order || order.customerId !== userId) {
    return <div className="p-10 text-center">Order not found</div>;
  }

  // 2. CHECK FOR EXISTING COMPLAINT
  const existingComplaint = await prisma.complaint.findFirst({
    where: {
      orderId: id,
      customerId: userId
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-sm border p-6">
        
        <Link href={`/orders/${id}`} className="flex items-center text-sm text-gray-500 mb-6 hover:text-blue-600">
          <ChevronLeft size={16} /> Back to Order
        </Link>

        {existingComplaint ? (
           <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket is Open</h2>
              <p className="text-gray-600 mb-6">
                 We have received your complaint for Order <strong>#{order.id.slice(-8).toUpperCase()}</strong>.
              </p>
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-left mb-6">
                 <div className="flex gap-3">
                    <Clock className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                       <p className="font-bold text-blue-900 text-sm">FixKart Support is on it!</p>
                       <p className="text-blue-700 text-sm mt-1">
                         Our team will investigate the issue and resolve it very soon. You will receive an email update once we take action.
                       </p>
                    </div>
                 </div>
              </div>

              <div className="bg-gray-50 p-4 rounded text-sm text-gray-500 text-left">
                 <p><strong>Ticket ID:</strong> #{existingComplaint.id.slice(-6).toUpperCase()}</p>
                 <p><strong>Status:</strong> <span className="uppercase font-bold text-orange-600">{existingComplaint.status}</span></p>
                 <p className="mt-2 text-xs italic">" {existingComplaint.message} "</p>
              </div>

              <Link href={`/orders/${id}`}>
                 <button className="mt-8 w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition">
                    Return to Order Details
                 </button>
              </Link>
           </div>
        ) : (
           <>
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                    <AlertTriangle size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Raise a Complaint</h1>
            </div>
            <p className="text-gray-500 text-sm mb-6 ml-12">Order #{order.id.slice(-8).toUpperCase()}</p>

            {/* [FIX] Use the Client Component here */}
            <ComplaintForm orderId={order.id} />
           </>
        )}
      </div>
    </div>
  );
}