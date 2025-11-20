import type { Product } from "@/components/BookingModal/ProductSelector";
import { Doctor } from "@/types/doctor";
import BookingModal from ".";
import { DateSlot } from "@/services/usersService";

interface ControllerProps {
  showModal: boolean;
  doctor: Doctor | null;
  availableDates: DateSlot[];
  selectedDate: string;
  selectedTime: string;
  confirmed: boolean;
  error: string | null;
  loading: boolean;
  products: Product[];
  selectedProductId: number | undefined;
  selectedPriceId: number | undefined;
  onClose: () => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
  fetchAvailability: (doctor?: Doctor) => Promise<void>;
  onProductSelect: (productId: number, priceId: number) => void;
}

export function Controller(props: ControllerProps) {
  return (
    <BookingModal
      {...props}
      show={props.showModal}
      getNext7Days={() => {
        // Example implementation, replace with actual logic if needed
        const today = new Date();
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const value = date.toISOString().split("T")[0];
          return {
            title: value,
            label: value,
            value: value,
            times: [],
          };
        });
      }}
    />
  );
}
