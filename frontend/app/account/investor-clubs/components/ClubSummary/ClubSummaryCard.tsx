// app/account/investor-clubs/components/ClubSummary/ClubSummaryCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign } from 'lucide-react';
import { Club } from '../../clubTypes';

interface ClubSummaryCardProps {
  club: Club;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const ClubSummaryCard: React.FC<ClubSummaryCardProps> = ({
  club,
  formatCurrency,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-sm p-4 lg:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3 lg:gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-lg lg:text-2xl flex-shrink-0">
            {club.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
              {club.name}
            </h2>
            <p className="text-gray-600 mt-1 text-sm lg:text-base line-clamp-2">
              {club.mission}
            </p>
            <div className="flex flex-wrap gap-2 mt-3 text-xs lg:text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {club.current_members_count} members
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <DollarSign size={14} />
                Min:{' '}
                {formatCurrency(
                  club.minimum_monthly_contribution,
                  club.currency,
                )}
              </span>
              <span className="hidden sm:inline">•</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  club.club_type === 'public'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {club.club_type}
              </span>
            </div>
          </div>
        </div>
        <div className="sm:text-left sm:min-w-[140px] lg:min-w-[160px]">
          <div className="flex items-baseline gap-1">
            <div className="text-xl lg:text-3xl font-bold text-emerald-700 break-words">
              {formatCurrency(club.financials.current_balance, club.currency)}
            </div>
          </div>
          <div className="text-xs lg:text-sm text-gray-500 font-bold">
            Club Balance
          </div>
        </div>
      </div>
    </motion.div>
  );
};
