import React from 'react';
import { FaSpinner } from 'react-icons/fa'; // Import spinner from react-icons

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onLoading: boolean;
  onError: string | null;
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
    {/* Show the loading spinner when onLoading is true */}
    {onLoading ? (
      <div className="flex justify-center items-center w-full">
        <FaSpinner className="animate-spin text-gray-600" size={24} />
      </div>
    ) : (
      // Show pagination controls if not loading
      <>
        <button
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </>
    )}
  </div>
);

export default Pagination;
