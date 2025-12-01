import DoctorCard from "@/components/DoctorCard";
import DoctorCardSkeleton from "@/components/DoctorCardSkeleton";
import { Doctor } from "@/types/doctor";
import React from "react";

interface BookingDoctorGridProps {
  doctors: Doctor[];
  loading: boolean;
  hasMore: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
  onBook: (doctor: Doctor) => Promise<void>;
  translations?: Record<string, string>;
}

export function BookingDoctorGrid({
  doctors,
  loading,
  hasMore,
  observerRef,
  onBook,
  translations,
}: BookingDoctorGridProps) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doctor, idx) => (
          <DoctorCard
            key={doctor.id + "-" + idx}
            doctor={doctor}
            onBook={onBook}
          />
        ))}
        {/* Skeletons to fill empty grid spaces when loading */}
        {loading && (() => {
          const columns = 3;
          const remainder = doctors.length % columns;
          const skeletonsNeeded = remainder === 0 ? columns : columns - remainder;
          return Array.from({ length: skeletonsNeeded }).map((_, idx) => (
            <DoctorCardSkeleton key={"skeleton-" + idx} />
          ));
        })()}
      </div>
      {/* Sentinel for infinite scroll */}
      <div ref={observerRef} style={{ height: 1 }} />
      {!hasMore && (
        <div className="text-center text-gray-400 py-4">
          {translations?.noMoreDoctors ?? "No more doctors to load."}
        </div>
      )}
    </main>
  );
}
