import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ShieldCheck, 
  Truck, 
  Package, 
  RotateCcw, 
  Zap, 
  ChevronRight, 
  Home 
} from "lucide-react";

// 1. IMPORT COMPONENTS
import ProductActions from "./../../components/ProductActions"; 
import ProductImageGallery from "@/components/ProductImageGallery";
import { getFinalCustomerPrice, stripCommissionSpecs } from "@/lib/pricing";
import { normalizeImageSrc } from "@/lib/image";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  // 2. Fetch Product
  const product = await prisma.product.findUnique({
    where: { slug: slug },
  });

  if (!product) return notFound();

  // 3. HYBRID VENDOR CONFIGURATION
  const vendorForDisplay = {
    id: product.vendorId, 
    firstName: "FixKart",
    lastName: "Official",
    email: "support@thefixkart.com",
    imageUrl: null 
  };

  // Helper for Specs
  const specs = stripCommissionSpecs(product.specs as Record<string, unknown> | null);
  const finalPrice = getFinalCustomerPrice(product.price, product.specs as Record<string, unknown> | null);

  // Calculate Discount (Mock logic)
  const fakeMrp = Math.round(finalPrice * 1.25);
  const discountPercent = fakeMrp > 0 ? Math.round(((fakeMrp - finalPrice) / fakeMrp) * 100) : 0;
  const productForCustomer = { ...product, price: finalPrice };
  const normalizedMainImage = normalizeImageSrc(product.image);
  const normalizedGallery = (product.gallery || []).map((img) => normalizeImageSrc(img));

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* --- BREADCRUMBS --- */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center text-xs md:text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="flex items-center hover:text-[#00529b] transition-colors">
              <Home size={14} className="mr-1" /> Home
            </Link>
            <ChevronRight size={14} className="mx-2 text-gray-300" />
            <span className="capitalize">{product.category}</span>
            <ChevronRight size={14} className="mx-2 text-gray-300" />
            
            {/* [UPDATED] Removed Link, now just text */}
            <span className="capitalize text-gray-500">
              {product.subCategory}
            </span>

            <ChevronRight size={14} className="mx-2 text-gray-300" />
            <span className="font-semibold text-gray-800 truncate max-w-[200px]">
              {product.title || product.name}
            </span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: IMAGE GALLERY (5 Columns) --- */}
          <div className="lg:col-span-5">
             <div className="sticky top-24">
                <ProductImageGallery 
                  mainImage={normalizedMainImage} 
                  gallery={normalizedGallery} 
                  title={product.title || product.name} 
                />
             </div>
          </div>

          {/* --- RIGHT: PRODUCT DETAILS (7 Columns) --- */}
          <div className="lg:col-span-7 flex flex-col h-full">
            
            {/* 1. Header Section */}
            <div className="border-b border-gray-100 pb-6 mb-6">
              <p className="text-[#00529b] font-bold text-xs tracking-widest uppercase mb-2">
                {product.brand || "Generic"}
              </p>
              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
                {product.title || product.name}
              </h1>
              
              <div className="flex items-center gap-4 text-sm">
                 <div className="flex items-center gap-1 text-yellow-500">
                    {/* <span className="font-bold text-black">4.5</span> ★★★★☆ */}
                 </div>
                 <span className="text-gray-300">|</span>
                 <span className="text-gray-500">{product.sku && `SKU: ${product.sku}`}</span>
                 <span className="text-gray-300">|</span>
                 <div className={`flex items-center gap-1 font-medium ${
                    product.quantity > 0 ? "text-green-600" : "text-red-600"
                 }`}>
                    {product.quantity > 0 ? (
                       <><Package size={14} /> In Stock</>
                    ) : (
                       <><Package size={14} /> Out of Stock</>
                    )}
                 </div>
              </div>
            </div>

            {/* 2. Price Block */}
            <div className="bg-blue-50/30 p-5 rounded-xl border border-blue-50 mb-8">
               <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-bold text-[#00529b]">
                    ₹{finalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-gray-400 text-lg line-through decoration-gray-400 decoration-1 mb-1">
                    ₹{fakeMrp.toLocaleString("en-IN")}
                  </span>
                  <span className="mb-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    {discountPercent}% OFF
                  </span>
               </div>
               <p className="text-xs text-gray-500">Inclusive of all taxes. Free shipping on bulk orders.</p>
            </div>

            {/* 3. Action Buttons */}
            <div className="mb-8">
               <ProductActions product={productForCustomer} vendor={vendorForDisplay} />
            </div>

            {/* 4. Trust Badges (Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
               <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 border border-gray-100 text-center">
                  <Truck className="text-[#00529b] mb-2" size={20} />
                  <span className="text-xs font-bold text-gray-700">Fast Delivery</span>
               </div>
               <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 border border-gray-100 text-center">
                  <ShieldCheck className="text-[#00529b] mb-2" size={20} />
                  <span className="text-xs font-bold text-gray-700">Secure Payment</span>
               </div>
               <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 border border-gray-100 text-center">
                  <RotateCcw className="text-[#00529b] mb-2" size={20} />
                  <span className="text-xs font-bold text-gray-700">Easy Returns</span>
               </div>
               <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 border border-gray-100 text-center">
                  <Zap className="text-[#00529b] mb-2" size={20} />
                  <span className="text-xs font-bold text-gray-700">Quality Assured</span>
               </div>
            </div>

            {/* 5. Description */}
            <div className="mb-8">
               <h3 className="font-bold text-gray-900 border-l-4 border-[#00529b] pl-3 mb-4 text-lg">
                 Product Description
               </h3>
               <div className="text-gray-600 text-sm leading-7 space-y-4">
                  <p>{product.description || "No description available."}</p>
               </div>
            </div>

          </div>
        </div>

        {/* --- BOTTOM SECTION: TECHNICAL SPECS TABLE --- */}
        {Object.keys(specs).length > 0 && (
          <div className="mt-12 pt-10 border-t border-gray-200">
             <div className="max-w-4xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                   Technical Specifications
                </h3>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                   <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-gray-100">
                         {Object.entries(specs).map(([key, value], index) => (
                            <tr key={key} className={index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}>
                               <td className="px-6 py-4 font-medium text-gray-500 capitalize w-1/3">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                               </td>
                               <td className="px-6 py-4 font-semibold text-gray-800">
                                  {value}
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}
