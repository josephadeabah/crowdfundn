'use client';

import * as Toast from '@radix-ui/react-toast';
import * as React from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description: string;
  type: 'success' | 'error' | 'warning';
}

const ToastComponent: React.FC<ToastProps> = ({
  isOpen,
  onClose,
  title,
  description,
  type,
}) => {
  const timerRef = React.useRef<number>(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const icons = {
    success: (
      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
        <FiCheckCircle className="h-5 w-5" />
        <span className="sr-only">Success icon</span>
      </div>
    ),
    error: (
      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
        <FiXCircle className="h-5 w-5" />
        <span className="sr-only">Error icon</span>
      </div>
    ),
    warning: (
      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
        <FiAlertTriangle className="h-5 w-5" />
        <span className="sr-only">Warning icon</span>
      </div>
    ),
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-3 shadow-lg data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut dark:border-gray-700 dark:bg-gray-800"
        open={isOpen}
        onOpenChange={onClose}
      >
        {icons[type]}
        <div className="flex-1">
          <Toast.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </Toast.Title>
          <Toast.Description asChild>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              {description}
            </p>
          </Toast.Description>
        </div>
      </Toast.Root>
      <Toast.Viewport className="fixed right-0 top-4 z-50 flex max-w-xs flex-col gap-2 p-4 outline-none" />
    </Toast.Provider>
  );
};

export default ToastComponent;
