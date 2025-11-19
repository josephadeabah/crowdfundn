// app/account/investor-clubs/components/Sidebar/PortfolioSummary.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, BarChart3 } from 'lucide-react';
import { ClubInvestmentPortfolio } from '../../clubTypes';

interface PortfolioSummaryProps {
  portfolio: ClubInvestmentPortfolio | null;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  portfolio,
  formatCurrency,
}) => {
  // FIXED: Safe access to portfolio properties
  const safePortfolio = portfolio || {
    total_invested: 0,
    total_value: 0,
    total_return: 0,
    return_percentage: 0,
    active_investments: 0,
    investments: [],
    campaigns_invested: 0,
    successful_count: 0,
  };

  if (!portfolio) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-sm p-4 lg:p-6"
      >
        <div className="flex items-center gap-2 mb-3 lg:mb-4">
          <TrendingUp size={18} className="text-emerald-600" />
          <h3 className="text-lg font-semibold">Portfolio Summary</h3>
        </div>
        <div className="text-center text-gray-500 py-4">
          <p className="text-sm">No portfolio data available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-sm p-4 lg:p-6"
    >
      <div className="flex items-center gap-2 mb-3 lg:mb-4">
        <TrendingUp size={18} className="text-emerald-600" />
        <h3 className="text-lg font-semibold">Portfolio Summary</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm lg:text-base">
            Total Invested
          </span>
          <span className="font-semibold text-sm lg:text-base">
            {formatCurrency(safePortfolio.total_invested)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm lg:text-base">
            Current Value
          </span>
          <span className="font-semibold text-sm lg:text-base">
            {formatCurrency(safePortfolio.total_value)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm lg:text-base">
            Total Returns
          </span>
          <span
            className={`font-semibold text-sm lg:text-base ${
              safePortfolio.total_return >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {formatCurrency(safePortfolio.total_return)} (
            {/* FIXED: Safe .toFixed() call */}
            {typeof safePortfolio.return_percentage === 'number'
              ? safePortfolio.return_percentage.toFixed(2)
              : '0.00'}
            %)
          </span>
        </div>

        {/* Additional Portfolio Metrics */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={12} />
              Active Investments
            </span>
            <span>{safePortfolio.active_investments}</span>
          </div>

          {safePortfolio.campaigns_invested && (
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <BarChart3 size={12} />
                Campaigns
              </span>
              <span>{safePortfolio.campaigns_invested}</span>
            </div>
          )}

          {safePortfolio.successful_count && (
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Successful</span>
              <span className="text-green-600">
                {safePortfolio.successful_count}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
