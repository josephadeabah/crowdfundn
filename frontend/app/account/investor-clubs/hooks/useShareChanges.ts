// app/account/investor-clubs/hooks/useShareChanges.ts

import { useState, useEffect } from 'react';
import { ShareChange, ShareChangesResponse } from '../clubTypes';
import { shareChangeService } from '../services/shareChangeService';
import { useAuth } from '@/app/context/auth/AuthContext';

interface UseShareChangesReturn {
  shareChanges: ShareChange[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    total_pages: number;
    per_page: number;
    total_count: number;
  };
  summary: {
    total_changes: number;
    current_share: number;
    total_contributed: number;
  } | null;
  loadShareChanges: (clubId: string, page?: number) => Promise<void>;
}

export const useShareChanges = (): UseShareChangesReturn => {
  const { token } = useAuth();
  const [shareChanges, setShareChanges] = useState<ShareChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    per_page: 10,
    total_count: 0,
  });
  const [summary, setSummary] = useState<{
    total_changes: number;
    current_share: number;
    total_contributed: number;
  } | null>(null);

  const loadShareChanges = async (clubId: string, page: number = 1) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response: ShareChangesResponse =
        await shareChangeService.getMyShareChanges(
          token,
          clubId,
          page,
          pagination.per_page,
        );

      setShareChanges(response.share_changes);
      setPagination(response.pagination);
      setSummary(response.summary || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load share changes');
      console.error('Failed to load share changes:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    shareChanges,
    loading,
    error,
    pagination,
    summary,
    loadShareChanges,
  };
};
