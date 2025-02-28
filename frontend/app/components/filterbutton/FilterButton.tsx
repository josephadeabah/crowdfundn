// components/FilterButton.tsx
import React from 'react';
import { FaFilter } from 'react-icons/fa';
import { Button } from '../button/Button';

// components/FilterButton.tsx
type FilterButtonProps = {
  onClick: () => void;
  isActive?: boolean;
};

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, isActive }) => {
  return (
    <Button
      className={`p-3 flex items-center gap-2 ${
        isActive ? 'bg-gray-200' : 'bg-gray-100'
      } text-gray-700 rounded-full hover:bg-gray-200`}
      onClick={onClick}
    >
      <FaFilter />
      Filter
    </Button>
  );
};

export default FilterButton;
