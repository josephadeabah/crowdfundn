import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import { useAuth } from '../../auth/AuthContext';

interface TransferData {
  id: number;
  user_id: number;
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

interface CreateTransferRecipientResponseType {
  message: string;
  recipient_code: string;
}

interface TransferState {
  transfers: TransferData[];
  loading: boolean;
  loadingCampaigns: Record<string | number, boolean>;
  error: string | null;
  currentPage: number; // current page
  totalPages: number; // total pages
  totalCount: number; // total items count
  fetchTransfers: (page: number) => void; // accepts page parameter
  fetchTransfersFromPaystack: () => Promise<void>;
  createTransferRecipient: (
    campaignId: string | number,
  ) => Promise<CreateTransferRecipientResponseType>;
  initiateTransfer: (
    campaignId: string | number,
    recipientCode: string,
  ) => Promise<string | null>;
  fetchSettlementStatus: () => Promise<void>;
}

const TransferContext = createContext<TransferState | undefined>(undefined);

export const TransferProvider = ({ children }: { children: ReactNode }) => {
  const [transfers, setTransfers] = useState<TransferData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState<
    Record<string | number, boolean>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const { token, ensureAuthReady } = useAuthGuard();
  const { user } = useAuth();

  const fetchTransfers = useCallback(
    async (page: number = 1): Promise<void> => {
      if (!ensureAuthReady()) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/fetch_user_transfers?page=${page}&per_page=8`, // Adjust per_page as needed
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          return;
        }

        if (!response.ok) {
          setError('Failed to fetch transfers');
          return;
        }

        const responseData = await response.json();

        if (responseData && responseData.transfers) {
          setTransfers(responseData.transfers); //  responseData.transfers is the array of transfers
          setTotalPages(responseData.total_pages); //  responseData contains pagination info
          setCurrentPage(responseData.current_page); //  responseData contains current page info
          setTotalCount(responseData.total_count); //  responseData contains total count info
        } else {
          setError('No transfer data found');
        }
      } catch (err: any) {
        setError(err || 'Error fetching transfers');
      } finally {
        setLoading(false);
      }
    },
    [token, ensureAuthReady],
  );

  const fetchTransfersFromPaystack = useCallback(async (): Promise<void> => {
    if (!ensureAuthReady()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/fetch_transfers_from_paystack`, // Adjust per_page as needed
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      if (!response.ok) {
        setError('Failed to fetch transfers');
        return;
      }

      const responseData = await response.json();

      return responseData;
    } catch (err: any) {
      setError(err || 'Error fetching transfers');
    } finally {
      setLoading(false);
    }
  }, [token, ensureAuthReady]);

  const fetchSettlementStatus = useCallback(async (): Promise<void> => {
    if (!ensureAuthReady()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/settlement_status/${user?.id}`, // Adjust per_page as needed
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      if (!response.ok) {
        setError('Failed to fetch settlement status');
        return;
      }

      const responseData = await response.json();

      if (responseData) {
        //  responseData contains the settlement status
      }
    } catch (err: any) {
      setError(err || 'Error fetching settlement status');
    } finally {
      setLoading(false);
    }
  }, [token, user, ensureAuthReady]);

  const initiateTransfer = useCallback(
    async (
      campaignId: string | number,
      recipientCode: string,
    ): Promise<string | null> => {
      if (!ensureAuthReady()) return null;

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
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              campaign_id: campaignId,
              recipient_code: recipientCode,
            }),
          },
        );

        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          return null;
        }

        const data = await response.json();
        return data;
      } catch (err: any) {
        setError(err || 'Error initiating transfer');
        return null;
      } finally {
        setLoadingCampaigns((prevState) => ({
          ...prevState,
          [campaignId]: false,
        }));
      }
    },
    [token, ensureAuthReady],
  );

  const createTransferRecipient = useCallback(
    async (
      campaignId: string | number,
    ): Promise<CreateTransferRecipientResponseType> => {
      if (!ensureAuthReady()) {
        return {
          message: 'Authentication required',
          recipient_code: '',
        };
      }

      setLoading(true);
      setLoadingCampaigns((prevState) => ({
        ...prevState,
        [campaignId]: true,
      }));
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/create_transfer_recipient`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              fundraiser_id: user?.id,
              campaign_id: campaignId,
            }),
          },
        );

        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          return {
            message: 'Authentication failed',
            recipient_code: '',
          };
        }

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error);
          return {
            message: errorData.error || 'Failed to create transfer recipient',
            recipient_code: '',
          };
        }

        const data = await response.json();
        return data;
      } catch (err: any) {
        setError(err || 'Error creating transfer recipient');
        return {
          message: 'Error creating transfer recipient',
          recipient_code: '',
        };
      } finally {
        setLoading(false);
        setLoadingCampaigns((prevState) => ({
          ...prevState,
          [campaignId]: false,
        }));
      }
    },
    [token, user, ensureAuthReady],
  );

  const contextValue = useMemo(
    () => ({
      transfers,
      loading,
      loadingCampaigns,
      error,
      currentPage,
      totalPages,
      totalCount,
      fetchTransfers,
      fetchTransfersFromPaystack,
      createTransferRecipient,
      initiateTransfer,
      fetchSettlementStatus,
    }),
    [
      transfers,
      loading,
      loadingCampaigns,
      error,
      currentPage,
      totalPages,
      totalCount,
      fetchTransfers,
      fetchTransfersFromPaystack,
      createTransferRecipient,
      initiateTransfer,
      fetchSettlementStatus,
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