import React, { useState } from "react";
import Modal from "../Modal";
import { useTranslations } from "@/providers/TranslationsProvider";
import Header from "./Header";
import Error from "./Error";
import Loading from "../Loading";
import NoAvailability from "./NoAvailability";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import Actions from "./Actions";
import ProductSelector, { Product } from "./ProductSelector";
import { Doctor } from "@/types/doctor";
import SelectedProductPrice from "./SelectedProductPrice";

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
  availableDates: { title: string; label: string; value: string; times: { start: string; end: string; duration: string }[] }[];
  fetchAvailability?: () => void;
  loading?: boolean;
  confirming?: boolean; // New prop for confirmation loading overlay
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
  availableDates,
  error,
  fetchAvailability,
  loading = false,
  confirming = false, // New prop for confirmation loading overlay
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
      setCurrentStep(selectedProductId ? 'datetime' : 'product');
    }
  }, [show, selectedProductId]);

  const days = availableDates;
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

  const handleBack = () => {
    if (currentStep === 'datetime') {
      setCurrentStep('product');
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Header doctor={doctor} />

      {error ? (
        <Error error={error} onRefresh={handleRefresh} />
      ) : isLoading ? (
        <Loading />
      ) : (
        <>
          {currentStep === 'product' && products && products.length > 0 && (
            <>
              <ProductSelector
                products={products}
                selectedProductId={selectedProductId}
                selectedPriceId={selectedPriceId}
                onSelect={async (productId, priceId) => {
                  if (onProductSelect) await onProductSelect(productId, priceId);
                  setCurrentStep('datetime');
                  if (fetchAvailability) await fetchAvailability();
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
              {loading ? (
                <Loading />
              ) : Array.isArray(days) && days.length === 0 ? (
                <NoAvailability />
              ) : (
                <>
                  <SelectedProductPrice
                    products={products}
                    selectedProductId={selectedProductId}
                    selectedPriceId={selectedPriceId}
                  />
                  <DateSelector
                    selectedDate={selectedDate}
                    onDateChange={onDateChange}
                    availableDates={availableDates}
                  />
                  <TimeSelector
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

              {/* Confirmation Loading Overlay */}
              {confirming && (
                <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t('labels.processing payment')}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Wizard Navigation */}
          {currentStep === 'datetime' && (
            <Actions
              selectedTime={selectedTime}
              confirmed={confirmed}
              onConfirm={onConfirm}
              onClose={onClose}
              onBack={handleBack}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default BookingModal;
