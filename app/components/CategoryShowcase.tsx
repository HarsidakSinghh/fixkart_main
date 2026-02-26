"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { INVENTORY_DATA } from "@/app/data/inventory";

export default function CategoryShowcase() {
  const items = useMemo(
    () =>
      INVENTORY_DATA.slice(0, 8).map((category) => {
        const rawImage = category.items[0]?.imagePath || "";
        const normalizedImage = rawImage.replace(/\\/g, "/");
        return {
          title: category.title,
          slug: category.slug,
          image: normalizedImage.startsWith("/") ? normalizedImage : `/${normalizedImage}`,
        };
      }),
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(4);

  useEffect(() => {
    const updateCardsPerPage = () => {
      if (window.innerWidth < 768) {
        setCardsPerPage(2);
      } else if (window.innerWidth < 1200) {
        setCardsPerPage(3);
      } else {
        setCardsPerPage(4);
      }
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const totalSlides = items.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const visibleItems = Array.from({ length: cardsPerPage }, (_, index) => items[(currentIndex + index) % items.length]);

  const prevPage = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextPage = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);

  return (
    <section className="mt-1 md:mt-2 rounded-3xl bg-white p-6 md:p-8 shadow-[0_14px_36px_-30px_rgba(20,55,110,0.45)]">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Welcome</h2>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={prevPage}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextPage}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className={`grid gap-4 md:gap-5 ${cardsPerPage === 2 ? "grid-cols-2" : cardsPerPage === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
        {visibleItems.map((item) => (
          <Link
            key={`${item.title}-${item.slug}`}
            href={`/browse/${item.slug}`}
            className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="h-36 md:h-40 bg-slate-100">
              <img src={item.image} alt={item.title} className="h-full w-full object-contain p-2" />
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-slate-800 line-clamp-2">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full transition-all ${index === currentIndex ? "w-8 bg-[#00529b]" : "w-2.5 bg-slate-300"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
