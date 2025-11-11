import React from 'react';
import { Target } from 'lucide-react';

interface ClubProfileCardProps {
  clubRiskProfile: any;
  currentClub: any;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const ClubProfileCard: React.FC<ClubProfileCardProps> = ({
  clubRiskProfile,
  currentClub,
  formatCurrency,
}) => {
  if (!clubRiskProfile) return null;

  return (
    <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-sm">
      <div className="flex items-center gap-2 mb-2">
        <Target className="text-emerald-600" size={16} />
        <span className="text-sm font-medium text-emerald-800">
          Club Profile
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <div className="text-gray-600">Risk Tolerance</div>
          <div className="font-semibold text-emerald-700 capitalize">
            {clubRiskProfile.risk_tolerance}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Focus</div>
          <div className="font-semibold text-emerald-700 capitalize">
            {clubRiskProfile.investment_focus || 'Diversified'}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Members</div>
          <div className="font-semibold text-emerald-700">
            {currentClub.current_members_count}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Balance</div>
          <div className="font-semibold text-emerald-700">
            {formatCurrency(currentClub.financials.current_balance)}
          </div>
        </div>
      </div>
    </div>
  );
};
