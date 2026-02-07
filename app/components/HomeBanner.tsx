"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Images provided
const bannerImages = [
  "/b1.png",
  "/b2.png",
];

export default function HomeBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? bannerImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === bannerImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="w-full relative group">
      
      {/* --- DIMENSION FIX --- 
          1. Removed fixed height (h-[250px]) which was causing cropping.
          2. Added 'aspect-[4/1]'. This matches the shape of your specific b1/b2 images.
          
          Result: The banner will act like a responsive video container.
          - On Desktop (1400px wide): Banner is ~350px tall (Big & Clear)
          - On Mobile (375px wide): Banner is ~95px tall (Small, but TEXT IS READABLE and uncropped)
      */}
      <div className="relative w-full aspect-[4/1] overflow-hidden bg-gray-100">
        
        <Image 
          src={bannerImages[currentIndex]} 
          alt="Fixkart Industrial Banner"
          fill
          // 'sizes' helps the browser load the right image size for speed
          sizes="(max-width: 768px) 100vw, 100vw"
          className="object-cover duration-500 ease-in-out"
          priority={true} 
        />

        {/* Left Arrow - Adjusted size for mobile responsiveness */}
        <div className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 left-2 md:left-4 rounded-full p-1 md:p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-all z-10">
          <ChevronLeft onClick={prevSlide} className="w-5 h-5 md:w-8 md:h-8" />
        </div>

        {/* Right Arrow - Adjusted size for mobile responsiveness */}
        <div className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 right-2 md:right-4 rounded-full p-1 md:p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-all z-10">
          <ChevronRight onClick={nextSlide} className="w-5 h-5 md:w-8 md:h-8" />
        </div>

        {/* Dots (Indicators) - Moved slightly closer to bottom for mobile tightness */}
        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10">
          {bannerImages.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => setCurrentIndex(slideIndex)}
              className={`transition-all duration-300 cursor-pointer rounded-full shadow-sm ${
                currentIndex === slideIndex 
                  ? "p-1 md:p-1.5 bg-white w-6 md:w-8" // Active dot
                  : "p-1 md:p-1.5 bg-white/50 hover:bg-white/80" // Inactive dot
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}