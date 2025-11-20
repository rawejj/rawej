import React, { useState } from "react";

export interface Price {
  id: number;
  product_id: number;
  title: string;
  price: number;
  discount_amount: number;
  discount_percent: string;
  created_at: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  slug_old: string;
  title_en: string;
  summary: string;
  description: string;
  display_rank: number | null;
  created_at: string;
  prices: Price[];
}

interface ProductSelectorProps {
  products: Product[];
  selectedProductId?: number;
  selectedPriceId?: number;
  onSelect: (productId: number, priceId: number) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  selectedPriceId,
  onSelect,
}) => {
  const [openProductId, setOpenProductId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm"
        >
          <button
            type="button"
            className={`w-full text-left px-4 py-3 flex flex-col gap-1 focus:outline-none transition-colors ${openProductId === product.id ? "bg-purple-50 dark:bg-zinc-800/40" : "bg-white dark:bg-zinc-900"}`}
            onClick={() => setOpenProductId(openProductId === product.id ? null : product.id)}
          >
            <span className="text-lg font-bold text-purple-700 dark:text-pink-400">{product.title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-300">{product.title_en}</span>
            <span className="text-sm text-gray-700 dark:text-gray-200 mt-1">{product.summary}</span>
          </button>
          {openProductId === product.id && (
            <div className="px-4 pb-4 pt-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.description}</div>
              <div className="flex flex-col gap-2">
                {product.prices.map((price) => (
                  <button
                    key={price.id}
                    type="button"
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-colors font-semibold text-sm ${selectedProductId === product.id && selectedPriceId === price.id ? "bg-purple-500 text-white border-purple-600" : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"}`}
                    onClick={() => onSelect(product.id, price.id)}
                  >
                    <span>{price.title}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-bold">{price.price.toLocaleString()} ریال</span>
                      {price.discount_amount > 0 && (
                        <span className="text-xs text-green-600 dark:text-green-400">-{price.discount_percent}%</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductSelector;
