'use client';

import * as React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaSearch } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { Popover, PopoverTrigger, PopoverContent } from '@/app/components/popover/Popover'; // Adjust the import path

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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleClose}
        />
      )}

      <div className="relative">
        <PopoverTrigger asChild>
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
        </PopoverTrigger>
      </div>

      <PopoverContent
        className="w-full max-w-3xl p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
        style={{ maxHeight: '50vh', overflowY: 'auto' }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results</h3>
          <div className="space-y-2">
            {/* Example Search Cards */}
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="text-sm">Search Result 1</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="text-sm">Search Result 2</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Filters</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
                Filter 1
              </button>
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
                Filter 2
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}