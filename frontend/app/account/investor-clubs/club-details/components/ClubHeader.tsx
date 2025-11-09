// app/account/investor-clubs/club-details/components/ClubHeader.tsx
import React from 'react';
import { Club, Membership } from '../../clubTypes';

interface ClubHeaderProps {
  club: Club;
  myMembership: Membership | null;
}

const ClubHeader: React.FC<ClubHeaderProps> = ({ club, myMembership }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-emerald-900">{club.name}</h2>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              club.club_type === 'public'
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {club.club_type} Club
          </span>
          {myMembership && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                myMembership.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {myMembership.status === 'active' ? 'Member' : 'Pending'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubHeader;
