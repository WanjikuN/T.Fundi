import { Archive, CheckCircle2, Clock3, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Product } from "../types/catalog.types";

interface ProductCardProps {
  product: Product;
}

const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  active: {
    label: "Published",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
} as const;

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const status = STATUS_CONFIG[product.status];
  const StatusIcon = status.icon;

  const categoryLabel =
    product.category.charAt(0).toUpperCase() +
    product.category.slice(1);

  const handleOpen = () => {
    navigate(`/catalog/products/${product.slug}`);
  };

  return (
    <article
      className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* =====================================================
          IMAGE
         ===================================================== */}

      <button
        type="button"
        onClick={handleOpen}
        className="relative block w-full overflow-hidden bg-black/[0.03] text-left"
      >
        <div className="aspect-[4/3] w-full">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm text-gray-400">
                No image
              </span>
            </div>
          )}
        </div>

        {/* Status */}

        <div
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm ${status.className}`}
        >
          <StatusIcon size={13} />
          {status.label}
        </div>

        {/* View overlay */}

        <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-black/30 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
            <Eye size={13} />
            View
          </span>
        </div>
      </button>

      {/* =====================================================
          CONTENT
         ===================================================== */}

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{
                color: "var(--color-primary)",
              }}
            >
              {categoryLabel}
            </p>

            <button
              type="button"
              onClick={handleOpen}
              className="mt-1 block max-w-full truncate text-left text-base font-bold text-gray-900 transition hover:text-[var(--color-primary)]"
            >
              {product.name}
            </button>
          </div>

          <p className="shrink-0 text-sm font-bold text-gray-900">
            {product.currency}{" "}
            {product.price.toLocaleString()}
          </p>
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
          {product.description}
        </p>

        {/* Product metadata */}

        <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3">
          <span className="text-xs text-gray-400">
            {product.options.length}{" "}
            {product.options.length === 1
              ? "option"
              : "options"}
          </span>

          <button
            type="button"
            onClick={handleOpen}
            className="text-xs font-semibold text-gray-600 transition hover:text-[var(--color-primary)]"
          >
            Manage product →
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;