import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const NotificationBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-orange-50 dark:bg-orange-900 text-md text-orange-600 dark:text-white font-medium py-0.5 px-9 z-50 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm">
          Thanks for visiting! We're in BETA, and we'd appreciate your feedback.
          Contact us at bantuhivefund@gmail.com
        </span>
      </div>
      <button
        onClick={handleClose}
        className="p-2 rounded-full hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
      >
        <XMarkIcon className="h-5 w-5 hover:text-white text-orange-400" />
      </button>
    </div>
  );
};

export default NotificationBar;
