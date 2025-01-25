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
  // Mock data for Top Backers
  const topBackers = [
    { name: 'John Doe', amount: '$1,000' },
    { name: 'Jane Smith', amount: '$800' },
    { name: 'Alice Johnson', amount: '$600' },
    { name: 'Bob Brown', amount: '$500' },
    { name: 'Charlie Davis', amount: '$400' },
    { name: 'Eve White', amount: '$300' },
    { name: 'Frank Green', amount: '$200' },
    { name: 'Grace Black', amount: '$100' },
  ];

  // Mock data for Most Active Backers
  const mostActiveBackers = [
    { name: 'John Doe', contributions: 12 },
    { name: 'Jane Smith', contributions: 10 },
    { name: 'Alice Johnson', contributions: 8 },
    { name: 'Bob Brown', contributions: 7 },
    { name: 'Charlie Davis', contributions: 6 },
  ];

  // Mock data for Top Backers with Most Rewards
  const topBackersWithRewards = [
    { name: 'John Doe', rewards: 5 },
    { name: 'Jane Smith', rewards: 4 },
    { name: 'Alice Johnson', rewards: 3 },
    { name: 'Bob Brown', rewards: 2 },
    { name: 'Charlie Davis', rewards: 1 },
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {/* Top Backers Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Top Backers</h3>
        <div className="flex -space-x-3">
          {topBackers.slice(0, 5).map((backer, index) => (
            <div
              key={index}
              className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
              style={{ zIndex: topBackers.length - index }}
            >
              <Avatar name={backer.name} size="md" />
            </div>
          ))}
          {topBackers.length > 5 && (
            <div className="relative flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
              +{topBackers.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Most Active Backers Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Most Active Backers</h3>
        <div className="flex -space-x-3">
          {mostActiveBackers.slice(0, 5).map((backer, index) => (
            <div
              key={index}
              className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
              style={{ zIndex: mostActiveBackers.length - index }}
            >
              <Avatar name={backer.name} size="md" />
            </div>
          ))}
          {mostActiveBackers.length > 5 && (
            <div className="relative flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
              +{mostActiveBackers.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Top Backers with Most Rewards Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Top Backers with Most Rewards</h3>
        <div className="flex -space-x-3">
          {topBackersWithRewards.slice(0, 5).map((backer, index) => (
            <div
              key={index}
              className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
              style={{ zIndex: topBackersWithRewards.length - index }}
            >
              <Avatar name={backer.name} size="md" />
            </div>
          ))}
          {topBackersWithRewards.length > 5 && (
            <div className="relative flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
              +{topBackersWithRewards.length - 5}
            </div>
          )}
        </div>
      </div>
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