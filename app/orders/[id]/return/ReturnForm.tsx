"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitReturnRequest } from "@/app/actions/customer-requests";
import { UploadCloud, Loader2 } from "lucide-react";

const initialState = {
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-70 flex justify-center items-center gap-2"
    >
      {pending ? <Loader2 className="animate-spin" /> : "Submit Return Request"}
    </button>
  );
}

export default function ReturnForm({ orderId }: { orderId: string }) {
  const [state, formAction] = useFormState(submitReturnRequest, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="orderId" value={orderId} />
      
      {/* Show Error Message if exists */}
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
          ⚠️ {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Return</label>
        <select name="reason" required className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-red-500 outline-none">
            <option value="">Select a reason</option>
            <option value="Damaged Product">Damaged Product</option>
            <option value="Wrong Item">Wrong Item Received</option>
            <option value="Quality Issue">Quality Issue</option>
            <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Proofs (Max 5) <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative group">
            <UploadCloud className="text-gray-400 mb-2 group-hover:text-red-500 transition" />
            <p className="text-xs text-gray-500">Click to upload multiple images</p>
            {/* [FIX] Added 'multiple' attribute and changed name to 'proofImages' */}
            <input 
              type="file" 
              name="proofImages" 
              multiple 
              accept="image/*" 
              required 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}