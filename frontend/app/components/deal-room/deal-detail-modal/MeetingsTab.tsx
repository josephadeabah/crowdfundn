'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Video,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { CreateMeetingModal } from '../meetings/CreateMeetingModal';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/auth/AuthContext';

// Get API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';

interface Meeting {
  id: string;
  title: string;
  description: string;
  meeting_type: string;
  status: string;
  start_time: string;
  end_time: string;
  meeting_link: string;
  notes?: string;
  duration_minutes: number;
  upcoming: boolean;
  ongoing: boolean;
  past: boolean;
  organizer: {
    id: string;
    name: string;
  };
  formatted_start_time: string;
}

interface MeetingsTabProps {
  dealRoomId: string;
}

export function MeetingsTab({ dealRoomId }: MeetingsTabProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  const loadMeetings = async () => {
    try {
      setIsLoading(true);

      if (!token) {
        toast.error('Please sign in to view meetings');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/deal_rooms/${dealRoomId}/meetings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please sign in again.');
          return;
        }
        throw new Error('Failed to load meetings');
      }

      const data = await response.json();
      setMeetings(data.meetings || data.data || []);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast.error('Failed to load meetings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMeetingCreated = () => {
    loadMeetings();
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank', 'noopener,noreferrer');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          label: 'Scheduled',
          color: 'bg-blue-100 text-blue-800',
          icon: Clock,
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
        };
      case 'canceled':
        return {
          label: 'Canceled',
          color: 'bg-red-100 text-red-800',
          icon: XCircle,
        };
      default:
        return {
          label: 'Scheduled',
          color: 'bg-blue-100 text-blue-800',
          icon: Clock,
        };
    }
  };

  const getMeetingTypeLabel = (type: string) => {
    switch (type) {
      case 'one_on_one':
        return 'One-on-One';
      case 'pitch_review':
        return 'Pitch Review';
      case 'due_diligence':
        return 'Due Diligence';
      case 'investor_update':
        return 'Investor Update';
      default:
        return type;
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [dealRoomId]);

  if (!token) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sign in required
        </h3>
        <p className="text-gray-600">
          Please sign in to view and schedule meetings
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Meetings</h3>
          <p className="text-sm text-gray-600">Schedule and join meetings</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-600 mb-4" />
          <p className="text-gray-600">Loading meetings...</p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No meetings scheduled
          </h4>
          <p className="text-gray-600 mb-6">
            Schedule your first meeting to get started
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Schedule Meeting
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => {
            const statusConfig = getStatusConfig(meeting.status);
            const StatusIcon = statusConfig.icon;
            const isUpcoming = meeting.upcoming;
            const canJoin = isUpcoming && meeting.meeting_link;

            return (
              <div
                key={meeting.id}
                className="bg-white border rounded-lg p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {meeting.title}
                      </h4>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                      <Badge variant="outline">
                        {getMeetingTypeLabel(meeting.meeting_type)}
                      </Badge>
                    </div>

                    {meeting.description && (
                      <p className="text-gray-600 text-sm mb-2">
                        {meeting.description}
                      </p>
                    )}

                    <div className="text-sm text-gray-500 space-y-1">
                      <div>📅 {meeting.formatted_start_time}</div>
                      <div>⏱️ {meeting.duration_minutes} minutes</div>
                      <div>👤 Organized by: {meeting.organizer.name}</div>
                    </div>

                    {meeting.notes && (
                      <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <span className="font-medium">Notes:</span>{' '}
                        {meeting.notes}
                      </div>
                    )}
                  </div>

                  {canJoin && (
                    <Button
                      size="sm"
                      onClick={() => handleJoinMeeting(meeting.meeting_link)}
                      className="ml-4 bg-orange-600"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateMeetingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        dealRoomId={dealRoomId}
        onMeetingCreated={handleMeetingCreated}
      />
    </div>
  );
}
