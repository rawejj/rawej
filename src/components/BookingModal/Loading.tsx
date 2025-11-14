import React from "react";

const BookingModalLoading: React.FC = () => {
  return (
    <div className="mb-8 flex flex-col items-center justify-center py-8">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin border-t-purple-500 dark:border-t-pink-400"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-pink-400 dark:border-t-purple-400 opacity-20"></div>
      </div>
      <div className="text-center space-y-3">
        <div className="w-48 h-4 bg-linear-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-lg animate-pulse"></div>
        <div className="w-32 h-3 bg-linear-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded animate-pulse"></div>
        <div className="w-40 h-3 bg-linear-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default BookingModalLoading;