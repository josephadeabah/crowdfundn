import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const RewardsLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 border border-gray-200"
          >
            {/* Placeholder for image */}
            <Skeleton height={192} className="mb-2 bg-gray-200" />

            {/* Placeholder for title */}
            <Skeleton height={20} className="mb-2 bg-gray-200" />

            {/* Placeholder for description */}
            <Skeleton height={15} className="mb-2 bg-gray-200" />

            <div className="flex justify-between items-center">
              {/* Placeholder for amount */}
              <Skeleton height={30} width={80} className="bg-gray-200" />

              {/* Placeholder for points */}
              <Skeleton height={15} width={50} className="bg-gray-200" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default RewardsLoader;
