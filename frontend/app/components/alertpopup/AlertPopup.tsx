import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, ReactNode } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface AlertPopupProps {
  title: string;
  message: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  error?: string | null;
  icon?: ReactNode;
  confirmText?: string;
  loading?: boolean;
  confirmDisabled?: boolean;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  showCancelButton?: boolean; // Add this to control cancel button visibility
}

const AlertPopup: React.FC<AlertPopupProps> = ({
  title,
  message,
  isOpen,
  setIsOpen,
  onConfirm,
  onCancel,
  error,
  icon = <FaExclamationTriangle className="w-6 h-6 text-red-600" />,
  confirmText = 'Confirm',
  loading = false,
  confirmDisabled = false,
  confirmButtonClass = 'bg-gray-600 hover:bg-gray-900 focus:ring-gray-500',
  cancelButtonClass = 'bg-white hover:bg-gray-50',
  showCancelButton = true, // Default to true for backward compatibility
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scroll when alert is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [setIsOpen, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen, isOpen]);

  // Prevent event propagation to parent modals
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfirm();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onCancel) onCancel();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" // Increased z-index
          onClick={() => setIsOpen(false)} // Close when clicking backdrop
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="rounded-lg w-full max-w-md mx-4" // Added mx-4 for mobile
            onClick={handlePopupClick} // Prevent closing when clicking popup
          >
            <div
              ref={popupRef}
              className="inline-block w-full overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:align-middle"
            >
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-gray-50 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    {icon}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="modal-title"
                    >
                      {title}
                    </h3>
                    <div className="mt-2">
                      <div className="text-sm text-gray-500">{message}</div>
                      {error && (
                        <p className="mt-2 text-sm text-red-600" role="alert">
                          Error: {error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  className={`inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-0 sm:w-auto sm:text-sm ${
                    confirmDisabled || loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : confirmButtonClass
                  }`}
                  onClick={handleConfirm}
                  disabled={confirmDisabled || loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    confirmText
                  )}
                </button>
                {showCancelButton && (
                  <button
                    type="button"
                    className={`inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-0 sm:w-auto sm:text-sm ${cancelButtonClass}`}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertPopup;
