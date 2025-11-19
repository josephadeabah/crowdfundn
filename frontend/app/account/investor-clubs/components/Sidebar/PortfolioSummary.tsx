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
  // FIXED: Transform portfolio data to match frontend expectations
  const transformPortfolioData = (portfolio: any) => {
    if (!portfolio) return null;

    // Calculate values from investments if not provided
    const investments = portfolio.investments || [];
    const successfulInvestments = investments.filter((inv: any) => 
      inv.status === 'successful' || inv.status === 'executed'
    );
    
    const totalInvested = successfulInvestments.reduce((sum: number, inv: any) => 
      sum + (parseFloat(inv.investment_amount) || 0), 0
    );
    
    const totalValue = successfulInvestments.reduce((sum: number, inv: any) => 
      sum + (parseFloat(inv.current_value) || parseFloat(inv.investment_amount) || 0), 0
    );
    
    const totalReturn = totalValue - totalInvested;
    const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    return {
      total_invested: portfolio.total_invested || totalInvested,
      total_value: portfolio.total_value || totalValue,
      total_return: portfolio.total_return || totalReturn,
      return_percentage: portfolio.return_percentage || returnPercentage,
      active_investments: portfolio.active_investments || successfulInvestments.length,
      investments: investments,
      campaigns_invested: portfolio.campaigns_invested || new Set(successfulInvestments.map((inv: any) => inv.campaign_id)).size,
      successful_count: portfolio.successful_count || successfulInvestments.length
    };
  };

  const transformedPortfolio = transformPortfolioData(portfolio);

  if (!transformedPortfolio) {
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
            {formatCurrency(transformedPortfolio.total_invested)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm lg:text-base">
            Current Value
          </span>
          <span className="font-semibold text-sm lg:text-base">
            {formatCurrency(transformedPortfolio.total_value)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm lg:text-base">
            Total Returns
          </span>
          <span
            className={`font-semibold text-sm lg:text-base ${
              transformedPortfolio.total_return >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(transformedPortfolio.total_return)} (
            {transformedPortfolio.return_percentage.toFixed(2)}%)
          </span>
        </div>

        {/* Additional Portfolio Metrics */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={12} />
              Active Investments
            </span>
            <span>{transformedPortfolio.active_investments}</span>
          </div>

          {transformedPortfolio.campaigns_invested && (
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <BarChart3 size={12} />
                Campaigns
              </span>
              <span>{transformedPortfolio.campaigns_invested}</span>
            </div>
          )}

          {transformedPortfolio.successful_count && (
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Successful</span>
              <span className="text-green-600">
                {transformedPortfolio.successful_count}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};