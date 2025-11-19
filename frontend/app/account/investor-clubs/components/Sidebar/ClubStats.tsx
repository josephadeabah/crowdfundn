// app/account/investor-clubs/components/Sidebar/ClubStats.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Club } from '../../clubTypes';
import InfoTooltip from '@/app/components/tooltip/tooltip';

interface ClubStatsProps {
  club: Club | null;
  investmentsCount: number;
  formatCurrency: (amount: number, currency?: string) => string;
}

// SUPER SAFE number formatting
const superSafeFormatNumber = (num: any): string => {
  try {
    const safeNum = Number(num) || 0;
    
    if (safeNum >= 1000000) {
      return (safeNum / 1000000).toFixed(1) + 'M';
    } else if (safeNum >= 1000) {
      return (safeNum / 1000).toFixed(1) + 'K';
    }
    return safeNum.toString();
  } catch (error) {
    return '0';
  }
};

// SUPER SAFE currency formatting
const superSafeFormatCurrencyForDisplay = (
  amount: any,
  currency: string,
  formatCurrency: (amount: number, currency?: string) => string
): string => {
  try {
    const safeAmount = Number(amount) || 0;
    
    if (safeAmount >= 1000000) {
      return formatCurrency(safeAmount / 1000000, currency) + 'M';
    } else if (safeAmount >= 1000) {
      return formatCurrency(safeAmount / 1000, currency) + 'K';
    }
    return formatCurrency(safeAmount, currency);
  } catch (error) {
    return formatCurrency(0, currency);
  }
};

export const ClubStats: React.FC<ClubStatsProps> = ({
  club,
  investmentsCount,
  formatCurrency,
}) => {
  // SUPER SAFE: Handle all possible undefined cases
  const safeClub = club || {
    current_members_count: 0,
    currency: 'USD',
    financials: {
      total_contributions: 0,
      total_invested: 0,
      current_balance: 0
    }
  };

  const safeInvestmentsCount = Number(investmentsCount) || 0;
  const safeMembersCount = Number(safeClub.current_members_count) || 0;
  const safeContributions = Number(safeClub.financials?.total_contributions) || 0;
  const safeInvested = Number(safeClub.financials?.total_invested) || 0;
  const safeCurrency = safeClub.currency || 'USD';

  const stats = [
    {
      id: 'members-stat',
      displayValue: superSafeFormatNumber(safeMembersCount),
      fullValue: safeMembersCount.toLocaleString(),
      label: 'Members',
      type: 'number',
    },
    {
      id: 'investments-stat',
      displayValue: superSafeFormatNumber(safeInvestmentsCount),
      fullValue: safeInvestmentsCount.toLocaleString(),
      label: 'Investments',
      type: 'number',
    },
    {
      id: 'raised-stat',
      displayValue: superSafeFormatCurrencyForDisplay(
        safeContributions,
        safeCurrency,
        formatCurrency
      ),
      fullValue: formatCurrency(safeContributions, safeCurrency),
      label: 'Total Raised',
      type: 'currency',
    },
    {
      id: 'invested-stat',
      displayValue: superSafeFormatCurrencyForDisplay(
        safeInvested,
        safeCurrency,
        formatCurrency
      ),
      fullValue: formatCurrency(safeInvested, safeCurrency),
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
          Currency: {safeCurrency}
        </div>
      </div>
    </motion.div>
  );
};