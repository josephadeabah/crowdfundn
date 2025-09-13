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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bantu-green mx-auto mb-4"></div>
        <p>Processing your payment...</p>
      </div>
    </div>
  );
}
