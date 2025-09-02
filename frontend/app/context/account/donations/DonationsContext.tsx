import {
  Donation,
  DonationsState,
  Pagination,
  DonationTransactionData,
  DonationMetadata,
  ShippingData,
  BillingFrequency,
} from '@/app/types/donations.types';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Reward } from '../rewards/RewardsContext';

const DonationsContext = createContext<DonationsState | undefined>(undefined);

export const DonationsProvider = ({ children }: { children: ReactNode }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const planCodeRef = useRef<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
    per_page: 10,
    total_count: 0,
  });
  const { token, user } = useAuth();

  const handleApiError = (errorText: string) => {
    setError(`Oops!: ${errorText}`);
    console.error('Donation Error:', errorText);
  };

  const clearError = () => setError(null);

  // Fetch all donations for the fundraiser (requires authentication)
  const fetchDonations = useCallback(
    async (currentPage: number = 1, perPage: number = 10) => {
      if (!token) {
        handleApiError('You need to log in to access donations.');
        return;
      }

      setLoading(true);
      clearError();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/donations?page=${currentPage}&per_page=${perPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: 'Unknown error' }));
          handleApiError(errorData.error || 'Failed to fetch donations');
          return;
        }

        const data = await response.json();
        setDonations(data.donations);
        setPagination(data.pagination);
      } catch (err) {
        handleApiError(
          'Network error fetching donations. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Fetch public donations for a campaign (no authentication required)
  const fetchPublicDonations = useCallback(
    async (
      campaignId: string,
      currentPage: number = 1,
      perPage: number = 10,
    ) => {
      setLoading(true);
      clearError();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/public_donations?page=${currentPage}&per_page=${perPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: 'Unknown error' }));
          handleApiError(errorData.error || 'Failed to fetch public donations');
          return;
        }

        const data = await response.json();
        setDonations(data.donations);
        setPagination(data.pagination);
      } catch (err) {
        handleApiError(
          'Network error fetching public donations. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Create subscription plan for recurring donations
  const createSubscriptionPlan = async (
    amount: number,
    interval: BillingFrequency,
    campaignTitle: string,
  ): Promise<string | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/subscriptions/create_plan`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            interval,
            name: campaignTitle,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to create subscription plan');
      }

      const data = await response.json();
      return data.plan?.plan_code || null;
    } catch (error) {
      console.warn('Subscription plan creation failed:', error);
      return null;
    }
  };

  // Create Donation Transaction
  const createDonationTransaction = async (
    transactionData: DonationTransactionData,
  ) => {
    const {
      email,
      fullName,
      phoneNumber,
      amount,
      campaignId,
      campaignTitle,
      billingFrequency,
      metadata,
    } = transactionData;

    setLoading(true);
    clearError();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (user && token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Step 1: Create subscription plan for recurring donations
      let planCode: string | null = null;
      if (billingFrequency && billingFrequency !== 'once') {
        planCode = await createSubscriptionPlan(
          amount,
          billingFrequency,
          campaignTitle,
        );
        if (!planCode) {
          throw new Error('Failed to create subscription plan');
        }
      }

      // Step 2: Create donation transaction
      const donationPayload = {
        donation: {
          amount,
          email,
          full_name: fullName,
          phone: phoneNumber,
          plan: planCode,
          metadata: metadata || {},
        },
      };

      console.log('Donation Payload', donationPayload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/donations`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(donationPayload),
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || 'Failed to create donation transaction',
        );
      }

      // Step 3: Redirect to Paystack Checkout
      const authorizationUrl =
        responseData.authorization_url || responseData.data?.authorization_url;

      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        throw new Error('No authorization URL received from server');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error initiating donation. Please try again later.';
      handleApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      donations,
      loading,
      error,
      pagination,
      fetchDonations,
      fetchPublicDonations,
      createDonationTransaction,
      clearError,
    }),
    [
      donations,
      loading,
      error,
      pagination,
      fetchDonations,
      fetchPublicDonations,
      createDonationTransaction,
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
  if (!context) {
    throw new Error('useDonations must be used within a DonationsProvider');
  }
  return context;
};
