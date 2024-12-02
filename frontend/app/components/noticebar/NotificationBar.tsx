'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const NotificationBar = () => {
  // Check if there is a stored countdown value in localStorage
  const savedDaysLeft = localStorage.getItem('daysLeft');
  const initialDaysLeft = savedDaysLeft ? parseInt(savedDaysLeft, 10) : 30;

  const [isVisible, setIsVisible] = useState(true);
  const [daysLeft, setDaysLeft] = useState(initialDaysLeft);

  useEffect(() => {
    if (daysLeft <= 0) return; // Don't start interval if countdown is already finished

    const interval = setInterval(() => {
      setDaysLeft((prev) => {
        const newDaysLeft = prev > 0 ? prev - 1 : 0;
        // Persist the new value in localStorage
        localStorage.setItem('daysLeft', newDaysLeft.toString());
        return newDaysLeft;
      });
    }, 86400000); // Update every 24 hours (86400000 ms)

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [daysLeft]); // Re-run the effect when daysLeft changes

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-orange-100 text-orange-800 font-medium py-2 px-9 z-50 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm">
          We're in Beta. Soon Launching. Stay tuned!
        </span>
      </div>
      <button
        onClick={handleClose}
        className="p-2 rounded-full hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <XMarkIcon className="h-5 w-5 text-orange-500 hover:text-orange-800" />
      </button>
    </div>
  );
};

export default NotificationBar;
