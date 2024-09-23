import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from 'react';

interface Reward {
  id: number;
  title: string;
  description: string;
  amount: number;
}

interface RewardState {
  rewards: Reward[];
  loading: boolean;
  error: string | null;
  fetchRewards: () => void;
}

const RewardContext = createContext<RewardState | undefined>(undefined);

export const RewardProvider = ({ children }: { children: ReactNode }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = async (): Promise<void> => {
    setLoading(true);
    setError(null);
  };

  const contextValue = useMemo(
    () => ({ rewards, loading, error, fetchRewards }),
    [rewards, loading, error],
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
