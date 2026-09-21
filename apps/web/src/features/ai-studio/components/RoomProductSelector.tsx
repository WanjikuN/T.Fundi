import {
  ArrowRight,
  Check,
  Package,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getProducts } from "../../catalog/api/products.api";
import type { Product } from "../../catalog/types/catalog.types";

type Props = {
  selectedProduct?: Product;
  onSelect: (product: Product) => void;
  onContinue: () => void;
};

const RoomProductSelector = ({
  selectedProduct,
  onSelect,
  onContinue,
}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        const result = await getProducts();

        if (mounted) {
          setProducts(result);
        }
      } catch {
        if (mounted) {
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      [
        product.name,
        product.category,
        product.description,
      ]
        .filter(Boolean)
        .some((value) =>
          value?.toLowerCase().includes(query),
        ),
    );
  }, [products, search]);

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="shrink-0 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Package
                size={17}
                className="text-[var(--color-primary)]"
              />

              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                Step 2
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">
              Choose a product
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Select the furniture you want to visualize in your room.
            </p>
          </div>

          {!loading && (
            <div className="hidden shrink-0 rounded-full bg-[var(--color-muted)] px-3 py-1 text-xs font-medium text-[var(--color-muted-foreground)] sm:block">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          SEARCH
      ====================================================== */}
      <div className="relative mb-4 shrink-0">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products..."
          className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
        />
      </div>

      {/* =====================================================
          PRODUCT GRID
          
          THIS is the ONLY scrolling container.
      ====================================================== */}
      <div className="min-h-0 max-h-[50vh] flex-1 overflow-y-auto overscroll-contain pr-1">
        {loading ? (
          <div className="flex min-h-full items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/10">
            <div className="flex items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />

              Loading products...
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-full items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/10">
            <div className="px-6 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-muted)]">
                <Search
                  size={19}
                  className="text-[var(--color-muted-foreground)]"
                />
              </div>

              <p className="mt-3 font-medium">
                No products found
              </p>

              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                Try another product name or category.
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-3 text-xs font-medium text-[var(--color-primary)] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => {
              const selected =
                selectedProduct?.id === product.id;

              const image =
                product.imageUrl ||
                product.images?.[0] ||
                "";

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onSelect(product)}
                  aria-pressed={selected}
                  className={`group overflow-hidden rounded-xl border bg-[var(--color-card)] text-left transition-all duration-200 ${
                    selected
                      ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/15"
                      : "border-[var(--color-border)] hover:-translate-y-0.5 hover:border-[var(--color-primary)]/50 hover:shadow-sm"
                  }`}
                >
                  {/* Image */}
                  <div className="relative aspect-[1.3/1] overflow-hidden bg-[var(--color-muted)]/30">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package
                          size={22}
                          className="text-[var(--color-muted-foreground)]"
                        />
                      </div>
                    )}

                    {selected && (
                      <>
                        <div className="absolute inset-0 bg-[var(--color-primary)]/5" />

                        <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-md">
                          <Check
                            size={14}
                            strokeWidth={2.5}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-3">
                    <h3 className="truncate text-sm font-semibold">
                      {product.name}
                    </h3>

                    <p className="mt-0.5 truncate text-[11px] capitalize text-[var(--color-muted-foreground)]">
                      {product.category}
                    </p>

                    <p className="mt-2 text-xs font-semibold">
                      {product.currency}{" "}
                      {product.price.toLocaleString()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          BOTTOM ACTION BAR

          NOT inside the scroll container.
          Therefore it ALWAYS remains visible.
      ====================================================== */}
      <div className="sticky bottom-0 z-20 mt-3 shrink-0 border-t border-[var(--color-primary)] bg-[var(--color-background)] py-3">
        <div className=" flex items-center justify-between gap-4">
          {/* Selection information */}
          <div className="min-w-0">
            {selectedProduct ? (
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Check size={14} strokeWidth={2.5} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] text-[var(--color-muted-foreground)]">
                    Selected product
                  </p>

                  <p className="truncate text-xs font-semibold">
                    {selectedProduct.name}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Select a product to continue
              </p>
            )}
          </div>

          {/* Continue */}
          <button
            type="button"
            disabled={!selectedProduct}
            onClick={onContinue}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomProductSelector;