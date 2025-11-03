"use client";

import { useState } from "react";

export default function ErrorMessage({ error }: { error: string }) {
  const [loading, setLoading] = useState(false);

  const handleRetry = () => {
    setLoading(true);
    window.location.reload();
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 flex flex-col items-center gap-4 bg-linear-to-br from-red-100 via-pink-100 to-orange-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 border border-red-300 dark:border-red-700 rounded-2xl shadow-lg animate-in fade-in">
      <div className="flex items-center gap-3">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-red-500 dark:text-red-400"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="text-lg font-semibold text-red-700 dark:text-red-400">Error loading doctors</span>
      </div>
      <div className="text-base text-red-600 dark:text-red-300 text-center">{error}</div>
      <button
        className="mt-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center min-w-[100px]"
        onClick={handleRetry}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"/></svg>
            Loading...
          </span>
        ) : (
          "Retry"
        )}
      </button>
    </div>
  );
}
