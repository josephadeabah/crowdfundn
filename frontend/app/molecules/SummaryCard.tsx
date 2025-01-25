'use client';

import React from 'react';
import Avatar from '../components/avatar/Avatar';

// SummaryCard Component
const SummaryCard: React.FC = () => {
  return (
    <div
      className="w-full bg-green-50 text-green-600 dark:bg-gray-800 dark:text-green-400 p-6 rounded-lg shadow-md"
      style={{ pointerEvents: 'auto', position: 'relative' }}
    >
      <div className="flex flex-col items-center md:items-start space-y-4">
        <h2
          className="text-green-600 dark:text-green-400 font-bold leading-tight text-center md:text-left"
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}
        >
          Support, Empower, Thrive with Bantu Hive
        </h2>
        <h3 className="text-gray-700 dark:text-gray-200 text-center md:text-left">
          Raise money when you need, fund, or support causes you care about.
          Reach donors, and make a difference.
        </h3>
      </div>
    </div>
  );
};

// Leaderboard Component
const Leaderboard: React.FC = () => {
  const topDonors = [
    { name: 'John Doe', amount: '$1,000' },
    { name: 'Jane Smith', amount: '$800' },
    { name: 'Alice Johnson', amount: '$600' },
    { name: 'Bob Brown', amount: '$500' },
    { name: 'Charlie Davis', amount: '$400' },
    { name: 'Eve White', amount: '$300' },
    { name: 'Frank Green', amount: '$200' },
    { name: 'Grace Black', amount: '$100' },
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Top Contributors</h2>

      {/* Stacked Avatar Group */}
      <div className="flex -space-x-3 mb-6">
        {topDonors.slice(0, 5).map((donor, index) => (
          <div
            key={index}
            className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
            style={{ zIndex: topDonors.length - index }}
          >
            <Avatar name={donor.name} size="md" />
          </div>
        ))}
        {topDonors.length > 5 && (
          <div className="relative flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
            +{topDonors.length - 5}
          </div>
        )}
      </div>

      {/* Donor List */}
      <ul>
        {topDonors.map((donor, index) => (
          <li
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700"
          >
            {/* Left Side: Avatar and Donor Name */}
            <div className="flex items-center space-x-4">
              <Avatar name={donor.name} size="sm" />
              <span className="text-gray-600 dark:text-gray-400">
                {donor.name}
              </span>
            </div>

            {/* Right Side: Donation Amount */}
            <span className="font-semibold">{donor.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Two-Column Layout
const TwoColumnLayout: React.FC = () => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 p-6">
      {/* Left Column - SummaryCard */}
      <div className="w-full md:w-1/3">
        <SummaryCard />
      </div>

      {/* Right Column - Leaderboard */}
      <div className="w-full md:w-2/3">
        <Leaderboard />
      </div>
    </div>
  );
};

export default TwoColumnLayout;