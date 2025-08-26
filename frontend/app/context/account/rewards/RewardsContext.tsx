import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';

export interface Reward {
  message: string;
  id: number;
  title: string;
  description: string;
  amount: number;
  image?: string;
}

interface RewardState {
  rewards: Reward[];
  loading: boolean;
  error: string | null;
  fetchRewards: (campaignId: string) => Promise<void>;
  fetchRewardById: (
    campaignId: string,
    rewardId: string,
  ) => Promise<Reward | null>;
  addReward: (
    campaignId: string,
    rewardData: FormData,
  ) => Promise<Reward | null>;
  editReward: (
    campaignId: string,
    rewardId: string,
    updatedRewardData: FormData,
  ) => Promise<Reward | null>;
  deleteReward: (campaignId: string, rewardId: string) => Promise<void>;
}

const RewardContext = createContext<RewardState | undefined>(undefined);

export const RewardProvider = ({ children }: { children: ReactNode }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, ensureAuthReady } = useAuthGuard();

  const handleApiError = (errorText: string) => {
    setError(`API Error: ${errorText}`);
  };

  const fetchRewards = useCallback(
    async (campaignId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Add authorization header if token is available
        // if (token) {
        //   headers.Authorization = `Bearer ${token}`;
        // }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/rewards`,
          {
            method: 'GET',
            headers,
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          handleApiError(errorText);
          return;
        }

        const fetchedRewards = await response.json();
        setRewards(fetchedRewards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching rewards');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const fetchRewardById = useCallback(
    async (campaignId: string, rewardId: string) => {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Add authorization header if token is available
        // if (token) {
        //   headers.Authorization = `Bearer ${token}`;
        // }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/rewards/${rewardId}`,
          {
            method: 'GET',
            headers,
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          handleApiError(errorText);
          return null;
        }

        const fetchedReward = await response.json();
        return fetchedReward;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error fetching reward by ID',
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const addReward = useCallback(
    async (campaignId: string, rewardData: FormData) => {
      if (!ensureAuthReady()) return null;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/rewards`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: rewardData,
          },
        );

        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          return null;
        }

        if (!response.ok) {
          const errorText = await response.text();
          handleApiError(errorText);
          return null;
        }

        const createdReward = await response.json();
        setRewards((prevRewards) => [...prevRewards, createdReward]);
        return createdReward;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creating reward');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, ensureAuthReady],
  );

  const editReward = useCallback(
    async (
      campaignId: string,
      rewardId: string,
      updatedRewardData: FormData,
    ) => {
      if (!ensureAuthReady()) return null;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/rewards/${rewardId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: updatedRewardData,
          },
        );

        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          return null;
        }

        if (!response.ok) {
          const errorText = await response.text();
          handleApiError(errorText);
          return null;
        }

        const updatedReward = await response.json();
        setRewards((prevRewards) =>
          prevRewards.map((reward) =>
            reward.id === updatedReward.id ? updatedReward : reward,
          ),
        );
        return updatedReward;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error editing reward');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, ensureAuthReady],
  );

  const deleteReward = useCallback(
    async (campaignId: string, rewardId: string) => {
      if (!ensureAuthReady()) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/rewards/${rewardId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          handleApiError(errorText);
          return;
        }

        setRewards((prevRewards) =>
          prevRewards.filter((reward) => reward.id !== Number(rewardId)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting reward');
      } finally {
        setLoading(false);
      }
    },
    [token, ensureAuthReady],
  );

  const contextValue = useMemo(
    () => ({
      rewards,
      loading,
      error,
      fetchRewards,
      fetchRewardById,
      addReward,
      editReward,
      deleteReward,
    }),
    [
      rewards,
      loading,
      error,
      fetchRewards,
      fetchRewardById,
      addReward,
      editReward,
      deleteReward,
    ],
  );

  return (
    <RewardContext.Provider value={contextValue}>
      {children}
    </RewardContext.Provider>
  );
};

export const useRewardContext = () => {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error('useRewardContext must be used within a RewardProvider');
  }
  return context;
};
