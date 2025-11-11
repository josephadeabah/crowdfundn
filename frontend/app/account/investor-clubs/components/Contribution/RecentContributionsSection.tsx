// app/account/investor-clubs/components/Contributions/RecentContributionsSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ClubContribution } from '../../clubTypes';

interface RecentContributionsSectionProps {
  contributions: ClubContribution[];
  formatCurrency: (amount: number, currency?: string) => string;
}

export const RecentContributionsSection: React.FC<
  RecentContributionsSectionProps
> = ({ contributions, formatCurrency }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h3 className="text-lg lg:text-xl font-semibold">Recent Contributions</h3>
        <span className="text-xs lg:text-sm text-gray-500">
          {contributions.length} total
        </span>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm divide-y">
        {contributions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-lg">💸</span>
            </div>
            <p className="text-sm">No contributions yet</p>
            <p className="text-xs mt-1">Be the first to contribute to this club!</p>
          </div>
        ) : (
          contributions.slice(0, 5).map((contribution) => (
            <div key={contribution.id} className="p-3 lg:p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm lg:text-base line-clamp-2">
                    {contribution.user.full_name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs lg:text-sm text-gray-600">
                      {formatCurrency(contribution.amount, contribution.currency)}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        contribution.status,
                      )}`}
                    >
                      {getStatusText(contribution.status)}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs lg:text-sm text-gray-500 whitespace-nowrap">
                  {new Date(contribution.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};