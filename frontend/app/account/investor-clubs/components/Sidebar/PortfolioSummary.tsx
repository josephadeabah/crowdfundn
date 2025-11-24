// app/account/investor-clubs/components/Sidebar/PortfolioSummary.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, BarChart3 } from 'lucide-react';
import { ClubInvestmentPortfolio } from '../../clubTypes';

interface PortfolioSummaryProps {
  portfolio: ClubInvestmentPortfolio | null;
  formatCurrency: (amount: number, currency?: string) => string;
  clubCurrency?: string; // Add club currency prop
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  portfolio,
  formatCurrency,
  clubCurrency = 'USD', // Default to USD if not provided
}) => {
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
            {formatCurrency(portfolio.total_invested, clubCurrency)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm lg:text-base">
            Current Value
          </span>
          <span className="font-semibold text-sm lg:text-base">
            {formatCurrency(portfolio.total_value, clubCurrency)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm lg:text-base">
            Total Returns
          </span>
          <span
            className={`font-semibold text-xs lg:text-sm ${
              portfolio.total_return >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(portfolio.total_return, clubCurrency)} (
            {portfolio.return_percentage}%)
          </span>
        </div>

        {/* Additional Portfolio Metrics */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={12} />
              Active Investments
            </span>
            <span>{portfolio.active_investments}</span>
          </div>

          {portfolio.campaigns_invested && portfolio.campaigns_invested > 0 && (
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <BarChart3 size={12} />
                Ventures
              </span>
              <span>{portfolio.campaigns_invested}</span>
            </div>
          )}

          {portfolio.successful_count && portfolio.successful_count > 0 && (
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Successful</span>
              <span className="text-green-600">
                {portfolio.successful_count}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Currency indicator - same as ClubStats */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Currency: {clubCurrency}
          <span className="ml-1 text-emerald-600">• Live Portfolio Data</span>
        </div>
      </div>
    </motion.div>
  );
};
