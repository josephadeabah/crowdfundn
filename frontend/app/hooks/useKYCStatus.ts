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
  can_upgrade?: boolean;
  current_type?: string;
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
        // First try to get upgrade status which includes basic status
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/upgrade_status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setKycStatus({
            verified: data.current_type !== undefined,
            has_kyc: data.current_type !== undefined,
            status: data.current_type ? 'verified' : 'not_started',
            kyc_type: data.current_type || '',
            verified_at: null,
            expires_at: null,
            is_expired: false,
            can_upgrade: data.can_upgrade,
            current_type: data.current_type,
          });
        } else {
          // Fallback to basic status
          const statusResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/status`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          );

          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            setKycStatus(statusData);
          } else {
            setKycStatus({
              verified: false,
              has_kyc: false,
              status: 'not_started',
              kyc_type: '',
              verified_at: null,
              expires_at: null,
              is_expired: false,
              can_upgrade: false,
            });
          }
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
          can_upgrade: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKYCStatus();
  }, [user, token]);

  return { kycStatus, loading };
};
