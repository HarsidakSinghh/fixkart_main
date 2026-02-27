"use client";

import { useState, useMemo, useEffect } from "react"; // Added useEffect
import { addProduct, getProductTypeSuggestions } from "@/app/actions";
import { INVENTORY_DATA } from "@/app/data/inventory";

// REMOVE THIS LINE:
// import { SUB_SUB_CATEGORIES } from "@/app/data/subCategories"; 

export default function VendorModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  
  // Selection States
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  
  // Dynamic Suggestions State
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);

  // 1. Get Level 2 Options (Static from Inventory Data)
  const availableSubCategories = useMemo(() => {
    const category = INVENTORY_DATA.find((c) => c.slug === selectedCategorySlug);
    return category ? category.items : [];
  }, [selectedCategorySlug]);

  // 2. NEW: Fetch Level 3 Suggestions from Database
  useEffect(() => {
    async function fetchSuggestions() {
      if (selectedSubCategory) {
        try {
          const suggestions = await getProductTypeSuggestions(selectedSubCategory);
          setDynamicSuggestions(suggestions);
        } catch (error) {
          console.error("Failed to load product type suggestions:", error);
          setDynamicSuggestions([]);
        }
      } else {
        setDynamicSuggestions([]);
      }
    }
    fetchSuggestions();
  }, [selectedSubCategory]); // Runs whenever Sub-Category changes

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      await addProduct(formData);
      alert("Item added successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save. Ensure all fields are filled.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">
        
        <div className="bg-[#00529b] p-5 flex justify-between items-center text-white sticky top-0 z-10 shadow-md">
          <h2 className="font-bold text-xl">Post New Inventory</h2>
          <button onClick={onClose} className="text-xl hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             
             {/* LEVEL 1: Main Category */}
             <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">1. Main Category</label>
                <select 
                  name="category" 
                  required 
                  value={selectedCategorySlug}
                  onChange={(e) => {
                    setSelectedCategorySlug(e.target.value);
                    setSelectedSubCategory(""); 
                    setDynamicSuggestions([]); // Clear suggestions
                  }}
                  className="w-full border border-gray-300 rounded-md p-2.5 font-bold bg-gray-50 text-gray-900"
                >
                  <option value="" disabled>-- Select Category --</option>
                  {INVENTORY_DATA.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.title}</option>
                  ))}
                </select>
             </div>

             {/* LEVEL 2: Sub-Category */}
             <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">2. Sub-Category</label>
                <select 
                  name="subCategory" 
                  required 
                  disabled={!selectedCategorySlug}
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 disabled:bg-gray-100"
                >
                  <option value="" disabled>-- Select --</option>
                  {availableSubCategories.map((item, idx) => (
                    <option key={idx} value={item.name.toLowerCase()}>{item.name}</option>
                  ))}
                </select>
             </div>

             {/* LEVEL 3: Sub-Sub-Category (DYNAMIC DB SUGGESTIONS) */}
             <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">3. Type / Variety</label>
                
                <input 
                   name="subSubCategory" 
                   list="dbSuggestions" 
                   placeholder={dynamicSuggestions.length > 0 ? "Select or Type New..." : "Type New Type..."} 
                   className="w-full border border-gray-300 rounded-md p-2.5 text-gray-900 focus:ring-2 focus:ring-[#00529b] outline-none"
                   disabled={!selectedSubCategory}
                   required
                />

                {/* The Suggestions List populated from DB */}
                <datalist id="dbSuggestions">
                  {dynamicSuggestions.map((type, idx) => (
                    <option key={idx} value={type} />
                  ))}
                </datalist>
                
                {dynamicSuggestions.length > 0 && (
                  <p className="text-[10px] text-green-600 mt-1 font-semibold">
                    * Showing {dynamicSuggestions.length} predefined + vendor-added types
                  </p>
                )}
             </div>

             {/* Basic Details */}
             <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Product Title</label>
                <input name="title" required placeholder="e.g. M6 Wedge Anchor" className="w-full border border-gray-300 rounded-md p-2.5 text-gray-900" />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Internal Name</label>
                <input name="name" required placeholder="e.g. anchor-wedge-m6" className="w-full border border-gray-300 rounded-md p-2.5 text-gray-900" />
             </div>
          </div>

          {/* Price, Size & Stock */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
             <h3 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Details & Stock</h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Price (₹)</label>
                   <input name="price" type="number" step="0.01" required className="w-full border p-2 rounded-md" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Size / Format</label>
                   <input name="size" placeholder="e.g. M6 x 50mm" className="w-full border p-2 rounded-md" />
                </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Stock Quantity</label>
                   <input name="quantity" type="number" defaultValue="10" className="w-full border p-2 rounded-md" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">SKU (Optional)</label>
                   <input name="sku" placeholder="ABC-123" className="w-full border p-2 rounded-md" />
                </div>
             </div>
          </div>

           {/* Description */}
           <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
              <textarea name="description" rows={3} className="w-full border border-gray-300 rounded-md p-2" />
           </div>

           {/* Image Upload */}
           <div className="bg-blue-50/50 p-4 rounded-lg border-2 border-dashed border-blue-200">
             <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Image</label>
             <input type="file" name="imageFile" accept="image/*" className="block w-full text-sm" />
             <div className="mt-2 text-center text-xs text-gray-400">- OR -</div>
             <input name="imageUrl" placeholder="Paste Image URL" className="w-full border p-2 mt-2 text-sm rounded-md" />
          </div>

          <div className="pt-2">
             <button type="submit" disabled={loading} className="w-full bg-[#00529b] text-white font-bold py-4 rounded-lg hover:bg-blue-800 transition-all">
               {loading ? "Publishing..." : "Publish Item"}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}
