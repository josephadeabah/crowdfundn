'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import {
  confirmEmail,
  resendConfirmationEmail,
} from '@/app/utils/api/api.confirm_email'; // Import resend API
import FullscreenLoader from '@/app/loaders/FullscreenLoader';

const EmailConfirmationContent = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [resendStatus, setResendStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const params = useParams(); // Get dynamic segment parameters
  const token = Array.isArray(params?.token)
    ? params.token[0]
    : params?.token || ''; // Ensure token is a string
  const [email, setEmail] = useState(''); // To capture the email for resending confirmation

  useEffect(() => {
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
  }, [token]);

  const handleResend = async () => {
    if (!email) return;

    setResendStatus('loading');
    try {
      const response = await resendConfirmationEmail(email);
      if (response.status === 200) {
        setResendStatus('success');
      } else {
        setResendStatus('error');
      }
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      setResendStatus('error');
    }
  };

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
          <div className="mt-6">
            <label className="block text-gray-700 mb-2">
              Enter your email to resend confirmation:
            </label>
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded w-full mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleResend}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              disabled={resendStatus === 'loading'}
            >
              {resendStatus === 'loading'
                ? 'Resending...'
                : 'Resend Confirmation Email'}
            </button>
            {resendStatus === 'success' && (
              <p className="mt-4 text-green-500">
                Confirmation email has been resent. Please check your inbox.
              </p>
            )}
            {resendStatus === 'error' && (
              <p className="mt-4 text-red-500">
                Failed to resend confirmation email. Please try again later.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const EmailConfirmation = () => {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <EmailConfirmationContent />
    </Suspense>
  );
};

export default EmailConfirmation;
