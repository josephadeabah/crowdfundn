'use client';

import {
  Users,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Share2,
  AlertCircle,
} from 'lucide-react';
import { Separator } from '@/app/components/ui/separator';
import { Button } from '@/app/components/ui/button';
import { Deal } from '../services/dealRoomApi';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'sonner';
import { ScheduleMeetingButton } from '../meetings/ScheduleMeetingButton';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useState, useEffect } from 'react';

interface SidebarProps {
  deal: Deal;
  dealRoomMemberCount: number;
  conversations: any[];
  isMember: boolean;
  isLoading: boolean;
  isInterested: boolean;
  onShowInterest: () => void;
  onJoinDealRoom: () => void;
  onSendMessageToFounder: () => void;
  onScheduleMeeting: () => void;
  onShareDeal: () => void;
  onMeetingCreated: () => void;
}

export function Sidebar({
  deal,
  dealRoomMemberCount,
  conversations,
  isMember,
  isLoading,
  isInterested,
  onShowInterest,
  onJoinDealRoom,
  onSendMessageToFounder,
  onScheduleMeeting,
  onShareDeal,
  onMeetingCreated,
}: SidebarProps) {
  const { token: authToken } = useAuth();
  const [localToken, setLocalToken] = useState<string | null>(null);

  // Sync token from localStorage on component mount and auth changes
  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    setLocalToken(token);
  }, [authToken]);

  // Use either authToken or localStorage token
  const token = authToken || localToken;

  const handleSendMessageToFounder = () => {
    if (!token) {
      toast.error('Please sign in to send messages');
      return;
    }
    onSendMessageToFounder();
  };

  const handleScheduleMeetingClick = () => {
    if (!token) {
      toast.error('Please sign in to schedule meetings');
      return;
    }

    if (!isMember) {
      onJoinDealRoom();
      return;
    }

    onScheduleMeeting();
  };

  return (
    <div className="space-y-6">
      {/* Deal Terms */}
      <div className="bg-gray-50 p-5 space-y-4 rounded-lg">
        <h3 className="font-semibold text-gray-900">Deal Terms</h3>
        <Separator className="bg-gray-300" />
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Stage</span>
            <span className="font-medium text-gray-900">{deal.stage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Valuation</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(deal.valuation)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Min Investment</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(deal.minInvestment)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Industry</span>
            <span className="font-medium text-gray-900">{deal.industry}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Days Left</span>
            <span className="font-medium text-gray-900">
              {deal.daysLeft > 0 ? deal.daysLeft : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Founder Info */}
      <div className="bg-gray-50 p-5 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Meet the Founder</h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-600 rounded-lg">
            {deal.founderImage ||
              deal.founderName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{deal.founderName}</p>
            <p className="text-sm text-gray-600">
              {deal.founderTitle || 'Founder'}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Button
            className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
            onClick={handleSendMessageToFounder}
            disabled={!token || isLoading}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Send Message
          </Button>

          {/* Schedule Meeting Button */}
          <ScheduleMeetingButton
            dealRoomId={deal.campaign?.deal_room?.id?.toString() || ''}
            onMeetingCreated={onMeetingCreated}
          />
        </div>
      </div>

      {/* Deal Room Info */}
      {dealRoomMemberCount > 0 && (
        <div className="bg-emerald-50 p-5 border border-emerald-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Deal Room</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">
                {dealRoomMemberCount} members
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">
                {conversations.length} conversations
              </span>
            </div>
            {!isMember && token && (
              <div className="mt-3">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={onJoinDealRoom}
                  disabled={isLoading}
                >
                  Join Deal Room
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Required Warning */}
      {!token && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h4 className="font-medium text-amber-900">Sign in required</h4>
          </div>
          <p className="text-sm text-amber-800">
            Please sign in to show interest, join deal rooms, or schedule
            meetings.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="space-y-3">
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          size="lg"
          disabled={
            deal.status === 'Funded' || !token || isLoading || isInterested
          }
          onClick={onShowInterest}
        >
          {isInterested ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Interest Shown
            </>
          ) : deal.status === 'Funded' ? (
            'Fully Funded'
          ) : (
            'Show Interest'
          )}
        </Button>

        <Button
          className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
          onClick={onShareDeal}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Deal
        </Button>
      </div>
    </div>
  );
}
