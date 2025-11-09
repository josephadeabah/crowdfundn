// app/components/pagination/Pagination.tsx
import React from 'react';
import { Button } from '@/app/components/button/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number; // Made optional
  perPage?: number; // Made optional
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void; // Made optional
  showPerPageSelector?: boolean; // Made optional
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  perPage,
  onPageChange,
  onPerPageChange,
  showPerPageSelector = false,
}) => {
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(event.target.value, 10);
    if (onPerPageChange) {
      onPerPageChange(newPerPage);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4">
      <div className="flex items-center gap-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
          {totalCount !== undefined && (
            <span className="text-gray-400 ml-2">
              ({totalCount} total items)
            </span>
          )}
        </span>

        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>

      {showPerPageSelector && onPerPageChange && (
        <div className="flex items-center gap-2">
          <label htmlFor="perPage" className="text-sm text-gray-600">
            Show:
          </label>
          <select
            id="perPage"
            value={perPage}
            onChange={handlePerPageChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
