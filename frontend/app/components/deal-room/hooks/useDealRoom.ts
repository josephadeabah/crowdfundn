// app/hooks/useDealRoomApi.ts
import { useState, useCallback, useEffect } from 'react';
import { Deal, dealRoomApi, DealRoomStats } from '../services/dealRoomApi';
import { useAuth } from '@/app/context/auth/AuthContext';

export const useDealRoomApi = () => {
  const { token } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<DealRoomStats | null>(null);
  const [industries, setIndustries] = useState<string[]>(['All Industries']);
  const [stages, setStages] = useState<string[]>(['All Stages']);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadStatsAndFilters = useCallback(async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      setIsStatsLoading(true);
      setError(null);

      const [statsData, industriesData, stagesData] = await Promise.all([
        dealRoomApi.getDealStats(token),
        dealRoomApi.getIndustries(token),
        dealRoomApi.getStages(token),
      ]);

      setStats(statsData);
      setIndustries(industriesData);
      setStages(stagesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load deal room data',
      );
      console.error('Error loading stats:', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, [token]);

  const loadDeals = useCallback(
    async (
      pageNum: number = 1,
      filters?: {
        industry?: string;
        stage?: string;
        search?: string;
      },
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await dealRoomApi.getPublicDeals(
          token ?? undefined,
          pageNum,
          12,
          filters,
        );
        setDeals(response.data || []);
        setTotalPages(response.total_pages);
        setTotalCount(response.total_count);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deals');
        setDeals([]);
        console.error('Error loading deals:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [token],
  );

  const showInterest = useCallback(
    async (dealId: string) => {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const result = await dealRoomApi.showInterest(dealId, token);
        return result;
      } catch (err) {
        console.error('Error showing interest:', err);
        throw err;
      }
    },
    [token],
  );

  const joinDealRoom = useCallback(
    async (dealId: string) => {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const result = await dealRoomApi.joinDealRoom(dealId, token);
        return result;
      } catch (err) {
        console.error('Error joining deal room:', err);
        throw err;
      }
    },
    [token],
  );

  const getDealDetails = useCallback(
    async (dealId: string) => {
      try {
        const deal = await dealRoomApi.getDealDetails(
          dealId,
          token ?? undefined,
        );
        return deal;
      } catch (err) {
        console.error('Error getting deal details:', err);
        throw err;
      }
    },
    [token],
  );

  const getDealDocuments = useCallback(
    async (dealId: string) => {
      try {
        const documents = await dealRoomApi.getDealDocuments(
          dealId,
          token ?? undefined,
        );
        return documents;
      } catch (err) {
        console.error('Error getting deal documents:', err);
        throw err;
      }
    },
    [token],
  );

  const getDealConversations = useCallback(
    async (dealId: string) => {
      try {
        const conversations = await dealRoomApi.getDealConversations(
          dealId,
          token ?? undefined,
        );
        return conversations;
      } catch (err) {
        console.error('Error getting deal conversations:', err);
        throw err;
      }
    },
    [token],
  );

  const getDealMeetings = useCallback(
    async (dealId: string) => {
      try {
        const meetings = await dealRoomApi.getDealMeetings(
          dealId,
          token ?? undefined,
        );
        return meetings;
      } catch (err) {
        console.error('Error getting deal meetings:', err);
        throw err;
      }
    },
    [token],
  );

  const createConversation = useCallback(
    async (dealId: string, title: string, isPrivate: boolean = false) => {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const result = await dealRoomApi.createConversation(
          dealId,
          title,
          token,
          isPrivate,
        );
        return result;
      } catch (err) {
        console.error('Error creating conversation:', err);
        throw err;
      }
    },
    [token],
  );

  const createMeeting = useCallback(
    async (
      dealId: string,
      meetingData: {
        title: string;
        description: string;
        meeting_type: string;
        start_time: string;
        end_time: string;
        meeting_link?: string;
        notes?: string;
        participant_ids?: string[];
      },
    ) => {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const result = await dealRoomApi.createMeeting(
          dealId,
          meetingData,
          token,
        );
        return result;
      } catch (err) {
        console.error('Error creating meeting:', err);
        throw err;
      }
    },
    [token],
  );

  useEffect(() => {
    loadStatsAndFilters();
  }, [loadStatsAndFilters]);

  return {
    // State
    deals,
    stats,
    industries,
    stages,
    isLoading,
    isStatsLoading,
    error,
    page,
    totalPages,
    totalCount,

    // Actions
    loadDeals,
    showInterest,
    joinDealRoom,
    getDealDetails,
    getDealDocuments,
    getDealConversations,
    getDealMeetings,
    createConversation,
    createMeeting,

    // Setters
    setPage,
    setError,
  };
};
