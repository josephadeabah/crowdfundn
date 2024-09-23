import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from 'react';

interface Transfer {
  id: number;
  amount: number;
  recipient: string;
  date: string;
}

interface TransferState {
  transfers: Transfer[];
  loading: boolean;
  error: string | null;
  fetchTransfers: () => void;
}

const TransferContext = createContext<TransferState | undefined>(undefined);

export const TransferProvider = ({ children }: { children: ReactNode }) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransfers = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Mock API call - replace this with your actual API call
      const response = await fetch('/api/transfers'); // Replace with your actual endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch transfers');
      }
      const data = await response.json();
      setTransfers(data.transfers); // Assuming response contains a `transfers` field
    } catch (err: any) {
      setError(err?.message || 'Error fetching transfers');
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({ transfers, loading, error, fetchTransfers }),
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
