"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { 
  LayoutGrid, 
  Wallet, 
  Factory, 
  ChevronDown,
  Phone, 
  Mail, 
  MessageCircle, 
  ShoppingBag,
  Menu 
} from "lucide-react";

import SearchBar from "./Searchbar";
import CartButton from "./CartButton";
import MobileMenu from "./MobileMenu"; 

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); 
  
  const showHamburger = pathname === "/"; 
  const isIndustryPage = pathname?.startsWith("/industry-4-0");

  // --- CONTACT CONFIGURATION ---
  const WHATSAPP_NUMBER = "918699466669"; // Your Number
  const EMAIL_ADDRESS = "info@thefixkart.com"; 

  return (
    <>
      <header className="sticky top-0 z-50 shadow-md">
        
        {/* ROW 1: MAIN BLUE BAR */}
        <div className="w-full bg-[#00529b] border-b border-[#004a8f] py-3 text-white relative z-50">
          <div className="w-full px-4 md:px-6 flex flex-wrap items-center justify-between gap-y-3">
            
            {/* 1. Logo */}
            <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity md:mr-4">
              <img 
                src="/fixkart-logo2.png" 
                alt="FixKart" 
                className="h-8 md:h-10 w-auto object-contain"
              />
            </Link>

            {/* 2. Right Actions */}
            <div className="flex items-center gap-3 md:gap-4 text-sm font-semibold whitespace-nowrap ml-auto md:ml-0 md:order-3">
              <CartButton />

              <div className="flex items-center gap-2">
                <SignedOut>
                  <SignInButton>
                    <button className="hover:text-gray-200 font-bold text-xs md:text-sm px-2">Sign in</button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="bg-[#ffc20e] text-black px-3 py-1.5 md:px-4 rounded font-bold hover:bg-yellow-500 transition-colors shadow-sm text-xs md:text-sm">
                      Sign up
                    </button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>

            {/* 3. Search Bar Container */}
            <div className="order-last md:order-2 w-full md:flex-1 max-w-3xl mx-0 md:mx-6 mt-1 md:mt-0 flex items-center gap-2">
              
              {/* Hamburger Button */}
              {showHamburger && (
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="md:hidden text-white p-2 hover:bg-white/10 rounded-md flex-shrink-0"
                >
                  <Menu size={28} />
                </button>
              )}
              
              <div className="flex-1">
                <SearchBar />
              </div>

            </div>

          </div>
        </div>

        {/* ROW 2: WHITE SUB-NAVBAR */}
        <div className="w-full bg-white border-b border-gray-200 shadow-sm relative z-40">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between py-2 overflow-x-auto overflow-y-hidden md:overflow-visible scrollbar-hide touch-pan-x">
              
              <div className="flex items-center gap-2 md:gap-4 text-sm font-bold text-gray-600 whitespace-nowrap pr-4 md:pr-0">
                
                {/* --- CATALOG DOWNLOAD BUTTON --- */}
                {/* Put your file in the 'public' folder named 'catalog.pdf' */}
                <a 
                  href="/catalog.pdf" 
                  download="FixKart-Catalog.pdf"
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-blue-50 hover:text-[#00529b] transition-all group cursor-pointer"
                >
                  <LayoutGrid size={18} className="group-hover:text-[#00529b]" />
                  <span>Download Catalog</span>
                </a>

                {isIndustryPage ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer">
                      <Factory size={18} className="group-hover:text-[#00529b]" />
                      <span>Industry 4.0</span>
                      <ChevronDown size={16} className="text-gray-500 group-hover:text-[#00529b]" />
                    </button>

                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block z-50">
                      <Link
                        href="/industry-4-0"
                        className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#00529b] transition-colors border-b border-gray-50"
                      >
                        Overview
                      </Link>
                      <Link
                        href="/industry-4-0?view=hardware"
                        className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#00529b] transition-colors"
                      >
                        Explore Hardware
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link href="/industry-4-0" className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all group">
                    <Factory size={18} className="group-hover:text-[#00529b]" />
                    <span>Industry 4.0</span>
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2 md:gap-4 text-sm font-bold text-gray-600 whitespace-nowrap ml-auto">
                
                {/* --- CONTACT US DROPDOWN (RESTORED) --- */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer">
                    <Phone size={18} className="group-hover:text-[#00529b]" />
                    <span>Contact Us</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block z-50 transform origin-top transition-all">
                    
                    {/* WhatsApp */}
                    <a 
                      href={`https://wa.me/${+918699466669}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 hover:text-green-600 transition-colors border-b border-gray-50"
                    >
                      <MessageCircle size={18} />
                      <span>WhatsApp</span>
                    </a>

                    {/* Email */}
                    <a 
                      href={`mailto:${"info@thefixkart.com"}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Mail size={18} />
                      <span>Email Support</span>
                    </a>
                  </div>
                </div>

                <Link href="/orders" className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-blue-50 hover:text-[#00529b] transition-all group">
                  <ShoppingBag size={18} className="group-hover:text-[#00529b]" />
                  <span>My Orders</span>
                </Link>
                <Link href="/wallet" className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-blue-50 hover:text-[#00529b] transition-all group">
                  <Wallet size={18} className="group-hover:text-[#00529b]" />
                  <span>My Wallet</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  );
}
