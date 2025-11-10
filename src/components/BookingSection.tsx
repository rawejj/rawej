"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import DoctorCard from "@/components/DoctorCard";
import BookingModal from "@/components/BookingModal";
import DoctorCardSkeleton from "@/components/DoctorCardSkeleton";

export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  image?: string;
  bio: string;
  availability?: string[];
  callTypes?: Array<'phone' | 'video' | 'voice'>;
};

const getNext7DaysRaw = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      label: d.toISOString().slice(0, 10),
      value: d.toISOString().slice(0, 10),
    });
  }
  return days;
};

const times = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30"
];

export default function BookingSection({ doctors: initialDoctors, translations, locale, hasMore: hasMoreProp }: { doctors: Doctor[]; translations?: Record<string,string>; locale?: string; hasMore?: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const getNext7DaysFormatted = () => {
    return getNext7DaysRaw().map(day => {
      try {
        return {
          ...day,
          label: new Date(day.value).toLocaleDateString(locale || undefined, { weekday: "short", month: "short", day: "numeric" })
        };
      } catch {
        return {
          ...day,
          label: new Date(day.value).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
        };
      }
    });
  };
  const [days] = useState(getNext7DaysFormatted());
  const [selectedDate, setSelectedDate] = useState(days[0].value);
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // Infinite scroll state
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    typeof hasMoreProp === 'boolean' ? hasMoreProp : true
  );
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Fetch next page
  const fetchMoreDoctors = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/doctors?page=${page + 1}&limit=10`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDoctors(prev => [...prev, ...json.data]);
        setPage(prev => prev + 1);
        if (json.data.length === 0 || (json.pageCount && page + 1 >= json.pageCount)) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        // Optionally log error for debugging
        console.error('Failed to fetch doctors:', error.message);
      } else {
        console.error('Failed to fetch doctors: Unknown error');
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!hasMore) return;
    const observer = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMoreDoctors();
      }
    }, { threshold: 1 });
    const refValue = observerRef.current;
    if (refValue) {
      observer.observe(refValue);
    }
    return () => {
      if (refValue) {
        observer.unobserve(refValue);
      }
    };
  }, [fetchMoreDoctors, hasMore]);

  const openModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setSelectedDate(days[0].value);
    setSelectedTime("");
    setConfirmed(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setConfirmed(false);
  };

  const confirmBooking = () => {
    setConfirmed(true);
    setTimeout(() => {
      closeModal();
    }, 1500);
  };

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, idx) => (
            <DoctorCard key={doctor.id + '-' + idx} doctor={doctor} onBook={openModal} />
          ))}
          {/* Skeletons to fill empty grid spaces when loading */}
          {loading && (() => {
            // Determine columns (default 3 for lg)
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
          <div className="text-center text-gray-400 py-4">{translations?.noMoreDoctors ?? 'No more doctors to load.'}</div>
        )}
      </main>
      <BookingModal
        show={showModal}
        doctor={selectedDoctor}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        confirmed={confirmed}
        onClose={closeModal}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
        onConfirm={confirmBooking}
        getNext7Days={() => days}
        times={times}
      />
      {/* Modal animation */}
      <style>{`
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(.4,2,.6,1) both; }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
