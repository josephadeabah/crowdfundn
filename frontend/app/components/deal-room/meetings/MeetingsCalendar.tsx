// app/components/deal-room/meetings/MeetingsCalendar.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
} from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  meeting_type: string;
}

interface MeetingsCalendarProps {
  meetings: Meeting[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export function MeetingsCalendar({
  meetings,
  onDateSelect,
  selectedDate = new Date(),
}: MeetingsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);
  const [meetingsByDate, setMeetingsByDate] = useState<
    Record<string, Meeting[]>
  >({});

  useEffect(() => {
    const grouped: Record<string, Meeting[]> = {};

    meetings.forEach((meeting) => {
      const date = new Date(meeting.start_time);
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(meeting);
    });

    setMeetingsByDate(grouped);
  }, [meetings]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const today = new Date();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-amber-500';
      case 'completed':
        return 'bg-green-500';
      case 'canceled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Meeting Calendar
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(today)}
            className="text-sm"
          >
            Today
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-gray-900 min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: new Date(monthStart).getDay() }).map(
          (_, index) => (
            <div
              key={`empty-${index}`}
              className="h-32 border rounded-lg bg-gray-50"
            />
          ),
        )}

        {monthDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayMeetings = meetingsByDate[dateKey] || [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={dateKey}
              onClick={() => {
                onDateSelect(day);
              }}
              className={`
                h-32 border rounded-lg p-2 cursor-pointer transition-colors
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                ${isSelected ? 'ring-2 ring-emerald-500 ring-inset' : ''}
                ${isTodayDate ? 'border-emerald-300' : 'border-gray-200'}
                hover:bg-gray-50
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`
                  font-medium text-sm
                  ${isTodayDate ? 'bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
                  ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                `}
                >
                  {format(day, 'd')}
                </span>
                {dayMeetings.length > 0 && (
                  <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {dayMeetings.length}
                  </span>
                )}
              </div>

              <div className="space-y-1 overflow-y-auto max-h-20">
                {dayMeetings.slice(0, 3).map((meeting) => (
                  <div
                    key={meeting.id}
                    className={`
                      text-xs p-1.5 rounded truncate
                      ${getStatusColor(meeting.status)}
                      text-white font-medium
                    `}
                    title={`${format(new Date(meeting.start_time), 'h:mm a')} - ${meeting.title}`}
                  >
                    <div className="truncate">{meeting.title}</div>
                    <div className="opacity-90 truncate">
                      {format(new Date(meeting.start_time), 'h:mm a')}
                    </div>
                  </div>
                ))}
                {dayMeetings.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayMeetings.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-600">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600">Completed</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateSelect(today)}
          >
            View Today's Meetings
          </Button>
        </div>
      </div>
    </div>
  );
}
