import React, { useState } from 'react';
import { FaExclamationTriangle, FaExpand, FaCompress } from 'react-icons/fa';

interface AlertPopupProps {
  title: string;
  message: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  error?: string | null;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  confirmDisabled?: boolean;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  showCancelButton?: boolean;
  maxHeight?: string;
  expandable?: boolean;
  isLoading?: boolean;
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
  cancelText = 'Cancel',
  loading = false,
  confirmDisabled = false,
  confirmButtonClass = 'bg-gray-600 hover:bg-gray-900 focus:ring-gray-500',
  cancelButtonClass = 'bg-white hover:bg-gray-50',
  showCancelButton = true,
  maxHeight = 'max-h-96',
  expandable = true,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Check if content is scrollable and needs expansion
  React.useEffect(() => {
    if (isOpen && contentRef.current && expandable) {
      const element = contentRef.current;
      const isScrollable = element.scrollHeight > element.clientHeight;
      setShowExpandButton(isScrollable);
    }
  }, [isOpen, message, expandable]);

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      // Reset expanded state when opening
      setIsExpanded(false);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [setIsOpen, isOpen]);

  React.useEffect(() => {
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Function to format long text with proper line breaks and paragraphs
  const formatLongText = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string') {
      // Split by double newlines for paragraphs
      const paragraphs = content.split(/\n\s*\n/);

      return paragraphs.map((paragraph, index) => {
        if (paragraph.trim() === '') return null;

        // Split by single newlines for line breaks within paragraphs
        const lines = paragraph.split('\n');

        return (
          <p key={index} className="mb-3 last:mb-0">
            {lines.map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {line.trim()}
                {lineIndex < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      });
    }

    // If it's not a string, return as is
    return content;
  };

  const contentHeightClass = isExpanded ? 'max-h-[70vh]' : maxHeight;

  const isButtonLoading = isLoading || loading;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div
            ref={popupRef}
            className="bg-white rounded-lg w-full max-w-2xl mx-auto max-h-[90vh] flex flex-col shadow-xl"
            onClick={handlePopupClick}
          >
            {/* Header Section */}
            <div className="px-6 pt-5 pb-4 bg-white border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-full">
                      {icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 truncate">
                      {title}
                    </h3>
                  </div>
                </div>
                {expandable && showExpandButton && (
                  <button
                    type="button"
                    onClick={toggleExpand}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? (
                      <FaCompress className="w-4 h-4" />
                    ) : (
                      <FaExpand className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Content Section */}
            <div
              ref={contentRef}
              className={`flex-1 overflow-y-auto px-6 py-4 ${contentHeightClass} transition-all duration-200`}
            >
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {formatLongText(message)}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700 font-medium" role="alert">
                    Error: {error}
                  </p>
                </div>
              )}

              {/* Scroll indicator for non-expanded state */}
              {!isExpanded && showExpandButton && (
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                    <span>Scroll for more content</span>
                    {expandable && (
                      <button
                        onClick={toggleExpand}
                        className="ml-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Expand to view full content"
                      >
                        <FaExpand className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Section - Updated for side-by-side buttons on all screens */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-row justify-end space-x-3">
                {showCancelButton && (
                  <button
                    type="button"
                    className={`inline-flex justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${cancelButtonClass}`}
                    onClick={handleCancel}
                    disabled={isButtonLoading}
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  type="button"
                  className={`inline-flex justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    confirmDisabled || isButtonLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : confirmButtonClass
                  }`}
                  onClick={handleConfirm}
                  disabled={confirmDisabled || isButtonLoading}
                >
                  {isButtonLoading ? (
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertPopup;
