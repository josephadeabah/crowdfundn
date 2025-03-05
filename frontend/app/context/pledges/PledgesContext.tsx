import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../auth/AuthContext';

interface PledgeDataType {
  id: number;
  amount: number;
  status: string;
  shipping_status: string;
  created_at: string;
  updated_at: string;
  fundraiser_id: number;
  campaign_id: number;
  donation_id: number;
  reward_id: number | null;
  shipping_data: any; // Adjust this type based on your data structure
  selected_rewards: any; // Adjust this type based on your data structure
  delivery_option: string;
}

interface PledgesState {
  pledges: PledgeDataType[];
  loading: boolean;
  error: string | null;
  fetchPledges: () => Promise<void>;
  deletePledge: (pledgeId: number) => Promise<void>;
}

const PledgesContext = createContext<PledgesState | undefined>(undefined);

export const PledgesProvider = ({ children }: { children: ReactNode }) => {
  const [pledges, setPledges] = useState<PledgeDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const handleApiError = (errorText: string) => {
    setError(`API Error: ${errorText}`);
  };

  // Fetch pledges for the current user
  const fetchPledges = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/pledges`,
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

      const fetchedPledges = await response.json();
      setPledges(fetchedPledges);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching pledges');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Delete a pledge
  const deletePledge = useCallback(
    async (pledgeId: number): Promise<void> => {
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/pledges/${pledgeId}`,
          {
            method: 'DELETE',
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

        // Remove the deleted pledge from the local state
        setPledges((prevPledges) =>
          prevPledges.filter((pledge) => pledge.id !== pledgeId),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting pledge');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const contextValue = useMemo(
    () => ({
      pledges,
      loading,
      error,
      fetchPledges,
      deletePledge,
    }),
    [pledges, loading, error, fetchPledges, deletePledge],
  );

  return (
    <PledgesContext.Provider value={contextValue}>
      {children}
    </PledgesContext.Provider>
  );
};

export const usePledgesContext = () => {
  const context = useContext(PledgesContext);
  if (!context) {
    throw new Error('usePledgesContext must be used within a PledgesProvider');
  }
  return context;
};
