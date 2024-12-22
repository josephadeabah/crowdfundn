'use client';

import React from 'react';
import { useAuth } from '../context/auth/AuthContext';

const SummaryCard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div
      className="w-full bg-green-50 text-green-600 dark:bg-gray-800 dark:text-green-400 py-4"
      style={{ pointerEvents: 'auto', position: 'relative' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex Container */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left Section */}
          <div className="text-center md:text-left">
            <h1 className="text-green-600 dark:text-green-400 font-bold leading-tight">
              Support, Empower, Thrive with Bantu Hive
            </h1>
            <h3 className="mt-1 text-gray-700 dark:text-gray-200 md:text-base opacity-90">
              Raise money when you need, fund, or support causes you care about.
              Reach donors, and make a difference.
            </h3>
          </div>

          {/* Right Section - Buttons */}
          <div className="flex space-x-4 z-10">
            <a
              href={`${user ? '/account/dashboard/create' : '/auth/register'}`}
              className="inline-block px-4 py-2 bg-green-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300 font-medium text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              Get Started
            </a>
            <a
              href="#categories"
              className="inline-block px-4 py-2 bg-green-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300 font-medium text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              Explore Campaigns
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
