import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';

export interface LeaderboardEntry {
  id: number;
  user_id: number;
  username: string;
  total_donations: number;
  score: number;
  level: string;
  profile_picture: string;
  country: string;
  rank: number;
  category_interest: string;
  currency: string;
  bio: string;
}

interface FundraiserLeaderboardRank {
  id: number;
  user_id: number;
  username: string;
  rank: number;
  total_raised: number;
  profile_picture: string;
  country: string;
  category_interest: string;
  currency: string;
  bio: string;
}

interface FundraiserLeaderboardEntry {
  id: number;
  user_id: number;
  username: string;
  rank: number;
  total_raised: number;
  profile_picture: string;
  country: string;
  category_interest: string;
  currency: string;
  bio: string;
  level: string;
}

export interface UserRankData extends LeaderboardEntry {
  rank: number;
}

interface RewardData {
  id: number;
  level: string;
  points_required: number;
  description: string;
  messsage: string;
}

interface UserRewardData extends RewardData {
  status: string;
}

interface PointsData {
  total_points: number;
}

interface PointRewardState {
  leaderboard: LeaderboardEntry[];
  fundraiserLeaderboard: FundraiserLeaderboardEntry[]; // Added for fundraiser leaderboard
  userRank: UserRankData | null;
  fundraiserLeaderboardRank: FundraiserLeaderboardRank | null;
  rewards: RewardData[];
  userReward: UserRewardData | null;
  userPoints: PointsData | null;
  loading: boolean;
  error: string | null;
  fetchLeaderboard: () => void;
  fetchFundraiserLeaderboard: () => void; // Added for fetching fundraiser leaderboard
  fetchUserRank: () => void;
  fetchFundraiserRank: () => void;
  fetchRewards: () => void;
  fetchUserReward: () => void;
  fetchUserPoints: () => void;
}

const PointRewardContext = createContext<PointRewardState | undefined>(
  undefined,
);

export const PointRewardProvider = ({ children }: { children: ReactNode }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [fundraiserLeaderboard, setFundraiserLeaderboard] = useState<
    FundraiserLeaderboardEntry[]
  >([]); // State for fundraiser leaderboard
  const [fundraiserLeaderboardRank, setFundraiserLeaderboardRank] =
    useState<FundraiserLeaderboardRank | null>(null);
  const [userRank, setUserRank] = useState<UserRankData | null>(null);
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [userReward, setUserReward] = useState<UserRewardData | null>(null);
  const [userPoints, setUserPoints] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, ensureAuthReady } = useAuthGuard(); // Get authentication token and guard

  // Fetch all leaderboard entries (public)
  const fetchLeaderboard = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/leaderboard_entry/leaderboard_entry`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setLeaderboard(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch fundraiser leaderboard entries (public)
  const fetchFundraiserLeaderboard = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/leaderboard_entry/fundraisers`, // New endpoint for fundraiser leaderboard
      );

      if (!response.ok) {
        throw new Error('Failed to fetch fundraiser leaderboard');
      }

      const data = await response.json();
      setFundraiserLeaderboard(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching fundraiser leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add this function to the PointRewardContext
  const fetchFundraiserRank = useCallback(async (): Promise<void> => {
    if (!ensureAuthReady()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/leaderboard_entry/leaderboard_entry/fundraiser_rank`,
        {
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
        throw new Error('Failed to fetch fundraiser rank');
      }

      const data = await response.json();
      setFundraiserLeaderboardRank(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching fundraiser rank');
    } finally {
      setLoading(false);
    }
  }, [token, ensureAuthReady]);

  // Fetch user leaderboard rank (requires authentication)
  const fetchUserRank = useCallback(async (): Promise<void> => {
    if (!ensureAuthReady()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/leaderboard_entry/leaderboard_entry/my_rank`,
        {
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
        throw new Error('Failed to fetch user rank');
      }

      const data = await response.json();
      setUserRank(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching user rank');
    } finally {
      setLoading(false);
    }
  }, [token, ensureAuthReady]);

  // Fetch available rewards (public)
  const fetchRewards = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/backer_rewards/backer_rewards`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch rewards');
      }

      const data = await response.json();
      setRewards(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching rewards');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user-specific reward (requires authentication)
  const fetchUserReward = useCallback(async (): Promise<void> => {
    if (!ensureAuthReady()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/backer_rewards/backer_rewards/my_reward`,
        {
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
        throw new Error('Failed to fetch user reward');
      }

      const data = await response.json();
      setUserReward(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching user reward');
    } finally {
      setLoading(false);
    }
  }, [token, ensureAuthReady]);

  // Fetch user points (requires authentication)
  const fetchUserPoints = useCallback(async (): Promise<void> => {
    if (!ensureAuthReady()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/points/my_points`,
        {
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
        throw new Error('Failed to fetch user points');
      }

      const data = await response.json();
      setUserPoints(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching user points');
    } finally {
      setLoading(false);
    }
  }, [token, ensureAuthReady]);

  const contextValue = useMemo(
    () => ({
      leaderboard,
      fundraiserLeaderboard, // Added to context
      fundraiserLeaderboardRank,
      userRank,
      rewards,
      userReward,
      userPoints,
      loading,
      error,
      fetchLeaderboard,
      fetchFundraiserRank,
      fetchFundraiserLeaderboard, // Added to context
      fetchUserRank,
      fetchRewards,
      fetchUserReward,
      fetchUserPoints,
    }),
    [
      leaderboard,
      fundraiserLeaderboard, // Added to dependency array
      userRank,
      fundraiserLeaderboardRank,
      rewards,
      userReward,
      userPoints,
      loading,
      error,
      fetchLeaderboard,
      fetchFundraiserLeaderboard, // Added to dependency array
      fetchUserRank,
      fetchFundraiserRank,
      fetchRewards,
      fetchUserReward,
      fetchUserPoints,
    ],
  );

  return (
    <PointRewardContext.Provider value={contextValue}>
      {children}
    </PointRewardContext.Provider>
  );
};

// Custom hook to use the context
export const usePointRewardContext = () => {
  const context = useContext(PointRewardContext);
  if (!context) {
    throw new Error(
      'usePointRewardContext must be used within a PointRewardProvider',
    );
  }
  return context;
};
