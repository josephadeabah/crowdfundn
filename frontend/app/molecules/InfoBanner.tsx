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
          Due to a recent system update on Bantu Hive, your payment method may have been 
          inadvertently removed from your account. To continue receiving support on your 
          campaigns and enjoying a seamless experience, please take a moment to re-add 
          your payment method. We're sorry for the inconvenience caused.
          
          <span className="block mt-1 md:inline md:mt-0">
            How to Re-Add Your Payment Method:
            <br className="md:hidden" />
            1. Log in to your Bantu Hive account.
            <br className="md:hidden" />
            2. Go to Settings → Payment
            <br className="md:hidden" />
            3. Add your preferred payment method.
          </span>
        </p>
        <div className="flex items-center gap-2">
          <Link
            href="/account#Settings"
            className="font-medium underline hover:text-red-600 whitespace-nowrap"
          >
            Add Payment Now
          </Link>
          <button
            onClick={() => setShowBanner(false)}
            className="ml-2 text-red-600 hover:text-red-800"
            aria-label="Close banner"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};