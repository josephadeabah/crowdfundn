import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
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

interface Recipient {
  active: boolean;
  createdAt: string;
  currency: string;
  description: string;
  domain: string;
  email: string;
  id: number;
  integration: number;
  metadata: {
    user_id: number;
  };
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

interface TransferState {
  transfers: TransferData[];
  loading: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTransfers = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (!user) {
        setError('You are not authenticated');
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/fetch_transfers?fundraiser_id=${user?.id}`,
      );
      if (!response.ok) {
        setError('Failed to fetch transfers');
        return;
      }
      const data: { data: TransferData[] } = await response.json();
      const mappedTransfers: TransferData[] = data.data.map((transfer) => ({
        ...transfer,
      }));
      setTransfers(mappedTransfers);
    } catch (err: any) {
      setError(err?.message || 'Error fetching transfers');
    } finally {
      setLoading(false);
    }
  };

  const createTransferRecipient = async (
    campaignId: string | number,
  ): Promise<string | null> => {
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
  };

  const initiateTransfer = async (
    campaignId: string | number,
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/initiate_transfer`,
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
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      transfers,
      loading,
      error,
      fetchTransfers,
      createTransferRecipient,
      initiateTransfer,
    }),
    [transfers, loading, error],
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
