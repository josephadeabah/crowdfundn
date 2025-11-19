// app/account/investor-clubs/components/Sidebar/ClubStats.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Club } from '../../clubTypes';
import InfoTooltip from '@/app/components/tooltip/tooltip';

interface ClubStatsProps {
  club: Club;
  investmentsCount: number;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const ClubStats: React.FC<ClubStatsProps> = ({
  club,
  investmentsCount,
  formatCurrency,
}) => {
  // FIXED: Use actual investment count from portfolio data
  const actualInvestmentsCount = investmentsCount;

  // Format large numbers with abbreviations
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format currency for display with proper scaling
  const formatCurrencyForDisplay = (
    amount: number,
    currency: string,
  ): string => {
    if (amount >= 1000000) {
      return formatCurrency(amount / 1000000, currency) + 'M';
    } else if (amount >= 1000) {
      return formatCurrency(amount / 1000, currency) + 'K';
    }
    return formatCurrency(amount, currency);
  };

  const stats = [
    {
      id: 'members-stat',
      displayValue: formatNumber(club.current_members_count),
      fullValue: club.current_members_count.toLocaleString(),
      label: 'Members',
      type: 'number',
    },
    {
      id: 'investments-stat',
      displayValue: formatNumber(actualInvestmentsCount),
      fullValue: actualInvestmentsCount.toLocaleString(),
      label: 'Investments',
      type: 'number',
    },
    {
      id: 'raised-stat',
      displayValue: formatCurrencyForDisplay(
        club.financials.total_contributions,
        club.currency,
      ),
      fullValue: formatCurrency(
        club.financials.total_contributions,
        club.currency,
      ),
      label: 'Total Raised',
      type: 'currency',
    },
    {
      id: 'invested-stat',
      displayValue: formatCurrencyForDisplay(
        club.financials.total_invested,
        club.currency,
      ),
      fullValue: formatCurrency(club.financials.total_invested, club.currency),
      label: 'Total Invested',
      type: 'currency',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-sm p-4 lg:p-6"
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h3 className="text-lg font-semibold">Club Stats</h3>
        <InfoTooltip
          id="club-stats-info"
          content="Displayed values are abbreviated for better readability. Hover over the info icons to see full values."
          className="text-gray-400"
          iconSize={14}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-gray-50 rounded-lg p-3 text-center relative"
          >
            {/* Value with Tooltip */}
            <div className="flex items-center justify-center gap-1 mb-1">
              <div
                className={`font-bold text-emerald-700 break-words leading-tight min-h-[2rem] flex items-center ${
                  stat.type === 'currency'
                    ? 'text-sm lg:text-base'
                    : 'text-lg lg:text-xl'
                }`}
              >
                {stat.displayValue}
              </div>
              <InfoTooltip
                id={stat.id}
                content={`Full value: ${stat.fullValue}`}
                className="text-gray-400"
                iconSize={12}
              />
            </div>

            {/* Label */}
            <div className="text-xs lg:text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Currency indicator */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Currency: {club.currency}
        </div>
      </div>
    </motion.div>
  );
};