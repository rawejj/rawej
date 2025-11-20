import React, { useState } from "react";
import Modal from "../Modal";
import { useTranslations } from "@/providers/TranslationsProvider";
import BookingModalHeader from "./Header";
import BookingModalError from "./Error";
import BookingModalLoading from "./Loading";
import BookingModalNoAvailability from "./NoAvailability";
import BookingModalDateSelector from "./DateSelector";
import BookingModalTimeSelector from "./TimeSelector";
import BookingModalActions from "./Actions";
import ProductSelector, { Product } from "./ProductSelector";
import { Doctor } from "@/types/doctor";

interface BookingModalProps {
  error?: string | null;
  show: boolean;
  doctor: Doctor | null;
  selectedDate: string;
  selectedTime: string;
  confirmed: boolean;
  onClose: () => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
  getNext7Days: () => { title: string; label: string; value: string; times: { start: string; end: string; duration: string }[] }[];
  fetchAvailability?: () => void;
  loading?: boolean;
  products?: Product[];
  selectedProductId?: number;
  selectedPriceId?: number;
  onProductSelect?: (productId: number, priceId: number) => void;
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
  error,
  fetchAvailability,
  loading = false,
  products = [],
  selectedProductId,
  selectedPriceId,
  onProductSelect = () => {},
}) => {

  const [currentStep, setCurrentStep] = useState<'product' | 'datetime'>('product');
  const { t } = useTranslations();
  // Reset step when modal opens
  React.useEffect(() => {
    if (show) {
      setCurrentStep('product');
    }
  }, [show]);
  const days = getNext7Days();
  const selectedDay = days.find((day) => day.value === selectedDate);
  const times = selectedDay?.times || [];
  // Retry handler for error state
  const handleRefresh = () => {
    if (fetchAvailability) {
      fetchAvailability();
    }
  };
  const isLoading = !error && loading;
  if (!show || !doctor) {
    return null;
  }
  // Show loading spinner if products are loading and step is product
  if (loading && currentStep === 'product') {
    return (
      <Modal show={true} onClose={onClose}>
        <BookingModalLoading />
      </Modal>
    );
  }
  return (
    <Modal show={show} onClose={onClose}>
      <BookingModalHeader doctor={doctor} />
      {error ? (
        <BookingModalError error={error} onRefresh={handleRefresh} />
      ) : isLoading ? (
        <BookingModalLoading />
      ) : (
        <>
          {currentStep === 'product' && products && products.length > 0 && (
            <>
              <ProductSelector
                products={products}
                selectedProductId={selectedProductId}
                selectedPriceId={selectedPriceId}
                onSelect={(productId, priceId) => {
                  if (onProductSelect) onProductSelect(productId, priceId);
                  setCurrentStep('datetime');
                  if (fetchAvailability) fetchAvailability();
                }}
              />
            </>
          )}
          {currentStep === 'product' && (!products || products.length === 0) && (
            <div className="mb-4 text-lg font-semibold text-purple-700 dark:text-pink-400 text-center">
              {t('labels.no products available')}
            </div>
          )}
          {currentStep === 'datetime' && (
            <>
              {Array.isArray(days) && days.length === 0 ? (
                <BookingModalNoAvailability />
              ) : (
                <>
                  <BookingModalDateSelector
                    selectedDate={selectedDate}
                    onDateChange={onDateChange}
                    getNext7Days={getNext7Days}
                  />
                  <BookingModalTimeSelector
                    selectedTime={selectedTime}
                    onTimeChange={onTimeChange}
                    times={times}
                  />
                  <div
                    className={`mt-4 px-4 py-3 bg-linear-to-r from-slate-50 to-slate-100 dark:from-zinc-800/50 dark:to-zinc-700/50 rounded-2xl border border-slate-200/60 dark:border-zinc-700/60 shadow-sm transition-all duration-300 ${selectedTime ? '' : 'opacity-0 pointer-events-none select-none'}`}
                    style={{ minHeight: 56 }}
                  >
                    {selectedTime ? (
                      <>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                          <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <svg
                              className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12,6 12,12 16,14" />
                            </svg>
                          </div>
                          <span className="text-blue-700 dark:text-blue-300">{t('labels.selected time details')}</span>
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto">
                          {(() => {
                            const selectedTimeSlot = times.find(time => time.start === selectedTime);
                            if (!selectedTimeSlot) return null;
                            return (
                              <>
                                <div className="shrink-0 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-600 shadow-sm">
                                  <div className="text-xs text-slate-500 dark:text-slate-400">{t('labels.start time')}</div>
                                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedTimeSlot.start}</div>
                                </div>
                                <div className="shrink-0 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-600 shadow-sm">
                                  <div className="text-xs text-slate-500 dark:text-slate-400">{t('labels.end time')}</div>
                                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedTimeSlot.end}</div>
                                </div>
                                <div className="shrink-0 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-600 shadow-sm">
                                  <div className="text-xs text-slate-500 dark:text-slate-400">{t('labels.duration')}</div>
                                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedTimeSlot.duration}</div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              )}
            </>
          )}
          {currentStep !== 'product' && (
            <BookingModalActions
              selectedTime={selectedTime}
              confirmed={confirmed}
              onConfirm={onConfirm}
              onClose={onClose}
              onBack={currentStep === 'datetime' ? () => setCurrentStep('product') : undefined}
            />
          )}
        </>
      )}
    </Modal>
  );
};export default BookingModal;
