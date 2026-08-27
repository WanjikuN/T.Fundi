import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Package,
  Plus,
  Search,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type {
  Product,
  ProductCategory,
} from "../types/catalog.types";

import { getProducts } from "../api/products.api";
import ProductGrid from "../components/ProductGrid";
import { mockProducts } from "../types/catalog.mock";

import { useTenant } from "../../../app/providers/TenantProvider";

/* =========================================================
   CATEGORY LABELS
   ========================================================= */

const CATEGORY_LABELS: Record<
  ProductCategory,
  string
> = {
  sofas: "Sofas",
  chairs: "Chairs",
  tables: "Tables",
  beds: "Beds",
  storage: "Storage",
  outdoor: "Outdoor",
  lighting: "Lighting",
  desks: "Desks",
  other: "Other",
};

/* =========================================================
   STATUS
   ========================================================= */

type StatusFilter =
  | "all"
  | "draft"
  | "active"
  | "archived";

const STATUS_OPTIONS: Array<{
  value: StatusFilter;
  label: string;
}> = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "draft",
    label: "Drafts",
  },
  {
    value: "active",
    label: "Published",
  },
  {
    value: "archived",
    label: "Archived",
  },
];

/* =========================================================
   PAGE
   ========================================================= */

const CatalogPage = () => {
  const navigate = useNavigate();

  const {
    catalogSettings,
  } = useTenant();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [category, setCategory] =
    useState<ProductCategory | "all">(
      "all",
    );

  const [status, setStatus] =
    useState<StatusFilter>("all");

  const [search, setSearch] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  /* =======================================================
     TENANT CATEGORIES
     ======================================================= */

  const enabledCategories =
    catalogSettings.categories ?? [];

  const categories = useMemo(() => {
    return [
      {
        label: "All Furniture",
        value: "all" as const,
      },

      ...enabledCategories.map(
        (value) => ({
          label:
            CATEGORY_LABELS[value] ??
            value,

          value,
        }),
      ),
    ];
  }, [enabledCategories]);

  /* =======================================================
     VALIDATE CATEGORY
     ======================================================= */

  useEffect(() => {
    if (
      category !== "all" &&
      !enabledCategories.includes(
        category,
      )
    ) {
      setCategory("all");
    }
  }, [
    category,
    enabledCategories,
  ]);

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

        setProducts(
          storedProducts.length > 0
            ? storedProducts
            : mockProducts,
        );
      } catch (error) {
        console.error(
          "Failed to load products:",
          error,
        );

        if (mounted) {
          setProducts(
            mockProducts,
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     COUNTS
     ======================================================= */

  const counts = useMemo(() => {
    let drafts = 0;
    let published = 0;

    for (const product of products) {
      if (
        product.status === "draft"
      ) {
        drafts += 1;
      }

      if (
        product.status === "active"
      ) {
        published += 1;
      }
    }

    return {
      total: products.length,
      drafts,
      published,
    };
  }, [products]);

  /* =======================================================
     FILTERED PRODUCTS
     ======================================================= */

  const filteredProducts =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          const matchesCategory =
            category === "all" ||
            product.category ===
              category;

          const matchesStatus =
            status === "all" ||
            product.status ===
              status;

          if (
            !matchesCategory ||
            !matchesStatus
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          return (
            product.name
              .toLowerCase()
              .includes(query) ||
            product.description
              .toLowerCase()
              .includes(query) ||
            product.category
              .toLowerCase()
              .includes(query)
          );
        },
      );
    }, [
      products,
      category,
      status,
      search,
    ]);

  /* =======================================================
     FILTER HELPERS
     ======================================================= */

  const hasActiveFilters =
    category !== "all" ||
    status !== "all" ||
    search.trim() !== "";

  const clearFilters = () => {
    setCategory("all");
    setStatus("all");
    setSearch("");
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main
      className="
        h-[calc(100vh-4rem)]
        overflow-hidden
        bg-[var(--color-background)]
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-[1500px]
          min-h-0
          flex-col
          px-4
          py-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            HEADER
           ================================================= */}

        <header className="shrink-0">
          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* TITLE */}

            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      "var(--color-primary)",
                  }}
                />

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                  "
                  style={{
                    color:
                      "var(--color-primary)",
                  }}
                >
                  The Collection
                </p>
              </div>

              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-gray-900
                  sm:text-3xl
                "
              >
                Furniture collection
              </h1>

              <p
                className="
                  mt-1
                  max-w-xl
                  text-sm
                  leading-5
                  text-gray-500
                "
              >
                Manage products, review
                drafts and publish your
                collection.
              </p>
            </div>

            {/* ACTIONS */}

            <div
              className="
                flex
                w-full
                flex-col
                gap-2
                sm:flex-row
                lg:w-auto
              "
            >
              {/* SEARCH */}

              <div
                className="
                  relative
                  min-w-0
                  flex-1
                  sm:w-64
                  lg:w-72
                "
              >
                <Search
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search products..."
                  className="
                    h-10
                    w-full
                    rounded-xl
                    border
                    border-black/10
                    bg-white
                    pl-10
                    pr-9
                    text-sm
                    text-gray-800
                    shadow-sm
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-[var(--color-primary)]
                    focus:ring-4
                    focus:ring-[var(--color-primary)]/10
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    aria-label="Clear search"
                    className="
                      absolute
                      right-2.5
                      top-1/2
                      -translate-y-1/2
                      rounded-full
                      p-1
                      text-gray-400
                      transition
                      hover:bg-black/5
                      hover:text-gray-700
                    "
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* ADD PRODUCT */}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/catalog/products/new",
                  )
                }
                className="
                  inline-flex
                  h-10
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-4
                  text-sm
                  font-bold
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                  active:translate-y-0
                "
                style={{
                  backgroundColor:
                    "var(--color-primary)",

                  color:
                    "var(--color-primary-foreground)",
                }}
              >
                <Plus size={16} />

                <span>
                  Add Product
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* =================================================
            COMPACT SUMMARY
           ================================================= */}

        <div
          className="
            mt-4
            flex
            shrink-0
            flex-wrap
            items-center
            gap-x-5
            gap-y-2
            border-b
            border-black/[0.07]
            pb-3
          "
        >
          {/* TOTAL */}

          <div className="flex items-center gap-2">
            <Package
              size={14}
              className="text-gray-400"
            />

            <span
              className="
                text-xs
                font-semibold
                text-gray-600
              "
            >
              {counts.total}{" "}
              {counts.total === 1
                ? "product"
                : "products"}
            </span>
          </div>

          {/* DRAFTS */}

          <button
            type="button"
            onClick={() =>
              setStatus(
                status === "draft"
                  ? "all"
                  : "draft",
              )
            }
            className={`
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-semibold
              transition
              ${
                status === "draft"
                  ? "text-[var(--color-primary)]"
                  : "text-gray-400 hover:text-gray-700"
              }
            `}
          >
            <Clock3 size={14} />

            {counts.drafts} drafts
          </button>

          {/* PUBLISHED */}

          <button
            type="button"
            onClick={() =>
              setStatus(
                status === "active"
                  ? "all"
                  : "active",
              )
            }
            className={`
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-semibold
              transition
              ${
                status === "active"
                  ? "text-[var(--color-primary)]"
                  : "text-gray-400 hover:text-gray-700"
              }
            `}
          >
            <CheckCircle2
              size={14}
            />

            {counts.published}{" "}
            published
          </button>
        </div>

        {/* =================================================
            FILTERS
           ================================================= */}

        <section className="mt-3 shrink-0">
          {/* CATEGORIES */}

          <div
            className="
              flex
              gap-1.5
              overflow-x-auto
              pb-1
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {categories.map(
              (item) => {
                const isActive =
                  category ===
                  item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setCategory(
                        item.value,
                      )
                    }
                    className={`
                      shrink-0
                      rounded-lg
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      transition
                      ${
                        isActive
                          ? "text-[var(--color-primary-foreground)] shadow-sm"
                          : "bg-white text-gray-500 hover:bg-black/[0.04] hover:text-gray-800"
                      }
                    `}
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
              },
            )}
          </div>

          {/* STATUS */}

          <div
            className="
              mt-2
              flex
              min-w-0
              items-center
              justify-between
              gap-3
            "
          >
            <div
              className="
                flex
                min-w-0
                gap-1
                overflow-x-auto
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {STATUS_OPTIONS.map(
                (option) => {
                  const isActive =
                    status ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() =>
                        setStatus(
                          option.value,
                        )
                      }
                      className={`
                        shrink-0
                        rounded-md
                        px-2.5
                        py-1.5
                        text-[11px]
                        font-semibold
                        transition
                        ${
                          isActive
                            ? "bg-black text-white"
                            : "text-gray-400 hover:bg-black/[0.04] hover:text-gray-700"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  );
                },
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="
                  shrink-0
                  text-[11px]
                  font-semibold
                  text-gray-400
                  transition
                  hover:text-gray-700
                "
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* =================================================
            PRODUCT RESULTS
           ================================================= */}

        <section
          className="
            mt-4
            flex
            min-h-0
            flex-1
            flex-col
          "
        >
          {/* RESULTS HEADER */}

          <div
            className="
              mb-3
              flex
              shrink-0
              items-center
              justify-between
            "
          >
            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
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
                  <p
                    className="
                      mt-0.5
                      text-[11px]
                      text-gray-400
                    "
                  >
                    Showing{" "}
                    {status ===
                    "draft"
                      ? "draft"
                      : status ===
                          "active"
                        ? "published"
                        : "archived"}{" "}
                    products
                  </p>
                )}
            </div>

            <Package
              size={17}
              className="text-gray-300"
            />
          </div>

         {/* Scrollable product area */}

          <div className="h-[calc(100%-2.5rem)] overflow-y-auto pr-1 scrollbar-thin">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6].map(
                  (item) => (
                    <div
                      key={item}
                      className="overflow-hidden rounded-2xl border border-black/10 bg-white"
                    >
                      <div className="aspect-[4/3] animate-pulse bg-black/[0.04]" />

                      <div className="space-y-2 p-3">
                        <div className="h-2.5 w-16 animate-pulse rounded bg-black/[0.06]" />

                        <div className="h-4 w-28 animate-pulse rounded bg-black/[0.06]" />

                        <div className="h-3 w-full animate-pulse rounded bg-black/[0.04]" />
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
        </section>
      </div>
    </main>
  );
};

export default CatalogPage;