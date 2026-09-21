import { Link } from "react-router-dom";
import { Package } from "lucide-react";

function ProductCard({ product }) {
  const hasImage = product.images && product.images.length > 0;
  const isAvailable = product.stock > 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm flex flex-col overflow-hidden h-full"
    >
      {/* Image container */}
{/* Image container */}
<div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
  {hasImage ? (
    <img
      src={product.images[0]}
      alt={product.name}
      className="absolute inset-0 w-full h-full object-contain"
      loading="lazy"
    />
  ) : (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400">
      <Package className="w-8 h-8 stroke-1" />
      <span className="text-xs">No Image</span>
    </div>
  )}
</div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm sm:text-base">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-3">
          {product.description}
        </p>

        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-base font-bold text-blue-600">
            ${Number(product.price).toFixed(2)}
          </span>
          <span
            className={`text-xs ${
              isAvailable ? "text-gray-500" : "text-red-500 font-medium"
            }`}
          >
            {isAvailable ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

