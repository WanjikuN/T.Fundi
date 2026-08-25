import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { ProductCategory } from "../types/catalog.types";
import ProductGrid from "../components/ProductGrid";
import { mockProducts } from "../types/catalog.mock";

const categories: Array<{
  label: string;
  value: ProductCategory | "all";
}> = [
  { label: "All Furniture", value: "all" },
  { label: "Sofas", value: "sofas" },
  { label: "Chairs", value: "chairs" },
  { label: "Tables", value: "tables" },
  { label: "Beds", value: "beds" },
  { label: "Storage", value: "storage" },
  { label: "Outdoor", value: "outdoor" },
];

const CatalogPage = () => {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mockProducts.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className="mb-2 text-sm font-semibold uppercase tracking-[0.2em]"
              style={{
                color: "var(--color-primary)",
              }}
            >
              The Collection
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Furniture made for your space
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Discover handcrafted pieces designed to bring warmth,
              character and functionality into your home.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search furniture..."
              className="w-full rounded-xl border border-black/10 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const isActive = category === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setCategory(item.value)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "text-[var(--color-primary-foreground)] shadow-sm"
                    : "bg-white text-gray-600 hover:bg-black/5"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--color-primary)",
                      }
                    : undefined
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </main>
  );
};

export default CatalogPage;