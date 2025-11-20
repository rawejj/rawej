import React from "react";
import { useTranslations } from "@/providers/TranslationsProvider";

const NoAvailability: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="mb-8 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-amber-500 dark:text-amber-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
        No Available Slots
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-center text-sm max-w-xs">
        {t("messages.no availability slots")}
      </p>
      <p className="text-zinc-400 dark:text-zinc-500 text-center text-xs mt-2">
        Please check back later or contact the doctor directly.
      </p>
    </div>
  );
};

export default NoAvailability;