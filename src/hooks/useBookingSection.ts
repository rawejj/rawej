import { useState, useRef, useCallback, useEffect } from "react";
import type { Product } from "@/components/BookingModal/ProductSelector";
import type { Doctor } from "@/types/doctor";
import type { DateSlot } from "@/services/usersService";

export function useBookingSection(initialDoctors: Doctor[], hasMoreProp?: boolean) {
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availableDates, setAvailableDates] = useState<DateSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const [selectedPriceId, setSelectedPriceId] = useState<number | undefined>(undefined);
  const [modalLoading, setModalLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(typeof hasMoreProp === "boolean" ? hasMoreProp : true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll logic
  const fetchMoreDoctors = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/users?page=${page + 1}&limit=10`);
      const json = await res.json();
      if (json.success && Array.isArray(json.items)) {
        setDoctors((prev) => [...prev, ...json.items]);
        setPage((prev) => prev + 1);
        if (
          json.items.length === 0 ||
          (json.pageCount && page + 1 >= json.pageCount)
        ) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // Fetch products for a doctor
  const fetchProducts = async (uuid: string) => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/v1/products/${uuid}`);
      const json = await res.json();
      if (Array.isArray(json)) {
        setProducts(json);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    if (!hasMore) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreDoctors();
        }
      },
      { threshold: 1 },
    );
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

  return {
    error,
    setError,
    showModal,
    setShowModal,
    selectedDoctor,
    setSelectedDoctor,
    availableDates,
    setAvailableDates,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    confirmed,
    setConfirmed,
    products,
    setProducts,
    selectedProductId,
    setSelectedProductId,
    selectedPriceId,
    setSelectedPriceId,
    modalLoading,
    setModalLoading,
    doctors,
    setDoctors,
    page,
    setPage,
    hasMore,
    setHasMore,
    loading,
    setLoading,
    observerRef,
    fetchMoreDoctors,
    fetchProducts,
  };
}
