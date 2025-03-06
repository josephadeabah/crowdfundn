import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../auth/AuthContext';

interface RewardDataType {
  id: number;
  title: string;
  description: string;
  amount: number;
  image: string;
}

interface ShippingDataType {
  firstName: string;
  lastName: string;
  shippingAddress: string;
}

interface PledgeDataType {
  id: number;
  amount: number;
  status: string;
  shipping_status: string;
  created_at: string;
  donation_id: number;
  reward_id: number | null;
  shipping_data: ShippingDataType | null;
  selected_rewards: RewardDataType[];
  delivery_option: string;
}

interface CampaignPledgeType {
  campaign_id: number;
  campaign_name: string;
  pledges: PledgeDataType[];
}

interface PledgesState {
  pledges: CampaignPledgeType[];
  loading: boolean;
  error: string | null;
  fetchPledges: () => Promise<void>;
  deletePledge: (pledgeId: number) => Promise<void>;
}

const PledgesContext = createContext<PledgesState | undefined>(undefined);

export const PledgesProvider = ({ children }: { children: ReactNode }) => {
  const [pledges, setPledges] = useState<CampaignPledgeType[]>([]);
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
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/pledges/pledges`,
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

      const fetchedPledges: CampaignPledgeType[] = await response.json();
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
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/pledges/pledges/${pledgeId}`,
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
          prevPledges.map((campaign) => ({
            ...campaign,
            pledges: campaign.pledges.filter(
              (pledge) => pledge.id !== pledgeId,
            ),
          })),
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
