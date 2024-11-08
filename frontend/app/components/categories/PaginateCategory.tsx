import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onLoading: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onLoading,
  onPreviousPage,
  onNextPage,
}) => (
  <div className="flex justify-between items-center mt-4">
    <button
      onClick={onPreviousPage}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
    >
      {onLoading ? 'Loading...' : 'Previous'}
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={onNextPage}
      disabled={currentPage === totalPages}
      className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
    >
      {onLoading ? 'Loading...' : 'Next'}
    </button>
  </div>
);

export default Pagination;
