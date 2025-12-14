// app/components/deal-room/meetings/CreateMeetingModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, Users, Video, Type, FileText, Loader2 } from 'lucide-react';
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
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';
import { TimePicker } from '../../ui/time-picker';
import { DatePicker } from '../../ui/date-picker';

interface User {
  id: string;
  full_name: string;
  email: string;
}

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (meetingData: any) => Promise<void>;
  dealRoomId: string;
  availableUsers: User[];
  isLoading?: boolean;
}

export function CreateMeetingModal({
  isOpen,
  onClose,
  onSubmit,
  dealRoomId,
  availableUsers,
  isLoading = false,
}: CreateMeetingModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [meetingType, setMeetingType] = useState('qna');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [inviteAllMembers, setInviteAllMembers] = useState(false);
  const [participantEmails, setParticipantEmails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const meetingTypes = [
    { value: 'qna', label: 'Q&A Session' },
    { value: 'pitch', label: 'Pitch Presentation' },
    { value: 'due_diligence', label: 'Due Diligence' },
    { value: 'investor_update', label: 'Investor Update' },
    { value: 'one_on_one', label: 'One-on-One' },
    { value: 'group_discussion', label: 'Group Discussion' },
    { value: 'webinar', label: 'Webinar' },
  ];

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMeetingType('qna');
    setSelectedDate(new Date());
    setStartTime('09:00');
    setEndTime('10:00');
    setMeetingLink('');
    setNotes('');
    setSelectedUsers([]);
    setInviteAllMembers(false);
    setParticipantEmails('');
    setErrors({});
    setIsSubmitting(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
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

    const startDateTime = new Date(selectedDate!);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(selectedDate!);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes);

    if (endDateTime <= startDateTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    // Allow meetings to start in the past for testing, but you can re-enable this
    // if (startDateTime < new Date()) {
    //   newErrors.startTime = 'Start time must be in the future';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event bubbling

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
      title,
      description,
      meeting_type: meetingType,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      meeting_link: meetingLink,
      notes,
      participant_ids: selectedUsers,
      participant_emails: participantEmails
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email),
      invite_all_members: inviteAllMembers,
    };

    console.log('Submitting meeting data:', meetingData);

    try {
      await onSubmit(meetingData);
      toast.success('Meeting scheduled successfully!');
      resetForm();
      onClose();
    } catch (error: any) {
      console.error('Failed to create meeting:', error);
      
      // Handle validation errors from backend
      if (error.errors) {
        const backendErrors: Record<string, string> = {};
        error.errors.forEach((err: string) => {
          if (err.includes('Title')) backendErrors.title = err;
          if (err.includes('start time')) backendErrors.startTime = err;
          if (err.includes('end time')) backendErrors.endTime = err;
          if (err.includes('meeting type')) backendErrors.meetingType = err;
        });
        setErrors(backendErrors);
        toast.error('Please fix the validation errors');
      } else {
        toast.error(error.message || 'Failed to schedule meeting');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the background, not the modal content
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
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
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Schedule New Meeting
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Create a meeting for your deal room
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
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Basic Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Investor Q&A Session"
                  className={errors.title ? 'border-red-500' : ''}
                  disabled={isSubmitting || isLoading}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will this meeting be about?"
                  rows={3}
                  disabled={isSubmitting || isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
                  <Input
                    id="meetingLink"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://zoom.us/j/..."
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date & Time
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <DatePicker
                    date={selectedDate}
                    onSelect={setSelectedDate}
                    fromDate={new Date()}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <TimePicker 
                    value={startTime} 
                    onChange={setStartTime}
                    minTime="00:00"
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
                  />
                  {errors.endTime && (
                    <p className="text-sm text-red-500">{errors.endTime}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participants
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inviteAll"
                    checked={inviteAllMembers}
                    onCheckedChange={(checked) =>
                      setInviteAllMembers(checked === true)
                    }
                    disabled={isSubmitting || isLoading}
                  />
                  <Label htmlFor="inviteAll" className="text-sm font-normal">
                    Invite all deal room members
                  </Label>
                </div>

                {availableUsers.length > 0 && (
                  <div className="space-y-2">
                    <Label>Select Participants</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                      {availableUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                        >
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleUserToggle(user.id)}
                            disabled={inviteAllMembers || isSubmitting || isLoading}
                          />
                          <Label
                            htmlFor={`user-${user.id}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-gray-500 text-xs">
                              {user.email}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="externalEmails">
                    External Participants (comma-separated emails)
                  </Label>
                  <Textarea
                    id="externalEmails"
                    value={participantEmails}
                    onChange={(e) => setParticipantEmails(e.target.value)}
                    placeholder="john@example.com, jane@example.com"
                    rows={2}
                    disabled={isSubmitting || isLoading}
                  />
                  <p className="text-xs text-gray-500">
                    External users will receive an email invitation
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((userId) => {
                    const user = availableUsers.find((u) => u.id === userId);
                    return user ? (
                      <Badge
                        key={userId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {user.full_name}
                        <button
                          type="button"
                          onClick={() => handleUserToggle(userId)}
                          className="ml-1 hover:text-red-500"
                          disabled={isSubmitting || isLoading}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Additional Notes
              </h3>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information for participants..."
                  rows={3}
                  disabled={isSubmitting || isLoading}
                />
              </div>
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
              {(isSubmitting || isLoading) ? (
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