import Image from "next/image";
import React from "react";
import type { Doctor } from "@/components/BookingSection";
import { t } from "i18next";

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => (
  <div className="relative rounded-3xl bg-white dark:bg-zinc-800 shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-[1.03] hover:shadow-2xl">
    {/* Call types top right */}
    {doctor.callTypes && doctor.callTypes.length > 0 && (
      <div className="absolute top-4 right-4 flex gap-1 z-10">
        {doctor.callTypes.map((type: string) => (
          <span key={type} className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-[11px] text-blue-500 dark:text-blue-300 shadow">
            {type === 'phone' && <span>📞</span>}
            {type === 'video' && <span>🎥</span>}
            {type === 'voice' && <span>🔊</span>}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
      </div>
    )}
    <Image
      src={doctor.image || "/images/default-doctor.svg"}
      alt={doctor.name}
      width={80}
      height={80}
      className="rounded-full border-4 border-purple-200 dark:border-pink-400 mb-4 shadow-md"
      onError={(e) => {
        // fallback to SVG if image fails
        (e.target as HTMLImageElement).src = "/images/default-doctor.svg";
      }}
    />
    <h2 className="text-xl font-semibold text-purple-700 dark:text-pink-400 mb-1">{doctor.name}</h2>
    <p className="text-sm text-zinc-500 dark:text-zinc-300 mb-2">{doctor.specialty}</p>
    <p className="text-xs text-zinc-400 dark:text-zinc-400 mb-2">{doctor.bio}</p>
    <div className="flex items-center gap-1 mb-4">
      <span className="text-yellow-400">★</span>
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{doctor.rating}</span>
    </div>
    {/* First availability removed as per request */}
    <button
      className="w-full py-2 px-4 rounded-full bg-linear-to-r from-purple-500 to-pink-400 text-white font-bold shadow-md hover:from-pink-400 hover:to-purple-500 transition-colors"
      onClick={() => onBook(doctor)}
    >
      {t('book appointment')}
    </button>
  </div>
);

export default DoctorCard;
