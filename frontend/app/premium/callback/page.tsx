'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth/AuthContext';

export default function PremiumCallback() {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        const trxref = urlParams.get('trxref');

        if (reference || trxref) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/premium_subscriptions/verify`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ reference: reference || trxref }),
            },
          );

          const result = await response.json();

          if (result.success) {
            if (result.processed) {
              // Webhook already processed - immediate access
              router.push('/account?premium=success');
            } else {
              // Webhook not processed yet - show waiting message
              router.push('/account?premium=pending');
            }
          } else {
            router.push('/account?premium=failed');
          }
        }
      } catch (error) {
        router.push('/account?premium=error');
      }
    };

    verifyPayment();
  }, [router, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-none border border-gray-200 max-w-md mx-4">
        {/* Clean spinner */}
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-bantu-green border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>

          {/* Checkmark icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-bantu-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Processing Payment
        </h2>

        <p className="text-gray-600 mb-4">
          Please wait while we confirm your subscription...
        </p>

        {/* Subtle loading dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-bantu-green rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-bantu-green rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-bantu-green rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
