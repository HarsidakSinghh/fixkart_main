"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import VendorModal from "@/components/VendorModal"; 
import { INVENTORY_DATA, SIDEBAR_LINKS } from "@/app/data/inventory"; 
import { getMergedInventoryData } from "@/app/actions";

// --- CONFIGURATION ---
const STICKY_HEADER_TOP = "140px";
const HEADER_HEIGHT_OFFSET = 180;

// --- UTILS ---
const toSlug = (text: string) =>
  text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

export default function InventoryContent() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  // 1. STATE
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>("");
  // Removed isMobileMenuOpen state
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState(INVENTORY_DATA);

  // 2. CLICK HANDLER
  const handlePostClick = () => {
    if (isSignedIn) {
      setIsVendorModalOpen(true);
    } else {
      router.push("/sign-in");
    }
  };

  // 3. LOAD MERGED DATA (Predefined + Vendor Added from backend)
  useEffect(() => {
    let isMounted = true;

    async function loadMergedInventory() {
      try {
        const merged = await getMergedInventoryData();
        if (isMounted && merged?.length) setInventoryData(merged as typeof INVENTORY_DATA);
      } catch (error) {
        console.error("Failed to load merged inventory data:", error);
      }
    }

    loadMergedInventory();
    return () => {
      isMounted = false;
    };
  }, []);

  // 4. FILTERING DATA
  const filteredData = useMemo(() => {
    if (!searchQuery) return inventoryData;
    return inventoryData.map((category) => {
      const matchingItems = category.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery)
      );
      return { ...category, items: matchingItems };
    }).filter((category) => category.items.length > 0);
  }, [searchQuery, inventoryData]);

  // 5. SCROLL SPY
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategorySlug(entry.target.id);
          }
        });
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [filteredData]);

  // 6. SMOOTH SCROLL HANDLER
  const handleScroll = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      setActiveCategorySlug(id);
      // Removed closeMenu logic

      const element = document.getElementById(id);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - HEADER_HEIGHT_OFFSET;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    },
    []
  );

  return (
    <div className="w-full flex flex-col md:flex-row relative min-h-screen">
      
      <VendorModal 
        isOpen={isVendorModalOpen} 
        onClose={() => setIsVendorModalOpen(false)} 
      />

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:block w-64 shrink-0 py-6 pl-6 pr-4 border-r border-gray-200 sticky top-[130px] h-[calc(100vh-130px)] overflow-y-auto custom-scrollbar">
        <h2 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-4">
          Browse Categories
        </h2>
        <ul className="space-y-1 text-[13px] leading-tight text-gray-700">
          {SIDEBAR_LINKS.map((linkName, index) => {
            const catSlug = INVENTORY_DATA.find((c) => c.title === linkName)?.slug || "";
            const isActive = activeCategorySlug === catSlug;
            return (
              <li key={index}>
                <a
                  href={`#${catSlug}`}
                  onClick={(e) => handleScroll(e, catSlug)}
                  className={`block px-3 py-2 rounded-md transition-all duration-200 cursor-pointer select-none ${
                    isActive ? "bg-[#e6f0fa] text-[#00529b] font-bold" : "hover:bg-gray-100 hover:text-[#00529b]"
                  }`}
                >
                  {linkName}
                </a>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50/30">
        {searchQuery && (
          <div className="mb-8 p-4 bg-white border border-yellow-200 rounded-lg shadow-sm text-sm text-gray-700 flex items-center justify-between">
            <span>Results for: <strong>"{searchQuery}"</strong></span>
            <Link href="/" className="text-blue-600 text-xs font-bold uppercase hover:underline">Clear</Link>
          </div>
        )}

        {filteredData.map((category: any) => (
          <section
            key={category.slug}
            id={category.slug}
            className="mb-10 scroll-mt-48 md:scroll-mt-40"
          >
            <div
              className="sticky z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 mb-6 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:border-none"
              style={{ top: STICKY_HEADER_TOP }}
            >
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#00529b] rounded-full inline-block"></span>
                {category.title}
              </h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-8">
              {category.items.map((item: any, idx: number) => (
                <Link
                  key={`${category.slug}-${item.name}-${idx}`}
                  href={`/browse/${toSlug(item.name)}`} 
                >
                  <ProductCard item={item} />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

// ... (ProductCard Component remains the same) ...
const ProductCard = React.memo(function ProductCard({ item }: { item: any }) {
  const encodedName = encodeURIComponent(item.name);
  let primaryPath = item.imagePath ? item.imagePath.replace(/\\/g, "/") : "";
  if (primaryPath && !primaryPath.startsWith("/") && !primaryPath.startsWith("http")) primaryPath = "/" + primaryPath;
  const fallbackUrl = `https://placehold.co/400x400/f3f4f6/00529b.png?text=${encodedName}&font=roboto`;
  const [imgSrc, setImgSrc] = useState(primaryPath || fallbackUrl);

  return (
    <div className="flex flex-col items-center group cursor-pointer w-full h-full bg-white rounded-lg p-2 transition-all hover:bg-white hover:shadow-lg relative">
      <div className="aspect-square w-full max-w-[120px] bg-white border border-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative shadow-sm">
        <Image src={imgSrc} alt={item.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" unoptimized={true} onError={() => setImgSrc(fallbackUrl)} />
      </div>
      <span className="text-[13px] text-center leading-snug font-medium px-1 line-clamp-2 text-gray-600 group-hover:text-[#00529b]">
        {item.name}
      </span>
    </div>
  );
});
