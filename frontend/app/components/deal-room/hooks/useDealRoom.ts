import { useState, useCallback, useEffect } from 'react';
import { Deal, dealRoomApi, DealRoomStats } from '../services/dealRoomApi';
import { useAuth } from '@/app/context/auth/AuthContext';
import { toast } from 'sonner';

// Get the API base URL from environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';

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
    async (dealId: string, pageNum: number = 1, perPage: number = 20) => {
      try {
        const response = await dealRoomApi.getDealMeetings(
          dealId,
          token ?? undefined,
          pageNum,
          perPage,
        );
        return response;
      } catch (err) {
        console.error('Error getting deal meetings:', err);
        throw err;
      }
    },
    [token],
  );

  const getMeetingCalendar = useCallback(
    async (dealId: string, startDate: string, endDate: string) => {
      try {
        const calendar = await dealRoomApi.getMeetingCalendar(
          dealId,
          startDate,
          endDate,
          token ?? undefined,
        );
        return calendar;
      } catch (err) {
        console.error('Error getting meeting calendar:', err);
        throw err;
      }
    },
    [token],
  );

  const getMeetingAvailability = useCallback(
    async (
      dealId: string,
      date: string,
      duration: number,
      participantIds: string[],
    ) => {
      try {
        const availability = await dealRoomApi.getMeetingAvailability(
          dealId,
          date,
          duration,
          participantIds,
          token ?? undefined,
        );
        return availability;
      } catch (err) {
        console.error('Error getting meeting availability:', err);
        throw err;
      }
    },
    [token],
  );

  const getDealRoomMembers = useCallback(
    async (dealId: string, pageNum: number = 1, perPage: number = 50) => {
      try {
        const members = await dealRoomApi.getDealRoomMembers(
          dealId,
          token ?? undefined,
          pageNum,
          perPage,
        );
        return members;
      } catch (err) {
        console.error('Error getting deal room members:', err);
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

  // Fixed createMeeting function using environment variable
const createMeeting = useCallback(
  async (
    dealId: string,
    meetingData: {
      title: string;
      description?: string;
      meeting_type: string;
      start_time: string;
      end_time: string;
      meeting_link: string;
      notes?: string;
    },
  ) => {
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const result = await fetch(`${API_BASE_URL}/deal_room_meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            deal_room_meeting: {
              ...meetingData,
              deal_room_id: dealId,
            },
          }),
        });

        if (!result.ok) {
          const error = await result.json();
          throw new Error(
            error.errors?.join(', ') || 'Failed to create meeting',
          );
        }

        return await result.json();
      } catch (err) {
        console.error('Error creating meeting:', err);
        throw err;
      }
    },
    [token],
  );

  const updateMeeting = useCallback(
    async (
      meetingId: string,
      meetingData: {
        title?: string;
        description?: string;
        meeting_type?: string;
        start_time?: string;
        end_time?: string;
        meeting_link?: string;
        notes?: string;
      },
    ) => {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const result = await fetch(
          `${API_BASE_URL}/deal_room_meetings/${meetingId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ deal_room_meeting: meetingData }),
          },
        );

        if (!result.ok) {
          const error = await result.json();
          throw new Error(
            error.errors?.join(', ') || 'Failed to update meeting',
          );
        }

        return await result.json();
      } catch (err) {
        console.error('Error updating meeting:', err);
        throw err;
      }
    },
    [token],
  );

  const deleteMeeting = useCallback(
    async (meetingId: string) => {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const result = await fetch(
          `${API_BASE_URL}/deal_room_meetings/${meetingId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!result.ok) {
          throw new Error('Failed to delete meeting');
        }

        return await result.json();
      } catch (err) {
        console.error('Error deleting meeting:', err);
        throw err;
      }
    },
    [token],
  );

  const startMeeting = useCallback(
    async (meetingId: string) => {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        toast.error(
          'Meeting start functionality not available in simplified version',
        );
        return Promise.resolve();
      } catch (err) {
        console.error('Error starting meeting:', err);
        throw err;
      }
    },
    [token],
  );

  const endMeeting = useCallback(
    async (meetingId: string) => {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        toast.error(
          'Meeting end functionality not available in simplified version',
        );
        return Promise.resolve();
      } catch (err) {
        console.error('Error ending meeting:', err);
        throw err;
      }
    },
    [token],
  );

  const cancelMeeting = useCallback(
    async (meetingId: string, reason: string) => {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const result = await fetch(
          `${API_BASE_URL}/deal_room_meetings/${meetingId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              deal_room_meeting: {
                status: 'canceled',
              },
            }),
          },
        );

        if (!result.ok) {
          throw new Error('Failed to cancel meeting');
        }

        return await result.json();
      } catch (err) {
        console.error('Error canceling meeting:', err);
        throw err;
      }
    },
    [token],
  );

  const rescheduleMeeting = useCallback(
    async (meetingId: string, newStartTime: string, newEndTime: string) => {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        const result = await fetch(
          `${API_BASE_URL}/deal_room_meetings/${meetingId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              deal_room_meeting: {
                start_time: newStartTime,
                end_time: newEndTime,
              },
            }),
          },
        );

        if (!result.ok) {
          throw new Error('Failed to reschedule meeting');
        }

        return await result.json();
      } catch (err) {
        console.error('Error rescheduling meeting:', err);
        throw err;
      }
    },
    [token],
  );

  // Remove participant-related functions for simplified version
  const addMeetingParticipants = useCallback(
    async (
      meetingId: string,
      participantIds: string[],
      participantEmails: string[] = [],
    ) => {
      return Promise.resolve();
    },
    [],
  );

  const removeMeetingParticipant = useCallback(
    async (meetingId: string, userId: string) => {
      return Promise.resolve();
    },
    [],
  );

  const rsvpToMeeting = useCallback(
    async (
      meetingId: string,
      status: 'accepted' | 'declined' | 'tentative',
    ) => {
      return Promise.resolve();
    },
    [],
  );

  const getUpcomingMeetings = useCallback(async () => {
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/deal_rooms/meetings/upcoming`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch upcoming meetings');
      }

      return await response.json();
    } catch (err) {
      console.error('Error getting upcoming meetings:', err);
      throw err;
    }
  }, [token]);

  const updateMeetingAttendance = useCallback(
    async (
      meetingId: string,
      attendance: Record<string, 'attended' | 'no_show'>,
    ) => {
      return Promise.resolve();
    },
    [],
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
    getMeetingCalendar,
    getMeetingAvailability,
    getDealRoomMembers,
    createConversation,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    startMeeting,
    endMeeting,
    cancelMeeting,
    rescheduleMeeting,
    addMeetingParticipants,
    removeMeetingParticipant,
    rsvpToMeeting,
    getUpcomingMeetings,
    updateMeetingAttendance,

    // Setters
    setPage,
    setError,
  };
};
