import React from "react";
import { useTranslations } from "@/providers/TranslationsProvider";

interface ActionsProps {
  selectedTime: string;
  confirmed: boolean;
  onConfirm: () => void;
  onClose: () => void;
  onBack?: () => void;
}

const Actions: React.FC<ActionsProps> = ({
  selectedTime,
  confirmed,
  onConfirm,
  onClose,
  onBack,
}) => {
  const { t } = useTranslations();

  return (
    <div className="mt-6 space-y-3">
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
      <div className="flex gap-3 justify-between">
        {onBack && (
          <button
            className="px-6 py-3 rounded-3xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-sm font-medium transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            onClick={onBack}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 ltr:hidden" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l7 7-7 7" />
              </svg>
              <svg className="w-4 h-4 rtl:hidden" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {t("buttons.back")}
            </div>
          </button>
        )}
        <button
          className="px-6 py-3 rounded-3xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-sm font-medium transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
          onClick={onClose}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M18 18L6 6" />
            </svg>
            {t("buttons.cancel")}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Actions;