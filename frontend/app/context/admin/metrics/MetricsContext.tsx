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

interface Metrics {
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
    donors_per_campaign: Record<string, number>;
    average_donors_per_campaign: number;
  };
  donations: {
    total_amount: string;
    average_donation: string;
    donations_over_time: Record<string, string | number>;
    repeat_donors: number;
  };
  roles: Record<string, number>;
  subscriptions: {
    active: number;
    mrr: string;
    churn_rate: number;
  };
  geography: {
    users_by_country: Record<string, number>;
    top_countries_by_donations: [string, string][];
  };
  engagement: {
    average_logins: number;
    time_to_first_action: number;
  };
  subaccounts: {
    total: number;
    success_rate: number;
  };
}

interface Campaign {
  id: number;
  name: string;
  transferred_amount: string;
  goal_amount: string;
  performance_percentage: string;
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
