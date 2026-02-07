"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitComplaint } from "@/app/actions/customer-requests";
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
      className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-70 flex justify-center items-center gap-2"
    >
      {pending ? <Loader2 className="animate-spin" /> : "Submit Complaint"}
    </button>
  );
}

export default function ComplaintForm({ orderId }: { orderId: string }) {
  const [state, formAction] = useFormState(submitComplaint, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="orderId" value={orderId} />
      
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
          ⚠️ {state.error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Describe your issue</label>
        <textarea 
            name="message" 
            required 
            rows={5}
            placeholder="Please describe the problem in detail..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Proofs (Max 5) <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative group">
          <UploadCloud className="text-gray-400 mb-2 group-hover:text-orange-500 transition" />
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