import { Calendar } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

interface MeetingsTabProps {
  isLoading: boolean;
  meetings: any[];
  isMember: boolean;
  token: string | null;
  onScheduleMeeting: () => void;
}

export function MeetingsTab({
  isLoading,
  meetings,
  isMember,
  token,
  onScheduleMeeting,
}: MeetingsTabProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading meetings...</p>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No scheduled meetings</p>
        {(isMember || token) && (
          <Button
            className="mt-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-100"
            onClick={onScheduleMeeting}
          >
            Schedule a Meeting
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-gray-900">{meeting.title}</p>
              <p className="text-xs text-gray-600">
                {meeting.meeting_type} • {meeting.status}
              </p>
            </div>
            <Badge variant={meeting.upcoming ? 'default' : 'secondary'}>
              {meeting.upcoming ? 'Upcoming' : 'Past'}
            </Badge>
          </div>
          <div className="text-sm text-gray-600">
            <p>{new Date(meeting.start_time).toLocaleString()}</p>
            <p>Duration: {meeting.duration_minutes} minutes</p>
            <p>Organizer: {meeting.organizer?.name}</p>
            {meeting.meeting_link && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.open(meeting.meeting_link, '_blank')}
              >
                Join Meeting
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
