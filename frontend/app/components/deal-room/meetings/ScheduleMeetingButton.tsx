'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { CreateMeetingModal } from '../meetings/CreateMeetingModal';
import { toast } from 'sonner';

interface ScheduleMeetingButtonProps {
  dealRoomId: string;
  onMeetingCreated: () => void;
}

export function ScheduleMeetingButton({
  dealRoomId,
  onMeetingCreated,
}: ScheduleMeetingButtonProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleScheduleClick = () => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to schedule a meeting');
      return;
    }
    setShowCreateModal(true);
  };

  return (
    <>
      <Button
        onClick={handleScheduleClick}
        variant="ghost"
        className="w-full justify-start text-gray-700 hover:bg-gray-100"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Schedule Meeting
      </Button>

      <CreateMeetingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        dealRoomId={dealRoomId}
        onMeetingCreated={onMeetingCreated}
      />
    </>
  );
}
