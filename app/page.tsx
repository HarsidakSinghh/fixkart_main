import React, { Suspense } from "react";
import InventoryContent from "@/components/InventoryContent";
import CategoryShowcase from "./components/CategoryShowcase";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { getFinalCustomerPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  
  // 1. Get the search query safely (Next.js 15+)
  const { q } = await searchParams;
  const query = q || "";

  // ---------------------------------------------------------
  // MODE 1: SEARCH ACTIVE (Show Real Database Results)
  // ---------------------------------------------------------
  if (query) {
    const products = await prisma.product.findMany({
      where: {
        // 1. Match Search Terms
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { subCategory: { contains: query, mode: "insensitive" } },
          { subSubCategory: { contains: query, mode: "insensitive" } },
        ],
        
        // 2. FILTER: Only show Published AND Approved products
        AND: [
            { isPublished: true },    // Vendor must have published it
            { status: "APPROVED" },   // Admin must have approved it
            // { quantity: { gt: 0 } } // Optional: Uncomment to hide out-of-stock
        ]
      },
      take: 50,
      orderBy: { createdAt: 'desc' }
    });

    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
        <div className="w-full h-[20px] md:h-[40px]"></div>

        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Search Results for <span className="text-[#00529b]">"{query}"</span>
              </h1>
              <p className="text-gray-500 text-sm">Found {products.length} matching items from vendors</p>
            </div>
            
            <Link href="/" className="text-sm font-bold text-gray-400 hover:text-red-500 hover:underline">
              Clear Search
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed shadow-sm">
              <p className="text-lg">No products found matching "{query}"</p>
              <Link href="/" className="mt-4 inline-block text-[#00529b] font-bold hover:underline">
                View All Categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const finalPrice = getFinalCustomerPrice(product.price, product.specs as Record<string, unknown> | null);
                return (
                <Link 
                  key={product.id} 
                  href={`/product/${product.slug}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col overflow-hidden"
                >
                  <div className="relative h-48 w-full bg-gray-50 border-b border-gray-100">
                    <Image
                      src={product.image || "https://placehold.co/300?text=No+Image"}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                      {product.subCategory && (
                        <span className="text-[10px] uppercase font-bold text-[#00529b] bg-blue-50 px-2 py-1 rounded">
                          {product.subCategory}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-[#00529b] transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="font-bold text-lg">₹{finalPrice.toLocaleString("en-IN")}</span>
                      <button className="text-xs text-gray-400 border px-2 py-1 rounded hover:bg-gray-100">View</button>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MODE 2: DEFAULT (Show Category Folders + Banner)
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* Spacer for Header */}
      <div className="w-full h-[70px]"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <CategoryShowcase />
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00529b]"></div>
          </div>
        }
      >
        <InventoryContent />
      </Suspense>
    </div>
  );
}
