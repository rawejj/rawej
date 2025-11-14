import React from "react";
import { Doctor } from "../BookingSection";
import { useTranslations } from "@/providers/TranslationsProvider";
import BookingModalHeader from "./Header";
import BookingModalError from "./Error";
import BookingModalLoading from "./Loading";
import BookingModalNoAvailability from "./NoAvailability";
import BookingModalDateSelector from "./DateSelector";
import BookingModalTimeSelector from "./TimeSelector";
import BookingModalActions from "./Actions";

interface BookingModalProps {
  error?: string | null;
  show: boolean;
  doctor: Doctor | null;
  selectedDate: string;
  selectedTime: string;
  confirmed: boolean;
  onClose: () => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
  getNext7Days: () => { title: string; label: string; value: string; times: { start: string; end: string; duration: string }[] }[];
  fetchAvailability?: () => void;
  loading?: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({
  show,
  doctor,
  selectedDate,
  selectedTime,
  confirmed,
  onClose,
  onDateChange,
  onTimeChange,
  onConfirm,
  getNext7Days,
  error,
  fetchAvailability,
  loading = false,
}) => {
  const { t } = useTranslations();
  const days = getNext7Days();
  const selectedDay = days.find((day) => day.value === selectedDate);
  const times = selectedDay?.times || [];
  // Retry handler for error state
  const handleRefresh = () => {
    if (fetchAvailability) {
      fetchAvailability();
    }
  };
  const isLoading = !error && loading;
  if (!show || !doctor) {
    return null;
  }
  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-4 rounded-3xl bg-linear-to-br from-white via-white to-gray-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 p-4 shadow-2xl shadow-purple-500/10 dark:shadow-pink-500/10 border border-gray-200/50 dark:border-zinc-700/50 animate-slide-up max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <BookingModalHeader doctor={doctor} />
        {error ? (
          <BookingModalError error={error} onRefresh={handleRefresh} />
        ) : isLoading ? (
          <BookingModalLoading />
        ) : !loading && Array.isArray(days) && days.length === 0 ? (
          <BookingModalNoAvailability />
        ) : (
          <>
            <BookingModalDateSelector
              selectedDate={selectedDate}
              onDateChange={onDateChange}
              getNext7Days={getNext7Days}
            />
            <BookingModalTimeSelector
              selectedTime={selectedTime}
              onTimeChange={onTimeChange}
              times={times}
            />
            <BookingModalActions
              selectedTime={selectedTime}
              confirmed={confirmed}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          </>
        )}
      </div>
    </div>
  );
};export default BookingModal;
