// components/FilterButton.tsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

// components/FilterButton.tsx
type FilterButtonProps = {
  onClick: () => void;
  isActive?: boolean;
};

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, isActive }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 ${
        isActive ? 'bg-gray-50' : 'bg-white'
      } py-1 px-4 dark:bg-gray-900 dark:text-gray-50 rounded-full focus-visible:outline-none focus:ring-0 hover:outline-none hover:bg-gray-100 hover:text-gray-700 hover:scale-105 transition-transform duration-300`}
      onClick={onClick}
    >
      <FaSearch className="text-gray-500"/>
      Search
    </motion.button>
  );
};

export default FilterButton;
