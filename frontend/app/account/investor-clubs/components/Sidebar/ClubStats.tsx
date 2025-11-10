import React from 'react';
import { motion } from 'framer-motion';
import { Club } from '../../clubTypes';

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
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-3 lg:mb-4">Club Stats</h3>
      <div className="grid grid-cols-2 gap-3 lg:gap-4 text-center">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-lg lg:text-2xl font-bold text-emerald-700">
            {club.current_members_count}
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Members</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-lg lg:text-2xl font-bold text-emerald-700">
            {investmentsCount}
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Investments</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-lg lg:text-2xl font-bold text-emerald-700">
            {formatCurrency(club.financials.total_contributions)}
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Total Raised</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-lg lg:text-2xl font-bold text-emerald-700">
            {formatCurrency(club.financials.total_invested)}
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Total Invested</div>
        </div>
      </div>
    </motion.div>
  );
};
