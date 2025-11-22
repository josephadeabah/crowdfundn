// app/account/investor-clubs/club-details/components/AboutTab.tsx
import React from 'react';
import { Club } from '../../clubTypes';
import { deslugify } from '@/app/utils/helpers/categories';
import { TabComponentProps } from '../types/club-details-types';

const AboutTab: React.FC<
  Omit<TabComponentProps, 'onFeatureClick' | 'onTabChange'>
> = ({ club, portfolio }) => {
  const formatCurrency = (
    amount: number,
    currency: string = club.currency || 'USD',
  ) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalInvested =
    portfolio?.total_invested || club?.financials?.total_invested || 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          About This Club
        </h3>
        <p className="text-gray-700 leading-relaxed break-words">
          {club.mission || 'No description available.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600 truncate">Club Balance</div>
          <div className="text-lg sm:text-xl font-bold text-emerald-700 truncate" title={formatCurrency(club.financials.current_balance, club.currency)}>
            {formatCurrency(club.financials.current_balance, club.currency)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600 truncate">Min Contribution</div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 truncate" title={`${formatCurrency(club.minimum_monthly_contribution, club.currency)}/month`}>
            {formatCurrency(club.minimum_monthly_contribution, club.currency)}
            <span className="text-sm font-normal">/month</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600 truncate">Members</div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            {club.current_members_count}/{club.max_members}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600 truncate">Total Invested</div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 truncate" title={formatCurrency(totalInvested, club.currency)}>
            {formatCurrency(totalInvested, club.currency)}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Investment Focus</h4>
        <p className="text-gray-700 break-words">
          {deslugify(club.investment_focus) || 'General investments'}
        </p>
      </div>
    </div>
  );
};

export default AboutTab;