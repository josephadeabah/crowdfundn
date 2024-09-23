// context/DonationsContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from 'react';

interface Donation {
  id: number;
  amount: number;
  campaign: string;
}

interface DonationsState {
  donations: Donation[];
  loading: boolean;
  error: string | null;
  fetchDonations: () => void;
}

const DonationsContext = createContext<DonationsState | undefined>(undefined);

export const DonationsProvider = ({ children }: { children: ReactNode }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = async (): Promise<void> => {
    // fetch donations data from an API
  };

  const contextValue = useMemo(
    () => ({
      donations,
      loading,
      error,
      fetchDonations,
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
  if (!context) {
    throw new Error(
      'useDonationsContext must be used within a DonationsProvider',
    );
  }
  return context;
};
