// app/account/investor-clubs/club-details/components/ActionsTab.tsx
import React from 'react';
import { Club, Membership } from '../../clubTypes';
import MembershipActions from './MembershipActions';
import { TabComponentProps } from '../types/club-details-types';

const ActionsTab: React.FC<TabComponentProps> = ({
  club,
  myMembership,
  actionLoading,
  onFeatureClick,
  onTabChange,
  onJoinClub,
  onLeaveClub,
  onCancelRequest,
  onDeleteClub,
}) => {
  const isAdmin =
    club.is_admin ||
    myMembership?.role === 'admin' ||
    myMembership?.role === 'creator';
  const isCreator = club.is_creator || myMembership?.role === 'creator';

  if (!myMembership) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Club Actions
        </h3>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Become a Member</h4>

          <div className="space-y-4">
            <p className="text-gray-600">
              {club.club_type === 'public'
                ? 'Join this public club to start collaborating with other investors and participate in investment decisions.'
                : 'Request to join this private club. Your request will be reviewed by club admins.'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={onJoinClub}
                disabled={!!actionLoading}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
              >
                {actionLoading === 'join'
                  ? club.club_type === 'public'
                    ? 'Joining...'
                    : 'Requesting...'
                  : club.club_type === 'public'
                    ? 'Join Club Now'
                    : 'Request to Join'}
              </button>

              {club.club_type === 'private' && (
                <button
                  onClick={() => onTabChange?.('about')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Learn More
                </button>
              )}
            </div>

            {club.club_type === 'private' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-orange-400 mt-0.5 mr-3 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-orange-700">
                      After requesting to join, club admins will review your
                      application. You'll receive a notification once your
                      membership is approved.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
          <div className="p-4 bg-white border border-gray-200 rounded-lg text-left">
            <div className="font-semibold text-gray-900">
              Make Contributions
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Add funds to the club pool (Members only)
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg text-left">
            <div className="font-semibold text-gray-900">
              Propose Investments
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Suggest new investment opportunities (Members only)
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg text-left">
            <div className="font-semibold text-gray-900">Vote on Decisions</div>
            <div className="text-sm text-gray-600 mt-1">
              Participate in club voting (Members only)
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg text-left">
            <div className="font-semibold text-gray-900">View Analytics</div>
            <div className="text-sm text-gray-600 mt-1">
              Access detailed performance reports (Members only)
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Club Actions</h3>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Membership</h4>
        <MembershipActions
          myMembership={myMembership}
          actionLoading={actionLoading}
          isCreator={isCreator}
          onLeaveClub={onLeaveClub!}
          onCancelRequest={onCancelRequest!}
          onDeleteClub={onDeleteClub!}
          onFeatureClick={onFeatureClick}
        />
      </div>

      {myMembership?.status === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onFeatureClick('Make Contribution')}
            className="p-4 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors text-left"
          >
            <div className="font-semibold text-emerald-900">
              Make Contribution
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Add funds to the club pool
            </div>
          </button>

          <button
            onClick={() => onFeatureClick('Propose Investment')}
            className="p-4 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors text-left"
          >
            <div className="font-semibold text-emerald-900">
              Propose Investment
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Suggest a new investment opportunity
            </div>
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => onFeatureClick('Manage Club')}
                className="p-4 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-left"
              >
                <div className="font-semibold text-orange-900">Manage Club</div>
                <div className="text-sm text-gray-600 mt-1">
                  Update club settings and members
                </div>
              </button>

              <button
                onClick={() => onFeatureClick('View Analytics')}
                className="p-4 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-left"
              >
                <div className="font-semibold text-orange-900">
                  View Analytics
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Detailed performance reports
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionsTab;
