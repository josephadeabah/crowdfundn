// app/hooks/useKYCStatus.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';

interface KYCStatus {
  verified: boolean;
  has_kyc: boolean;
  status: string;
  kyc_type: string;
  verified_at: string | null;
  expires_at: string | null;
  is_expired: boolean;
}

export const useKYCStatus = () => {
  const { user, token } = useAuth();
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKYCStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // If user already has KYC info, use it
        if (user.kyc_status_info) {
          setKycStatus(user.kyc_status_info);
          setLoading(false);
          return;
        }

        // Otherwise, fetch from API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setKycStatus(data);
        } else {
          // Fallback to empty status
          setKycStatus({
            verified: false,
            has_kyc: false,
            status: 'not_started',
            kyc_type: '',
            verified_at: null,
            expires_at: null,
            is_expired: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch KYC status:', error);
        setKycStatus({
          verified: false,
          has_kyc: false,
          status: 'not_started',
          kyc_type: '',
          verified_at: null,
          expires_at: null,
          is_expired: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKYCStatus();
  }, [user]);

  return { kycStatus, loading };
};
