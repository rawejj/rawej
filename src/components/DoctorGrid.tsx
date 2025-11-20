"use client";

import React from "react";
import DoctorCard from "./DoctorCard";
import DoctorCardSkeleton from "./DoctorCardSkeleton";
import { Doctor } from "@/types/doctor";

interface DoctorGridProps {
  doctors: Doctor[];
  onBook: (doctor: Doctor) => void;
  loading?: boolean;
}

const DoctorGrid: React.FC<DoctorGridProps> = ({
  doctors,
  onBook,
  loading,
}) => {
  const skeletonCount = Math.max(doctors.length, 6); // fallback to 6 skeletons if no doctors
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {loading
        ? Array.from({ length: skeletonCount }).map((_, idx) => (
          <DoctorCardSkeleton key={idx} />
        ))
        : doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} onBook={onBook} />
        ))}
    </div>
  );
};

export default DoctorGrid;
