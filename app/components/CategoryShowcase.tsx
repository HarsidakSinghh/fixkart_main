import { INVENTORY_DATA } from "@/app/data/inventory";

export default function CategoryShowcase() {
  const categoryShowcase = INVENTORY_DATA.slice(0, 8).map((category) => {
    const rawImage = category.items[0]?.imagePath || "";
    const normalizedImage = rawImage.replace(/\\/g, "/");
    return {
      title: category.title,
      image: normalizedImage.startsWith("/") ? normalizedImage : `/${normalizedImage}`,
    };
  });

  return (
    <section className="mt-6 md:mt-8 rounded-3xl border border-[#dde6f5] bg-white p-6 md:p-8 shadow-[0_14px_36px_-30px_rgba(20,55,110,0.45)]">
      <div className="mb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Category Showcase</h2>
        <p className="mt-1 text-slate-600 text-sm md:text-base">One representative product image from each category.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {categoryShowcase.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="h-36 md:h-40 bg-slate-100">
              <img src={item.image} alt={item.title} className="h-full w-full object-contain p-2" />
            </div>
            <div className="p-3 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-800 line-clamp-2">{item.title}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
