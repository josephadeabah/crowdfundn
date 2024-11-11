import { SingleCampaignResponseDataType } from '@/app/types/campaigns.types';
import { Profile } from '@/app/types/user_profiles.types';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from 'react';

// Refactored Donation interface
interface Donation {
  id: number; // Donation ID
  amount: number;
  donation: {
    message: string;
    status: 'successful'; // Donation status as a fixed string
    amount: string; // Amount as string (if received as a string, otherwise change to number)
    campaign_id: number; // Campaign ID that the donation is for
    id: number; // Donation ID (duplicate, may be removed if redundant)
    user_id: number | null; // User ID who made the donation, nullable
    transaction_reference: string; // Unique reference for the transaction
    total_donations: number; // Total donations received
    metadata: {
      custom_data: string; // Additional custom data for the donation
    };
    created_at: string; // Donation creation timestamp
    updated_at: string; // Donation last updated timestamp
  };
  campaign: SingleCampaignResponseDataType; // Campaign details associated with the donation
  reference: string; // Reference string (either `reference` or `trxref`)
  fundraiser: {
    profile: Profile; // Profile of the fundraiser associated with this donation
  };
}

interface DonationsState {
  donations: Donation[];
  loading: boolean;
  error: string | null;
  createDonationTransaction: (
    email: string,
    amount: number,
    campaignId: string,
    fundraiserId: string,
  ) => void;
  verifyTransaction: (reference: string) => void;
}

const DonationsContext = createContext<DonationsState | undefined>(undefined);

export const DonationsProvider = ({ children }: { children: ReactNode }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [campaignID, setCampaignID] = useState<string | null>(null);

  // Step 1: Create the donation transaction (send donation to backend)
  const createDonationTransaction = async (
    email: string,
    amount: number,
    fundraiser_id: string,
    campaignId: string,
  ) => {
    setCampaignID(campaignId);
    try {
      setLoading(true);
      // Step 1: Create the donation transaction in the backend
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

      // Step 2: Redirect to Paystack using the authorization URL
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

  // Step 3: Verify the transaction (this should be called from the Thank You page)
  const verifyTransaction = async (reference: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignID}/donations/${reference}/verify`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } },
      );

      const data = await response.json();
      if (response.ok) {
        // Successfully verified, update the donation state with the verified data
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
    }),
    [donations, loading, error],
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
