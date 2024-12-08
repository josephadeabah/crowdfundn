import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../../auth/AuthContext';

// Define the detailed interfaces for the transfer data structure
interface TransferDetails {
  authorization_code: string | null;
  account_number: string;
  account_name: string | null;
  bank_code: string;
  bank_name: string;
}

interface Metadata {
  user_id: number;
}

interface Recipient {
  active: boolean;
  createdAt: string;
  currency: string;
  description: string;
  domain: string;
  email: string;
  id: number;
  integration: number;
  metadata: Metadata;
  name: string;
  recipient_code: string;
  type: string;
  updatedAt: string;
  is_deleted: boolean;
  isDeleted: boolean;
  details: TransferDetails;
}

interface Session {
  provider: string | null;
  id: string | null;
}

interface TransferData {
  amount: number;
  createdAt: string;
  currency: string;
  domain: string;
  failures: string | null;
  id: number;
  integration: number;
  reason: string;
  reference: string;
  source: string;
  source_details: string | null;
  status: string;
  titan_code: string | null;
  transfer_code: string;
  request: number;
  transferred_at: string | null;
  updatedAt: string;
  recipient: Recipient;
  session: Session;
  fee_charged: number;
  fees_breakdown: string | null;
  gateway_response: string | null;
}

interface TransferResponse {
  subaccount_id: number
  transfers_response: {
    status: boolean;
    message: string;
    data: TransferData;
  };
}

interface TransferState {
  transfers: TransferResponse[];
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
  const [transfers, setTransfers] = useState<TransferResponse[]>([]);
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

      if (responseData && responseData.transfers) {
        console.log(responseData.transfers); // Verify the structure of the response
        setTransfers(responseData.transfers);
      } else {
        setError('No transfer data found');
      }
    } catch (err: any) {
      setError(err?.message || 'Error fetching transfers');
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  // Memoize initiateTransfer using useCallback
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
          throw new Error(errorData.error || 'Failed to initiate transfer');
        }

        const data = await response.json();
        return data.transfer_code || null;
      } catch (err: any) {
        setError(err?.message || 'Error initiating transfer');
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

  // Memoize createTransferRecipient using useCallback
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
          throw new Error(
            errorData.error || 'Failed to create transfer recipient',
          );
        }

        const data = await response.json();
        const recipientCode = data.recipient_code || null;

        if (recipientCode) {
          // Immediately initiate the transfer after successfully creating the recipient
          const transferCode = await initiateTransfer(campaignId);
          if (!transferCode) {
            setError('Failed to initiate transfer after creating recipient');
          }
        }

        return recipientCode;
      } catch (err: any) {
        setError(err?.message || 'Error creating transfer recipient');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user, initiateTransfer], // Use user and initiateTransfer as dependencies
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
    [
      transfers,
      loading,
      loadingCampaigns,
      error,
      fetchTransfers,
      createTransferRecipient,
      initiateTransfer,
    ],
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
