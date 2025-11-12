// app/account/investor-clubs/club-details/components/ActiveMembers.tsx
import React from 'react';
import { Member } from '../../clubTypes';
import { useAuth } from '@/app/context/auth/AuthContext';

interface ActiveMembersProps {
  members: Member[];
  getMemberInitials: (fullName: string) => string;
  formatRole: (role: string) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  safeToFixed: (value: any, decimals?: number) => string;
  clubCurrency?: string;
}

const ActiveMembers: React.FC<ActiveMembersProps> = ({
  members,
  getMemberInitials,
  formatRole,
  formatCurrency,
  safeToFixed,
  clubCurrency = 'USD',
}) => {
  const { user } = useAuth();

  return (
    <div>
      <h4 className="text-md font-semibold text-gray-900 mb-3">
        Active Members
      </h4>
      <div className="border border-gray-200 rounded-lg divide-y">
        {members.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No active members found
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-sm">
                  {getMemberInitials(member.user.full_name)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {member.user.full_name}
                    {member.user.id === String(user?.id) && (
                      <span className="ml-2 text-xs text-emerald-600">
                        (You)
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        member.role === 'creator'
                          ? 'bg-purple-100 text-purple-800'
                          : member.role === 'admin'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {formatRole(member.role)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : member.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(member.total_contributed, clubCurrency)}
                </div>
                <div className="text-sm text-gray-500">
                  {safeToFixed(member.contributed_share, 1)}% share{' '}
                  {/* CHANGED */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveMembers;
