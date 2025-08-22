// app/context/kyc/KycReviewContext.tsx
'use client';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  KycReview,
  KycReviewFilters,
  KycReviewStats,
  KycReviewAction,
} from '@/app/types/kyc-review.types';

interface KycReviewState {
  reviews: KycReview[];
  currentReview: KycReview | null;
  loading: boolean;
  error: string | null;
  stats: KycReviewStats;
  filters: KycReviewFilters;
  fetchReviews: (filters?: KycReviewFilters) => Promise<void>;
  fetchReview: (id: number) => Promise<void>;
  updateReview: (id: number, action: KycReviewAction) => Promise<void>;
  updateFilters: (filters: KycReviewFilters) => void;
  clearFilters: () => void;
  fetchStats: () => Promise<void>;
}

const KycReviewContext = createContext<KycReviewState | undefined>(undefined);

export const KycReviewProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<KycReview[]>([]);
  const [currentReview, setCurrentReview] = useState<KycReview | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<KycReviewStats>({
    total: 0,
    pending: 0,
    in_review: 0,
    verified: 0,
    rejected: 0,
    expired: 0,
  });
  const [filters, setFilters] = useState<KycReviewFilters>({});

  // Fetch KYC reviews with filters
  const fetchReviews = useCallback(
    async (newFilters?: KycReviewFilters) => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (newFilters) {
          Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== 'all') queryParams.append(key, value);
          });
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/all_needs_review?${queryParams}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch KYC reviews');
        }

        const data = await response.json();
        setReviews(data.kycs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Fetch a specific KYC review
  const fetchReview = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 403) {
          // Forbidden - user doesn't have access to this specific KYC
          throw new Error(
            'You do not have permission to view this KYC application',
          );
        }

        if (!response.ok) {
          throw new Error('Failed to fetch KYC review');
        }

        const data = await response.json();
        setCurrentReview(data.kyc);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Fetch KYC review statistics
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/stats`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch KYC statistics');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Update KYC review status
  const updateReview = useCallback(
    async (id: number, action: KycReviewAction) => {
      setLoading(true);
      setError(null);

      try {
        let url = '';
        let body = {};

        switch (action.action) {
          case 'verify':
            url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}/verify`;
            body = { review_notes: action.notes };
            break;
          case 'reject':
            url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}/reject`;
            body = { rejection_reason: action.rejection_reason };
            break;
          case 'request_info':
            url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}/request_info`;
            break;
          default:
            throw new Error('Invalid action');
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.errors?.join(', ') || 'Failed to update KYC review',
          );
        }

        const data = await response.json();
        const updatedReview = data.kyc;

        // Update the reviews list
        setReviews((prev) =>
          prev.map((review) => (review.id === id ? updatedReview : review)),
        );

        // Update current review if it's the one being viewed
        if (currentReview?.id === id) {
          setCurrentReview(updatedReview);
        }

        // Refresh stats
        await fetchStats();

        return updatedReview;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [token, currentReview, fetchStats],
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters: KycReviewFilters) => {
      setFilters(newFilters);
      fetchReviews(newFilters);
    },
    [fetchReviews],
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    fetchReviews();
  }, [fetchReviews]);

  const contextValue: KycReviewState = React.useMemo(
    () => ({
      reviews,
      currentReview,
      loading,
      error,
      stats,
      filters,
      fetchReviews,
      fetchReview,
      updateReview,
      updateFilters,
      clearFilters,
      fetchStats,
    }),
    [
      reviews,
      currentReview,
      loading,
      error,
      stats,
      filters,
      fetchReviews,
      fetchReview,
      updateReview,
      updateFilters,
      clearFilters,
      fetchStats,
    ],
  );

  return (
    <KycReviewContext.Provider value={contextValue}>
      {children}
    </KycReviewContext.Provider>
  );
};

export const useKycReview = () => {
  const context = useContext(KycReviewContext);
  if (!context) {
    throw new Error('useKycReview must be used within a KycReviewProvider');
  }
  return context;
};
