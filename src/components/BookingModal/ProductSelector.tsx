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

  const getProductIcon = (slug: string) => {
    switch (slug) {
    case 'chat-consultation':
      return (
        <svg className="w-6 h-6 text-purple-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'video-consultation':
      return (
        <svg className="w-6 h-6 text-purple-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case 'scheduled-phone-consultation':
    case 'immediate-phone-consultation':
      return (
        <svg className="w-6 h-6 text-purple-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6 text-purple-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-linear-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <button
            type="button"
            className={`w-full px-4 py-4 flex items-center gap-3 focus:outline-none transition-all duration-300 hover:bg-purple-50 dark:hover:bg-zinc-800/60 cursor-pointer rtl:text-right rtl:flex-row-reverse ltr:text-left ltr:flex-row ${openProductId === product.id ? "bg-purple-50 dark:bg-zinc-800/40 rounded-t-2xl" : "bg-white dark:bg-zinc-900 rounded-2xl"}`}
            onClick={() => setOpenProductId(openProductId === product.id ? null : product.id)}
          >
            {getProductIcon(product.slug)}
            <div className="flex-1">
              <span className="text-lg font-bold text-purple-700 dark:text-pink-400">{product.title}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-300">{product.title_en}</span>
              <span className="block text-sm text-gray-700 dark:text-gray-200 mt-1">{product.summary}</span>
            </div>
            <svg
              className={`w-5 h-5 text-purple-700 dark:text-pink-400 transition-transform duration-300 ${openProductId === product.id ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${openProductId === product.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-zinc-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{product.description}</div>
              <div className="grid gap-2">
                {product.prices.map((price) => (
                  <button
                    key={price.id}
                    type="button"
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 font-semibold text-sm shadow-sm hover:shadow-md transform hover:scale-105 cursor-pointer rtl:flex-row-reverse ltr:flex-row ${selectedProductId === product.id && selectedPriceId === price.id ? "bg-purple-500 text-white border-purple-600 shadow-purple-500/50" : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"}`}
                    onClick={() => onSelect(product.id, price.id)}
                  >
                    <span>{price.title}</span>
                    <span className="flex items-center gap-2 rtl:flex-row-reverse ltr:flex-row">
                      <span className="font-bold">{price.price.toLocaleString()} ریال</span>
                      {price.discount_amount > 0 && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">-{price.discount_percent}%</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSelector;
