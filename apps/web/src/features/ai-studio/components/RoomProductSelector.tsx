import {
  ArrowRight,
  Check,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../catalog/types/catalog.types";
import { getProducts } from "../../catalog/api/products.api";

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

    const load = async () => {
      try {
        const result = await getProducts();

        if (mounted) {
          setProducts(result);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();

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
          value!.toLowerCase().includes(query),
        ),
    );
  }, [products, search]);

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col">
      <div className="mb-5 shrink-0">
        <h2 className="text-2xl font-bold">
          Choose a product
        </h2>

        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Select a product from your workspace catalogue.
        </p>
      </div>

      <div className="relative mb-5 shrink-0">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products..."
          className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-full min-h-[300px] items-center justify-center">
            <div className="text-sm text-[var(--color-muted-foreground)]">
              Loading products...
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)]">
            <div className="text-center">
              <p className="font-medium">
                No products found
              </p>

              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Try a different search.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  className={`group overflow-hidden rounded-2xl border bg-[var(--color-card)] text-left transition ${
                    selected
                      ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                      : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-muted)]/30">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[var(--color-muted-foreground)]">
                        No image
                      </div>
                    )}

                    {selected && (
                      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow">
                        <Check size={16} />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-xs capitalize text-[var(--color-muted-foreground)]">
                      {product.category}
                    </p>

                    <p className="mt-3 text-sm font-medium">
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

      <div className="mt-5 flex shrink-0 justify-end">
        <button
          type="button"
          disabled={!selectedProduct}
          onClick={onContinue}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default RoomProductSelector;