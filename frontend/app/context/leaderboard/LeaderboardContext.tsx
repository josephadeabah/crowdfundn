import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../auth/AuthContext';

interface TopbackersData {
  name: string;
  amount: string;
  category_interest: string;
  profile: string;
  score: number;
  country: string;
  bio: string;
}

interface MostActiveBackersData {
  name: string;
  contributions: string;
  category_interest: string;
  profile: string;
  country: string;
  bio: string;
}

interface TopBackersWithRewardsData {
  name: string;
  rewards: number;
  category_interest: string;
  profile: string;
  country: string;
  bio: string;
}

interface TopFundraisersGraphicsData {
  name: string;
  campaign: string;
  category_interest: string;
  profile: string;
  country: string;
  bio: string;
}

interface TopFundraisersStoriesData {
  name: string;
  campaign: string;
  amount: number;
  score: number;
  rank: number;
  category_interest: string;
  profile: string;
  country: string;
  bio: string;
}

interface LeaderboardState {
  topBackers: TopbackersData[];
  mostActiveBackers: MostActiveBackersData[];
  topBackersWithRewards: TopBackersWithRewardsData[];
  topFundraisersGraphics: TopFundraisersGraphicsData[];
  topFundraisersStories: TopFundraisersStoriesData[];
  loading: boolean;
  error: string | null;
  fetchLeaderboardData: () => void;
}

const LeaderboardContext = createContext<LeaderboardState | undefined>(
  undefined,
);

export const LeaderboardProvider = ({ children }: { children: ReactNode }) => {
  const [topBackers, setTopBackers] = useState<TopbackersData[]>([]);
  const [mostActiveBackers, setMostActiveBackers] = useState<
    MostActiveBackersData[]
  >([]);
  const [topBackersWithRewards, setTopBackersWithRewards] = useState<
    TopBackersWithRewardsData[]
  >([]);
  const [topFundraisersGraphics, setTopFundraisersGraphics] = useState<
    TopFundraisersGraphicsData[]
  >([]);
  const [topFundraisersStories, setTopFundraisersStories] = useState<
    TopFundraisersStoriesData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboardData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const endpoints = [
        'top_backers',
        'most_active_backers',
        'top_backers_with_rewards',
        'top_fundraisers_graphics',
        'top_fundraisers_stories',
      ];

      const dataPromises = endpoints.map((endpoint) =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/leaderboard/${endpoint}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ).then((response) => response.json()),
      );

      const [
        topBackersData,
        mostActiveBackersData,
        topBackersWithRewardsData,
        topFundraisersGraphicsData,
        topFundraisersStoriesData,
      ] = await Promise.all(dataPromises);

      setTopBackers(topBackersData);
      setMostActiveBackers(mostActiveBackersData);
      setTopBackersWithRewards(topBackersWithRewardsData);
      setTopFundraisersGraphics(topFundraisersGraphicsData);
      setTopFundraisersStories(topFundraisersStoriesData);
    } catch (err: any) {
      setError(err || 'Error fetching leaderboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      topBackers,
      mostActiveBackers,
      topBackersWithRewards,
      topFundraisersGraphics,
      topFundraisersStories,
      loading,
      error,
      fetchLeaderboardData,
    }),
    [
      topBackers,
      mostActiveBackers,
      topBackersWithRewards,
      topFundraisersGraphics,
      topFundraisersStories,
      loading,
      error,
      fetchLeaderboardData,
    ],
  );

  return (
    <LeaderboardContext.Provider value={contextValue}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboardContext = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error(
      'useLeaderboardContext must be used within a LeaderboardProvider',
    );
  }
  return context;
};
