// app/account/investor-clubs/club-details/components/MembersTab.tsx
import React from 'react';
import { Club, Member, Membership } from '../../clubTypes';
import { useAuth } from '@/app/context/auth/AuthContext';
import PendingMembers from './PendingMembers';
import ActiveMembers from './ActiveMembers';
import { TabComponentProps } from '../types/club-details-types';

const MembersTab: React.FC<
  Omit<TabComponentProps, 'onFeatureClick'> & {
    onJoinClub: () => void;
  }
> = ({
  club,
  members,
  myMembership,
  actionLoading,
  onJoinClub,
  onApproveMember,
  onRejectMember,
}) => {
  const { user } = useAuth();

  const safeToFixed = (value: any, decimals: number = 2): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getMemberInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const isAdmin =
    club.is_admin ||
    myMembership?.role === 'admin' ||
    myMembership?.role === 'creator';
  const pendingMembers = members.filter((m) => m.status === 'pending');
  const activeMembers = members.filter((m) => m.status !== 'pending');

  if (!myMembership && club.club_type === 'private') {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Members</h3>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-orange-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-orange-800">
                Private Club Membership Required
              </h4>
              <p className="text-sm text-orange-700 mt-1">
                This is a private club with {club.current_members_count}{' '}
                members. Request to join to see the full members list and
                connect with other investors.
              </p>
              <button
                onClick={onJoinClub}
                disabled={!!actionLoading}
                className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium disabled:opacity-50"
              >
                {actionLoading === 'join' ? 'Requesting...' : 'Request to Join'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {club.current_members_count}
          </div>
          <div className="text-gray-600">Active Members</div>
          <div className="text-sm text-gray-500 mt-2">
            Join the club to see member details and connect with the community
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Members ({activeMembers.length})
          {pendingMembers.length > 0 && ` (${pendingMembers.length} pending)`}
        </h3>
        {pendingMembers.length > 0 && isAdmin && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            {pendingMembers.length} pending
          </span>
        )}
      </div>

      {isAdmin && pendingMembers.length > 0 && (
        <PendingMembers
          pendingMembers={pendingMembers}
          actionLoading={actionLoading}
          getMemberInitials={getMemberInitials}
          onApproveMember={onApproveMember!}
          onRejectMember={onRejectMember!}
        />
      )}

      <ActiveMembers
        members={activeMembers}
        getMemberInitials={getMemberInitials}
        formatRole={formatRole}
        formatCurrency={formatCurrency}
        safeToFixed={safeToFixed}
        clubCurrency={club.currency}
      />
    </div>
  );
};

export default MembersTab;
