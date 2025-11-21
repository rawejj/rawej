"use client";

import { BookingDoctorGrid } from "@/components/BookingDoctorGrid";
import { useBookingSection } from "@/hooks/useBookingSection";
import { Doctor } from "@/types/doctor";
import BookingModal from "@/components/BookingModal";
import { useState } from "react";
import dayjs from "dayjs";

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

  const [confirming, setConfirming] = useState(false);

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


  const confirmBooking = async () => {
    if (!selectedDoctor || !selectedPriceId || !selectedDate || !selectedTime) {
      alert("Please select all required fields.");
      return;
    }
    setConfirming(true);
    try {
      // Combine date and time into a timezone-aware ISO datetime string
      const selectedDateTime = dayjs(`${selectedDate} ${selectedTime}`).toISOString();

      const res = await fetch("/api/v1/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorUuid: selectedDoctor.uuid,
          productPriceId: selectedPriceId,
          selectedDateTime: selectedDateTime, // Send as combined timezone-aware datetime
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Include user's timezone
        }),
      });

      if (!res.ok) {
        throw new Error("Payment failed");
      }
      
      window.location.href = (await res.json()).redirectUrl;
    } catch (err: Error | unknown) {
      setConfirming(false);
      alert("Payment error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const fetchAvailability = async (doctorArg?: Doctor, productId?: number, priceId?: number) => {
    const doctor = doctorArg || selectedDoctor;
    const prodId = productId || selectedProductId;
    const prId = priceId || selectedPriceId;
    if (!doctor || !prodId || !prId) return;
    try {
      setModalLoading(true);
      // You may want to pass type or priceId if needed by API
      const res = await fetch(`/api/v1/users/${doctor.uuid}/availability?priceId=${prId}`);
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
        confirming={confirming}
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
