'use client';

import React, { useEffect, useState } from 'react';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';
import ToastComponent from '../toast/Toast';

const UnverifiedPayment = () => {
  const { error } = useDonationsContext();
  const [showToast, setShowToast] = useState(false);

  // Trigger toast visibility when error changes
  useEffect(() => {
    if (error) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [error]);

  return (
    <>
      {showToast && error && (
        <ToastComponent
          type="error"
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          description={error}
        />
      )}

      <div className="min-h-screen bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
          <div>{error}</div>
          <div className="mt-8 space-y-4">
            <a
              href="/"
              className="w-full inline-block text-center bg-gray-600 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-700 transition"
            >
              Go Back to Home
            </a>
          </div>

          <div className="mt-10 text-sm text-gray-500">
            Need help?{' '}
            <a href="/contact" className="text-blue-600 underline">
              Contact us
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnverifiedPayment;
