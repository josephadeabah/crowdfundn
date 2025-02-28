// components/FilterButton.tsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Button } from '../button/Button';

// components/FilterButton.tsx
type FilterButtonProps = {
  onClick: () => void;
  isActive?: boolean;
};

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, isActive }) => {
  return (
    <Button
      className={`flex items-center gap-2 ${
        isActive ? 'bg-gray-200' : 'bg-gray-100'
      } py-1 px-4 bg-white dark:bg-gray-900 dark:text-gray-50 rounded-full focus-visible:outline-none focus:ring-0 hover:outline-none hover:bg-gray-100 hover:text-gray-700 hover:scale-105 transition-transform duration-300`}
      onClick={onClick}
    >
      <FaSearch />
      Search
    </Button>
  );
};

export default FilterButton;
