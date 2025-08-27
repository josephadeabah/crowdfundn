// app/context/kyc/KycReviewContext.tsx
'use client';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import {
  KycReview,
  KycReviewFilters,
  KycReviewStats,
  KycReviewAction,
} from '@/app/types/kyc-review.types';
import { useAuth } from '../auth/AuthContext';

interface KycReviewState {
  reviews: KycReview[];
  currentReview: KycReview | null;
  loading: boolean;
  error: string | null;
  stats: KycReviewStats;
  filters: KycReviewFilters;
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
  fetchReviews: (filters?: KycReviewFilters, page?: number) => Promise<void>;
  fetchReview: (id: number) => Promise<void>;
  updateReview: (id: number, action: KycReviewAction) => Promise<void>;
  updateFilters: (filters: KycReviewFilters) => void;
  clearFilters: () => void;
  fetchStats: () => Promise<void>;
}

const KycReviewContext = createContext<KycReviewState | undefined>(undefined);

export const KycReviewProvider = ({ children }: { children: ReactNode }) => {
  const { ensureAuthReady } = useAuthGuard();
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
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 25,
  });

  // Fetch KYC reviews with filters
  const fetchReviews = useCallback(
    async (newFilters?: KycReviewFilters, page: number = 1) => {
      // if (!ensureAuthReady()) return;

      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();

        // Add filters
        if (newFilters) {
          Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== 'all') queryParams.append(key, value);
          });
        }

        // Add pagination
        queryParams.append('page', page.toString());
        queryParams.append('per_page', '25');

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

        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch KYC reviews');
        }

        const data = await response.json();
        setReviews(data.kycs);
        setPagination(
          data.pagination || {
            current_page: 1,
            total_pages: 1,
            total_count: data.kycs.length,
            per_page: 25,
          },
        );
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
      if (!ensureAuthReady()) return;

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
          throw new Error(
            'You do not have permission to view this KYC application',
          );
        }

        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
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
    [token, ensureAuthReady],
  );

  // Fetch KYC review statistics
  const fetchStats = useCallback(async () => {
    // if (!ensureAuthReady()) return;

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

      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }

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
      if (!ensureAuthReady()) return;

      setLoading(true);
      setError(null);

      try {
        let url = '';
        let body: any = {};

        switch (action.action) {
          case 'verify':
            url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}/verify`;
            body = { review_notes: action.review_notes };
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

        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }

        const data = await response.json();

        if (!response.ok) {
          const errorMessage =
            data.errors?.[0]?.message ||
            data.full_messages?.[0] ||
            data.errors?.join(', ') ||
            data.message ||
            'Failed to update KYC review';

          throw new Error(errorMessage);
        }

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
    [token, currentReview, fetchStats, ensureAuthReady],
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters: KycReviewFilters) => {
      setFilters(newFilters);
      fetchReviews(newFilters, 1);
    },
    [fetchReviews],
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    fetchReviews({}, 1);
  }, [fetchReviews]);

  const contextValue: KycReviewState = React.useMemo(
    () => ({
      reviews,
      currentReview,
      loading,
      error,
      stats,
      filters,
      pagination,
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
      pagination,
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
