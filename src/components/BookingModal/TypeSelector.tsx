import React from "react";
import { useTranslations } from "@/providers/TranslationsProvider";

interface TypeSelectorProps {
  consultantTypes: string[];
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({
  consultantTypes,
  selectedType,
  onTypeChange,
}) => {
  const { t } = useTranslations();

  return (
    <div>
      <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-pink-600 dark:text-pink-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <span className="text-purple-700 dark:text-pink-400">{t("labels.select consultant type")}</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {consultantTypes.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`group p-3 text-sm font-semibold rounded-3xl border-2 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-pink-400 ${
              selectedType === type
                ? "bg-linear-to-r from-purple-500 to-pink-400 text-white border-purple-600 shadow-xl shadow-purple-500/40"
                : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:scale-102"
            }`}
          >
            <div className="text-center">
              <div className="font-bold text-sm mb-1">{type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeSelector;