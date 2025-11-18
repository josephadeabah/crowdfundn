// app/account/investor-clubs/components/Sidebar/QuickActions.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, BarChart3, Send, Plus } from 'lucide-react';

interface QuickActionsProps {
  onMakeContribution: () => void;
  onProposeInvestment: () => void;
  onViewAnalytics: () => void;
  onTransferFunds?: () => void;
  onCreateInvestment?: () => void;
  isAdmin?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onMakeContribution,
  onProposeInvestment,
  onViewAnalytics,
  onTransferFunds,
  onCreateInvestment,
  isAdmin = false,
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
          className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-medium text-sm lg:text-base text-left flex items-center gap-2 transition-colors duration-200"
        >
          <DollarSign size={16} />
          Make Contribution
        </button>

        <button
          onClick={onCreateInvestment}
          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-400 text-gray-500 rounded-full hover:bg-gray-50 font-medium text-sm lg:text-base text-left flex items-center gap-2 transition-colors duration-200"
        >
          <Plus size={16} />
          Make Investment
        </button>

        <button
          onClick={onProposeInvestment}
          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-emerald-400 text-emerald-500 rounded-full hover:bg-emerald-50 font-medium text-sm lg:text-base text-left flex items-center gap-2 transition-colors duration-200"
        >
          <TrendingUp size={16} />
          Propose Investment
        </button>

        <button
          onClick={onTransferFunds}
          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-orange-400 text-orange-500 rounded-full hover:bg-orange-50 font-medium text-sm lg:text-base text-left flex items-center gap-2 transition-colors duration-200"
        >
          <Send size={16} />
          Withdraw Funds
        </button>

        <button
          onClick={onViewAnalytics}
          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 font-medium text-sm lg:text-base text-left flex items-center gap-2 transition-colors duration-200"
        >
          <BarChart3 size={16} />
          View Analytics
        </button>
      </div>

      {/* Admin notice */}
      {isAdmin && (
        <div className="mt-3 p-1 bg-gray-50 border border-gray-100 rounded-sm">
          <p className="text-xs text-gray-600 text-center">
            💼 You have admin access
          </p>
        </div>
      )}
    </motion.div>
  );
};
