// components/FilterButton.tsx
import React from 'react';
import { FaFilter } from 'react-icons/fa';
import { Button } from '../button/Button';

type FilterButtonProps = {
  onClick: () => void; // Callback function to handle button click
};

const FilterButton: React.FC<FilterButtonProps> = ({ onClick }) => {
  return (
    <Button
      className="p-3 flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
      onClick={onClick}
    >
      <FaFilter />
      Filter
    </Button>
  );
};

export default FilterButton;
