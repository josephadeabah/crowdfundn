// app/account/investor-clubs/club-details/components/MembershipActions.tsx
import React from 'react';
import { Membership } from '../../clubTypes';

interface MembershipActionsProps {
  myMembership: Membership;
  actionLoading: string | null;
  isCreator: boolean;
  onLeaveClub: () => void;
  onCancelRequest: () => void;
  onDeleteClub: () => void;
  onFeatureClick: (featureName: string) => void;
  clubCurrency?: string;
}

const MembershipActions: React.FC<MembershipActionsProps> = ({
  myMembership,
  actionLoading,
  isCreator,
  onLeaveClub,
  onCancelRequest,
  onDeleteClub,
  onFeatureClick,
  clubCurrency = 'USD',
}) => {
  const safeToFixed = (value: any, decimals: number = 2): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  };

  const formatCurrency = (amount: number, currency: string = clubCurrency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (myMembership.status === 'pending') {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Membership Pending Approval
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Your membership request is pending approval from club admins.
                  You'll be able to access all club features once approved.
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onCancelRequest}
          disabled={!!actionLoading}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium disabled:opacity-50"
        >
          {actionLoading === 'cancel' ? 'Canceling...' : 'Cancel Request'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Your Share:</span>
          <div className="font-semibold">
            {safeToFixed(myMembership.contributed_share, 2)}% {/* CHANGED */}
          </div>
        </div>
        <div>
          <span className="text-gray-600">Total Contributed:</span>
          <div className="font-semibold">
            {formatCurrency(myMembership.total_contributed, clubCurrency)}
          </div>
        </div>
        {/* REMOVED: Estimated Value since we don't calculate individual share values for contributions */}
        <div>
          <span className="text-gray-600">Role:</span>
          <div className="font-semibold capitalize">{myMembership.role}</div>
        </div>
      </div>

      <button
        onClick={onLeaveClub}
        disabled={!!actionLoading}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
      >
        {actionLoading === 'leave' ? 'Leaving...' : 'Leave Club'}
      </button>

      {isCreator && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            As the club creator, you have additional administrative privileges.
          </p>
          <button
            onClick={onDeleteClub}
            disabled={!!actionLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 text-sm"
          >
            {actionLoading === 'delete' ? 'Loading...' : 'Delete Club'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MembershipActions;
