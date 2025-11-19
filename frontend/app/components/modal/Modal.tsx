import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?:
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'xxlarge'
    | 'xxxlarge'
    | 'huge'
    | 'full';
  isDraggable?: boolean;
  closeOnBackdropClick?: boolean;
  customStyles?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'medium',
  isDraggable = false,
  closeOnBackdropClick = true,
  customStyles = {},
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleKeyDown]);

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) onClose();
  };

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    xlarge: 'max-w-xl',
    xxlarge: 'max-w-2xl',
    xxxlarge: 'max-w-4xl w-[95vw]',
    huge: 'max-w-7xl w-[98vw]',
    full: 'max-w-full mx-4 w-[95vw]',
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm z-[100]"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            ref={modalRef}
            className={`relative w-full ${sizeClasses[size]} bg-background border border-border rounded-lg shadow-2xl mt-6 mb-6`}
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            drag={isDraggable}
            dragConstraints={{
              top: -100,
              left: -100,
              right: 100,
              bottom: 100,
            }}
            style={{
              ...customStyles,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div className="p-6">
              <button
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors duration-200 z-10"
                onClick={onClose}
                aria-label="Close modal"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="mt-4">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render modal using Portal to escape any stacking context issues
  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};

export default Modal;
