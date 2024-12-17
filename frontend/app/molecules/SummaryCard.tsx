'use client';

import React from 'react';
import { useAuth } from '../context/auth/AuthContext';

const SummaryCard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full bg-green-600 text-white py-4 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex Container */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left Section */}
          <div className="text-center md:text-left">
            <h2 className="text-lg md:text-xl font-semibold leading-tight">
              Support, Empower, Thrive with Bantu Hive
            </h2>
            <p className="mt-1 text-sm md:text-base opacity-90">
              Raise money when you need, fund, or support causes you care about.
              Reach donors, and make a difference.
            </p>
          </div>

          {/* Right Section - Buttons */}
          <div className="flex space-x-4">
            <a
              href={`${user ? '/account/dashboard/create' : '/auth/register'}`}
              className="inline-block px-4 py-2 bg-white text-gray-600 font-medium text-sm rounded-md shadow-sm hover:bg-gray-100 transition"
              style={{ pointerEvents: 'auto' }}
            >
              Get Started
            </a>
            <a
              href="#categories"
              className="inline-block px-4 py-2 bg-white text-gray-600 font-medium text-sm rounded-md shadow-sm hover:bg-gray-100 transition"
              style={{ pointerEvents: 'auto' }}
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
