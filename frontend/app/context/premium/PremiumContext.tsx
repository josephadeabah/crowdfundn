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
  is_recurring: boolean;
  trial_period_days: number | null;
  created_at: string;
  updated_at: string;
  paystack_plan_code: string | null;
  paystack_subscription_code: string | null;
  description: string;
  features: Record<string, string | boolean>;
}

export interface PremiumSubscription {
  id: number;
  has_premium: boolean;
  expires_at: string | null;
  current_plan: PremiumPlan | null;
  active_subscription: {
    id: number;
    status: string;
    auto_renew: boolean;
    is_recurring: boolean;
    paystack_subscription_code: string | null;
    expires_at: string;
    start_date: string;
  } | null;
}

interface CreateSubscriptionResponse {
  authorization_url: string;
  reference: string;
  is_recurring: boolean;
}

interface PremiumState {
  plans: PremiumPlan[];
  subscription: PremiumSubscription | null;
  loading: boolean;
  plansLoading: boolean;
  subscriptionLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  fetchSubscription: () => Promise<void>;
  createSubscription: (
    planId: number,
    isRecurring: boolean,
  ) => Promise<CreateSubscriptionResponse>;
  cancelSubscription: () => Promise<void>;
}

const PremiumContext = createContext<PremiumState | undefined>(undefined);

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [subscription, setSubscription] = useState<PremiumSubscription | null>(
    null,
  );
  const [plansLoading, setPlansLoading] = useState<boolean>(false);
  const [subscriptionLoading, setSubscriptionLoading] =
    useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchPlans = useCallback(async () => {
    if (!token) return;
    setPlansLoading(true);
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch premium plans');
      }

      const data = await response.json();
      setPlans(data.plans);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch plans';
      setError(errorMessage);
      console.error('Fetch plans error:', errorMessage);
    } finally {
      setPlansLoading(false);
    }
  }, [token]);

  const fetchSubscription = useCallback(async () => {
    if (!token) return;
    setSubscriptionLoading(true);
    setError(null);
    try {
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch subscription');
      }

      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch subscription';
      setError(errorMessage);
      console.error('Fetch subscription error:', errorMessage);
    } finally {
      setSubscriptionLoading(false);
    }
  }, [token]);

  const createSubscription = useCallback(
    async (
      planId: number,
      isRecurring: boolean = false,
    ): Promise<CreateSubscriptionResponse> => {
      if (!token) throw new Error('Authentication token is missing');

      setActionLoading(true);
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
            body: JSON.stringify({
              plan_id: planId,
              recurring: isRecurring, // Send as boolean
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to create subscription');
        }

        const result = await response.json();
        return {
          authorization_url: result.authorization_url,
          reference: result.reference,
          is_recurring: result.is_recurring || false,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create subscription';
        setError(errorMessage);
        console.error('Create subscription error:', errorMessage);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [token],
  );

  const cancelSubscription = useCallback(async () => {
    if (!token) throw new Error('Authentication token is missing');

    setActionLoading(true);
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      // Refresh subscription data after cancellation
      await fetchSubscription();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(errorMessage);
      console.error('Cancel subscription error:', errorMessage);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [token, fetchSubscription]);

  const contextValue = useMemo(
    () => ({
      plans,
      subscription,
      loading: plansLoading || subscriptionLoading || actionLoading,
      plansLoading,
      subscriptionLoading,
      actionLoading,
      error,
      fetchPlans,
      fetchSubscription,
      createSubscription,
      cancelSubscription,
    }),
    [
      plans,
      subscription,
      plansLoading,
      subscriptionLoading,
      actionLoading,
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
