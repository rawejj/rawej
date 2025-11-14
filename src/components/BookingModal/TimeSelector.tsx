import React from "react";
import { useTranslations } from "@/providers/TranslationsProvider";

interface TimeSlot {
  start: string;
  end: string;
  duration: string;
}

interface BookingModalTimeSelectorProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  times: TimeSlot[];
}

const BookingModalTimeSelector: React.FC<BookingModalTimeSelectorProps> = ({
  selectedTime,
  onTimeChange,
  times,
}) => {
  const { t } = useTranslations();

  const formatTime = (time: string) => {
    return time; // Return time as-is (already in 24h format from API)
  };

  return (
    <div>
      <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-pink-600 dark:text-pink-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>
        <span className="text-purple-700 dark:text-pink-400">{t("labels.select a time")}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {times.map((time) => (
          <button
            key={time.start}
            onClick={() => onTimeChange(time.start)}
            className={`group p-2 text-sm font-semibold rounded-3xl border-2 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-pink-400 ${
              selectedTime === time.start
                ? "bg-linear-to-r from-purple-500 to-pink-400 text-white border-purple-600 shadow-xl shadow-purple-500/40"
                : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:scale-102"
            }`}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-0.5">
                <svg
                  className={`w-3 h-3 ${selectedTime === time.start ? 'text-purple-100' : 'text-purple-500 dark:text-purple-400'}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span className="font-bold text-sm">
                  {formatTime(time.start)}
                </span>
              </div>
              <div className={`text-xs font-medium ${selectedTime === time.start ? 'text-purple-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
                {time.duration}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingModalTimeSelector;