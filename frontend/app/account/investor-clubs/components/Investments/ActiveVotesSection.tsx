import React from 'react';
import { motion } from 'framer-motion';
import { ClubInvestment } from '../../clubTypes';

interface ActiveVotesSectionProps {
  activeVotes: ClubInvestment[];
  onVote: (investmentId: string, voteType: string) => void;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const ActiveVotesSection: React.FC<ActiveVotesSectionProps> = ({
  activeVotes,
  onVote,
  formatCurrency,
}) => {
  if (activeVotes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">
        Active Votes
      </h3>
      <div className="space-y-3 lg:space-y-4">
        {activeVotes.map((investment) => (
          <div
            key={investment.id}
            className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 shadow-sm"
          >
            <h4 className="font-semibold text-base lg:text-lg mb-2 line-clamp-2">
              {investment.campaign.title}
            </h4>
            <p className="text-gray-600 mb-4 text-sm lg:text-base">
              Investment: {formatCurrency(investment.investment_amount)}
            </p>
            <div className="flex gap-2 lg:gap-3">
              <button
                onClick={() => onVote(investment.id, 'invest')}
                className="flex-1 px-3 lg:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm lg:text-base"
              >
                Vote Yes
              </button>
              <button
                onClick={() => onVote(investment.id, 'pass')}
                className="flex-1 px-3 lg:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm lg:text-base"
              >
                Vote No
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
