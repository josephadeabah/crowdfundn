'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import {
  confirmEmail,
  resendConfirmationEmail,
} from '@/app/utils/api/api.confirm_email';
import FullscreenLoader from '@/app/loaders/FullscreenLoader';

const EmailConfirmationContent = () => {
  const [status, setStatus] = useState<string>('');
  const [resendStatus, setResendStatus] = useState<string>('');
  const params = useParams(); 
  const token = Array.isArray(params?.token)
    ? params.token[0]
    : params?.token || ''; // Ensure token is a string
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmUserEmail = async () => {
      if (!token) {
        setStatus('error');
        setLoading(false);
        return;
      }

      try {
        const response = await confirmEmail(token);

        if (response.message) {
          setStatus(response.message);
        }
        if (response.error) {
          setStatus(response.error);
        }
      } catch (error) {
        if ((error as Error)?.message) {
          setStatus('Error confirming email. Please try again later.');
        } else {
          setStatus('Unexpected error occurred. Please try again later.');
        }
      } finally {
        setLoading(false); // Ensure loading state is set to false when done
      }
    };

    // Set a timeout to simulate loading for 2 seconds
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false); // Stop loading if still loading after 2 seconds
      }
    }, 2000);

    confirmUserEmail();

    return () => clearTimeout(timeout); // Clear timeout if the component unmounts
  }, [token]);

  const handleResend = async () => {
    if (!email) return;

    setResendStatus('loading');
    try {
      const response = await resendConfirmationEmail(email);
      const data = await response.json();

      if (data.message) {
        setResendStatus(data.message);
      } else if (data.error) {
        setResendStatus(data.error);
      } else {
        setResendStatus('Unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      if ((error as Error)?.message) {
        setResendStatus(
          'Failed to resend confirmation email. Please try again later.',
        );
      } else {
        setResendStatus('Unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {loading && (
        <p className="text-lg text-blue-500">Confirming your email...</p>
      )}

      {status === 'Email confirmed successfully' && (
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

      {/* Already Confirmed / Invalid Token */}
      {(status === 'Email is already confirmed.' ||
        status === 'Invalid confirmation token' ||
        status ===
          'Confirmation token has expired. Please request a new confirmation email.' ||
        status === 'Invalid token format' ||
        status === 'Error confirming email. Please try again later.' ||
        status === 'Unexpected error occurred. Please try again later.') && (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          {status === 'Email is already confirmed.' && (
            <>
              <p className="text-xl font-semibold text-blue-500">
                Email already confirmed!
              </p>
              <p className="mt-4">
                You can{' '}
                <a href="/auth/login" className="text-blue-500 hover:underline">
                  log in
                </a>{' '}
                now.
              </p>
            </>
          )}
          {status === 'Invalid confirmation token' && (
            <>
              <p className="text-xl font-semibold text-red-500">
                Failed to confirm email.
              </p>
              <p className="mt-4 text-gray-700">
                The link might be invalid or there was an error processing your
                request.
              </p>
            </>
          )}
          {status ===
            'Confirmation token has expired. Please request a new confirmation email.' && (
            <>
              <p className="text-xl font-semibold text-orange-500">
                Confirmation link expired.
              </p>
              <p className="mt-4">
                Please enter your email to resend the confirmation link:
              </p>
            </>
          )}
          {status === 'Invalid token format' && (
            <>
              <p className="text-xl font-semibold text-red-500">
                Error with confirmation link.
              </p>
              <p className="mt-4">
                The token format seems to be incorrect. Please try again.
              </p>
            </>
          )}
          {status === 'Unexpected error occurred. Please try again later.' && (
            <>
              <p className="text-xl font-semibold text-red-500">
                Something went wrong.
              </p>
              <p className="mt-4">
                An unexpected error occurred. Please try again later.
              </p>
            </>
          )}

          {/* Resend Confirmation Form */}
          <div className="mt-6">
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded w-full mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleResend}
              className="bg-blue-100 text-indigo-600 py-2 px-4 rounded hover:bg-blue-200 w-full"
              disabled={loading || resendStatus === 'loading'} // Disable if loading or resend is in progress
            >
              {resendStatus === 'loading'
                ? 'Resending...'
                : 'Resend Confirmation Email'}
            </button>
            {resendStatus === 'Confirmation email resent successfully' && (
              <p className="mt-4 text-green-500">
                Confirmation email resent successfully.
              </p>
            )}
            {resendStatus ===
              'Error confirming email. Please try again later.' && (
              <p className="mt-4 text-red-500">
                Failed to resend confirmation email. Please try again later.
              </p>
            )}
            {resendStatus === 'Invalid email' && (
              <p className="mt-4 text-red-500">
                The email address provided is invalid. Please check and try
                again.
              </p>
            )}
            {resendStatus ===
              'Confirmation email already sent recently. Please check your inbox or try again later.' && (
              <p className="mt-4 text-yellow-500">
                A confirmation email was already sent recently. Please check
                your inbox or try again later.
              </p>
            )}
            {resendStatus ===
              'Unexpected error occurred. Please try again later.' && (
              <p className="mt-4 text-red-500">
                An unexpected error occurred while resending the confirmation
                email. Please try again later.
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
