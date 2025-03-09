import React from 'react';
import { Button } from '@/app/components/button/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex justify-between items-center mt-4">
      <Button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        variant="outline"
      >
        Previous
      </Button>
      <div className="text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      <Button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
