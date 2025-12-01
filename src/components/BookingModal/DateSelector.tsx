import React, { useContext } from "react";
import { useTranslations } from "@/providers/TranslationsProvider";
import { LocalizationContext } from "@/providers/LocalizationContext";
import { formatDate } from "@/utils/dateFormatter";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableDates: { title: string; label: string; value: string; times: { start: string; end: string; duration: string }[] }[];
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  availableDates,
}) => {
  const { t } = useTranslations();
  const days = availableDates;
  const localization = useContext(LocalizationContext);
  const lang = localization?.language || "en";

  return (
    <>
      <div className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-3 px-1">
        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="8"
              y1="2"
              x2="8"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="16"
              y1="2"
              x2="16"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <span className="text-purple-700 dark:text-pink-400">{t("labels.select a date")}</span>
      </div>
      <div className="flex gap-2 overflow-x-auto px-1 py-2 mb-4 hide-scrollbar">
        {days.map((day) => {
          const { displayText, subText } = formatDate(
            day.value,
            day.label,
            lang,
            t,
          );

          return (
            <button
              key={day.value}
              className={`px-4 py-3 rounded-2xl border-2 font-semibold transition-all duration-200 min-w-[110px] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-pink-400 cursor-pointer ${
                selectedDate === day.value
                  ? "bg-linear-to-r from-purple-500 to-pink-400 text-white border-purple-500 scale-105 shadow-lg shadow-purple-500/25"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-gray-200 dark:border-zinc-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:scale-102"
              }`}
              onClick={() => onDateChange(day.value)}
            >
              <div className="text-center">
                <div className={`text-sm font-bold ${selectedDate === day.value ? 'text-white' : 'text-zinc-800 dark:text-zinc-100'}`}>
                  {displayText}
                </div>
                {subText && (
                  <div className={`text-xs mt-1 font-medium ${selectedDate === day.value ? 'text-purple-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {subText}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default DateSelector;