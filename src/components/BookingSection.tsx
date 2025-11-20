"use client";

import { BookingDoctorGrid } from "@/components/BookingDoctorGrid";
import { useBookingSection } from "@/hooks/useBookingSection";
import { Doctor } from "@/types/doctor";
import BookingModal from "@/components/BookingModal";

export default function BookingSection({
  doctors: initialDoctors,
  translations,
  hasMore: hasMoreProp,
}: {
  doctors: Doctor[];
  translations?: Record<string, string>;
  hasMore?: boolean;
}) {
  const {
    doctors,
    loading,
    hasMore,
    fetchMoreDoctors,
    setSelectedDate,
    setSelectedTime,
    setSelectedProductId,
    setSelectedPriceId,
    showModal,
    selectedDoctor,
    selectedDate,
    selectedTime,
    confirmed,
    error,
    modalLoading,
    setModalLoading,
    products,
    selectedProductId,
    selectedPriceId,
    availableDates,
    observerRef,
    setSelectedDoctor,
    setShowModal,
    fetchProducts,
    setAvailableDates,
  } = useBookingSection(initialDoctors, hasMoreProp);

  // Modal handlers
  const openModal = async (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setSelectedDate(availableDates[0]?.value || "");
    setSelectedTime("");
    // Optionally reset confirmation state
    if (doctor?.uuid) {
      await fetchProducts(doctor.uuid);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    // Optionally reset confirmation state
  };

  const confirmBooking = () => {
    // Implement booking confirmation logic here
  };

  const fetchAvailability = async (doctorArg?: Doctor) => {
    const doctor = doctorArg || selectedDoctor;
    if (!doctor || !selectedProductId || !selectedPriceId) return;
    try {
      setModalLoading(true);
      // You may want to pass type or priceId if needed by API
      const res = await fetch(`/api/v1/users/${doctor.uuid}/availability?priceId=${selectedPriceId}`);
      const json = await res.json();
      if (Array.isArray(json)) {
        // Set available dates for the modal
        setSelectedDate(json[0]?.value || "");
        setAvailableDates(json);
      } else {
        setAvailableDates([]);
      }
    } catch {
      setAvailableDates([]);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <BookingDoctorGrid
        doctors={doctors}
        loading={loading}
        hasMore={hasMore}
        observerRef={observerRef}
        onBook={openModal}
        translations={translations}
      />
      <BookingModal
        show={showModal}
        doctor={selectedDoctor}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        confirmed={confirmed}
        error={error}
        loading={modalLoading}
        products={products}
        selectedProductId={selectedProductId}
        selectedPriceId={selectedPriceId}
        onClose={closeModal}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
        onConfirm={confirmBooking}
        fetchAvailability={fetchAvailability}
        onProductSelect={(productId, priceId) => {
          setSelectedProductId(productId);
          setSelectedPriceId(priceId);
        }}
        availableDates={availableDates}
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
