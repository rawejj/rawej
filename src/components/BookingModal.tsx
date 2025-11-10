import Image from "next/image";
import React from "react";
import { Doctor } from "./BookingSection";
import { useTranslations } from "@/providers/TranslationsProvider";

interface BookingModalProps {
  show: boolean;
  doctor: Doctor | null;
  selectedDate: string;
  selectedTime: string;
  confirmed: boolean;
  onClose: () => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
  getNext7Days: () => { label: string; value: string }[];
  times: string[];
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
  times,
}) => {
  const { t } = useTranslations();
  if (!show || !doctor) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={doctor.image || "/images/default-doctor.svg"}
            alt={doctor.name}
            width={48}
            height={48}
            className="rounded-full border-2 border-purple-200 dark:border-pink-400"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/default-doctor.svg";
            }}
          />
          <div>
            <div className="font-semibold text-lg text-purple-700 dark:text-pink-400">{doctor.name}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-300">{doctor.specialty}</div>
          </div>
        </div>
        <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">{t('labels.select a date')}:</div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
          {getNext7Days().map(day => (
            <button
              key={day.value}
              className={`px-4 py-2 rounded-full border font-semibold transition-colors min-w-[90px] ${selectedDate === day.value
                ? "bg-purple-500 text-white border-purple-500"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700"}`}
              onClick={() => onDateChange(day.value)}
            >
              {day.label}
            </button>
          ))}
        </div>
        <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">{t('labels.select a time')}:</div>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {times.map(time => (
            <button
              key={time}
              className={`py-2 rounded-xl font-semibold transition-colors ${selectedTime === time ? "bg-pink-400 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"}`}
              onClick={() => onTimeChange(time)}
            >
              {time}
            </button>
          ))}
        </div>
        <button
          className={`w-full py-3 rounded-full font-bold shadow-md transition-colors text-lg ${selectedTime ? "bg-linear-to-r from-purple-500 to-pink-400 text-white" : "bg-zinc-300 text-zinc-500 cursor-not-allowed"}`}
          onClick={selectedTime ? onConfirm : undefined}
          disabled={!selectedTime}
        >
          {confirmed ? t('buttons.booked') : t('buttons.confirm booking')}
        </button>
        <button className="w-full mt-3 py-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-sm" onClick={onClose}>
          {t('buttons.cancel')}
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
