'use client';

import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export const InfoBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null;

  return (
    <div className="bg-red-100 border-b border-red-200 text-red-800 p-3 text-center text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="flex-1">
          Due to a recent system update on Bantu Hive, your payment method may
          have been inadvertently removed from your account. To continue
          receiving support on your campaigns and enjoying a seamless
          experience, please take a moment to re-add your payment method.
          <span className="block mt-1">
            We're sorry for the inconvenience caused.
          </span>
        </p>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Link
            href="/account#Settings"
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 whitespace-nowrap text-sm font-medium transition-colors"
          >
            Update Payment Method
          </Link>
          <button
            onClick={() => setShowBanner(false)}
            className="ml-2 text-red-600 hover:text-red-800 p-1"
            aria-label="Close banner"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
