import React from "react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { INVENTORY_DATA } from "@/app/data/inventory"; 
import { getFinalCustomerPrice } from "@/lib/pricing";
import { normalizeImageSrc } from "@/lib/image";

export const dynamic = "force-dynamic"; // Ensures we don't cache old data

export default async function BrowseSubCategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  // --- SMART SEARCH LOGIC START ---
  let categoryTerm = "";
  let subCategoryTerm = "";
  let displayTitle = "";
  
  const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");
  const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const targetSlug = normalize(slug);

  const mainCategory = INVENTORY_DATA.find(c => normalize(c.slug) === targetSlug);

  if (mainCategory) {
    categoryTerm = mainCategory.title;
    displayTitle = mainCategory.title;
  } else {
    for (const cat of INVENTORY_DATA) {
      const itemMatch = cat.items.find(item => normalize(item.name) === targetSlug);
      if (itemMatch) {
        categoryTerm = cat.title;
        subCategoryTerm = itemMatch.name;
        displayTitle = itemMatch.name; 
        break;
      }
    }
  }

  if (!categoryTerm && !subCategoryTerm) {
    subCategoryTerm = slug.replace(/-/g, " ");
    displayTitle = subCategoryTerm;
  }


  // 5. Fetch Products (approved + published only)
  const filteredProducts = await prisma.product.findMany({
    where: {
      isPublished: true,
      status: { equals: "APPROVED", mode: "insensitive" },
      ...(subCategoryTerm
        ? {
            subCategory: {
              contains: subCategoryTerm,
              mode: "insensitive",
            },
          }
        : {
            OR: [
              { category: { contains: categoryTerm, mode: "insensitive" } },
              { category: { contains: toSlug(categoryTerm), mode: "insensitive" } },
            ],
          }),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-[#00529b]">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-[#00529b] capitalize mt-2">
          {displayTitle} Inventory
        </h1>
      </div>

      <div className="max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>No approved products found in "{displayTitle}".</p>
            
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {filteredProducts.map((product) => {
              const finalPrice = getFinalCustomerPrice(product.price, product.specs as Record<string, unknown> | null);
              return (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-all relative group">
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="relative aspect-square mb-3 bg-gray-50 rounded-lg overflow-hidden">
                    <Image 
                      src={normalizeImageSrc(product.image)} 
                      alt={product.name} 
                      fill 
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight min-h-[2.5em]">
                    {product.title || product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[#00529b] font-bold text-sm">₹{finalPrice.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      Qty: {product.quantity}
                    </span>
                  </div>
                </Link>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
