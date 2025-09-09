'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth/AuthContext';

export default function PremiumCallback() {
  const router = useRouter();
  const { token } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Wait for authentication to be ready
        if (!token) {
          setTimeout(verifyPayment, 500); // Retry after delay
          return;
        }

        if (!token) {
          throw new Error('Authentication token not available');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference') || urlParams.get('trxref');

        if (!reference) {
          throw new Error('No payment reference found');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/premium_subscriptions/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ reference }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          router.push(result.processed 
            ? '/account?premium=success' 
            : '/account?premium=pending'
          );
        } else {
          router.push('/account?premium=failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        router.push('/account?premium=error');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [router, token]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bantu-green mx-auto mb-4"></div>
          <p>Processing your payment...</p>
        </div>
      </div>
    );
  }

  return null;
}