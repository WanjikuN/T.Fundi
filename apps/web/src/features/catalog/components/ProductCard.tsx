import { Link } from "react-router-dom";
import type { Product } from "../types/catalog.types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/catalog/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {product.featured && (
            <span
              className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-[var(--color-primary-foreground)]"
              style={{
                backgroundColor: "var(--color-primary)",
              }}
            >
              Featured
            </span>
          )}
        </div>

        <div className="p-5">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
            {product.category}
          </p>

          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span
              className="text-lg font-bold"
              style={{
                color: "var(--color-primary)",
              }}
            >
              {product.currency}{" "}
              {product.price.toLocaleString("en-KE")}
            </span>

            <span className="text-sm font-medium text-gray-500 transition-colors group-hover:text-[var(--color-primary)]">
              View →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;