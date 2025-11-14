import React from "react";
import { useTranslations } from "@/providers/TranslationsProvider";

interface BookingModalErrorProps {
  error: string;
  onRefresh?: () => void;
}

const BookingModalError: React.FC<BookingModalErrorProps> = ({
  error,
  onRefresh,
}) => {
  const { t } = useTranslations();

  return (
    <div
      className="mb-8 flex flex-col items-center justify-center py-8 px-4"
      role="alert"
    >
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-red-500 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <span className="text-red-600 dark:text-red-400 text-center font-semibold mb-2 text-lg">
        {error}
      </span>
      <p className="text-zinc-500 dark:text-zinc-400 text-center text-sm mb-6">
        Please try again or contact support if the problem persists.
      </p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-3 px-6 py-3 rounded-3xl bg-linear-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 2v6h-6" />
            <path d="M3 22v-6h6" />
            <path d="M21 8A9 9 0 0 0 5.07 5.07L3 7" />
            <path d="M3 16A9 9 0 0 0 18.93 18.93L21 17" />
          </svg>
          {t("buttons.retry")}
        </button>
      )}
    </div>
  );
};

export default BookingModalError;