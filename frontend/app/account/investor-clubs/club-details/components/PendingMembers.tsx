// app/account/investor-clubs/club-details/components/PendingMembers.tsx
import React from 'react';
import { Member } from '../../clubTypes';

interface PendingMembersProps {
  pendingMembers: Member[];
  actionLoading: string | null;
  getMemberInitials: (fullName: string) => string;
  onApproveMember: (memberId: string) => void;
  onRejectMember: (memberId: string, memberName: string) => void;
}

const PendingMembers: React.FC<PendingMembersProps> = ({
  pendingMembers,
  actionLoading,
  getMemberInitials,
  onApproveMember,
  onRejectMember,
}) => {
  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-900 mb-3">
        Pending Membership Requests
      </h4>
      <div className="border border-yellow-200 rounded-lg divide-y divide-yellow-100 bg-yellow-50">
        {pendingMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 hover:bg-yellow-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white font-semibold text-sm">
                {getMemberInitials(member.user.full_name)}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {member.user.full_name}
                </div>
                <div className="text-sm text-gray-500">Requested to join</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onApproveMember(member.id)}
                disabled={!!actionLoading}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50 min-w-[80px]"
              >
                {actionLoading === `approve-${member.id}`
                  ? 'Approving...'
                  : 'Approve'}
              </button>
              <button
                onClick={() => onRejectMember(member.id, member.user.full_name)}
                disabled={!!actionLoading}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 min-w-[80px]"
              >
                {actionLoading === `reject-${member.id}`
                  ? 'Rejecting...'
                  : 'Reject'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingMembers;
