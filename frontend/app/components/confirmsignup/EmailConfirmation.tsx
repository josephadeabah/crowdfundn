"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Adjust based on your router library
import { confirmEmail } from '@/app/utils/api/api.confirm_email';

const EmailConfirmation: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    const confirmUserEmail = async () => {
      if (!token) return;

      try {
        const response = await confirmEmail(token as string);
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
