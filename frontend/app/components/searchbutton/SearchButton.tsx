'use client';

import * as React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaSearch } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

export default function SearchBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      {/* Search Bar */}
      <div
        className={twMerge(
          'flex items-center p-2 rounded-full transition-all duration-300 cursor-pointer overflow-hidden',
          isOpen ? 'w-72 bg-white shadow-lg' : 'w-10 bg-transparent',
        )}
        onClick={handleSearchClick}
      >
        <FaSearch className="h-5 w-5 text-gray-500" />
        {isOpen && (
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 flex-1 outline-none bg-transparent text-gray-900 dark:text-white"
          />
        )}
        {isOpen && (
          <XMarkIcon
            className="h-5 w-5 text-gray-500 cursor-pointer"
            onClick={handleClose}
          />
        )}
      </div>

      {/* Custom Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleClose}
          />

          {/* Dropdown Content */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="w-full h-1/2 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
              style={{ pointerEvents: 'auto' }}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {Array.from({ length: 20 }, (_, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center text-gray-700 dark:text-gray-50 font-semibold"
                    >
                      Item {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}