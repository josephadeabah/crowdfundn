import React from 'react';
import { motion } from 'framer-motion';

interface CreateClubCardProps {
  onCreateClub: () => void;
}

export const CreateClubCard: React.FC<CreateClubCardProps> = ({
  onCreateClub,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-4 lg:p-6 shadow-sm text-white"
    >
      <h3 className="text-lg font-semibold mb-2">Start a New Club</h3>
      <p className="text-emerald-100 text-xs lg:text-sm mb-3 lg:mb-4">
        Create your own investment club and invite others to join
      </p>
      <button
        onClick={onCreateClub}
        className="w-full px-3 lg:px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 font-medium text-sm lg:text-base transition-colors"
      >
        Create New Club
      </button>
    </motion.div>
  );
};
