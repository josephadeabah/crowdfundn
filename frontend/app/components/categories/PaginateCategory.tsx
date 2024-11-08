import React from 'react';
import { FaSpinner } from 'react-icons/fa'; // Import spinner from react-icons
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
        <FaSpinner
          className="animate-spin text-gray-600 dark:text-gray-300"
          size={24}
        />
      </div>
    ) : (
      // Show pagination controls if not loading
      <>
        <button
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 rounded-full shadow-md transition-all duration-300 bg-white dark:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronLeft className="mr-2" /> Previous
        </button>
        <span className="text-gray-900 dark:text-gray-100">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 rounded-full shadow-md transition-all duration-300 bg-white dark:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <FiChevronRight className="ml-2" />
        </button>
      </>
    )}
  </div>
);

export default Pagination;
