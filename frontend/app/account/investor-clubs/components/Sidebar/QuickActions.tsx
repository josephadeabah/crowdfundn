// app/account/investor-clubs/components/Sidebar/QuickActions.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

interface QuickActionsProps {
  onMakeContribution: () => void;
  onProposeInvestment: () => void;
  onViewAnalytics: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onMakeContribution,
  onProposeInvestment,
  onViewAnalytics,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-sm p-4 lg:p-6"
    >
      <h3 className="text-lg font-semibold mb-3 lg:mb-4">Quick Actions</h3>
      <div className="space-y-2 lg:space-y-3">
        <button
          onClick={onMakeContribution}
          className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-medium text-sm lg:text-base text-left flex items-center gap-2"
        >
          <DollarSign size={16} />
          Make Contribution
        </button>
        <button
          onClick={onProposeInvestment}
          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-emerald-400 text-emerald-500 rounded-full hover:bg-emerald-50 font-medium text-sm lg:text-base text-left flex items-center gap-2"
        >
          <TrendingUp size={16} />
          Propose Investment
        </button>
        <button
          onClick={onViewAnalytics}
          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 font-medium text-sm lg:text-base text-left flex items-center gap-2"
        >
          <BarChart3 size={16} />
          View Analytics
        </button>
      </div>
    </motion.div>
  );
};
