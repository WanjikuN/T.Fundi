import {
  Archive,
  CheckCircle2,
  Clock3,
  Eye,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { Product } from "../types/catalog.types";

interface ProductCardProps {
  product: Product;
}

/* =========================================================
   STATUS
   ========================================================= */

const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    icon: Clock3,
    className:
      "bg-amber-50/95 text-amber-700 border-amber-200",
  },

  active: {
    label: "Published",
    icon: CheckCircle2,
    className:
      "bg-emerald-50/95 text-emerald-700 border-emerald-200",
  },

  archived: {
    label: "Archived",
    icon: Archive,
    className:
      "bg-gray-100/95 text-gray-600 border-gray-200",
  },
} as const;

/* =========================================================
   COMPONENT
   ========================================================= */

const ProductCard = ({
  product,
}: ProductCardProps) => {
  const navigate = useNavigate();

  const status =
    STATUS_CONFIG[product.status];

  const StatusIcon = status.icon;

  const categoryLabel =
    product.category.charAt(0).toUpperCase() +
    product.category.slice(1);

  const handleOpen = () => {
    navigate(
      `/catalog/products/${product.slug}`,
    );
  };
console.log(product);
  return (
    <article className="group flex min-h-0 flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-black/[0.12] hover:shadow-md">
      {/* =====================================================
          IMAGE
         ===================================================== */}

      <button
        type="button"
        onClick={handleOpen}
        aria-label={`View ${product.name}`}
        className="relative block w-full overflow-hidden bg-black/[0.025] text-left"
      >
        <div className="aspect-[16/10] w-full">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xs text-gray-400">
                No image
              </span>
            </div>
          )}
        </div>

        {/* Status */}

        <div
          className={`absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-sm ${status.className}`}
        >
          <StatusIcon size={11} />
          {status.label}
        </div>

        {/* View overlay */}

        <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-black/30 to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-semibold text-gray-800 shadow-sm">
            <Eye size={11} />
            View
          </span>
        </div>
      </button>

      {/* =====================================================
          CONTENT
         ===================================================== */}

      <div className="flex min-h-0 flex-1 flex-col p-3.5">
        {/* Category + Price */}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="text-[9px] font-bold uppercase tracking-[0.15em]"
              style={{
                color:
                  "var(--color-primary)",
              }}
            >
              {categoryLabel}
            </p>

            <button
              type="button"
              onClick={handleOpen}
              className="mt-0.5 block max-w-full truncate text-sm font-bold text-gray-900 transition hover:text-[var(--color-primary)]"
            >
              {product.name}
            </button>
          </div>

          <p className="shrink-0 text-xs font-bold text-gray-900">
            {product.currency}{" "}
            {product.price.toLocaleString()}
          </p>
        </div>

        {/* Description */}

        <p className="mt-1.5 line-clamp-1 text-[11px] leading-4 text-gray-500">
          {product.description}
        </p>

        {/* Metadata */}

        <div className="mt-3 flex items-center justify-between border-t border-black/[0.06] pt-2.5">
          <span className="text-[10px] text-gray-400">
            {product.options.length}{" "}
            {product.options.length === 1
              ? "option"
              : "options"}
          </span>

          <button
            type="button"
            onClick={handleOpen}
            className="text-[10px] font-semibold text-gray-500 transition hover:text-[var(--color-primary)]"
          >
            Manage →
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
