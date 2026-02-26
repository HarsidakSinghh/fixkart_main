"use client";

import React, { useCallback } from "react";
import { X, ChevronRight } from "lucide-react";
import { INVENTORY_DATA, SIDEBAR_LINKS } from "@/app/data/inventory";

// Configuration for smooth scrolling offset
const HEADER_HEIGHT_OFFSET = 180;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  
  // --- SCROLL FUNCTIONALITY ---
  // This replicates the "overlapping hamburger" logic
  const handleScroll = useCallback(
    (e: React.MouseEvent, title: string) => {
      e.preventDefault();
      
      // 1. Find the slug for the clicked title
      const catSlug = INVENTORY_DATA.find((c) => c.title === title)?.slug || "";
      
      if (!catSlug) return;

      // 2. Find the element on the page
      const element = document.getElementById(catSlug);
      
      if (element) {
        // 3. Calculate position
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - HEADER_HEIGHT_OFFSET;

        // 4. Smooth Scroll
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }

      // 5. Close the menu
      onClose();
    },
    [onClose]
  );

  return (
    <>
      {/* --- BACKDROP --- */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[110] md:hidden backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* --- SIDEBAR PANEL --- */}
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[120] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-lg font-bold text-[#00529b]">Browse Categories</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Categories List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {SIDEBAR_LINKS.map((linkName, index) => (
              <li key={index}>
                <a
                  href={`#${INVENTORY_DATA.find((c) => c.title === linkName)?.slug}`}
                  onClick={(e) => handleScroll(e, linkName)}
                  className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-[#00529b] rounded-lg font-medium transition-colors cursor-pointer"
                >
                  {linkName}
                  <ChevronRight size={16} className="opacity-30" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
           <a href="/industry-4-0" onClick={onClose} className="block text-center text-sm font-bold text-gray-700 py-2 hover:text-[#00529b] transition-colors">
             Industry 4.0
           </a>
           <a href="/orders" onClick={onClose} className="block text-center text-sm font-bold text-[#00529b] py-2">
             View My Orders
           </a>
        </div>
      </div>
    </>
  );
}
