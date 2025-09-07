'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../auth/AuthContext';

export interface PremiumPlan {
  id: number;
  name: string;
  price: number;
  currency: string;
  interval: string;
  description: string;
  features: Record<string, string | boolean>;
}

export interface PremiumSubscription {
  id: number;
  has_premium: boolean;
  expires_at: string | null;
  current_plan: PremiumPlan | null;
  active_subscription: any | null;
}

interface PremiumState {
  plans: PremiumPlan[];
  subscription: PremiumSubscription | null;
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  fetchSubscription: () => Promise<void>;
  createSubscription: (
    planId: number,
  ) => Promise<{ authorization_url: string; reference: string }>;
  cancelSubscription: () => Promise<void>;
}

const PremiumContext = createContext<PremiumState | undefined>(undefined);

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [subscription, setSubscription] = useState<PremiumSubscription | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchPlans = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/premium_plans`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error('Failed to fetch premium plans');

      const data = await response.json();
      setPlans(data.plans);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchSubscription = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      // FIXED: Changed to use the /current endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/premium_subscriptions/current`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          setSubscription({
            has_premium: false,
            expires_at: null,
            current_plan: null,
            active_subscription: null,
            id: 0,
          });
          return;
        }
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch subscription',
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createSubscription = useCallback(
    async (planId: number) => {
      if (!token) throw new Error('Authentication token is missing');

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/premium_subscriptions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ plan_id: planId }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create subscription');
        }

        return await response.json();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to create subscription',
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const cancelSubscription = useCallback(async () => {
    if (!token) throw new Error('Authentication token is missing');

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/premium_subscriptions/cancel`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error('Failed to cancel subscription');

      await fetchSubscription();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to cancel subscription',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchSubscription]);

  const contextValue = useMemo(
    () => ({
      plans,
      subscription,
      loading,
      error,
      fetchPlans,
      fetchSubscription,
      createSubscription,
      cancelSubscription,
    }),
    [
      plans,
      subscription,
      loading,
      error,
      fetchPlans,
      fetchSubscription,
      createSubscription,
      cancelSubscription,
    ],
  );

  return (
    <PremiumContext.Provider value={contextValue}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};
