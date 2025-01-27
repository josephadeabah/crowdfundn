import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LeaderboardSkeletonLoader: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 p-4 md:py-4 md:pl-4 rounded-l-lg rounded-r-none">
      {/* Two-Column Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="w-full md:w-1/2">
          {/* Top Backers Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">
              <Skeleton width={150} />
            </h3>
            <div className="flex -space-x-3">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full overflow-hidden"
                  >
                    <Skeleton circle height="100%" />
                  </div>
                ))}
              <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full">
                <Skeleton circle height="100%" />
              </div>
            </div>
          </div>

          {/* Most Active Backers Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">
              <Skeleton width={180} />
            </h3>
            <div className="flex -space-x-3">
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full overflow-hidden"
                  >
                    <Skeleton circle height="100%" />
                  </div>
                ))}
              <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full">
                <Skeleton circle height="100%" />
              </div>
            </div>
          </div>

          {/* Top Backers with Most Rewards Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              <Skeleton width={200} />
            </h3>
            <div className="flex -space-x-3">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full overflow-hidden"
                  >
                    <Skeleton circle height="100%" />
                  </div>
                ))}
              <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full">
                <Skeleton circle height="100%" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2">
          {/* Top Fundraisers with Best Campaign Graphics */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">
              <Skeleton width={250} />
            </h3>
            <div className="flex -space-x-3">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full overflow-hidden"
                  >
                    <Skeleton circle height="100%" />
                  </div>
                ))}
              <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full">
                <Skeleton circle height="100%" />
              </div>
            </div>
          </div>

          {/* Top Fundraisers with Best Stories */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">
              <Skeleton width={250} />
            </h3>
            <div className="flex -space-x-3">
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full overflow-hidden"
                  >
                    <Skeleton circle height="100%" />
                  </div>
                ))}
              <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full">
                <Skeleton circle height="100%" />
              </div>
            </div>
          </div>

          {/* Certificates Section */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-cyan-500">
              <Skeleton width={300} />
            </h3>
            <div className="flex flex-wrap gap-3">
              {Array(7)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <Skeleton height="100%" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSkeletonLoader;
