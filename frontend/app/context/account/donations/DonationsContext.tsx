import {
  Donation,
  DonationsState,
  Pagination,
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
  const { token } = useAuth();

  const handleApiError = (errorText: string) => {
    setError(`Oops!: ${errorText}`);
  };

  // Fetch all donations for the fundraiser
  const fetchDonations = useCallback(
    async (currentPage: number = 1, perPage: number = 10) => {
      if (!token) {
        handleApiError('You need to log in to access donations.');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/donations?page=${currentPage}&per_page=${perPage}`,
          {
            method: 'GET',
            headers: {
              // 'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          handleApiError(errorText);
          return;
        }

        const data = await response.json();
        setDonations(data.donations);
        setPagination({
          current_page: data.pagination.current_page,
          total_pages: data.pagination.total_pages,
          per_page: data.pagination.per_page,
          total_count: data.pagination.total_count,
        });
      } catch (err) {
        handleApiError('Error fetching donations. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Create Donation Transaction
  const createDonationTransaction = async (
    email: string,
    fullName: string,
    phoneNumber: string,
    amount: number,
    campaignId: string,
    campaignTitle: string,
    billingFrequency: string,
  ) => {
    try {
      setLoading(true);

      try {
        const subscriptionResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/subscriptions/create_plan`,
          {
            method: 'POST',
            body: JSON.stringify({
              amount: amount,
              interval: billingFrequency,
              name: campaignTitle,
            }),
          },
        );

        const subscriptionData = await subscriptionResponse.json();
        planCodeRef.current = subscriptionData.plan?.plan_code;
        // Extract plan_code from subscription plan response
      } catch (error) {
        handleApiError(
          'Creating your subscription failed!, proceeding with one time donation. You may restart the process to create your subscription.',
        );
        // If plan creation fails, proceed with the donation without the plan_code
      }

      // Step 2: Create donation transaction (with or without plan_code)
      const donationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/donations`,
        {
          method: 'POST',
          body: JSON.stringify({
            amount: amount,
            email: email,
            full_name: fullName,
            phone: phoneNumber,
            metadata: {},
            plan: planCodeRef.current,
          }),
        },
      );
      const donationData = await donationResponse.json();

      if (!donationResponse.ok) {
        handleApiError('Failed to create donation');
        return;
      }

      const { authorization_url } = donationData;

      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        handleApiError(
          'We could not initiate your payment at this time. Please try again later.',
        );
      }
    } catch (error) {
      handleApiError('Error initiating donation. Please try again later.');
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
      createDonationTransaction,
    }),
    [
      donations,
      loading,
      error,
      pagination,
      fetchDonations,
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
