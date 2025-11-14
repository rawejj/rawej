import React from "react";
import { useTranslations } from "@/providers/TranslationsProvider";

interface BookingModalActionsProps {
  selectedTime: string;
  confirmed: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const BookingModalActions: React.FC<BookingModalActionsProps> = ({
  selectedTime,
  confirmed,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslations();

  return (
    <div className="space-y-2 mt-6">
      <button
        className={`w-full py-4 rounded-3xl font-bold shadow-lg transition-all duration-300 text-lg border-2 ${
          selectedTime
            ? "bg-linear-to-r from-purple-500 to-pink-400 text-white border-purple-500 hover:from-purple-600 hover:to-pink-500 hover:shadow-xl hover:shadow-purple-500/50 hover:border-purple-600"
            : "bg-gray-100 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 border-gray-200 dark:border-zinc-600 cursor-not-allowed"
        }`}
        onClick={selectedTime ? onConfirm : undefined}
        disabled={!selectedTime}
      >
        <div className="flex items-center justify-center gap-2">
          {confirmed ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t("buttons.booked")}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("buttons.confirm booking")}
            </>
          )}
        </div>
      </button>
      <button
        className="w-full py-3 rounded-3xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-sm font-medium transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
        onClick={onClose}
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {t("buttons.cancel")}
        </div>
      </button>
    </div>
  );
};

export default BookingModalActions;