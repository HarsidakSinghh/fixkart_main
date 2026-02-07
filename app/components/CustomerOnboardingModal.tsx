"use client";

import React, { useState } from "react";
import { registerCustomer } from "@/app/actions/customer";
import { useUser } from "@clerk/nextjs";

interface CustomerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomerOnboardingModal({ isOpen, onClose, onSuccess }: CustomerOnboardingModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    } else {
      alert("Geolocation is not supported.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // GPS
      if (coords) {
        formData.set("gpsLat", coords.lat.toString());
        formData.set("gpsLng", coords.lng.toString());
      }

      // Check File Size
      const fileInputs = Array.from(formData.entries()).filter(([key, val]) => val instanceof File);
      const totalSize = fileInputs.reduce((acc, [_, file]) => acc + (file as File).size, 0);
      const sizeInMB = totalSize / (1024 * 1024);

      if (sizeInMB > 15) {
         const proceed = window.confirm(`⚠️ Large Upload Detected (${sizeInMB.toFixed(1)} MB). Continue?`);
         if (!proceed) {
            setLoading(false);
            return;
         }
      }

      const res = await registerCustomer(formData);

      if (res.success) {
        onSuccess(); // Close modal and proceed to checkout
      } else {
        alert("Registration failed: " + (res.error || "Check inputs."));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#00529b] p-6 text-white flex-shrink-0 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Complete B2B Profile</h2>
            <p className="text-blue-100 text-sm mt-1">One-time registration required for first order.</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold">&times;</button>
        </div>

        {/* Scrollable Form Area */}
        <div className="overflow-y-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. BASIC INFO */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">1. Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="fullName" placeholder="Full Name *" required defaultValue={user?.fullName || ""} className="p-3 border rounded" />
                <input name="companyName" placeholder="Company Name *" required className="p-3 border rounded" />
                <input name="phone" placeholder="Phone Number *" required className="p-3 border rounded" />
                <input name="email" type="email" placeholder="Email *" required defaultValue={user?.primaryEmailAddress?.emailAddress || ""} className="p-3 border rounded" />
                <input name="address" placeholder="Physical Address *" required className="p-3 border rounded md:col-span-2" />
                <div className="grid grid-cols-3 gap-2 md:col-span-2">
                  <input name="city" placeholder="City *" required className="p-3 border rounded" />
                  <input name="state" placeholder="State *" required className="p-3 border rounded" />
                  <input name="postalCode" placeholder="Postal Code *" required className="p-3 border rounded" />
                </div>
              </div>
            </div>

            {/* 2. BUSINESS DETAILS */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">2. Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                   <label className="block text-sm font-bold text-gray-700 mb-1">Business Type *</label>
                   <select name="businessType" required className="w-full p-3 border rounded bg-white">
                     <option value="" disabled selected>Select...</option>
                     <option value="Retailer">Retailer</option>
                     <option value="Wholesaler">Wholesaler</option>
                     <option value="Manufacturer">Manufacturer</option>
                     <option value="Exporter">Exporter</option>
                     <option value="Contractor">Contractor</option>
                   </select>
                 </div>
                 <input name="gstNumber" placeholder="GST Number" className="p-3 border rounded" />
                 <input name="tradeLicense" placeholder="Trade License / Udyam No." className="p-3 border rounded" />
                 <input name="yearsInBusiness" placeholder="Years in Business" className="p-3 border rounded md:col-span-2" />
                 
                 {/* Files */}
                 <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">GST Certificate</label><input type="file" name="gstCertificate" className="block w-full text-sm" /></div>
                 <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">MSME Certificate</label><input type="file" name="msmeCertificate" className="block w-full text-sm" /></div>
                 <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Aadhar Card (Front/Back)</label><input type="file" name="aadharCard" required className="block w-full text-sm" /></div>
                 <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">PAN Card</label><input type="file" name="panCard" required className="block w-full text-sm" /></div>
                 <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Owner Photo</label><input type="file" name="ownerPhoto" required className="block w-full text-sm" /></div>
              </div>
            </div>

            {/* 3. BANKING DETAILS */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">3. Banking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="bankName" placeholder="Bank Name *" required className="p-3 border rounded" />
                <input name="accountHolder" placeholder="Account Holder *" required className="p-3 border rounded" />
                <input name="accountNumber" placeholder="Account Number *" required className="p-3 border rounded" />
                <input name="ifscCode" placeholder="IFSC Code *" required className="p-3 border rounded" />
                <div className="md:col-span-2 mt-2 space-y-1">
                   <label className="text-xs font-bold text-gray-500 uppercase">Cancelled Cheque Photo</label>
                   <input type="file" name="cancelledCheque" required className="block w-full text-sm" />
                 </div>
              </div>
            </div>

            {/* 4. BACKUP CONTACTS */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">4. Backup Contacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-[#00529b]">Backup Contact 1</h4>
                  <input name="backup1Name" placeholder="Name *" required className="w-full p-2 border rounded" />
                  <input name="backup1Phone" placeholder="Phone *" required className="w-full p-2 border rounded" />
                  <div className="space-y-1"><label className="text-xs text-gray-500">ID Proof</label><input type="file" name="backup1IdProof" required className="block w-full text-xs" /></div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-[#00529b]">Backup Contact 2</h4>
                  <input name="backup2Name" placeholder="Name *" required className="w-full p-2 border rounded" />
                  <input name="backup2Phone" placeholder="Phone *" required className="w-full p-2 border rounded" />
                  <div className="space-y-1"><label className="text-xs text-gray-500">ID Proof</label><input type="file" name="backup2IdProof" required className="block w-full text-xs" /></div>
                </div>
              </div>
            </div>

            {/* 5. LOCATION */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">5. Location Verification</h3>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">GPS Location</label>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={handleGetLocation} className="bg-[#00529b] text-white px-4 py-2 rounded hover:bg-blue-800 transition flex items-center gap-2">📍 Detect Location</button>
                      {coords && <span className="text-green-600 text-sm font-semibold">Captured!</span>}
                    </div>
                 </div>
                 <div className="space-y-1">
                   <label className="block text-sm text-gray-700 font-bold">Shop/Location Photo</label>
                   <input type="file" name="locationImage" required className="block w-full text-sm" />
                 </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#ffc20e] text-black font-bold text-lg py-4 rounded-lg hover:bg-yellow-500 transition-colors shadow-lg disabled:opacity-50"
            >
              {loading ? "Registering..." : "Submit & Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}