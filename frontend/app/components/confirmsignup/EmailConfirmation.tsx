// Import from next/navigation
"use client"

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';  // For navigation-related logic
import { confirmEmail } from '@/app/utils/api/api.confirm_email';

const EmailConfirmation: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const pathname = usePathname(); 
  const searchParams = useSearchParams();  // Get search params (e.g., query params like token)

  useEffect(() => {
    const token = searchParams?.get('token');  // Get the token from the query params

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
  }, [searchParams]);  // Dependency on searchParams to rerun when token changes

  return (
    <div className="confirmation-container">
      {status === 'loading' && <p>Confirming your email...</p>}
      {status === 'success' && (
        <p>
          Email successfully confirmed! You can now{' '}
          <a href="/auth/login">login</a>.
        </p>
      )}
      {status === 'error' && (
        <p>Failed to confirm email. The link might be invalid or expired.</p>
      )}
    </div>
  );
};

export default EmailConfirmation;
