import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../../auth/AuthContext';

interface TransferData {
  id: number
  user_id: number
  campaign_id: number | null;
  amount: number;
  created_at: string;
  currency: string;
  reason: string;
  status: string;
  failure_reason: string;
  transfer_code: string;
  reference: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  recipient_code: string;
  completed_at: string;
  reversed_at: string;
}

interface TransferState {
  transfers: TransferData[];
  loading: boolean;
  loadingCampaigns: Record<string | number, boolean>;
  error: string | null;
  fetchTransfers: () => void;
  createTransferRecipient: (
    campaignId: string | number,
  ) => Promise<string | null>;
  initiateTransfer: (campaignId: string | number) => Promise<string | null>;
}

const TransferContext = createContext<TransferState | undefined>(undefined);

export const TransferProvider = ({ children }: { children: ReactNode }) => {
  const [transfers, setTransfers] = useState<TransferData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState<
    Record<string | number, boolean>
  >({});
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  const fetchTransfers = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        setError('You are not authenticated');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/fetch_user_transfers`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        setError('Failed to fetch transfers');
        return;
      }

      const responseData = await response.json();

      if (responseData && responseData) {
        setTransfers(responseData);
      } else {
        setError('No transfer data found');
      }
    } catch (err: any) {
      setError(err?.error || 'Error fetching transfers');
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  const initiateTransfer = useCallback(
    async (campaignId: string | number): Promise<string | null> => {
      setLoadingCampaigns((prevState) => ({
        ...prevState,
        [campaignId]: true,
      }));
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/initialize_transfer`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ campaign_id: campaignId }),
          },
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to initiate transfer');
        }
  
        const data = await response.json();
        return data.transfer_code || null;
      } catch (err: any) {
        setError(err?.error || 'Error initiating transfer');
        return null;
      } finally {
        setLoadingCampaigns((prevState) => ({
          ...prevState,
          [campaignId]: false,
        }));
      }
    },
    [],
  );  

  const createTransferRecipient = useCallback(
    async (campaignId: string | number): Promise<string | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/create_transfer_recipient`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fundraiser_id: user?.id,
              campaign_id: campaignId,
            }),
          },
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to create transfer recipient');
        }
  
        const data = await response.json();
        const recipientCode = data.recipient_code || null;
  
        if (recipientCode) {
          const transferCode = await initiateTransfer(campaignId);
          if (!transferCode) {
            setError('Failed to initiate transfer');
          }
        }
  
        return recipientCode;
      } catch (err: any) {
        setError(err?.error || 'Error creating transfer recipient');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user, initiateTransfer],
  );  

  const contextValue = useMemo(
    () => ({
      transfers,
      loading,
      loadingCampaigns,
      error,
      fetchTransfers,
      createTransferRecipient,
      initiateTransfer,
    }),
    [transfers, loading, loadingCampaigns, error, fetchTransfers, createTransferRecipient, initiateTransfer],
  );

  return (
    <TransferContext.Provider value={contextValue}>
      {children}
    </TransferContext.Provider>
  );
};

export const useTransferContext = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error(
      'useTransferContext must be used within a TransferProvider',
    );
  }
  return context;
};
