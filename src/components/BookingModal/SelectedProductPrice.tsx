import React from "react";
import { Product } from "./ProductSelector";

interface SelectedProductPriceProps {
  products: Product[];
  selectedProductId?: number;
  selectedPriceId?: number;
}

const SelectedProductPrice: React.FC<SelectedProductPriceProps> = ({ products, selectedProductId, selectedPriceId }) => {
  if (!products || products.length === 0 || !selectedProductId || !selectedPriceId) return null;
  const product = products.find(p => p.id === selectedProductId);
  const price = product?.prices?.find(pr => pr.id === selectedPriceId);
  if (!product || !price) return null;
  return (
    <div className="mb-4 px-4 py-3 rounded-xl border border-purple-200 dark:border-pink-700 bg-linear-to-r from-purple-50 to-pink-50 dark:from-pink-950/30 dark:to-purple-900/30 flex flex-col gap-1 shadow-sm">
      <div className="font-semibold text-purple-700 dark:text-pink-400 text-base">{product.title}</div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-purple-600 dark:text-pink-300">{price.title}</span>
        {price.discount_amount > 0 ? (
          <>
            <span className="text-sm font-bold text-green-700 dark:text-green-300">{(price.price - price.discount_amount).toLocaleString()} ریال</span>
            <span className="inline-block text-xs font-bold px-2 py-1 rounded-full bg-green-500 dark:bg-green-700 text-white shadow rtl:ml-2 ltr:mr-2" dir="ltr">{price.discount_percent}%</span>
            <span className="text-sm font-bold text-gray-400 dark:text-gray-500 line-through">{price.price.toLocaleString()} ریال</span>
          </>
        ) : (
          <span className="text-sm font-bold text-purple-900 dark:text-pink-200">{price.price.toLocaleString()} ریال</span>
        )}
      </div>
    </div>
  );
};

export default SelectedProductPrice;
