"use client";

import { useState, useActionState } from "react";
// [FIX] Import the type from the action file
import { uploadReturnDocuments, ReturnDocsState } from "@/app/actions/return-docs";
import { UploadCloud, FileText, CheckCircle } from "lucide-react";

// [FIX] Define initial state using the specific type
const initialState: ReturnDocsState = {
  error: "",
  success: false
};

export default function ReturnDocsUploader({ orderItemId, existingSlips, existingBills }: { 
  orderItemId: string,
  existingSlips: string[],
  existingBills: string[]
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // [FIX] Now types match perfectly
  const [state, formAction, isPending] = useActionState(uploadReturnDocuments, initialState);

  // If already uploaded, show a success badge
  if (existingSlips.length > 0 || existingBills.length > 0 || state.success) {
    return (
      <div className="mt-2 text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 p-2 rounded w-fit">
        <CheckCircle size={14} /> Return Documents Uploaded
      </div>
    );
  }

  return (
    <div className="mt-2">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="text-xs flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-100 font-bold transition"
        >
          <UploadCloud size={14} /> Upload Transport Details
        </button>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 animate-in fade-in slide-in-from-top-2">
          <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText size={16} /> Upload Return Details
          </h4>

          <form action={async (formData) => {
            await formAction(formData);
            // Note: We don't strictly setOpen(false) here because useActionState doesn't promise immediate resolution in the same tick easily without effects, 
            // but the state.success check above will hide the form automatically on success re-render.
            if (!state?.error) setIsOpen(false);
          }} className="space-y-4">
            <input type="hidden" name="orderItemId" value={orderItemId} />

            {/* Transport Slip Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Transport Slip (Courier Receipt)</label>
              <input 
                type="file" 
                name="transportSlips" 
                multiple 
                accept="image/*,application/pdf"
                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Return Bill Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Return Bill / Invoice</label>
              <input 
                type="file" 
                name="returnBills" 
                multiple 
                accept="image/*,application/pdf"
                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex gap-2 pt-2">
               <button 
                  type="submit" 
                  disabled={isPending}
                  className="flex-1 bg-blue-600 text-white py-1.5 rounded text-xs font-bold hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-70"
               >
                  {isPending ? "Uploading..." : "Submit Docs"}
               </button>
               <button 
                 type="button" 
                 onClick={() => setIsOpen(false)}
                 className="flex-1 bg-white border border-gray-300 text-gray-700 py-1.5 rounded text-xs font-bold hover:bg-gray-50"
               >
                 Cancel
               </button>
            </div>
            
            {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}