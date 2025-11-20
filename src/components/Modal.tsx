import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeLabel?: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children, className, closeLabel }) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-4 rounded-3xl bg-linear-to-br from-white via-white to-gray-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 p-4 shadow-2xl shadow-purple-500/10 dark:shadow-pink-500/10 border border-gray-200/50 dark:border-zinc-700/50 animate-slide-up max-h-[85vh] overflow-y-auto relative ${className || ""}`}
        onClick={e => e.stopPropagation()}
      >
        {closeLabel && (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="absolute top-4 rtl:left-4 ltr:right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-700 shadow hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-red-500"
            >
              <path
                fillRule="evenodd"
                d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
