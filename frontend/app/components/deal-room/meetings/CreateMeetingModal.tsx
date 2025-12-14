'use client';

import { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Video,
  Type,
  FileText,
  Loader2,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { toast } from 'sonner';
import { TimePicker } from '../../ui/time-picker';
import { DatePicker } from '../../ui/date-picker';

// Get API base URL from environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealRoomId: string;
  onMeetingCreated: () => void;
  isLoading?: boolean;
}

export function CreateMeetingModal({
  isOpen,
  onClose,
  dealRoomId,
  onMeetingCreated,
  isLoading = false,
}: CreateMeetingModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [meetingType, setMeetingType] = useState('one_on_one');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const meetingTypes = [
    { value: 'one_on_one', label: 'One-on-One Meeting' },
    { value: 'pitch_review', label: 'Pitch Review' },
    { value: 'due_diligence', label: 'Due Diligence' },
    { value: 'investor_update', label: 'Investor Update' },
  ];

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMeetingType('one_on_one');
    setSelectedDate(new Date());
    setStartTime('09:00');
    setEndTime('10:00');
    setMeetingLink('');
    setNotes('');
    setErrors({});
    setIsSubmitting(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!meetingType) {
      newErrors.meetingType = 'Meeting type is required';
    }

    if (!selectedDate) {
      newErrors.date = 'Date is required';
    }

    if (!startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (!meetingLink.trim()) {
      newErrors.meetingLink = 'Meeting link is required';
    } else if (!meetingLink.startsWith('http')) {
      newErrors.meetingLink = 'Please enter a valid URL (https://...)';
    }

    const startDateTime = new Date(selectedDate!);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(selectedDate!);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes);

    if (endDateTime <= startDateTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    const startDateTime = new Date(selectedDate!);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(selectedDate!);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes);

    const meetingData = {
      deal_room_id: dealRoomId,
      title,
      description,
      meeting_type: meetingType,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      meeting_link: meetingLink,
      notes,
    };

    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Please sign in to schedule a meeting');
      }

      const response = await fetch(`${API_BASE_URL}/deal_room_meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deal_room_meeting: meetingData }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.errors?.join(', ') || 'Failed to schedule meeting',
        );
      }

      const result = await response.json();
      toast.success('Meeting scheduled successfully!');
      resetForm();
      onMeetingCreated();
      onClose();
      return result;
    } catch (error: any) {
      console.error('Failed to create meeting:', error);

      if (error.errors) {
        const backendErrors: Record<string, string> = {};
        error.errors.forEach((err: string) => {
          if (err.includes('Title')) backendErrors.title = err;
          if (err.includes('start time')) backendErrors.startTime = err;
          if (err.includes('end time')) backendErrors.endTime = err;
          if (err.includes('meeting type')) backendErrors.meetingType = err;
          if (err.includes('meeting link')) backendErrors.meetingLink = err;
        });
        setErrors(backendErrors);
        toast.error('Please fix the validation errors');
      } else {
        toast.error(error.message || 'Failed to schedule meeting');
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).className?.includes?.('absolute')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Schedule Meeting
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Create a meeting for this deal
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            disabled={isSubmitting || isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Investor Meeting"
                className={errors.title ? 'border-red-500' : ''}
                disabled={isSubmitting || isLoading}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will this meeting be about?"
                rows={2}
                disabled={isSubmitting || isLoading}
              />
            </div>

            {/* Meeting Type */}
            <div className="space-y-2">
              <Label htmlFor="meetingType">Meeting Type *</Label>
              <Select
                value={meetingType}
                onValueChange={setMeetingType}
                disabled={isSubmitting || isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {meetingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.meetingType && (
                <p className="text-sm text-red-500">{errors.meetingType}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <DatePicker
                date={selectedDate}
                onSelect={setSelectedDate}
                fromDate={new Date()}
                disabled={isSubmitting || isLoading}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <TimePicker
                  value={startTime}
                  onChange={setStartTime}
                  minTime="00:00"
                  disabled={isSubmitting || isLoading}
                />
                {errors.startTime && (
                  <p className="text-sm text-red-500">{errors.startTime}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <TimePicker
                  value={endTime}
                  onChange={setEndTime}
                  minTime={startTime}
                  disabled={isSubmitting || isLoading}
                />
                {errors.endTime && (
                  <p className="text-sm text-red-500">{errors.endTime}</p>
                )}
              </div>
            </div>

            {/* Meeting Link */}
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link *</Label>
              <Input
                id="meetingLink"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                className={errors.meetingLink ? 'border-red-500' : ''}
                disabled={isSubmitting || isLoading}
              />
              {errors.meetingLink && (
                <p className="text-sm text-red-500">{errors.meetingLink}</p>
              )}
              <p className="text-xs text-gray-500">
                Copy and paste the full meeting URL
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information..."
                rows={2}
                disabled={isSubmitting || isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                'Schedule Meeting'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
