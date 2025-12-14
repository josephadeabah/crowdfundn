// app/components/deal-room/deal-detail-modal/MeetingsTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { MeetingsList } from '../meetings/MeetingsList';
import { MeetingsCalendar } from '../meetings/MeetingsCalendar';
import { CreateMeetingModal } from '../meetings/CreateMeetingModal';
import { useAuth } from '@/app/context/auth/AuthContext';
import { toast } from 'sonner';
import { useDealRoomApi } from '../hooks/useDealRoom';

interface MeetingsTabProps {
  dealRoomId: string;
  token: string | null;
  isMember: boolean;
}

export function MeetingsTab({ dealRoomId, token, isMember }: MeetingsTabProps) {
  const { getDealMeetings, getDealRoomMembers, createMeeting } =
    useDealRoomApi();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (token && dealRoomId) {
      loadMeetings();
      loadAvailableUsers();
    }
  }, [token, dealRoomId, page]);

  const loadMeetings = async () => {
    try {
      setIsLoading(true);
      const response = await getDealMeetings(dealRoomId, page, 20);

      setMeetings(response.data || []);
      setTotalPages(response.total_pages || 1);
      setTotalCount(response.total_count || 0);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast.error('Failed to load meetings');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const response = await getDealRoomMembers(dealRoomId, 1, 100);
      setAvailableUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleCreateMeeting = async (meetingData: any) => {
    if (!token) {
      toast.error('You must be logged in to schedule a meeting');
      return;
    }

    try {
      setIsCreatingMeeting(true);
      
      // Format the data properly for the API
      const formattedData = {
        title: meetingData.title,
        description: meetingData.description || '',
        meeting_type: meetingData.meeting_type,
        start_time: meetingData.start_time,
        end_time: meetingData.end_time,
        meeting_link: meetingData.meeting_link || '',
        notes: meetingData.notes || '',
        participant_ids: meetingData.participant_ids || [],
        participant_emails: meetingData.participant_emails || [],
        invite_all_members: meetingData.invite_all_members || false
      };

      console.log('Creating meeting with data:', formattedData);
      
      const result = await createMeeting(dealRoomId, formattedData);
      
      toast.success('Meeting scheduled successfully');
      setShowCreateModal(false);
      loadMeetings(); // Refresh the meetings list
      return result;
    } catch (error: any) {
      console.error('Error creating meeting:', error);
      
      // Handle specific error messages
      if (error.message && error.message.includes('Failed to create meeting')) {
        const errorData = await error.response?.json?.();
        const errorMessage = errorData?.errors?.join(', ') || error.message;
        toast.error(`Failed to schedule meeting: ${errorMessage}`);
      } else {
        toast.error(
          error instanceof Error ? error.message : 'Failed to schedule meeting'
        );
      }
      throw error; // Re-throw so the modal can handle it
    } finally {
      setIsCreatingMeeting(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Filter meetings for the selected date if needed
    // You could implement date filtering here
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!isMember && token) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Join Deal Room
        </h3>
        <p className="text-gray-600 mb-6">
          You need to join the deal room to view and schedule meetings
        </p>
        <Button variant="ghost" className="bg-emerald-600 text-white">
          Join Deal Room
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Meetings</h3>
          <p className="text-sm text-gray-600">
            Schedule and manage meetings with investors and founders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as any)}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </Tabs>

          {isMember && token && (
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="ghost"
              className="text-gray-800"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-600 mb-4" />
          <p className="text-gray-600">Loading meetings...</p>
        </div>
      ) : (
        <>
          {view === 'calendar' ? (
            <MeetingsCalendar
              meetings={meetings}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          ) : (
            <MeetingsList
              meetings={meetings}
              dealRoomId={dealRoomId}
              availableUsers={availableUsers}
              onRefresh={loadMeetings}
            />
          )}

          {/* Pagination for list view */}
          {view === 'list' && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Total Meetings
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {totalCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">Upcoming</p>
                  <p className="text-2xl font-bold text-green-700">
                    {meetings.filter((m) => m.upcoming).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    Avg Participants
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {meetings.length > 0
                      ? Math.round(
                          meetings.reduce(
                            (sum, m) => sum + (m.participants?.length || 0),
                            0,
                          ) / meetings.length,
                        )
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <CreateMeetingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateMeeting}
        dealRoomId={dealRoomId}
        availableUsers={availableUsers}
        isLoading={isCreatingMeeting}
      />
    </div>
  );
}