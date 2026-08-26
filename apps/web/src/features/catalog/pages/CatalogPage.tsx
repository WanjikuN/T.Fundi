import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Package,
  Search,
} from "lucide-react";

import type {
  Product,
  ProductCategory,
} from "../types/catalog.types";

import { getProducts } from "../api/products.api";
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
  { label: "Lighting", value: "lighting" },
  { label: "Desks", value: "desks" },
  { label: "Other", value: "other" },
];

type StatusFilter = "all" | "draft" | "active" | "archived";

const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] =
    useState<ProductCategory | "all">("all");

  const [status, setStatus] =
    useState<StatusFilter>("all");

  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  /* =======================================================
     LOAD PRODUCTS
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        const storedProducts =
          await getProducts();

        if (!mounted) {
          return;
        }

        /*
         * Keep mock products visible when there are
         * no persisted products yet.
         *
         * Once the tenant has created real products,
         * those become the primary catalog data.
         */
        setProducts(
          storedProducts.length
            ? storedProducts
            : mockProducts,
        );
      } catch (error) {
        console.error(
          "Failed to load products:",
          error,
        );

        if (mounted) {
          setProducts(mockProducts);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     COUNTS
     ======================================================= */

  const draftCount = useMemo(
    () =>
      products.filter(
        (product) =>
          product.status === "draft",
      ).length,
    [products],
  );

  const publishedCount = useMemo(
    () =>
      products.filter(
        (product) =>
          product.status === "active",
      ).length,
    [products],
  );

  /* =======================================================
     FILTER
     ======================================================= */

  const filteredProducts = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "all" ||
        product.category === category;

      const matchesStatus =
        status === "all" ||
        product.status === status;

      const matchesSearch =
        !query ||
        product.name
          .toLowerCase()
          .includes(query) ||
        product.description
          .toLowerCase()
          .includes(query) ||
        product.category
          .toLowerCase()
          .includes(query);

      return (
        matchesCategory &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [
    products,
    category,
    status,
    search,
  ]);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[var(--color-background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
           ================================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{
                color:
                  "var(--color-primary)",
              }}
            >
              The Collection
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Furniture made for your space
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage your furniture collection,
              review drafts and publish products
              when they are ready.
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
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search furniture..."
              className="w-full rounded-xl border border-black/10 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>
        </div>

        {/* =================================================
            QUICK STATUS
           ================================================= */}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-xl">
          <button
            type="button"
            onClick={() =>
              setStatus(
                status === "draft"
                  ? "all"
                  : "draft",
              )
            }
            className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left transition ${
              status === "draft"
                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/10"
                : "border-black/10 hover:border-black/20"
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={17} />
            </div>

            <div>
              <p className="text-lg font-bold text-gray-900">
                {draftCount}
              </p>

              <p className="text-xs text-gray-500">
                Drafts
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatus(
                status === "active"
                  ? "all"
                  : "active",
              )
            }
            className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left transition ${
              status === "active"
                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/10"
                : "border-black/10 hover:border-black/20"
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={17} />
            </div>

            <div>
              <p className="text-lg font-bold text-gray-900">
                {publishedCount}
              </p>

              <p className="text-xs text-gray-500">
                Published
              </p>
            </div>
          </button>
        </div>

        {/* =================================================
            CATEGORIES
           ================================================= */}

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const isActive =
              category === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setCategory(
                    item.value,
                  )
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "text-[var(--color-primary-foreground)] shadow-sm"
                    : "bg-white text-gray-600 hover:bg-black/5"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor:
                          "var(--color-primary)",
                      }
                    : undefined
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* =================================================
            STATUS FILTER
           ================================================= */}

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {(
            [
              ["all", "All products"],
              ["draft", "Drafts"],
              ["active", "Published"],
              ["archived", "Archived"],
            ] as const
          ).map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setStatus(value)
                }
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  status === value
                    ? "bg-black text-white"
                    : "bg-black/[0.04] text-gray-500 hover:bg-black/[0.08]"
                }`}
              >
                {label}
              </button>
            ),
          )}
        </div>

        {/* =================================================
            RESULTS
           ================================================= */}

        <div className="mt-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {isLoading
                  ? "Loading products..."
                  : `${filteredProducts.length} ${
                      filteredProducts.length ===
                      1
                        ? "piece"
                        : "pieces"
                    }`}
              </p>

              {!isLoading &&
                status !== "all" && (
                  <p className="mt-0.5 text-xs text-gray-400">
                    Showing{" "}
                    {status === "draft"
                      ? "draft"
                      : status === "active"
                        ? "published"
                        : "archived"}{" "}
                    products
                  </p>
                )}
            </div>

            <Package
              size={18}
              className="text-gray-300"
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-3xl border border-black/10 bg-white"
                  >
                    <div className="aspect-[4/3] animate-pulse bg-black/[0.04]" />

                    <div className="space-y-3 p-5">
                      <div className="h-3 w-20 animate-pulse rounded bg-black/[0.06]" />

                      <div className="h-5 w-40 animate-pulse rounded bg-black/[0.06]" />

                      <div className="h-8 w-full animate-pulse rounded bg-black/[0.04]" />
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <ProductGrid
              products={
                filteredProducts
              }
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default CatalogPage;