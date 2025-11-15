import React from 'react';
import { motion } from 'framer-motion';
import { ClubInvestment } from '../../clubTypes';

interface RecentInvestmentsSectionProps {
  investments: ClubInvestment[];
  formatCurrency: (amount: number, currency?: string) => string;
}

export const RecentInvestmentsSection: React.FC<
  RecentInvestmentsSectionProps
> = ({ investments, formatCurrency }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h3 className="text-lg lg:text-xl font-semibold">Recent Investments</h3>
        <span className="text-xs lg:text-sm text-gray-500">
          {0} total
        </span>
      </div>
      <div className="bg-white rounded-sm divide-y">
        {/* {investments?.slice(0, 5)?.map((investment) => (
          <div key={investment.id} className="p-3 lg:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm lg:text-base line-clamp-2">
                  {investment?.campaign?.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs lg:text-sm text-gray-600">
                    {formatCurrency(investment?.investment_amount)}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      investment.status === 'executed'
                        ? 'bg-green-100 text-green-800'
                        : investment.status === 'voting'
                          ? 'bg-yellow-100 text-yellow-800'
                          : investment.status === 'approved'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {investment.status}
                  </span>
                </div>
              </div>
              <div className="text-right text-xs lg:text-sm text-gray-500 whitespace-nowrap">
                {new Date(investment.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))} */}
      </div>
    </motion.div>
  );
};
