import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../auth/AuthContext';

interface LeaderboardEntry {
  id: number;
  user_id: number;
  username: string;
  total_donations: number;
  score: number;
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
}

interface UserRankData extends LeaderboardEntry {
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
  rewards: RewardData[];
  userReward: UserRewardData | null;
  userPoints: PointsData | null;
  loading: boolean;
  error: string | null;
  fetchLeaderboard: () => void;
  fetchFundraiserLeaderboard: () => void; // Added for fetching fundraiser leaderboard
  fetchUserRank: () => void;
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
  const [userRank, setUserRank] = useState<UserRankData | null>(null);
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [userReward, setUserReward] = useState<UserRewardData | null>(null);
  const [userPoints, setUserPoints] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); // Get authentication token

  // Fetch all leaderboard entries (public)
  const fetchLeaderboard = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/leaderboard_entry/leaderboard_entry`,
      );
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
      const data = await response.json();

      setFundraiserLeaderboard(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching fundraiser leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user leaderboard rank (requires authentication)
  const fetchUserRank = useCallback(async (): Promise<void> => {
    if (!token) return;

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
      const data = await response.json();

      setUserRank(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching user rank');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch available rewards (public)
  const fetchRewards = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/backer_rewards/backer_rewards`,
      );
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
    if (!token) return;

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
      const data = await response.json();

      setUserReward(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching user reward');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch user points (requires authentication)
  const fetchUserPoints = useCallback(async (): Promise<void> => {
    if (!token) return;

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
      const data = await response.json();

      setUserPoints(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching user points');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      leaderboard,
      fundraiserLeaderboard, // Added to context
      userRank,
      rewards,
      userReward,
      userPoints,
      loading,
      error,
      fetchLeaderboard,
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
      rewards,
      userReward,
      userPoints,
      loading,
      error,
      fetchLeaderboard,
      fetchFundraiserLeaderboard, // Added to dependency array
      fetchUserRank,
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
