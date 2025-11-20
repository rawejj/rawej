import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useBookingSection } from "../useBookingSection";
import type { Doctor } from "@/types/doctor";
import type { DateSlot } from "@/services/usersService";

vi.stubGlobal("fetch", vi.fn());

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

describe("useBookingSection", () => {
  const mockDoctor: Doctor = {
    id: 1,
    uuid: "doc-1",
    name: "John Doe",
    email: "john@example.com",
    specialty: "Cardiology",
  };

  const mockDoctors: Doctor[] = [mockDoctor];

  const mockProduct = {
    id: 1,
    title: "Video Consultation",
    slug: "video-consultation",
    slug_old: "video-consultation",
    title_en: "Video Consultation",
    summary: "Video consultation service",
    description: "Consult with doctor via video call",
    display_rank: 1,
    created_at: "2023-01-01T00:00:00Z",
    prices: [
      {
        id: 1,
        product_id: 1,
        title: "Standard",
        price: 5000,
        discount_amount: 0,
        discount_percent: "0",
        created_at: "2023-01-01T00:00:00Z",
      },
    ],
  };

  const mockDateSlot: DateSlot = {
    title: "2024-01-15",
    label: "Monday, January 15",
    value: "2024-01-15",
    times: [{ start: "09:00", end: "09:30", duration: "30m" }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with correct default state", () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors));

    expect(result.current.error).toBeNull();
    expect(result.current.showModal).toBe(false);
    expect(result.current.selectedDoctor).toBeNull();
    expect(result.current.doctors).toEqual(mockDoctors);
    expect(result.current.page).toBe(1);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it("initializes with hasMore prop when provided", () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors, false));

    expect(result.current.hasMore).toBe(false);
  });

  it("updates error state", () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors));

    act(() => {
      result.current.setError("Test error");
    });

    expect(result.current.error).toBe("Test error");
  });

  it("toggles modal visibility", () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors));

    act(() => {
      result.current.setShowModal(true);
    });

    expect(result.current.showModal).toBe(true);

    act(() => {
      result.current.setShowModal(false);
    });

    expect(result.current.showModal).toBe(false);
  });

  it("sets selected doctor", () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors));

    act(() => {
      result.current.setSelectedDoctor(mockDoctor);
    });

    expect(result.current.selectedDoctor).toEqual(mockDoctor);
  });

  it("manages booking form state", () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors));

    act(() => {
      result.current.setSelectedDate("2024-01-15");
      result.current.setSelectedTime("14:00");
      result.current.setSelectedProductId(1);
      result.current.setSelectedPriceId(100);
    });

    expect(result.current.selectedDate).toBe("2024-01-15");
    expect(result.current.selectedTime).toBe("14:00");
    expect(result.current.selectedProductId).toBe(1);
    expect(result.current.selectedPriceId).toBe(100);
  });

  it("confirms booking", () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors));

    act(() => {
      result.current.setConfirmed(true);
    });

    expect(result.current.confirmed).toBe(true);
  });

  it("manages products state", () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors));

    act(() => {
      result.current.setProducts([mockProduct]);
    });

    expect(result.current.products).toEqual([mockProduct]);
  });

  it("fetches products for a doctor", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ items: [mockProduct] }),
    } as Response);

    const { result } = renderHook(() => useBookingSection(mockDoctors));

    await act(async () => {
      await result.current.fetchProducts("doc-1");
    });

    expect(result.current.products).toEqual([mockProduct]);
    expect(fetch).toHaveBeenCalledWith("/api/v1/products/doc-1");
  });

  it("handles product fetch errors", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useBookingSection(mockDoctors));

    await act(async () => {
      await result.current.fetchProducts("doc-1");
    });

    expect(result.current.products).toEqual([]);
  });

  it("handles invalid product response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ items: null }),
    } as Response);

    const { result } = renderHook(() => useBookingSection(mockDoctors));

    await act(async () => {
      await result.current.fetchProducts("doc-1");
    });

    expect(result.current.products).toEqual([]);
  });

  it("fetches more doctors for infinite scroll", async () => {
    const newDoctor: Doctor = {
      id: 2,
      uuid: "doc-2",
      name: "Jane Smith",
      email: "jane@example.com",
      specialty: "Neurology",
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        items: [newDoctor],
        pageCount: 5,
      }),
    } as Response);

    const { result } = renderHook(() => useBookingSection(mockDoctors));

    await act(async () => {
      await result.current.fetchMoreDoctors();
    });

    expect(result.current.doctors).toContain(mockDoctor);
    expect(result.current.doctors).toContain(newDoctor);
    expect(result.current.page).toBe(2);
  });

  it("stops infinite scroll at end of pages", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        items: [],
        pageCount: 1,
      }),
    } as Response);

    const { result } = renderHook(() => useBookingSection(mockDoctors));

    await act(async () => {
      await result.current.fetchMoreDoctors();
    });

    expect(result.current.hasMore).toBe(false);
  });

  it("handles fetch error in infinite scroll", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useBookingSection(mockDoctors));

    await act(async () => {
      await result.current.fetchMoreDoctors();
    });

    expect(result.current.hasMore).toBe(false);
  });

  it("does not fetch more doctors if already loading", async () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors));

    act(() => {
      result.current.setLoading(true);
    });

    await act(async () => {
      await result.current.fetchMoreDoctors();
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not fetch more doctors if hasMore is false", async () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors, false));

    await act(async () => {
      await result.current.fetchMoreDoctors();
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it("manages available dates", () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors));

    act(() => {
      result.current.setAvailableDates([mockDateSlot]);
    });

    expect(result.current.availableDates).toEqual([mockDateSlot]);
  });

  it("provides observerRef for infinite scroll", () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors));

    expect(result.current.observerRef).toBeDefined();
    expect(result.current.observerRef.current).toBeNull();
  });

  it("manages modal loading state", () => {
    const { result } = renderHook(() => useBookingSection(mockDoctors));

    act(() => {
      result.current.setModalLoading(true);
    });

    expect(result.current.modalLoading).toBe(true);

    act(() => {
      result.current.setModalLoading(false);
    });

    expect(result.current.modalLoading).toBe(false);
  });
});
