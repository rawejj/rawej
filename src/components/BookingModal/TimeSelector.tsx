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
    // Optionally format time to hh:mm
    return time;
  };

  // Categorize times
  const morning: TimeSlot[] = [];
  const afternoon: TimeSlot[] = [];
  const evening: TimeSlot[] = [];

  times.forEach((slot) => {
    const hour = parseInt(slot.start.split(":")[0], 10);
    if (hour >= 5 && hour < 12) {
      morning.push(slot);
    } else if (hour >= 12 && hour < 17) {
      afternoon.push(slot);
    } else {
      evening.push(slot);
    }
  });

  const renderColumn = (label: string, slots: TimeSlot[]) => (
    <div>
      <div className="mb-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 text-center">{label}</div>
      <div className="flex flex-col gap-2">
        {slots.length === 0 ? (
          <div className="text-xs text-zinc-400 dark:text-zinc-600 text-center">{t('labels.no times')}</div>
        ) : (
          slots.map((time) => (
            <button
              key={time.start}
              onClick={() => onTimeChange(time.start)}
              className={`group p-2 text-sm font-semibold rounded-3xl border-2 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-pink-400 ${
                selectedTime === time.start
                  ? "bg-linear-to-r from-purple-500 to-pink-400 text-white border-purple-600 shadow-md shadow-purple-500/20"
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
          ))
        )}
      </div>
    </div>
  );

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
      <div className="grid grid-cols-3 gap-4 mt-2">
        {renderColumn(t('labels.morning'), morning)}
        {renderColumn(t('labels.afternoon'), afternoon)}
        {renderColumn(t('labels.evening'), evening)}
      </div>
    </div>
  );
};

export default BookingModalTimeSelector;