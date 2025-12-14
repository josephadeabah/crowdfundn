'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Video,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock4,
  Edit,
  Trash2,
  Play,
  StopCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { CreateMeetingModal } from './CreateMeetingModal';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useDealRoomApi } from '../hooks/useDealRoom';
import { EditMeetingModal } from './EditMeetingModal';

interface Meeting {
  id: string;
  title: string;
  description: string;
  meeting_type: string;
  status: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  duration_minutes: number;
  upcoming: boolean;
  ongoing: boolean;
  past: boolean;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  participants: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
  }>;
  can_edit: boolean;
  can_delete: boolean;
  can_start: boolean;
  can_end: boolean;
  participant_status?: string;
  notes?: string;
}

interface MeetingsListProps {
  meetings: Meeting[];
  dealRoomId: string;
  availableUsers: Array<{ id: string; full_name: string; email: string }>;
  onRefresh: () => void;
}

export function MeetingsList({
  meetings,
  dealRoomId,
  availableUsers,
  onRefresh,
}: MeetingsListProps) {
  const { token } = useAuth();
  const {
    startMeeting,
    endMeeting,
    cancelMeeting,
    deleteMeeting,
    rsvpToMeeting,
  } = useDealRoomApi();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const meetingTypeLabels: Record<string, string> = {
    qna: 'Q&A',
    pitch: 'Pitch',
    due_diligence: 'Due Diligence',
    investor_update: 'Investor Update',
    one_on_one: '1:1',
    group_discussion: 'Group Discussion',
    webinar: 'Webinar',
  };

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: any }
  > = {
    scheduled: {
      label: 'Scheduled',
      color: 'bg-blue-100 text-blue-800',
      icon: Clock,
    },
    in_progress: {
      label: 'In Progress',
      color: 'bg-amber-100 text-amber-800',
      icon: Play,
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle,
    },
    canceled: {
      label: 'Canceled',
      color: 'bg-red-100 text-red-800',
      icon: XCircle,
    },
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: Clock4 },
  };

  const participantStatusConfig: Record<
    string,
    { label: string; color: string }
  > = {
    invited: { label: 'Invited', color: 'bg-gray-100 text-gray-800' },
    accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
    declined: { label: 'Declined', color: 'bg-red-100 text-red-800' },
    tentative: { label: 'Tentative', color: 'bg-amber-100 text-amber-800' },
    attended: { label: 'Attended', color: 'bg-emerald-100 text-emerald-800' },
    no_show: { label: 'No Show', color: 'bg-red-100 text-red-800' },
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      full: date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const handleStartMeeting = async (meetingId: string) => {
    setIsProcessing(meetingId);
    try {
      await startMeeting(meetingId);
      toast.success('Meeting started successfully');
      onRefresh();
    } catch (error) {
      console.error('Error starting meeting:', error);
      toast.error('Failed to start meeting');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleEndMeeting = async (meetingId: string) => {
    setIsProcessing(meetingId);
    try {
      await endMeeting(meetingId);
      toast.success('Meeting ended successfully');
      onRefresh();
    } catch (error) {
      console.error('Error ending meeting:', error);
      toast.error('Failed to end meeting');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleCancelMeeting = async (meetingId: string) => {
    if (!confirm('Are you sure you want to cancel this meeting?')) return;

    setIsProcessing(meetingId);
    try {
      await cancelMeeting(meetingId, 'Cancelled by organizer');
      toast.success('Meeting cancelled successfully');
      onRefresh();
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      toast.error('Failed to cancel meeting');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this meeting? This action cannot be undone.',
      )
    )
      return;

    setIsProcessing(meetingId);
    try {
      await deleteMeeting(meetingId);
      toast.success('Meeting deleted successfully');
      onRefresh();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast.error('Failed to delete meeting');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRSVP = async (meetingId: string, status: string) => {
    if (!['accepted', 'declined', 'tentative'].includes(status)) return;

    setIsProcessing(meetingId);
    try {
      await rsvpToMeeting(meetingId, status as any);
      toast.success(`RSVP ${status} successfully`);
      onRefresh();
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast.error('Failed to update RSVP');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Meetings</h3>
          <p className="text-sm text-gray-600">
            Schedule and manage meetings for this deal room
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="ghost"
          className="text-gray-800"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No meetings scheduled
          </h4>
          <p className="text-gray-600 mb-6">
            Schedule your first meeting to connect with investors
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="ghost"
            className="text-gray-800"
          >
            Schedule First Meeting
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => {
            const dateTime = formatDateTime(meeting.start_time);
            const statusConfigItem =
              statusConfig[meeting.status] || statusConfig.scheduled;
            const StatusIcon = statusConfigItem.icon;
            const participantStatus = meeting.participant_status
              ? participantStatusConfig[meeting.participant_status]
              : null;
            const isProcessingThis = isProcessing === meeting.id;

            return (
              <div
                key={meeting.id}
                className="bg-white border rounded-lg p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {meeting.title}
                          </h4>
                          <Badge className={statusConfigItem.color}>
                            {isProcessingThis ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <StatusIcon className="w-3 h-3 mr-1" />
                            )}
                            {statusConfigItem.label}
                          </Badge>
                          {meeting.meeting_type && (
                            <Badge variant="outline">
                              {meetingTypeLabels[meeting.meeting_type] ||
                                meeting.meeting_type}
                            </Badge>
                          )}
                        </div>
                        {meeting.description && (
                          <p className="text-gray-600 text-sm mb-3">
                            {meeting.description}
                          </p>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={isProcessingThis}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {meeting.can_edit && meeting.upcoming && (
                            <DropdownMenuItem
                              onClick={() => handleEditMeeting(meeting)}
                              disabled={isProcessingThis}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {meeting.can_start && meeting.upcoming && (
                            <DropdownMenuItem
                              onClick={() => handleStartMeeting(meeting.id)}
                              disabled={isProcessingThis}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Meeting
                            </DropdownMenuItem>
                          )}
                          {meeting.can_end && meeting.ongoing && (
                            <DropdownMenuItem
                              onClick={() => handleEndMeeting(meeting.id)}
                              disabled={isProcessingThis}
                            >
                              <StopCircle className="w-4 h-4 mr-2" />
                              End Meeting
                            </DropdownMenuItem>
                          )}
                          {meeting.can_edit && meeting.upcoming && (
                            <DropdownMenuItem
                              onClick={() => handleCancelMeeting(meeting.id)}
                              disabled={isProcessingThis}
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          )}
                          {meeting.can_delete && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteMeeting(meeting.id)}
                              disabled={isProcessingThis}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{dateTime.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {dateTime.time} • {meeting.duration_minutes}min
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{meeting.participants.length} participants</span>
                      </div>
                      {meeting.meeting_link && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Video className="w-4 h-4" />
                          <span>Virtual Meeting</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-sm text-gray-600">
                        Organized by:{' '}
                        <span className="font-medium">
                          {meeting.organizer.name}
                        </span>
                      </div>
                      {participantStatus && (
                        <Badge className={participantStatus.color}>
                          {participantStatus.label}
                        </Badge>
                      )}
                    </div>

                    {meeting.participants.length > 0 && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            Participants
                          </span>
                          <span className="text-xs text-gray-500">
                            ({meeting.participants.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {meeting.participants
                            .slice(0, 5)
                            .map((participant) => {
                              const pStatus =
                                participantStatusConfig[participant.status] ||
                                participantStatusConfig.invited;
                              return (
                                <Badge
                                  key={participant.id}
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                                  {participant.name}
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded ${pStatus.color}`}
                                  >
                                    {pStatus.label}
                                  </span>
                                </Badge>
                              );
                            })}
                          {meeting.participants.length > 5 && (
                            <Badge variant="outline" className="text-gray-600">
                              +{meeting.participants.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 lg:w-48">
                    {meeting.participant_status === 'invited' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleRSVP(meeting.id, 'accepted')}
                          disabled={isProcessingThis}
                        >
                          {isProcessingThis ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          )}
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleRSVP(meeting.id, 'declined')}
                          disabled={isProcessingThis}
                        >
                          {isProcessingThis ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-1" />
                          )}
                          Decline
                        </Button>
                      </div>
                    )}

                    {meeting.meeting_link && meeting.upcoming && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleJoinMeeting(meeting.meeting_link!)}
                        className="w-full"
                        disabled={isProcessingThis}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Join Meeting
                      </Button>
                    )}

                    {meeting.notes && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <div className="font-medium mb-1">Notes:</div>
                        <div className="line-clamp-2">{meeting.notes}</div>
                      </div>
                    )}
                  </div>
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
        onMeetingCreated={onRefresh}
        isLoading={false}
      />

      {selectedMeeting && (
        <EditMeetingModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMeeting(null);
          }}
          meeting={selectedMeeting}
          onSubmit={async (meetingData) => {
            // This should be implemented in the parent component
            // using the updateMeeting hook
            return Promise.resolve();
          }}
          availableUsers={availableUsers}
          isLoading={false}
        />
      )}
    </div>
  );
}
