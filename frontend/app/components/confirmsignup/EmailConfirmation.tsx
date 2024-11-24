'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation'; // For navigation-related logic
import { confirmEmail } from '@/app/utils/api/api.confirm_email';
import FullscreenLoader from '@/app/loaders/FullscreenLoader';

const EmailConfirmationContent = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Get search params (e.g., query params like token)

  useEffect(() => {
    const token = searchParams?.get('token'); // Get the token from the query params

    const confirmUserEmail = async () => {
      if (!token) return;

      try {
        const response = await confirmEmail(token);
        if (response.status === 200) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error confirming email:', error);
        setStatus('error');
      }
    };

    confirmUserEmail();
  }, [searchParams]); // Dependency on searchParams to rerun when token changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {status === 'loading' && (
        <p className="text-lg text-blue-500">Confirming your email...</p>
      )}
      {status === 'success' && (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <p className="text-xl font-semibold text-green-500">
            Email successfully confirmed!
          </p>
          <p className="mt-4">
            You can now{' '}
            <a href="/auth/login" className="text-blue-500 hover:underline">
              login
            </a>
            .
          </p>
        </div>
      )}
      {status === 'error' && (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <p className="text-xl font-semibold text-red-500">
            Failed to confirm email.
          </p>
          <p className="mt-4 text-gray-700">
            The link might be invalid or expired.
          </p>
        </div>
      )}
    </div>
  );
};

const EmailConfirmation = () => {
  return (
    <Suspense fallback={<FullscreenLoader/>}>
      <EmailConfirmationContent />
    </Suspense>
  );
};

export default EmailConfirmation;
