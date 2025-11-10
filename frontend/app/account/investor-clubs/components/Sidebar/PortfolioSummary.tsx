import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface PortfolioSummaryProps {
  portfolio: any;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  portfolio,
  formatCurrency,
}) => {
  if (!portfolio) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm"
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
            {formatCurrency(portfolio.total_invested)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm lg:text-base">
            Current Value
          </span>
          <span className="font-semibold text-sm lg:text-base">
            {formatCurrency(portfolio.current_value)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm lg:text-base">
            Total Returns
          </span>
          <span
            className={`font-semibold text-sm lg:text-base ${
              portfolio.total_returns >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(portfolio.total_returns)} (
            {portfolio.return_percentage}%)
          </span>
        </div>
      </div>
    </motion.div>
  );
};
