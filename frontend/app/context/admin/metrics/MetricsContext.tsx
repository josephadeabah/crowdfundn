import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';

interface MetricsState {
  metrics: Metrics | null;
  loading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
}

// Add these interfaces to your MetricsContext.tsx file
export interface Metrics {
  premium_subscriptions: {
    active: number;
    total_revenue: number;
    mrr: number;
    churn_rate: number;
    plan_distribution: Record<string, number>;
    revenue_by_plan: Record<string, number>;
  };
  users: {
    total: number;
    new_last_week: number;
    active: number;
    email_confirmation_rate: number;
  };
  campaigns: {
    total: number;
    active: number;
    average_goal_amount: number;
    average_current_amount: number;
    performance_percentage: number;
    top_performing: Campaign[];
  };
  donations: {
    total_amount: number;
    total_count: number;
    average_donation: number;
    donations_over_time: Record<string, number>;
    repeat_donors: number;
  };
  equity: {
    total_investment_amount: number;
    total_count: number;
    average_investment: number;
    investments_over_time: Record<string, number>;
    repeat_investors: number;
  };
  combined: {
    total_raised: number;
    average_contribution: number;
    platform_fees: number;
  };
  platform_fees: number;
  roles: Record<string, number>;
  subscriptions: {
    active: number;
    mrr: number;
    churn_rate: number;
  };
  geography: {
    users_by_country: Record<string, number>;
    top_countries_by_donations: [string, number][];
  };
  engagement: {
    average_logins: number;
    time_to_first_action: number;
  };
  subaccounts: {
    total: number;
    success_rate: number;
  };
  equity_campaigns: {
    total: number;
    active: number;
    total_valuation: number;
    total_equity_offered: number;
    total_funds_raised: number;
    average_valuation: number;
    average_equity_offered: number;
    status_distribution: Record<string, number>;
    top_performing: EquityCampaign[];
  };
  investments: {
    total_investments: number;
    successful_investments: number;
    total_investment_amount: number;
    average_investment: number;
    investments_over_time: Record<string, number>;
    status_distribution: Record<string, number>;
    top_investors: TopInvestor[];
    investment_size_distribution: {
      small: number;
      medium: number;
      large: number;
    };
  };

  // NEW: Contribution statistics
  contribution_statistics: {
    total_contributions: number;
    total_amount: number;
    average_contribution: number;
    contributions_over_time: Record<string, number>;
    monthly_contributions: Record<string, number>;
    status_distribution: Record<string, number>;
    top_contributors: TopContributor[];
    contribution_size_distribution: {
      small: number;
      medium: number;
      large: number;
    };
    recent_contributions: RecentContribution[];
  };

  // NEW: Investment clubs statistics
  investment_clubs_statistics: {
    total_clubs: number;
    active_clubs: number;
    total_members: number;
    average_members_per_club: number;
    total_club_contributions: number;
    total_club_balance: number;
    total_club_invested: number;
    club_type_distribution: Record<string, number>;
    membership_role_distribution: Record<string, number>;
    top_clubs_by_contributions: TopClub[];
    clubs_created_over_time: Record<string, number>;
    financial_metrics: {
      average_contribution_per_club: number;
      average_balance_per_club: number;
      average_invested_per_club: number;
      investment_ratio: number;
    };
  };

  // NEW: Club investment statistics
  club_investment_statistics: {
    total_investments: number;
    total_investment_amount: number;
    average_investment: number;
    investments_over_time: Record<string, number>;
    status_distribution: Record<string, number>;
    top_investments: ClubInvestment[];
    investment_by_club_type: Record<string, number>;
    equity_investments: {
      total_equity_invested: number;
      total_current_value: number;
      average_roi: number;
      total_returns: number;
      investment_count: number;
    };
    investment_size_distribution: {
      small: number;
      medium: number;
      large: number;
    };
  };

  // NEW: Voting statistics
  voting_statistics: {
    total_votes: number;
    club_investment_votes: number;
    vote_type_distribution: Record<string, number>;
    voting_participation_by_club: VotingParticipation[];
    recent_votes: RecentVote[];
    average_votes_per_investment: number;
  };

  // NEW: Member share statistics
  member_share_statistics: {
    total_members: number;
    share_distribution: Record<string, number>;
    top_members_by_share: TopMemberByShare[];
    recent_share_changes: RecentShareChange[];
    statistical_analysis: {
      average_share: number;
      median_share: number;
      maximum_share: number;
      minimum_share: number;
      standard_deviation: number;
    };
    share_concentration: {
      top_10_percent_share: number;
      top_20_percent_share: number;
      gini_coefficient: number;
    };
  };
}

// NEW: Additional interfaces for the new statistics
interface TopContributor {
  id: number;
  name: string;
  contribution_count: number;
  total_contributed: number;
}

interface RecentContribution {
  id: number;
  amount: number;
  user_name: string;
  club_name: string;
  created_at: string;
}

interface TopClub {
  id: number;
  name: string;
  total_contributions: number;
  current_balance: number;
  total_invested: number;
  member_count: number;
  club_type: string;
}

interface ClubInvestment {
  id: number;
  club_name: string;
  campaign_name: string;
  investment_amount: number;
  status: string;
  created_at: string;
}

interface VotingParticipation {
  club_name: string;
  unique_voters: number;
  total_members: number;
  participation_rate: number;
}

interface RecentVote {
  id: number;
  user_name: string;
  votable_type: string;
  vote_type: string;
  created_at: string;
}

interface TopMemberByShare {
  id: number;
  user_name: string;
  club_name: string;
  contributed_share: number;
  total_contributed: number;
  role: string;
}

interface RecentShareChange {
  id: number;
  user_name: string;
  club_name: string;
  previous_share: number;
  new_share: number;
  change_amount: number;
  change_reason: string;
  created_at: string;
}

interface Campaign {
  id: number;
  name: string;
  transferred_amount: number;
  goal_amount: number;
  performance_percentage: number;
}

interface EquityCampaign {
  id: number;
  name: string;
  company_name: string;
  valuation: number;
  equity_offered: number;
  total_raised: number;
  percentage_raised: number;
  status: string;
}

interface TopInvestor {
  id: number;
  name: string;
  investment_count: number;
  total_invested: number;
}

const MetricsContext = createContext<MetricsState | undefined>(undefined);

export const MetricsProvider = ({ children }: { children: ReactNode }) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/metrics/dashboard`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch metrics.');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unknown error occurred while fetching metrics.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      metrics,
      loading,
      error,
      fetchMetrics,
    }),
    [metrics, loading, error, fetchMetrics],
  );

  return (
    <MetricsContext.Provider value={contextValue}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetricsContext = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetricsContext must be used within a MetricsProvider');
  }
  return context;
};
