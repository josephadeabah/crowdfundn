// app/account/investor-clubs/components/Sidebar/ClubStats.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Club, ClubInvestmentPortfolio } from '../../clubTypes';
import InfoTooltip from '@/app/components/tooltip/tooltip';

interface ClubStatsProps {
  club: Club;
  investmentsCount: number;
  portfolio: ClubInvestmentPortfolio | null;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const ClubStats: React.FC<ClubStatsProps> = ({
  club,
  investmentsCount,
  portfolio,
  formatCurrency,
}) => {
  // FIXED: Use actual investment count from portfolio data with safe fallback
  const actualInvestmentsCount = investmentsCount || 0;

  // FIXED: Use portfolio total invested if available, otherwise fallback to club financials
  const totalInvested =
    portfolio?.total_invested || club?.financials?.total_invested || 0;

  // FIXED: Safe number formatting
  const formatNumber = (num: number | undefined | null): string => {
    // Handle undefined, null, or NaN values
    const safeNum = num || 0;

    if (safeNum >= 1000000) {
      return (safeNum / 1000000).toFixed(1) + 'M';
    } else if (safeNum >= 1000) {
      return (safeNum / 1000).toFixed(1) + 'K';
    }
    return safeNum.toString();
  };

  // FIXED: Safe currency formatting
  const formatCurrencyForDisplay = (
    amount: number | undefined | null,
    currency: string,
  ): string => {
    // Handle undefined, null, or NaN values
    const safeAmount = amount || 0;

    if (safeAmount >= 1000000) {
      return formatCurrency(safeAmount / 1000000, currency) + 'M';
    } else if (safeAmount >= 1000) {
      return formatCurrency(safeAmount / 1000, currency) + 'K';
    }
    return formatCurrency(safeAmount, currency);
  };

  // FIXED: Updated stats with portfolio total invested
  const stats = [
    {
      id: 'members-stat',
      displayValue: formatNumber(club?.current_members_count),
      fullValue: (club?.current_members_count || 0).toLocaleString(),
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
        club?.financials?.total_contributions,
        club?.currency || 'USD',
      ),
      fullValue: formatCurrency(
        club?.financials?.total_contributions || 0,
        club?.currency || 'USD',
      ),
      label: 'Total Raised',
      type: 'currency',
    },
    {
      id: 'invested-stat',
      displayValue: formatCurrencyForDisplay(
        totalInvested,
        club?.currency || 'USD',
      ),
      fullValue: formatCurrency(totalInvested, club?.currency || 'USD'),
      label: 'Total Invested',
      type: 'currency',
      tooltip: portfolio ? 'From portfolio data' : 'From club financials',
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
                content={
                  stat.tooltip
                    ? `Full value: ${stat.fullValue} (${stat.tooltip})`
                    : `Full value: ${stat.fullValue}`
                }
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
          Currency: {club?.currency || 'USD'}
          {portfolio && (
            <span className="ml-1 text-emerald-600">• Live Portfolio Data</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
