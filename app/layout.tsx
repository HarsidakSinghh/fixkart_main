import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { CartProvider } from "./context/CartContext";

// --- COMPONENTS ---
import Header from "./components/Header";
// Note: MobileMenu is removed from here because it is now inside Header.tsx

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixKart",
  description: "Industrial Supply Catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-800 bg-gray-50`}>

        <ClerkProvider>
          <CartProvider>
            
            {/* 1. Header Component (Contains SearchBar & Hamburger Menu Logic) */}
            <Header />

            {/* 2. Main Content */}
            <main className="min-h-[calc(100vh-115px)] w-full">
              <div className="w-full px-4 md:px-6 py-6">
                {children}
              </div>
            </main>

          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}