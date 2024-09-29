import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ totalPages = 10, initialPage = 1 }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inputPage, setInputPage] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (!isNaN(page)) {
      handlePageChange(page);
      setInputPage('');
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`${currentPage === i ? 'bg-theme-color-primary text-white' : 'bg-white text-theme-color-primary'} px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:bg-theme-color-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-theme-color-primary focus:ring-opacity-50`}
            aria-label={`Page ${i}`}
          >
            {i}
          </button>,
        );
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisibleButtons / 2),
      );
      const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

      if (startPage > 1) {
        buttons.push(
          <button
            key="start-ellipsis"
            className="px-4 py-2 text-theme-color-primary"
            aria-label="More pages"
          >
            ...
          </button>,
        );
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`${currentPage === i ? 'bg-theme-color-primary text-white' : 'bg-white text-theme-color-primary'} px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:bg-theme-color-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-theme-color-primary focus:ring-opacity-50`}
            aria-label={`Page ${i}`}
          >
            {i}
          </button>,
        );
      }

      if (endPage < totalPages) {
        buttons.push(
          <button
            key="end-ellipsis"
            className="px-4 py-2 text-theme-color-primary"
            aria-label="More pages"
          >
            ...
          </button>,
        );
      }
    }

    return buttons;
  };

  return (
    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 rounded-full shadow-md transition-all duration-300 bg-white text-theme-color-primary hover:bg-theme-color-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-theme-color-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <FiChevronLeft className="mr-2" /> Previous
      </button>

      <div className="flex flex-wrap justify-center space-x-2">
        {renderPageButtons()}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 rounded-full shadow-md transition-all duration-300 bg-white text-theme-color-primary hover:bg-theme-color-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-theme-color-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        Next <FiChevronRight className="ml-2" />
      </button>

      <form
        onSubmit={handleInputSubmit}
        className="flex items-center space-x-2"
      >
        <label htmlFor="pageInput" className="sr-only">
          Go to page
        </label>
        <input
          id="pageInput"
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          className="w-16 px-2 py-1 text-center border border-theme-color-primary rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color-primary focus:ring-opacity-50"
          placeholder="Page"
          aria-label="Go to page"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md shadow-md transition-all duration-300 bg-theme-color-primary text-white hover:bg-theme-color-primary-dark focus:outline-none focus:ring-2 focus:ring-theme-color-primary focus:ring-opacity-50"
        >
          Go
        </button>
      </form>

      <p className="text-sm text-theme-color-neutral">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
};

export default Pagination;
