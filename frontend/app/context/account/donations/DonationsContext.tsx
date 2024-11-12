import { Donation, DonationsState } from '@/app/types/donations.types';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../../auth/AuthContext';

const DonationsContext = createContext<DonationsState | undefined>(undefined);

export const DonationsProvider = ({ children }: { children: ReactNode }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [campaignID, setCampaignID] = useState<string | null>(null);
  const { token } = useAuth();

  const handleApiError = (errorText: string) => {
    setError(`API Error: ${errorText}`);
  };

  // Function to fetch all donations for the fundraiser
  const fetchDonations = useCallback(async () => {
    if (!token) {
      setError('Authentication token is missing');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/donations`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        handleApiError(errorText);
        return;
      }

      const fetchedDonations: Donation[] = await response.json();
      setDonations(fetchedDonations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching donations');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Create Donation Transaction
  const createDonationTransaction = async (
    email: string,
    fullName: string,
    phoneNumber: string,
    amount: number,
    fundraiser_id: string,
    campaignId: string,
  ) => {
    setCampaignID(campaignId);
    try {
      setLoading(true);
      const donationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/donations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            email: email,
            full_name: fullName,
            phone: phoneNumber,
            metadata: {
              custom_fields: [
                {
                  display_name: 'Campaign ID',
                  variable_name: 'campaign_id',
                  value: campaignId,
                },
                {
                  display_name: 'Fundraiser ID',
                  variable_name: 'fundraiser_id',
                  value: fundraiser_id,
                },
              ],
            },
          }),
        },
      );

      const donationData = await donationResponse.json();

      if (!donationResponse.ok) {
        throw new Error(donationData.error || 'Failed to create donation');
      }

      const { authorization_url } = donationData;
      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        throw new Error('Authorization URL not found');
      }
    } catch (error) {
      console.error('Error initiating donation:', error);
      setError('Error initiating donation');
    } finally {
      setLoading(false);
    }
  };

  // Verify Transaction
  const verifyTransaction = async (reference: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignID}/donations/${reference}/verify`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } },
      );

      const data = await response.json();
      if (response.ok) {
        setDonations((prevDonations) => [...prevDonations, data]);
      } else {
        throw new Error('Verification failed');
      }
    } catch (err) {
      setError('Verification error');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      donations,
      loading,
      error,
      createDonationTransaction,
      verifyTransaction,
      fetchDonations,
    }),
    [
      donations,
      loading,
      error,
      createDonationTransaction,
      verifyTransaction,
      fetchDonations,
    ],
  );

  return (
    <DonationsContext.Provider value={contextValue}>
      {children}
    </DonationsContext.Provider>
  );
};

export const useDonationsContext = () => {
  const context = useContext(DonationsContext);
  if (!context)
    throw new Error(
      'useDonationsContext must be used within a DonationsProvider',
    );
  return context;
};
