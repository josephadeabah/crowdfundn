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

  // Base fetch review function (without retry)
  const fetchReviewBase = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        // Check if token exists
        if (!token) {
          throw new Error('Authentication token is missing');
        }

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

        if (!response.ok) {
          throw new Error('Failed to fetch KYC review');
        }

        const data = await response.json();
        setCurrentReview(data.kyc);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        throw err; // Re-throw for retry logic
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Fetch a specific KYC review with retry logic
  const fetchReview = useCallback(
    async (id: number, retryCount = 0): Promise<void> => {
      try {
        await fetchReviewBase(id);
      } catch (error: any) {
        // Check if it's a 401 error and we should retry
        if (
          (error.message.includes('401') || 
           error.message.includes('Authentication token')) && 
          retryCount < 3
        ) {
          // Wait a bit and retry (token might be loading)
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return fetchReview(id, retryCount + 1);
        }
        throw error;
      }
    },
    [fetchReviewBase],
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

        const data = await response.json();

        if (!response.ok) {
          // Handle different error response formats
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
    [token, currentReview, fetchStats],
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters: KycReviewFilters) => {
      setFilters(newFilters);
      fetchReviews(newFilters, 1); // Reset to page 1 when filters change
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