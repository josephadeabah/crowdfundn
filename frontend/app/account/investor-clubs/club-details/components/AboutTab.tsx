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

  // Helper function to truncate long text
  const truncateText = (text: string, maxLength: number = 200): string => {
    if (!text) return 'No description available.';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="space-y-6">
      {/* About Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          About This Club
        </h3>
        <p className="text-gray-700 leading-relaxed break-words">
          {truncateText(club.mission || 'No description available.')}
        </p>
      </div>

      {/* Stats Grid - Improved for mobile */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 min-w-0">
          <div className="text-xs xs:text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
            Club Balance
          </div>
          <div className="text-lg xs:text-xl font-bold text-emerald-700 whitespace-nowrap overflow-hidden text-ellipsis">
            {formatCurrency(club.financials.current_balance, club.currency)}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 min-w-0">
          <div className="text-xs xs:text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
            Min Contribution
          </div>
          <div className="text-lg xs:text-xl font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
            {formatCurrency(club.minimum_monthly_contribution, club.currency)}
            <span className="text-sm font-normal">/month</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 min-w-0">
          <div className="text-xs xs:text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
            Members
          </div>
          <div className="text-lg xs:text-xl font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
            {club.current_members_count}/{club.max_members}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 min-w-0">
          <div className="text-xs xs:text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
            Total Invested
          </div>
          <div className="text-lg xs:text-xl font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
            {formatCurrency(totalInvested, club.currency)}
          </div>
        </div>
      </div>

      {/* Investment Focus */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm xs:text-base">
          Investment Focus
        </h4>
        <p className="text-gray-700 break-words">
          {deslugify(club.investment_focus) || 'General investments'}
        </p>
      </div>

      {/* Additional Club Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm xs:text-base">
            Club Type
          </h4>
          <p className="text-gray-700 capitalize">
            {club.club_type || 'Not specified'}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm xs:text-base">
            Currency
          </h4>
          <p className="text-gray-700 uppercase">
            {club.currency || 'USD'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;